import Password from "../../src/domain/Password";

test.each([
    "asdQWE123"
])("Deve validar a senha: %s", (password: string) => {
    expect(new Password(password)).toBeDefined();
});

test.each([
    "asdQWE",
    "asdQWERTY",
    "asd123456789",
    "RTY123456789"
])("Não deve validar a senha: %s", (password: string) => {
    expect(() => new Password(password)).toThrow(new Error("Invalid password"));
});