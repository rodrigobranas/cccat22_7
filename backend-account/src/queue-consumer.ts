import { RabbitMQAdapter } from "./infra/queue/Queue";

async function main () {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    queue.consume("orderPlaced.executeOrder", async (input: any) => {
        // console.log(input);
    });
}

main();
