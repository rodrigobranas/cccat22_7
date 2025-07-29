import Document from "../../src/domain/Document";

test.each([
    "97456321558",
    "71428793860",
    "87748248800"
])("Deve testar um cpf válido: %s", (cpf: string) => {
    const document = new Document(cpf);
    expect(document).toBeDefined();
});

test.each([
    null,
    undefined,
    "11111111111",
    "111",
    "1111111111111111",
])("Deve testar um cpf inválido: %s", (cpf: any) => {
    expect(() => new Document(cpf)).toThrow(new Error("Invalid document"));
});
