using deluxe.distribution as db from '../db/distribution';

service DistributionService @(requires: 'authenticated-user') {
    @readonly
    entity BusinessPartners  as projection on db.BusinessPartners;

    @readonly
    entity ShippingConditions as projection on db.ShippingConditions;

    entity DistroSpec        as projection on db.DistroSpec;
    annotate DistroSpec with @odata.draft.enabled
}
