using dcp.db as db from '../db/dcp';
using {API_SALES_ORDER_SRV as S4_SalesOrder} from './external/API_SALES_ORDER_SRV';
using {API_BUSINESS_PARTNER as S4_BuisnessPartner} from './external/API_BUSINESS_PARTNER';
using {DistributionService.DistroSpec as DistroSpec} from './dist-service';
service BookingOrderService{
    entity dcpcontent as projection on db.dcpcontent;
    action createContent(Records: array of  dcpcontent) returns String;
    action processContent(bookingIDs: array of String) returns String;
    action reconcileContent(bookingIDs: array of  String) returns String;

    entity dcpkey as projection on db.dcpkey;
    action createKey(Records: array of  dcpkey) returns String;
    action processKey(dcpkey: array of  dcpkey) returns String;
    action reconcileKey(dcpkey: array of  dcpkey) returns String;

    entity S4H_SOHeader as projection on S4_SalesOrder.SalesOrder;
    entity S4H_BuisnessPartner as projection on S4_BuisnessPartner.A_BusinessPartner;
    entity S4H_CustomerSalesArea as projection on S4_BuisnessPartner.A_CustomerSalesArea;

    entity DistroSpec_Local as projection on DistroSpec;

    annotate dcpcontent with @odata.draft.enabled;
    annotate dcpkey with @odata.draft.enabled;
}