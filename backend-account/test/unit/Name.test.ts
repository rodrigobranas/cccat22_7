import Name from "../../src/domain/Name";

test.each([
    "John Doe",
    "John Doe Xy",
    "John Doe Xy Pr"
])("Deve validar o nome: %s", (name: string) => {
    expect(new Name(name)).toBeDefined();
});

test.each([
    "John",
    ""
])("Não deve validar o nome: %s", (name: string) => {
    expect(() => new Name(name)).toThrow(new Error("Invalid name"));
});