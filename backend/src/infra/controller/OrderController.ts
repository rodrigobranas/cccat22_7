import HttpServer from "../http/HttpServer";
import { inject } from "../di/Registry";
import PlaceOrder from "../../application/usecase/PlaceOrder";
import GetOrder from "../../application/usecase/GetOrder";
import GetDepth from "../../application/usecase/GetDepth";

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

    constructor () {
        this.httpServer.route("post", "/place_order", async (params: any, body: any) => {
            const output = await this.placeOrder.execute(body);
            return output;
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
