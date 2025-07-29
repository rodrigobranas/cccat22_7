import AccountRepository from "../../infra/repository/AccountRepository";
import { inject } from "../../infra/di/Registry";
import OrderRepository from "../../infra/repository/OrderRepository";
import Order from "../../domain/Order";
import Mediator from "../../infra/mediator/Mediator";

export default class PlaceOrder {
    @inject("accountRepository")
    accountRepository!: AccountRepository;
    @inject("orderRepository")
    orderRepository!: OrderRepository;
    @inject("mediator")
    mediator!: Mediator;

    async execute (input: Input): Promise<Output> {
        // TODO: implementar a verificação do saldo
        // const account = await this.accountRepository.getById(input.accountId);
        const order = Order.create(input.accountId, input.marketId, input.side, input.quantity, input.price);
        await this.orderRepository.save(order);
        await this.mediator.notifyAll("orderPlaced", { marketId: order.marketId, orderId: order.orderId });
        return {
            orderId: order.orderId
        }
    }

}

type Input = {
    accountId: string,
    marketId: string,
    side: string,
    quantity: number,
    price: number
}

type Output = {
    orderId: string
}
