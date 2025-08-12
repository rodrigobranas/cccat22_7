import amqp from "amqplib";
import { RabbitMQAdapter } from "./infra/queue/Queue";

async function main () {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup("orderPlaced", "orderPlaced.executeOrder");
    await queue.setup("orderFilled", "orderFilled.updateOrder");
}

main();
