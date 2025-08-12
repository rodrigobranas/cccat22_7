export default class Wallet {
    balances: Balance[] = [];

    constructor (readonly accountId: string) {
    }

    deposit (assetId: string, quantity: number) {
        const balance = this.balances.find((balance: Balance) => balance.assetId === assetId);
        if (balance) {
            balance.quantity += quantity;
        } else {
            this.balances.push({ assetId, quantity });
        }
    }

    withdraw (assetId: string, quantity: number) {
        const balance = this.balances.find((balance: Balance) => balance.assetId === assetId);
        if (!balance || balance.quantity < quantity) throw new Error("Insuficient funds");
        balance.quantity -= quantity;
    }

    getBalance (assetId: string) {
        const balance = this.balances.find((balance: Balance) => balance.assetId === assetId);
        if (!balance) return 0;
        return balance;
    }

    block (assetId: string, quantity: number) {
        // const balance = this.getBalance(asset);
        // if (!balance || balance.quantity < input.quantity) throw new Error("Insufficient funds");
    }

}

type Balance = {
    assetId: string,
    quantity: number
}
