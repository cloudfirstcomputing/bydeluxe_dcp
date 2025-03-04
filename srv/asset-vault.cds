using {deluxe.assetvault as db} from '../db/asset-vault';

service AssetVaultService {

    entity DistributionDcp as projection on db.DistributionDcp;
    entity MediaFiles      as projection on db.MediaFiles;
    function downloadFormADS() returns LargeString;

}
