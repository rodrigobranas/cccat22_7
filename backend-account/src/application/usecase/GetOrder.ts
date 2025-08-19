import AccountRepository from "../../infra/repository/AccountRepository";
import { inject } from "../../infra/di/Registry";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class GetOrder {
    @inject("accountRepository")
    accountRepository!: AccountRepository;
    @inject("orderRepository")
    orderRepository!: OrderRepository;

    async execute (orderId: string): Promise<Output> {
        const order = await this.orderRepository.getById(orderId);
        const account = await this.accountRepository.getById(order.accountId);
        return {
            orderId: order.orderId,
            accountId: account.accountId,
            marketId: order.marketId,
            name: account.getName(),
            email: account.getEmail(),
            side: order.side,
            quantity: order.quantity,
            price: order.price
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
