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

// Unit of Work
export class PgPromiseAdapterUoW implements DatabaseConnection {
    connection: any;
    queries: { statement: string, params: any }[] = [];;

    constructor () {
        this.connection = pgp()("postgres://postgres:123456@db:5432/app");
    }

    async query(statement: string, params: any): Promise<any> {
        this.queries.push({ statement, params });
        // return this.connection.query(statement, params);
        return {};
    }
    
    async commit () {
        // open tx
        for (const query of this.queries) {
            await this.connection.query(query.statement, query.params);
        }
        // commit tx
        // or
        // rollback tx
    }

    close(): Promise<void> {
        return this.connection.$pool.end();
    }

}
