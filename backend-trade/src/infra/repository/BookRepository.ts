import Book from "../../domain/Book";
import Order from "../../domain/Order";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface BookRepository {
    getByMarketId (marketId: string): Promise<Book>;
}

export class BookRepositoryDatabase implements BookRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

   async getByMarketId(marketId: string): Promise<Book> {
        const ordersData = await this.connection.query("select * from ccca.order where market_id = $1 and status = $2", [marketId, "open"]);
        const orders: Order[] = [];
        for (const orderData of ordersData) {
            const order = new Order(orderData.order_id, orderData.account_id, orderData.market_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price), parseFloat(orderData.fill_quantity), parseFloat(orderData.fill_price), orderData.status, orderData.timestamp);
            orders.push(order);
        }
        const buys = orders.filter((order: Order) => order.side === "buy");
        const sells = orders.filter((order: Order) => order.side === "sell");
        const book = new Book(marketId);
        book.buys = buys;
        book.sells = sells;
        return book;
    }

}
