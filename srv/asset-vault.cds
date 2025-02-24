using {deluxe.assetvault as db} from '../db/asset-vault';

service AssetVaultService {

    entity AssetVault as projection on db.AssetVault;
    entity MediaFiles as projection on db.MediaFiles;

     function downloadFormADS() returns LargeString;

}
