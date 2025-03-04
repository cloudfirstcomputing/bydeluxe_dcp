using deluxe.distribution as db from '../db/distribution';
using api from '../db/common';
using deluxe.assetvault as av from '../db/asset-vault';

service DistributionService @(requires: 'authenticated-user') {
    @Capabilities: {
        Deletable : false,
        Insertable: false
    }
    @cds.redirection.target
    entity DistributionDcp      as projection on av.DistributionDcp;

    entity DistributionDcpVH    as projection on av.DistributionDcp
                                   where
                                       CreatedinSAP = false;

    entity CplList              as
        select from av.DistributionDcp._Items as a
        inner join av.DistributionDcp as b
            on a.up_.ProjectID = b.ProjectID
        {
            key DCP,
            key a.LinkedCPLUUID,
            a.LinkedCTT,
            a.Download,
            a.Email
        };

    @readonly
    entity CustomerGroup        as projection on api.CustomerGroup;

    @readonly
    entity Plants               as projection on api.Plants;

    @readonly
    entity StorageLocations     as projection on api.StorageLocations;

    @readonly
    entity SalesOrganizations   as projection on api.SalesOrganizations;

    @readonly
    entity DistributionChannels as projection on api.DistributionChannels;

    @readonly
    entity Country              as projection on api.Country;

    @readonly
    entity Regions              as projection on api.Regions;

    @readonly
    entity Studios              as projection on db.StudioVH;

    @readonly
    entity Theaters             as projection on db.TheaterVH;

    @readonly
    entity ShippingConditions   as projection on api.ShippingConditions;

    entity Products             as projection on api.Products;

    @readonly
    entity DCPProducts          as projection on db.DCPMaterialVH;

    @readonly
    entity Titles               as projection on db.TitleVH;

    @readonly
    entity SalesDistricts       as projection on api.SalesDistricts;

    @readonly
    entity DeliveryPriority     as projection on api.DeliveryPriority;

    entity DistroSpec           as projection on db.DistroSpec;

    entity DCPMaterials         as projection on db.DCPMaterials
        actions {
            action setDownloadEmail(cpl : String(40), download : Boolean, email : Boolean);
        };

    entity DCPMaterialConfig    as projection on db.DCPMaterialConfig
                                   where
                                       createdBy = $user.id
        actions {
            action createDCPMaterial() returns Products;
        };

    annotate DistroSpec with @odata.draft.enabled;
    annotate DCPMaterialConfig with @odata.draft.enabled;

    extend projection DCPMaterials with {
        to_DCPDetail1 : Association to many CplList on DCPMaterialNumber.Product = to_DCPDetail1.DCP
    }

    extend projection CustomerGroup with {
        virtual null as Name : String
    };

    extend projection Country with {
        virtual null as Name : String
    };

    extend projection Titles with {
        virtual null as Name : String
    };

    extend projection DCPProducts with {
        virtual null as Name : String
    };

    extend projection SalesOrganizations with {
        virtual null as Name : String
    };

    extend projection DistributionChannels with {
        virtual null as Name : String
    };

    extend projection SalesDistricts with {
        virtual null as Name : String
    };
}
