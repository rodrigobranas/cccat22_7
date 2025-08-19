import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default class Outbox {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async publish (event: string, data: any) {
        const messageId = crypto.randomUUID();
        await this.connection.query("insert into ccca.message (message_id, event, data, status, timestamp) values ($1, $2, $3, $4, $5)", [messageId, event, data, "pending", new Date()]);
    }

}
