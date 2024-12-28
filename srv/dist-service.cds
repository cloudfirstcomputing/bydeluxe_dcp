using deluxe.distribution as db from '../db/distribution';
using api from '../db/common';

service DistributionService @(requires: 'authenticated-user') {
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

    entity DistroSpec         as projection on db.DistroSpec;

    entity DCPMaterialConfig  as projection on db.DCPMaterialConfig
                                 where
                                     createdBy = $user.id
        actions {
            action createDCPMaterial() returns Products;
        };

    annotate DistroSpec with @odata.draft.enabled;
    annotate DCPMaterialConfig with @odata.draft.enabled;
}
