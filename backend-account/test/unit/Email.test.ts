import Email from "../../src/domain/Email";

test.each([
    "john.doe@gmail.com"
])("Deve validar o email: %s", (email: string) => {
    expect(new Email(email)).toBeDefined();
});

test.each([
    "john@",
    "john@.com",
    "john@gmail"
])("Não deve validar o email: %s", (email: string) => {
    expect(() => new Email(email)).toThrow(new Error("Invalid email"));
});