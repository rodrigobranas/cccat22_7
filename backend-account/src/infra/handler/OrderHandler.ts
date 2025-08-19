import CancelOrder from "../../application/usecase/CancelOrder";
import ExecuteOrder from "../../application/usecase/ExecuteOrder";
import PlaceOrder from "../../application/usecase/PlaceOrder";
import UpdateOrder from "../../application/usecase/UpdateOrder";
import Book from "../../domain/Book";
import Order from "../../domain/Order";
import { inject } from "../di/Registry";
import HttpClient from "../http/HttpClient";
import Mediator from "../mediator/Mediator";
import Outbox from "../outbox/Outbox";
import Queue from "../queue/Queue";
import OrderRepository from "../repository/OrderRepository";

export default interface OrderHandler {
    handle (): void;
}

export class OrderHandlerBook implements OrderHandler {
    @inject("mediator")
    mediator!: Mediator;
    @inject("orderRepository")
    orderRepository!: OrderRepository;
    @inject("book")
    book!: Book;

    handle(): void {
        this.mediator.register("orderPlaced", async (order: Order) => {
            await this.book.insert(order);
        });
        this.mediator.register("orderFilled", async (order: Order) => {
            await this.orderRepository.update(order);
        });
    }

}

export class OrderHandlerExecuteOrder implements OrderHandler {
    @inject("mediator")
    mediator!: Mediator;
    @inject("executeOrder")
    executeOrder!: ExecuteOrder;
    
    handle(): void {
        this.mediator.register("orderPlaced", async (order: Order) => {
            await this.executeOrder.execute(order.marketId);
    
        });
    }

}

export class OrderHandlerExecuteHttp implements OrderHandler {
    @inject("mediator")
    mediator!: Mediator;
    @inject("httpClient")
    httpClient!: HttpClient;
    
    handle(): void {
        this.mediator.register("orderPlaced", async (order: Order) => {
            // console.log("orderPlaced");
            await this.httpClient.post("http://localhost:3001/execute_order", order);
        });
    }

}

export class OrderHandlerExecuteQueue implements OrderHandler {
    @inject("mediator")
    mediator!: Mediator;
    @inject("queue")
    queue!: Queue;
    @inject("updateOrder")
    updateOrder!: UpdateOrder;
    @inject("cancelOrder")
    cancelOrder!: CancelOrder;
    @inject("placeOrder")
    placeOrder!: PlaceOrder;
    @inject("outbox")
    outbox!: Outbox;
    
    handle(): void {
        this.queue.consume("placeOrder", async (input: any) => {
            await this.placeOrder.execute(input);
        });

        this.mediator.register("orderPlaced", async (order: Order) => {
            // console.log("orderPlaced");
            await this.queue.publish("orderPlaced", order);
            // await this.outbox.publish("orderPlaced", order);
        });
        this.queue.consume("orderFilled.updateOrder", async (input: any) => {
            console.log("orderFilled");
            await this.updateOrder.execute({ orderId: input.orderId, fillQuantity: input.fillQuantity, fillPrice: input.fillPrice });
            
        });
        this.queue.consume("orderRejected.cancelOrder", async (input: any) => {
            console.log("orderRejected");
            await this.cancelOrder.execute(input.orderId);
        });
    }

}
