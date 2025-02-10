using dcp.db as db from '../db/dcp';
using {API_SALES_ORDER_SRV as S4_SalesOrder} from './external/API_SALES_ORDER_SRV';
using {API_BUSINESS_PARTNER as S4_BuisnessPartner} from './external/API_BUSINESS_PARTNER';
using {DistributionService.DistroSpec as DistroSpec} from './dist-service';
using {AssetVaultService.AssetVault as AssetVault} from './asset-vault';
using api from '../db/common';

service BookingOrderService {
    entity dcpcontent            as projection on db.dcpcontent;
    action createContent(Records : array of dcpcontent)                                                                                           returns String;
    action processContent(bookingIDs : array of String)                                                                                           returns String;
    // action reconcileContent(bookingIDs: array of  String) returns String;

    entity dcpkey                as projection on db.dcpkey;
    action createKey(Records : array of dcpkey)                                                                                                   returns String;
    action postKeyToSAP(bookingIDs : array of String)                                                                                             returns String;
    action remediateContentSalesOrder(bookingID : String, salesOrder : String, plant : String, shippingCondition : String, deliveryDate : String) returns String;
    action remediateKeySalesOrder(bookingID : String, salesOrder : String, plant : String, shippingCondition : String, deliveryDate : String)     returns String;
    // action reconcileKey(bookingIDs: array of  String) returns String;

    entity S4H_SOHeader          as projection on S4_SalesOrder.SalesOrder;
    entity S4H_BuisnessPartner   as projection on S4_BuisnessPartner.A_BusinessPartner;
    entity S4H_CustomerSalesArea as projection on S4_BuisnessPartner.A_CustomerSalesArea;
    entity S4H_SOHeader_V2       as projection on api.SalesOrderHeader;
    entity S4H_SalesOrderItem_V2 as projection on api.SalesOrderItem;

    @readonly
    entity S4_Plants             as projection on api.Plants;

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
    entity Maccs_Dchub           as projection on db.Maccs_Dchub;
    action createMaccs(Request : array of Maccs_Dchub)                                                                                            returns String;

    /// Comscore Hollywood

    entity DigitalKeyOrders as projection on db.DigitalKeyOrder;
    entity Theatres as projection on db.Theatre;
    entity TheatreOrderRequest   as projection on db.TheatreOrderRequest;

    entity DigitalComposition as projection on db.DigitalComposition;

    type TheatreOrderRequestType {
        StudioID             : String(50);
        GenerateDate         : DateTime;
        Theatre_Ass          : array of TheatreType;
        Content_Ass          : array of DigitalCompositionType;
        DigitalKeyOrders_Ass : array of DigitalKeyOrderType;
    }

    type TheatreType {
        ID   : String(50);
        Name        : String(200);
        City        : String(200);
        State       : String(100);
        PostalCode  : String(50);
        CountryCode : String(50);
    }

    type DigitalCompositionType {
        ID : String(50);
        Title     : String(500);
        CPL_UUID  : String(100);
    }

    type DigitalKeyOrderType {
        ID : String(50);
        ContentID         : String(50);
        Screens           : String(200);
        CancelFlag        : Boolean;
        LicenseBeginDate  : DateTime;
        LicenseEndDate    : DateTime;
    }

    action createComscoreHollywood(Request : array of TheatreOrderRequestType)                                                                    returns String;

        /// Disney OFE

            @readonly
    entity OrderRequests as projection on db.OrderRequest;

    @readonly
    entity AddressTypes as projection on db.AddressType;

    @readonly
    entity PackageTypes as projection on db.PackageType

    @readonly
    entity CompositionTypes as projection on db.CompositionType 

    @readonly
    entity VendorTypes as projection on db.VendorType;
    type OrderRequestType {
        ShowTimeType         : String(50);
        OrderID              : Integer;
        ContentOrderID       : Integer;
        TransactionType      : String(50);
        BookingID            : String(50);
        BookingSystem        : String(50);
        DeliveryDate         : DateTime;
        StartDate            : DateTime;
        EndDate              : DateTime;
        NumberOfCompositions : Integer;
        IsCancellation       : Boolean;
        DeliveryType         : String(50);
        IsRemediation        : Boolean;
        DeliveryAddress      : AddressType;
        PhysicalAddress      : AddressType;
        Package              : PackageType;
        Vendor               : VendorType;
    }

    type AddressType {
        SiteID      : String(50);
        SiteName    : String(200);
        CircuitName : String(200);
        ShortName   : String(50);
        Address1    : String(200);
        Address2    : String(200);
        City        : String(100);
        State       : String(50);
        Territory   : String(100);
        ISO         : String(10);
        PostalCode  : String(20);
        Region      : String(50);
    }

    type PackageType {
        ID           : Integer;
        Description  : String(200);
        TitleName    : String(500);
        Compositions : array of CompositionType;
    }

    type CompositionType {
        ID                : Integer;
        UUID              : String(100);
        ContentUniqueID   : String(100);
        Description       : String(500);
        TrackLanguage     : String(100);
        Sub1              : String(100);
        Sub2              : String(100);
        ContentType       : String(50);
        ContentSize       : Integer;
        IsUpdated         : Boolean;
        CompositionStatus : String(50);
    }

    type VendorType {
        ID    : Integer;
        Name  : String(200);
        Email : String(500);
        Phone : String(50);
        Fax   : String(50);
    }

    action createDisneyOFE(Request : array of OrderRequestType) returns String;
}
