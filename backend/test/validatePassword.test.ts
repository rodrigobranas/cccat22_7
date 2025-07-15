import { validatePassword } from "../src/validatePassword"

test.each([
    "asdQWE123"
])("Deve validar a senha: %s", (password: string) => {
    const isValid = validatePassword(password);
    expect(isValid).toBe(true);
});

test.each([
    "asdQWE",
    "asdQWERTY",
    "asd123456789",
    "RTY123456789"
])("Não deve validar a senha: %s", (password: string) => {
    const isValid = validatePassword(password);
    expect(isValid).toBe(false);
});