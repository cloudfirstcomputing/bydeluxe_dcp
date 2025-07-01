using deluxe.mastering as db from '../db/mastering';
using api from '../db/common';

service MasteringService @(requires: 'authenticated-user') {
    entity SalesOrders      as projection on db.CPLSalesOrders;
    entity EssenceGroup     as projection on db.EssenceGroup;
    entity HeadTailReels    as projection on db.HeadTailReels;
    entity InsertEditGroup  as projection on db.InsertEditGroup;

    @readonly
    entity BusinessPartners as projection on api.BusinessPartners;

 entity MasteringHubMain  as projection on db.MasteringHubMain;
  entity InsertEditDetails  as projection on db.InsertEditDetails;
   entity EssenceDetails  as projection on db.EssenceDetails;
    entity PartnerDetails  as projection on db.PartnerDetails;
    



}
