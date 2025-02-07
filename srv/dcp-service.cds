using dcp.db as db from '../db/dcp';
using {API_SALES_ORDER_SRV as S4_SalesOrder} from './external/API_SALES_ORDER_SRV';
using {API_BUSINESS_PARTNER as S4_BuisnessPartner} from './external/API_BUSINESS_PARTNER';
using {DistributionService.DistroSpec as DistroSpec} from './dist-service';
using {AssetVaultService.AssetVault as AssetVault} from './asset-vault';
using api from '../db/common';
service BookingOrderService{
    entity dcpcontent as projection on db.dcpcontent;
    action createContent(Records: array of  dcpcontent) returns String;
    action processContent(bookingIDs: array of String) returns String;
    // action reconcileContent(bookingIDs: array of  String) returns String;

    entity dcpkey as projection on db.dcpkey;
    action createKey(Records: array of  dcpkey) returns String;
    action postKeyToSAP(bookingIDs: array of String) returns String;
    action remediateContentSalesOrder(bookingID: String, salesOrder: String, plant: String, shippingCondition: String, deliveryDate: String) returns String;
    action remediateKeySalesOrder(bookingID: String, salesOrder: String, plant: String, shippingCondition: String, deliveryDate: String) returns String;
    // action reconcileKey(bookingIDs: array of  String) returns String;

    entity S4H_SOHeader as projection on S4_SalesOrder.SalesOrder;
    entity S4H_BuisnessPartner as projection on S4_BuisnessPartner.A_BusinessPartner;
    entity S4H_CustomerSalesArea as projection on S4_BuisnessPartner.A_CustomerSalesArea;   
    entity S4H_SOHeader_V2 as projection on api.SalesOrderHeader;
    entity S4H_SalesOrderItem_V2 as projection on api.SalesOrderItem;
    @readonly 
    entity S4_Plants as projection on api.Plants;
    entity S4_ShippingConditions as projection on api.ShippingConditions;
    entity DistroSpec_Local as projection on DistroSpec;
    entity AssetVault_Local as projection on AssetVault;

    entity BookingSalesOrder as projection on db.BookingSalesOrder;
    action test(bookingIDs: array of String) returns String;
    
    entity BookingStatus as projection on db.BookingStatus;
    entity ShippingConditionTypeMapping as projection on db.ShippingConditionTypeMapping;
    entity ShippingTypeMaster as projection on db.ShippingTypeMaster;
    annotate dcpcontent with @odata.draft.enabled;
    annotate dcpkey with @odata.draft.enabled;
}