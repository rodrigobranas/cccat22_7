import { inject } from "../../infra/di/Registry";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class CancelOrder {
    @inject("orderRepository")
    orderRepository!: OrderRepository;

    async execute (orderId: string): Promise<void> {
        await this.orderRepository.delete(orderId);
    }
}
