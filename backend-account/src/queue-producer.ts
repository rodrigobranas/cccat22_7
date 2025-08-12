import { RabbitMQAdapter } from "./infra/queue/Queue";

async function main () {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    const input = {
        side: "sell",
        quantity: 1,
        price: 85000
    }
    queue.publish("orderPlaced", input);
}

main();
