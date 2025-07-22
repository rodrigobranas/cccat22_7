export function validateName (name: string) {
    return /[a-zA-Z]+ [a-zA-Z]+/.test(name);
}
