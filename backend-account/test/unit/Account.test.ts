import Account from "../../src/domain/Account";

test("Deve criar uma conta", function () {
    const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "asdQWE123");
    expect(account.getName()).toBe("John Doe");
    expect(account.getEmail()).toBe("john.doe@gmail.com");
    expect(account.getDocument()).toBe("97456321558");
    expect(account.getPassword()).toBe("asdQWE123");
});

test("Não deve criar uma conta com nome inválido", function () {
    expect(() => Account.create("John", "john.doe@gmail.com", "97456321558", "asdQWE123")).toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta com email inválido", function () {
    expect(() => Account.create("John Doe", "john.doe@gmail", "97456321558", "asdQWE123")).toThrow(new Error("Invalid email"));
});

test("Não deve criar uma conta com documento inválido", function () {
    expect(() => Account.create("John Doe", "john.doe@gmail.com", "123456", "asdQWE123")).toThrow(new Error("Invalid document"));
});

test("Não deve criar uma conta com senha inválida", function () {
    expect(() => Account.create("John Doe", "john.doe@gmail.com", "97456321558", "123456")).toThrow(new Error("Invalid password"));
});

test("Deve fazer um saque", function () {
    const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "asdQWE123");
    account.deposit("USD", 500);
    account.withdraw("USD", 100);
    expect(account.balances[0].quantity).toBe(400);
});

test("Não deve fazer um saque se não tiver saldo", function () {
    const account = Account.create("John Doe", "john.doe@gmail.com", "97456321558", "asdQWE123");
    account.deposit("USD", 500);
    expect(() => account.withdraw("USD", 1000)).toThrow(new Error("Insuficient funds"));
});