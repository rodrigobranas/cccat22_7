import Order from "../../domain/Order";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface OrderRepository {
    save (order: Order): Promise<void>;
    update (order: Order): Promise<void>;
    getById (orderId: string): Promise<Order>;
    getByMarketIdAndStatus (marketId: string, status: string): Promise<Order[]>
    delete (orderId: string): Promise<void>;
}

export class OrderRepositoryDatabase implements OrderRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async save(order: Order): Promise<void> {
        await this.connection.query("insert into ccca.order (order_id, account_id, market_id, side, quantity, price, fill_quantity, fill_price, status, timestamp) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [order.orderId, order.accountId, order.marketId, order.side, order.quantity, order.price, order.fillQuantity, order.fillPrice, order.status, order.timestamp]);
    }

    async update(order: Order): Promise<void> {
        await this.connection.query("update ccca.order set status = $1, fill_quantity = $2, fill_price = $3 where order_id = $4", [order.status, order.fillQuantity, order.fillPrice, order.orderId]);
    }

    async getById(orderId: string): Promise<Order> {
        const [orderData] = await this.connection.query("select * from ccca.order where order_id = $1", [orderId]);
        if (!orderData) throw new Error("Order not found");
        return new Order(orderData.order_id, orderData.account_id, orderData.market_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price), parseFloat(orderData.fill_quantity), parseFloat(orderData.fill_price), orderData.status, orderData.timestamp);
    }

    async getByMarketIdAndStatus(marketId: string, status: string): Promise<Order[]> {
        const ordersData = await this.connection.query("select * from ccca.order where market_id = $1 and status = $2", [marketId, status]);
        const orders: Order[] = [];
        for (const orderData of ordersData) {
            const order = new Order(orderData.order_id, orderData.account_id, orderData.market_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price), parseFloat(orderData.fill_quantity), parseFloat(orderData.fill_price), orderData.status, orderData.timestamp);
            orders.push(order);
        }
        return orders;
    }

    async delete(orderId: string): Promise<void> {
        await this.connection.query("delete from ccca.order where order_id = $1", [orderId]);
    }

}
