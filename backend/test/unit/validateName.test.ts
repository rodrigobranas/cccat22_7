import { validateName } from "../../src/domain/validateName";

test.each([
    "John Doe",
    "John Doe Xy",
    "John Doe Xy Pr"
])("Deve validar o nome: %s", (name: string) => {
    const isValid = validateName(name);
    expect(isValid).toBe(true);
});

test.each([
    "John",
    ""
])("Não deve validar o nome: %s", (name: string) => {
    const isValid = validateName(name);
    expect(isValid).toBe(false);
});