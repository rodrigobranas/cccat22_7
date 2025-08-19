import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import { sleep } from "./infra/util/sleep";

async function main () {
    const connection = new PgPromiseAdapter();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    while(true) {
        console.log("outbox is fetching messages...");
        const messages = await connection.query("select * from ccca.message where status = 'pending'", []);
        console.log("processing messages: ", messages.length);
        for (const message of messages) {
            queue.publish(message.event, message.data);
            await connection.query("update ccca.message set status = 'sent' where message_id = $1", [message.message_id]);
        }
        await sleep(500);
    }
}

main();
