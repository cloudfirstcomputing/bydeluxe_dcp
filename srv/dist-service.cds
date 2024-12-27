using deluxe.distribution as db from '../db/distribution';
using api from '../db/common';

service DistributionService @(requires: 'authenticated-user') {
    @readonly
    entity BusinessPartners   as projection on api.BusinessPartners;

    @readonly
    entity ShippingConditions as projection on api.ShippingConditions;

    entity Products           as projection on api.Products;
    entity DistroSpec         as projection on db.DistroSpec;

    entity DCPMaterialConfig  as projection on db.DCPMaterialConfig
        actions {
            action createDCPMaterial() returns Products;
        };

    annotate DistroSpec with @odata.draft.enabled;
    annotate DCPMaterialConfig with @odata.draft.enabled;
}
