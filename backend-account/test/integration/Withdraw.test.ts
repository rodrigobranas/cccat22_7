import Deposit from "../../src/application/usecase/Deposit";
import GetAccount from "../../src/application/usecase/GetAccount";
import Signup from "../../src/application/usecase/Signup";
import Withdraw from "../../src/application/usecase/Withdraw";
import { AccountAssetDAODatabase } from "../../src/infra/dao/AccountAssetDAO";
import { AccountDAODatabase } from "../../src/infra/dao/AccountDAO";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/di/Registry";
import { CieloPaymentProcessor } from "../../src/infra/fallback/PaymentProcessor";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;
let deposit: Deposit;
let withdraw: Withdraw;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", connection);
    const accountDAO = new AccountDAODatabase();
    Registry.getInstance().provide("accountDAO", accountDAO);
    Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
    Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
    Registry.getInstance().provide("paymentProcessor", new CieloPaymentProcessor());
    signup = new Signup();
    getAccount = new GetAccount();
    deposit = new Deposit();
    withdraw = new Withdraw();
});

test("Deve sacar de uma conta", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(input);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 1000
    }
    await deposit.execute(inputDeposit);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 500
    }
    await withdraw.execute(inputWithdraw);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.balances[0].assetId).toBe("USD");
    expect(outputGetAccount.balances[0].quantity).toBe(500);
});

test("Deve sacar de uma conta", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(input);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 500
    }
    await deposit.execute(inputDeposit);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 1000
    }
    await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow(new Error("Insuficient funds"));
});

afterEach(async () => {
    await connection.close();
});
