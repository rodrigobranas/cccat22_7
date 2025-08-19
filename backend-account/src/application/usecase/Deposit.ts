import AccountRepository from "../../infra/repository/AccountRepository";
import { inject } from "../../infra/di/Registry";
import PaymentGateway from "../../infra/gateway/PaymentGateway";
import Retry from "../../infra/retry/Retry";
import PaymentProcessor from "../../infra/fallback/PaymentProcessor";

export default class Deposit {
    @inject("accountRepository")
    accountRepository!: AccountRepository;
    // @inject("paymentGateway")
    // paymentGateway!: PaymentGateway;
    @inject("paymentProcessor")
    paymentProcessor!: PaymentProcessor;

    async execute (input: Input): Promise<void> {
        const account = await this.accountRepository.getById(input.accountId);
        account.deposit(input.assetId, input.quantity);
        await this.accountRepository.update(account);
        // call payment
        // await Retry.execute(async () => {
        //     const output = await this.paymentGateway.processTransaction({ amount: input.quantity, creditCardToken: input.creditCardToken || "" });
        //     console.log(output);
        // });
        const output = await this.paymentProcessor.processPayment({ amount: input.quantity, creditCardToken: input.creditCardToken || "" });
        console.log(output);
    }

}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number,
    creditCardToken?: string
}
