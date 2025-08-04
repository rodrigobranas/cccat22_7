import Deposit from "../../src/application/usecase/Deposit";
import GetAccount from "../../src/application/usecase/GetAccount";
import Signup from "../../src/application/usecase/Signup";
import Withdraw from "../../src/application/usecase/Withdraw";
import { AccountAssetDAODatabase } from "../../src/infra/dao/AccountAssetDAO";
import { AccountDAODatabase, AccountDAOMemory } from "../../src/infra/dao/AccountDAO";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/di/Registry";
import { AccountRepositoryDatabase, AccountRepositoryMemory } from "../../src/infra/repository/AccountRepository";
import sinon from "sinon";

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", connection);
    const accountDAO = new AccountDAODatabase();
    Registry.getInstance().provide("accountDAO", accountDAO);
    Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
    Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
    signup = new Signup();
    getAccount = new GetAccount();
});

test("Deve criar uma conta", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(input);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.document).toBe(input.document);
    expect(outputGetAccount.password).toBe(input.password);
});

test("Não deve criar uma conta com nome inválido", async () => {
    const input = {
        name: "John",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Deve criar uma conta com stub", async () => {
    const saveStub = sinon.stub(AccountDAODatabase.prototype, "save").resolves();
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const getByIdStub = sinon.stub(AccountDAODatabase.prototype, "getById").resolves(input);
    const outputSignup = await signup.execute(input);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.document).toBe(input.document);
    expect(outputGetAccount.password).toBe(input.password);
    saveStub.restore();
    getByIdStub.restore();
});

test("Deve criar uma conta com spy", async () => {
    const saveSpy = sinon.spy(AccountDAODatabase.prototype, "save");
    const getByIdSpy = sinon.spy(AccountDAODatabase.prototype, "getById");
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(input);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.document).toBe(input.document);
    expect(outputGetAccount.password).toBe(input.password);
    expect(saveSpy.calledOnce).toBe(true);
    expect(getByIdSpy.calledWith(outputSignup.accountId)).toBe(true);
    expect(getByIdSpy.calledOnce).toBe(true);
    saveSpy.restore();
    getByIdSpy.restore();
});

test("Deve criar uma conta com mock", async () => {
    const accountDAOMock = sinon.mock(AccountDAODatabase.prototype);
    accountDAOMock.expects("save").once().resolves();
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    accountDAOMock.expects("getById").once().resolves(input);
    const outputSignup = await signup.execute(input);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.document).toBe(input.document);
    expect(outputGetAccount.password).toBe(input.password);
    accountDAOMock.verify();
    accountDAOMock.restore();
});

test("Deve criar uma conta com fake", async () => {
    const accountRepository = new AccountRepositoryMemory();
    Registry.getInstance().provide("accountRepository", accountRepository);
    signup = new Signup();
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(input);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.document).toBe(input.document);
    expect(outputGetAccount.password).toBe(input.password);
});

afterEach(async () => {
    await connection.close();
});
