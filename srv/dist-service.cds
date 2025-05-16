using deluxe.distribution as db from '../db/distribution';
using api from '../db/common';
using deluxe.assetvault as av from '../db/asset-vault';

service DistributionService {
    @Capabilities: {
        Deletable : false,
        Insertable: false
    }
    @cds.redirection.target
    entity DistributionDcp      as projection on av.DistributionDcp;

    entity DistributionDcpVH    as projection on av.DistributionDcp
                                   where
                                       CreatedinSAP = false;

    @readonly
    entity CplList              as
        select from av.DistributionDcp._Items as a
        inner join av.DistributionDcp as b
            on a.up_.ProjectID = b.ProjectID
        {
            key DCP,
            key a.LinkedCPLUUID,
                a.LinkedCTT,
                a.AssetMapUUID,
                b.ProjectID,
                a.Download,
                a.Email
        }
        where
            b.CreatedinSAP = true;

    @readonly
    entity CustomerGroup        as projection on api.CustomerGroup;

    @readonly
    entity Plants               as projection on api.Plants;

    @readonly
    entity ShippingType         as projection on api.ShippingType_VH;

    @readonly
    entity ProductGroup         as projection on api.ProductGroup;

    @readonly
    entity ProductGroup1        as projection on api.ProductGroup1;

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

@readonly entity GeoRegions as projection on db.GeoRegions;
    @readonly
    @cds.redirection.target
    entity DCPProducts          as projection on db.DCPMaterialVH;

    @readonly
    entity DCPMapProducts       as projection on db.DCPMaterialVH;

    @readonly
    entity Titles               as projection on db.TitleVH;

    @readonly
    entity SalesDistricts       as projection on api.SalesDistricts;

    @readonly
    entity Characteristic       as projection on api.Characteristic;

    @readonly
    entity DeliveryPriority     as projection on api.DeliveryPriority;

    entity CPLDetail            as projection on db.CPLDetail
        actions {
            @(
                cds.odata.bindingparameter.name: '_it',
                Common.SideEffects             : {TargetProperties: ['_it/*']}
            )
            action setDownloadEmail(download : Boolean, email : Boolean);
        };

    entity DistroSpec           as projection on db.DistroSpec;
    entity DCPMaterials         as projection on db.DCPMaterials;
    entity Parameters           as projection on api.Parameters;
    entity PlayBackCapability1  as projection on api.Characteristic;
    entity PlayBackCapability2  as projection on api.Characteristic;
    entity PlayBackCapability3  as projection on api.Characteristic;
    entity PlayBackCapability4  as projection on api.Characteristic;
    entity PlayBackCapability5  as projection on api.Characteristic;
    entity PlayBackCapability6  as projection on api.Characteristic;
    entity PlayBackCapability7  as projection on api.Characteristic;
    entity PlayBackCapability8  as projection on api.Characteristic;
    entity PlayBackCapability9  as projection on api.Characteristic;
    entity PlayBackCapability10 as projection on api.Parameters;
    entity DCPMaterialMapping   as projection on db.DCPMaterialMapping;
    annotate DistroSpec with @odata.draft.enabled;
    annotate DCPMaterialMapping with @odata.draft.enabled;

    extend projection DCPMaterials with {
        to_DCPDetail : Association to many CplList on DCPMaterialNumber.Product = to_DCPDetail.DCP
    }

    extend projection CustomerGroup with {
        virtual null as Name : String
    };

    extend projection ProductGroup with {
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

    extend projection DCPMapProducts with {
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
