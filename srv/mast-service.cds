using deluxe.mastering as db from '../db/mastering';
using api from '../db/common';

service MasteringService @(requires: 'authenticated-user') {
    entity SalesOrders      as projection on db.CPLSalesOrders;
    entity EssenceGroup     as projection on db.EssenceGroup;
    entity HeadTailReels    as projection on db.HeadTailReels;
    entity InsertEditGroup  as projection on db.InsertEditGroup;

    @readonly
    entity BusinessPartners as projection on api.BusinessPartners;
}
