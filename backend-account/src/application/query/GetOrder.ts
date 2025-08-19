import DatabaseConnection from "../../infra/database/DatabaseConnection";
import { inject } from "../../infra/di/Registry";

export default class GetOrder {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async execute (orderId: string): Promise<Output> {
        const data = await this.connection.query("select order_id, account_id, market_id, name, email, side, quantity, price from ccca.order o join ccca.account a using (account_id) where order_id = $1", [orderId]);
        // DTO
        return {
            orderId: data.order_id,
            accountId: data.account_id,
            marketId: data.market_id,
            name: data.name,
            email: data.email,
            side: data.side,
            quantity: data.quantity,
            price: data.price
        }
    }
}

type Output = {
    orderId: string,
    accountId: string,
    marketId: string,
    name: string,
    email: string,
    side: string,
    quantity: number,
    price: number,
}
