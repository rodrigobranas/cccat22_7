import crypto from "crypto";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/di/Registry";
import { AccountDAODatabase } from "../../src/infra/dao/AccountDAO";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import Account from "../../src/domain/Account";
import { AccountAssetDAODatabase } from "../../src/infra/dao/AccountAssetDAO";

test("Deve persistir uma conta", async () => {
    const connection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", connection);
    Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
    Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
    const accountRepository = new AccountRepositoryDatabase();
    const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "asdQWE123");
    await accountRepository.save(account);
    const savedAccount = await accountRepository.getById(account.accountId);
    expect(savedAccount.accountId).toBe(account.accountId);
    expect(savedAccount.getName()).toBe(account.getName());
    expect(savedAccount.getEmail()).toBe(account.getEmail());
    expect(savedAccount.getDocument()).toBe(account.getDocument());
    expect(savedAccount.getPassword()).toBe(account.getPassword());
    await connection.close();
});
