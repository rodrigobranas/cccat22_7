import HttpServer from "../http/HttpServer";
import { inject } from "../di/Registry";
import PlaceOrder from "../../application/usecase/PlaceOrder";
import GetOrder from "../../application/usecase/GetOrder";
import GetDepth from "../../application/usecase/GetDepth";
import OrderRepository from "../repository/OrderRepository";
import Order from "../../domain/Order";
import Queue from "../queue/Queue";

// Interface Adapter
export default class OrderController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("placeOrder")
    placeOrder!: PlaceOrder;
    @inject("getOrder")
    getOrder!: GetOrder;
    @inject("getDepth")
    getDepth!: GetDepth;
    @inject("orderRepository")
    orderRepository!: OrderRepository;
    @inject("queue")
    queue!: Queue;

    constructor () {
        this.httpServer.route("post", "/place_order", async (params: any, body: any) => {
            const output = await this.placeOrder.execute(body);
            return output;
        });

        this.httpServer.route("post", "/place_order_async", async (params: any, body: any) => {
            this.queue.publish("placeOrder", body);
        });

        this.httpServer.route("post", "/update_order", async (params: any, body: any) => {
            // console.log("updateOrder");
            const input = body;
            const order = new Order(input.orderId, input.accountId, input.marketId, input.side, input.quantity, input.price, input.fillQuantity, input.fillPrice, input.status, new Date(input.timestamp));
            await this.orderRepository.update(order);
        });

        this.httpServer.route("get", "/orders/:orderId", async (params: any, body: any) => {
            const output = await this.getOrder.execute(params.orderId);
            return output;
        });

        this.httpServer.route("get", "/markets/:marketId/depth", async (params: any, body: any) => {
            const output = await this.getDepth.execute(params.marketId);
            return output;
        });
    }

}
