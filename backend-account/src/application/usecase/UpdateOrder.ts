import { inject } from "../../infra/di/Registry";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class UpdateOrder {
    @inject("orderRepository")
    orderRepository!: OrderRepository;

    async execute (input: Input): Promise<void> {
        const order = await this.orderRepository.getById(input.orderId);
        order.fillPrice = input.fillPrice;
        order.fillQuantity = input.fillQuantity;
        order.calculateStatus();
        await this.orderRepository.update(order);
    }
}

type Input = {
    orderId: string,
    fillQuantity: number,
    fillPrice: number
}
