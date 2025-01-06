using deluxe.distribution as db from '../db/distribution';
using api from '../db/common';
using deluxe.assetvault as av from '../db/asset-vault';

service DistributionService @(requires: 'authenticated-user') {
    @Capabilities: {
        Deletable : false,
        Insertable: false
    }
    entity AssetVault         as projection on av.AssetVault
                                 where
                                     CreatedinSAP = false;

    @readonly
    entity CustomerGroup      as projection on api.CustomerGroup;

    @readonly
    entity Country            as projection on api.Country;

    @readonly
    entity Studios            as projection on db.StudioVH;

    @readonly
    entity Theaters           as projection on db.TheaterVH;

    @readonly
    entity ShippingConditions as projection on api.ShippingConditions;

    entity Products           as projection on api.Products;

    @readonly
    entity DCPProducts        as projection on db.DCPMaterialVH;

    @readonly
    entity Titles             as projection on db.TitleVH;

    @readonly
    entity DeliveryPriority   as projection on api.DeliveryPriority;

    entity DistroSpec         as projection on db.DistroSpec;

    entity DCPMaterialConfig  as projection on db.DCPMaterialConfig
                                 where
                                     createdBy = $user.id
        actions {
            action createDCPMaterial() returns Products;
        };

    annotate DistroSpec with @odata.draft.enabled;
    annotate DCPMaterialConfig with @odata.draft.enabled;

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
}
