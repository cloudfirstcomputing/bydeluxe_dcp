using dcp.db as db from '../db/dcp';
using {API_SALES_ORDER_SRV as S4_SalesOrder} from './external/API_SALES_ORDER_SRV';
using {API_BUSINESS_PARTNER as S4_BuisnessPartner} from './external/API_BUSINESS_PARTNER';
using {DistributionService.DistroSpec as DistroSpec} from './dist-service';
using {DistributionService as distService} from './dist-service';
using {AssetVaultService.DistributionDcp as AssetVault} from './asset-vault';
using {YY1_PARAMETER_CDS_0001 as S4_Param} from './external/YY1_PARAMETER_CDS_0001';
using {YY1_SALESPARAMETERS_CDS_0001 as S4_Sales_Param} from './external/YY1_SALESPARAMETERS_CDS_0001';
using {API_PRODUCT_SRV as externalProduct} from '../srv/external/API_PRODUCT_SRV.csn';
using {API_PRODUCTGROUP_SRV as S4_prodGroup} from '../srv/external/API_PRODUCTGROUP_SRV.csn';

using api from '../db/common';

service BookingOrderService {
    entity dcpcontent                   as projection on db.dcpcontent;
    action createContent(Records : array of dcpcontent)                                                    returns String;
    action processContent(bookingIDs : array of String)                                                    returns String;
    // action reconcileContent(bookingIDs: array of  String) returns String;

    entity dcpkey                       as projection on db.dcpkey;
    action createKey(Records : array of dcpkey)                                                            returns String;
    action postKeyToSAP(bookingIDs : array of String)                                                      returns String;
    action MassUploadBookingFeed(fileData : LargeString, fileName : String, fieldNames : FieldMap)         returns UploadResponse;
    // action reconcileKey(bookingIDs: array of  String) returns String;
    
    //Normalized Order
    entity StudioFeed                   as projection on db.StudioFeed;
    annotate StudioFeed with @odata.draft.enabled;
    action createStudioFeeds(StudioFeed : array of StudioFeed)                                             returns String;
    action MassUploadStudioFeed(fileData : LargeString, fileName : String, fieldNames : FieldMap)          returns UploadResponse;
    action MassUploadManageMaterialTitle(fileData : LargeString, fileName : String, fieldNames : array of String) returns UploadResponse;
    action remediateSalesOrder(ID : String)                                    returns String;
    action reconcileStudioFeed(aBookingID : array of String)                                               returns String;

    entity S4H_SOHeader                 as projection on S4_SalesOrder.SalesOrder;
    entity S4H_BuisnessPartner          as projection on S4_BuisnessPartner.A_BusinessPartner;
    entity S4H_CustomerSalesArea        as projection on S4_BuisnessPartner.A_CustomerSalesArea;
    entity S4H_SOHeader_V2              as projection on api.SalesOrderHeader;
    entity S4H_SalesOrderItem_V2        as projection on api.SalesOrderItem;
    entity S4H_BusinessPartnerapi       as projection on api.BusinessPartnersV1;
    entity S4H_BusinessPartnerAddress   as projection on S4_BuisnessPartner.A_BusinessPartnerAddress;
    entity S4H_ProductGroup1            as projection on api.ProductGroup1;

    entity S4H_Country                  as
        projection on api.Country {

            @Common.ValueList: {
                Label: 'Country', CollectionPath: 'S4H_Country', Parameters: [
                    {
                        $Type            : 'Common.ValueListParameterInOut',
                        LocalDataProperty: 'Country',
                        ValueListProperty: 'Country'
                    },
                    {
                        $Type            : 'Common.ValueListParameterDisplayOnly',
                        ValueListProperty: 'CountryName'
                    }
                ]
            }
            Country,

            CountryThreeLetterISOCode,
            CountryThreeDigitISOCode,
            CountryCurrency,
            to_Text.CountryName as CountryName
        };
    entity CountryText as projection on api.CountryText;
    entity S4_Parameters                as
        projection on S4_Param.YY1_PARAMETER {
            key ID,
                VariableName,
                VariableValue
        };

    entity S4_SalesParameter            as projection on S4_Sales_Param.YY1_SALESPARAMETERS;

    type FieldMap       : many {
        technicalName : String;
        excelColumn   : String;
    };

    type ResultRow      : {
        TitleID : String;
        Message : String;
        Error   : String;
        RowData : String;
    };

   type UploadResponse : {
        message     : {
            success : array of ResultRow;
            error   : array of ResultRow;
            warning : array of ResultRow;
        };
    };


    
    @readonly
    entity S4_Plants                    as projection on api.Plants;

    entity S4_ShippingConditions        as projection on api.ShippingConditions;
    entity S4_ShippingType_VH           as projection on api.ShippingType_VH;
    entity S4_ShippingPoint_VH          as projection on api.ShippingPoint_VH;
    entity S4_ProductGroupText          as projection on S4_prodGroup.A_ProductGroupText;
    entity DistroSpec_Local             as projection on DistroSpec;
    entity AssetVault_Local             as projection on AssetVault;
    entity BookingSalesOrder            as projection on db.BookingSalesOrder;
    entity BookingSalesorderItem        as projection on db.BookingSalesorderItem;
    entity CplList_Local                as projection on distService.CplList;
    entity DCPMaterialMapping           as projection on distService.DCPMaterialMapping;
    action test(bookingIDs : array of String)                                                              returns String;
    entity BookingStatus                as projection on db.BookingStatus;
    entity ShippingConditionTypeMapping as projection on db.ShippingConditionTypeMapping;
    entity ShippingTypeMaster           as projection on db.ShippingTypeMaster;  //S4_Bank
    
    type RemediateType {
        bookingID         : String;
        salesOrder        : String;
        plant             : String;
        shipTypeSelected  : String;
        shipPointSelected : String;
        deliveryDate      : Date
    }

    entity Maccs_Dchub                  as projection on db.Maccs_Dchub;
    action createMaccs(Request : array of Maccs_Dchub)                                                     returns String;

    /// Comscore Hollywood

    entity DigitalKeyOrders             as projection on db.DigitalKeyOrder;
    entity Theatres                     as projection on db.Theatre;
    entity TheatreOrderRequest          as projection on db.TheatreOrderRequest;
    entity DigitalComposition           as projection on db.DigitalComposition;
    entity MediaOrder                   as projection on db.MediaOrder;

    type TheatreOrderRequestType {
        StudioID       : String(50);
        GenerateDate   : DateTime;
        Version        : String(50);
        ServerName     : String(50);
        DataBaseName   : String(50);
        notes          : String(500);
        Theatre_Ass    : array of TheatreType;
        Content_Ass    : array of DigitalCompositionType;
        // DigitalKeyOrders_Ass : array of DigitalKeyOrderType;
        MediaOrder_Ass : array of MediaOrderType;
    }

    type TheatreType {
        ID          : String(50);
        Name        : String(200);
        City        : String(200);
        State       : String(100);
        PostalCode  : String(50);
        Address     : String(500);
        CountryCode : String(50);
    }

    type DigitalCompositionType {
        ID       : String(50);
        Title    : String(500);
        CPL_UUID : String(100);
        FilmID   : String(100);
    }

    type DigitalKeyOrderType {
        ID               : String(50);
        ContentID        : String(50);
        Screens          : String(200);
        CancelFlag       : Boolean;
        LicenseBeginDate : DateTime;
        LicenseEndDate   : DateTime;
    }

    type MediaOrderType {
        mediaType         : String;
        mediaOrderId      : Integer;
        TheatreID         : String(50);
        contentId         : Integer;
        cancelFlag        : String;
        operation         : String;
        playdateBegin     : Date;
        playdateEnd       : Date;
        holdKeyFlag       : String;
        tmcMediaOrderId   : String;
        tmcTheaterId      : String;
        note              : String;
        screeningScreenNo : String;
        screeningTime     : String;
        doNotShip         : String;
        shipHoldType      : String;
        deliveryMethod    : String;
        returnMethod      : String;
        isNoKey           : String;
        bookerName        : String;
        bookerPhone       : String;
        bookerEmail       : String;
    }

    action createComscoreHollywood(Request : TheatreOrderRequestType)                                      returns String;

    /// Disney OFE


    entity OrderRequest                 as projection on db.OrderRequest;
    entity AddressTypes                 as projection on db.AddressType;
    entity PackageTypes                 as projection on db.PackageType;
    entity CompositionTypes             as projection on db.CompositionType;
    entity VendorTypes                  as projection on db.VendorType;

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
        Compositions : CompositionType;
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

    action createDisneyOFE(Request : OrderRequestType)                                                     returns String;


    //OFE Key

    entity OFEOrders                    as projection on db.OFEOrders;
    entity KeyOrders                    as projection on db.KeyOrders;
    entity Site                         as projection on db.Site;
    entity Contacts                     as projection on db.Contacts;


    type OFEOrderstype {
        orderId       : Integer;
        studioId      : String;
        generatedDate : DateTime;
        keyOrders     : array of KeyOrderstype;
    }

    type KeyOrderstype {
        id                 : Integer;
        showtimeType       : String;
        contentDescription : String;
        cpl                : String;
        licenseBeginDate   : DateTime;
        licenseEndDate     : DateTime;
        isSpecialDelivery  : Boolean;
        cancelOrder        : String;
        screenId           : String;
        contacts           : array of Contactstype;
        site               : Sitetype;
    }

    type Sitetype {
        siteID          : String;
        siteName        : String;
        physicalAddress : String;
        deliveryAddress : String;
    }

    type Contactstype {
        email : String;
    }

    action createDisneyOFEKey(Request : OFEOrderstype)                                                     returns String;
    entity Titles                       as projection on db.Titles;
    entity Ratings                      as projection on db.Ratings;
    entity ExternalTitleIDs             as projection on db.ExternalTitleIDs;
   
    @readonly
    entity TitleV                       as projection on  db.TitleV{
        *,
           @Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'CountryText',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: RegionCode,
                    ValueListProperty: 'Country',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'CountryName',
                }
            ],
        }
        @Common.Text: Region
        @UI.TextArrangement : #TextOnly
           RegionCode ,
           Region,
           @Common.Text: TitleCategoryText
        @UI.TextArrangement : #TextOnly
           TitleCategory,
           TitleCategoryText ,
           @Common.Text: LangCodeText
        @UI.TextArrangement : #TextOnly
           LanguageCode,
           LangCodeText ,
           @Common.Text: StudioText
        @UI.TextArrangement : #TextOnly
           StudioDistributor,
           StudioText 
    };

    entity Products                     as
        projection on externalProduct.A_Product {
            key Product,
                ProductGroup,
                ProductType,
                BaseUnit,
                PreferredUnitOfMeasure,
                PurchaseOrderQuantityUnit,
                ProductManufacturerNumber,
                CreationDate,
                IsMarkedForDeletion,
                YY1_CustomerDes_PRD,
                YY1_matcust_PRD,
                to_ProductBasicText : redirected to ProductBasicText,
                to_Description      : redirected to ProductDescription
        };

    entity ProductDescription           as
        projection on externalProduct.A_ProductDescription {
            key Product,
            key Language,
                ProductDescription
        };

    entity ProductBasicText             as
        projection on externalProduct.A_ProductBasicText {
            key Product,
            key Language,
                LongText

        };

    type ProductsType {
        Product                   : Integer;
        ProductGroup              : String(9);
        ProductType               : String(4);
        BaseUnit                  : String(3);
        PurchaseOrderQuantityUnit : String(3);
        PreferredUnitOfMeasure    : String(3);
        ProductManufacturerNumber : String(40);
        to_ProductBasicText       : array of ProductBasicTextType;
        to_Description            : array of ProductDescriptionType;
    }

    type ProductBasicTextType {
        Product  : Integer;
        Language : String(2);
        LongText : String;
    }

    type ProductDescriptionType {
        Product            : Integer;
        Language           : String(2);
        ProductDescription : String(40)
    }

    action createProduct(input : ProductsType)                                                             returns Products;
    action editProduct(input : ProductsType)                                                               returns Products;
    action deleteProduct(input : ProductsType)                                                             returns Products;
    action downloadFormADS(form : String, Product : String)                                                returns LargeString;

    type MaterialDocItemType {
        MaterialDocumentYear : String(4);
        MaterialDocument     : String(10);
        MaterialDocumentItem : String(4);
    }

    action formGR_LABEL(form : String, Material : MaterialDocItemType)                                     returns LargeString;


    @readonly
    entity MaterialDocumentHeader       as
        projection on api.MaterialDocumentHeader {
            key MaterialDocumentYear,
            key MaterialDocument,
                PostingDate,
                MaterialDocumentHeaderText,
                InventoryTransactionType,
                to_MaterialDocumentItem : redirected to MaterialDocumentItem,
        };

    entity MaterialDocumentItem         as
        projection on api.MaterialDocumentItem {
            key MaterialDocumentYear,
            key MaterialDocument,
            key MaterialDocumentItem,
                QuantityInBaseUnit,
                QuantityInEntryUnit,
                EntryUnit,
                Material,
                Plant,
                Supplier,
                Batch,
                '' as PlantDescription :String,
                '' as MaterialDescription :String,
                '' as BatchDescription :String,
                '' as SupplierDescription :String,
                to_MaterialDocumentHeader : redirected to MaterialDocumentHeader,

        };

    entity ProductionOrder              as projection on api.ProductionOrder;

    entity BillingDocument              as
        projection on api.BillingDocument {
            key BillingDocument,
                BillingDocumentCategory,
                BillingDocumentType,
                BillingDocumentDate,
                to_Item : redirected to BillingDocumentItem,
        }

    entity BillingDocumentItem          as
        projection on api.BillingDocumentItem {
            key BillingDocument,
            key BillingDocumentItem,
                SalesDocument,
                SalesDocumentItemCategory,
                PricingReferenceMaterial,
                BillingQuantity,
                BillingQuantityUnit,
                TransactionCurrency,
                NetAmount,
                to_BillingDocument : redirected to BillingDocument
        }

    entity BillingDocumentPartner as projection on api.BillingDocumentPartner;

    entity BillingDocumentItemText as projection on api.BillingDocumentItemText;
    entity BillingDocumentItemPrcgElmnt as projection on api.BillingDocumentItemPrcgElmnt;
    
 
    type BillingDoc {
        BillingDocument         : String;
        BillingDocumentCategory : String;
        BillingDocumentType     : String;
        BillingDocumentDate     : Date;

    }

    action invoiceForm_LABEL(form : String, Billing : BillingDoc)                                          returns LargeString;

    action  SDBIL_CI_STANDARD_US_E (form:String, Billing:BillingDoc) returns LargeString;
    
    entity Batch  as projection on db.Batch;
    entity Company as projection on api.Company;

    entity AddressPostal as projection on api.AddressPostal;
    entity HouseBank as projection on api.HouseBank;

    entity Bank as projection on api.Bank;
}
