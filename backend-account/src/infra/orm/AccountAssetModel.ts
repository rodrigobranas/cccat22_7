import { model, Model, column } from "./ORM";

@model("ccca", "account_asset")
export class AccountAssetModel extends Model {
    @column("account_id")
    accountId: string;
    @column("asset_id")
    assetId: string;
    @column("quantity")
    quantity: string;

    constructor (accountId: string, assetId: string, quantity: string) {
        super();
        this.accountId = accountId;
        this.assetId = assetId;
        this.quantity = quantity;
    }
}