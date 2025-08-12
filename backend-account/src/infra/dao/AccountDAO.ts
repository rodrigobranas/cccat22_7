import Account from "../../domain/Account";
import Order from "../../domain/Order";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface AccountDAO {
    save (account: any): Promise<void>;
    update (account: any): Promise<void>;
    getById (accountId: string): Promise<any>;
}

// Interface Adapter
export class AccountDAODatabase implements AccountDAO {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async save(account: any): Promise<void> {
        await this.connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.accountId, account.getName(), account.getEmail(), account.getDocument(), account.getPassword()]);
    }

    async update(account: any): Promise<void> {
        await this.connection.query("update ccca.account set name = $1, email = $2, document = $3, password = $4 where account_id = $5", [account.getName(), account.getEmail(), account.getDocument(), account.getPassword(), account.accountId]);
    }

    async getById(accountId: string): Promise<any> {
        const [account] = await this.connection.query("select * from ccca.account where account_id = $1", [accountId]);
        return account;
    }

}

export class AccountDAOMemory implements AccountDAO {
    accounts: any[] = [];

    async save(account: any): Promise<void> {
        this.accounts.push(account);
    }

    update(account: any): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getById(accountId: string): Promise<any> {
        return this.accounts.find((account: any) => account.accountId === accountId);
    }

}
