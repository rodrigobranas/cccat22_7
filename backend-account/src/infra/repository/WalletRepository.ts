import Account from "../../domain/Account";
import Wallet from "../../domain/Wallet";
import AccountAssetDAO from "../dao/AccountAssetDAO";
import AccountDAO from "../dao/AccountDAO";
import { inject } from "../di/Registry";

export default interface WalletRepository {
    getByAccountId (accountId: string): Promise<Wallet>;
    update (wallet: Wallet): Promise<void>;
}

export class WalletRepositoryDatabase implements WalletRepository {
    @inject("accountDAO")
    accountDAO!: AccountDAO;
    @inject("accountAssetDAO")
    accountAssetDAO!: AccountAssetDAO;

    async update(wallet: Wallet): Promise<void> {
        await this.accountAssetDAO.deleteByAccountId(wallet.accountId);
        for (const balance of wallet.balances) {
            await this.accountAssetDAO.save({ accountId: wallet.accountId, ...balance });
        }
    }

    async getByAccountId(accountId: string): Promise<Wallet> {
        const accountAssetsData = await this.accountAssetDAO.getByAccountId(accountId);
        const wallet = new Wallet(accountId);
        for (const accountAssetData of accountAssetsData) {
            wallet.balances.push({ assetId: accountAssetData.asset_id, quantity: parseFloat(accountAssetData.quantity )});
        }
        return wallet;
    }

}
