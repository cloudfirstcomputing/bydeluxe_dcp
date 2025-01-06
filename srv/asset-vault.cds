using {deluxe.assetvault as db} from '../db/asset-vault';

service AssetVaultService @(requires: 'authenticated-user') {

    entity AssetVault as projection on db.AssetVault;

}
