import { validateEmail } from "../../src/domain/validateEmail";

test.each([
    "john.doe@gmail.com"
])("Deve validar o email: %s", (email: string) => {
    const isValid = validateEmail(email);
    console.log(isValid);
    expect(isValid).toBe(true);
});

test.each([
    "john@",
    "john@.com",
    "john@gmail"
])("Não deve validar o email: %s", (email: string) => {
    const isValid = validateEmail(email);
    expect(isValid).toBe(false);
});