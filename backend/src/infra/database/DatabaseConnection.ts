import pgp from "pg-promise";

// Porta de Interface Adapter
export default interface DatabaseConnection {
    query (statement: string, params: any): Promise<any>;
    close (): Promise<void>;
}

// Framework and Driver
export class PgPromiseAdapter implements DatabaseConnection {
    connection: any;

    constructor () {
        this.connection = pgp()("postgres://postgres:123456@db:5432/app");
    }

    query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params);
    }

    close(): Promise<void> {
        return this.connection.$pool.end();
    }

}
