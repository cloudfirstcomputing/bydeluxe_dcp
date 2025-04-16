using {deluxe.assetvault as db} from '../db/asset-vault';
using api from '../db/common';

service AssetVaultService {
    type dcpParam : {
        Customer : String;
        Title    : String;
    };

    entity DistributionDcp    as projection on db.DistributionDcp
        actions {
            @(
                cds.odata.bindingparameter.name: '_it',
                Common.SideEffects             : {TargetProperties: ['_it/*']}
            )
            action createDcp(Customer : dcpParam:Customer, Title : dcpParam:Title) returns many String;
        };

    @readonly
    entity Studios            as projection on api.BusinessPartners;

    @readonly
    entity StorageLocations   as projection on api.StorageLocations;

    @readonly
    entity SalesOrganizations as projection on api.SalesOrganizations;

    @readonly
    entity CustomerPlant as projection on api.CustomerPlant;

    @readonly
    entity SalesOrgDistCh as projection on api.SalesOrgDistCh;

    @readonly
    entity Plants             as projection on api.Plants;

    @readonly
    entity Titles             as projection on api.Products;

    @readonly
    entity CustomerCompany    as projection on api.CustomerCompany;
    @readonly
    entity Company as projection on api.Company;

    entity MediaFiles         as projection on db.MediaFiles;
    function downloadFormADS() returns LargeString;

    extend projection Titles with {
        virtual null as Name : String
    };

}
