import Book from "./domain/Book";
import Order from "./domain/Order";
import Registry from "./infra/di/Registry";
import { AxiosAdapter } from "./infra/http/HttpClient";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { MediatorMemory } from "./infra/mediator/Mediator";
import { RabbitMQAdapter } from "./infra/queue/Queue";

async function main () {
    const httpServer = new ExpressAdapter();
    const httpClient = new AxiosAdapter();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup("orderPlaced", "orderPlaced.executeOrder");
    await queue.setup("orderFilled", "orderFilled.updateOrder");
    await queue.setup("orderRejected", "orderRejected.cancelOrder");
    const mediator = new MediatorMemory();
    Registry.getInstance().provide("mediator", mediator);
    const book = new Book("BTC-USD");
    httpServer.route("post", "/execute_order", async (params: any, body: any) => {
        // console.log("executeOrder");
        const input = body;
        const order = new Order(input.orderId, input.accountId, input.marketId, input.side, input.quantity, input.price, input.fillQuantity, input.fillPrice, input.status, new Date(input.timestamp));
        await book.insert(order);
    });
    queue.consume("orderPlaced.executeOrder", async (input: any) => {
        console.log("executeOrder");
        const order = new Order(input.orderId, input.accountId, input.marketId, input.side, input.quantity, input.price, input.fillQuantity, input.fillPrice, input.status, new Date(input.timestamp));
        if (input.quantity > 10000) {
            await queue.publish("orderRejected", order);
            return;
        }
        await book.insert(order);
    });
    mediator.register("orderFilled", async (order: Order) => {
        console.log("orderFilled");
        // await httpClient.post("http://localhost:3000/update_order", order);
        await queue.publish("orderFilled", order);
    });
    httpServer.listen(3001);
}

main();
