namespace dcp.db;

using {
    managed,
    cuid,
    sap.common.CodeList,
} from '@sap/cds/common';
using api from './common';
using deluxe.distribution as dist from './distribution';

entity TitleVH as projection on api.Products;
entity dcpcontent : managed {
        ApplicationID       : String ;
    key BookingID           : String ;
    key Version             : Integer;
        IsActive            : String;
        EntityID            : String;
        ReleaseID           : String ;
        TheaterID           : String ;
        Circuit             : String;
        ShipmentIndicator   : String  ;
        ScreeningIndicator  : String  ;
        PlayStartDate       : Date       ;
        PlayEndDate         : Date       ;
        BranchID            : String  ;
        DepotID             : String;
        SoundID             : String  ;
        Language            : String  ;
        SubtitleType        : String;
        PrintFormat         : String  ;
        ReleaseHold         : String  ;
        ShipDate            : Date       ;
        ShipPriority        : String  ;
        AuditoriumType      : String  ;
        PrintQuality        : String  ;
        FilmStock           : String  ;
        Key_Content         : String  ;
        TimeofEntry         : Time;
        BookingType         : String  ;
        PackageName         : String     ;
        UUID                : String;
        Territory           : String  ;
        //Key Specific
        BookingUpdater      : String;
        CountryCode         : String;
        ScreenID            : String;
        SingleScreen        : String;
        StartDate           : Date;
        StartTime           : Time;
        EndDate             : Date;
        EndTime             : Time;
        DeliveryOnDate      : Date;
        ApprovedScreensList : String;
        ReleaseName         : String;
        ReleaseShortName    : String;
        ReleaseNameHO       : String;
        ReleaseTitleHO      : String;
        //Common custom fields
        Status              : Association to BookingStatus;
        SalesOrder          : String     @readonly;
        ErrorMessage        : String     @readonly;
        ReferenceSDDocument : String     @readonly;
        Warnings            : String
}

entity dcpkey : managed {
        ApplicationID       : String                   ;
    key BookingID           : String                   ;
    key Version             : Integer;
        IsActive            : String;
        EntityID            : String;
        ReleaseID           : String                   ;
        TheaterID           : String                   ;
        Circuit             : String;
        ShipmentIndicator   : String                    ;
        ScreeningIndicator  : String                    ;
        PlayStartDate       : Date                         ;
        PlayEndDate         : Date                         ;
        BranchID            : String                    ;
        DepotID             : String;
        SoundID             : String                    ;
        Language            : String                    ;
        SubtitleType        : String                    ;
        PrintFormat         : String;
        ReleaseHold         : String                    ;
        BookingUpdater      : String                   ;
        ShipDate            : Date                         ;
        ShipPriority        : String                    ;
        AuditoriumType      : String                    ;
        PrintQuality        : String                    ;
        FilmStock           : String                    ;
        CountryCode         : String                    ;
        ScreenID            : String                    ;
        SingleScreen        : String                       ;
        StartDate           : Date                         ;
        StartTime           : Time                         ;
        EndDate             : Date                         ;
        EndTime             : Time                         ;
        Key_Content         : String                    ;
        UUID                : String                   ;
        TimeofEntry         : Time;
        BookingType         : String                    ;
        PackageName         : String                       ;
        Releasempm          : String                   ;
        Territory           : String                    ;
        DeliveryOnDate      : Date                         ;
        ApprovedScreensList : String                       ;
        ReleaseName         : String                   ;
        ReleaseShortName    : String                    ;
        ReleaseNameHO       : String                   ;
        ReleaseTitleHO      : String;
        Status              : Association to BookingStatus;
        SalesOrder          : String                       @readonly;
        ErrorMessage        : String                       @readonly;
        ReferenceSDDocument : String                       @readonly;
        Warnings            : String
}
entity TitleCustVH       as projection on api.ZI_TITLES_VH;
entity StudioVH      as projection on api.ZI_Studio;
entity StudioFeed : cuid, managed {
    BookingID          : String                       ;
    SourceSystem       : String                       @UI.Hidden;
    EntityID           : String                       ;
    Origin             : Association to Origins       ;
    // Origin             : String        ;
    Studio             : Association to StudioVH                       ;
    StudioText         : String;
    CustomerReference  : String;
    Title              : Association to TitleCustVH       ;
    TitleText          : String;
    CreatedOn          : Date;
    RequestedDelivDate : Date                         ;
    ReleaseID          : String @UI.Hidden;
    OrderType          : Association to dist.OrderType                       ;
    RecordType         : String @UI.Hidden;
    BookingType        : Association to BookingTypeVH;
    TheaterID          : String;
    Circuit            : String @UI.Hidden;
    BookerName         : String;
    RequestId          : String @UI.Hidden;
    OrderID            : String;
    PlayStartDate      : Date ;
    PlayStartTime      : Time default '00:00:01' ;
    PlayEndDate        : Date ;
    PlayEndTime        : Time default '23:59:59';
    KeyDeliveryOnDate  : Date;
    KeyStartDate       : Date;
    KeyStartTime       : Time;
    KeyEndDate         : Date;
    KeyEndTime         : Time;
    HFR                : String;
    ShipmentIndicator  : String;
    ScreeningIndicator : String;
    DepotID            : String @UI.Hidden;
    SoundID            : String @UI.Hidden;
    Language           : String;
    SubtitleType1      : String @UI.Hidden;
    SubtitleType2      : String @UI.Hidden;
    PrintFormat        : String @UI.Hidden;
    ShipPriority       : Integer                      @assert.range: [
        1,
        5
    ];
    PrintQuality       : String @UI.Hidden;
    ApprovedScreens    : String;
    CTTs               : String @UI.Hidden;
    CPLUUIDs           : String @UI.Hidden;
    CountryCode        : String @UI.Hidden;
    ScreenID           : String @UI.Hidden;
    ContentType        : String @UI.Hidden;
    CancelOrder        : String @UI.Hidden;
    DeliveryType       : String @UI.Hidden;

    //Common custom fields    
    RemediationCounter : Integer                      @readonly;
    DeliveryMethod: String                            @readonly;
    Version            : Integer                      @readonly;
    IsActive           : String(1)                    @readonly;
    Remediation        : String                       @readonly;
    Status             : Association to BookingStatus @readonly;
    SalesOrder         : String                       @readonly;
    ErrorMessage       : String                       @readonly;
    Warnings           : String                       @readonly;

    to_Item: Composition of many BookingSalesorderItem
                                      on $self.SalesOrder = to_Item.SalesOrder    @readonly;
    @readonly
    to_Partner                : Composition of many BookingSalesorderPartner
                                      on $self.SalesOrder = to_Partner.SalesOrder;                                      
}

entity Origins {
    // key OriginID   : String(1) enum {
    //         F;
    //         P;
    //         S;
    //         M;
    //     };
    key OriginID   : String(1);
        OriginText : localized String;
};

entity BookingStatus {
    key ID     : String(1) enum {
            A;//Not Processed
            C;//Completedly Processed
            D;//Failed
            R;//Review
        };
        Status : localized String;
};

entity BookingTypeVH {
    // key ID: String(2) enum {
    //     NO; //New Order
    //     C; //Cancel
    //     U; //Update
    // };
    key ID: String(2);
    Description: localized String;
}
// @cds.redirection.target: 'BookingOrderService.BookingSalesOrder'
@readonly
entity BookingSalesOrder : managed {
    key SalesOrder              : String                                    @mandatory;
    key BookingID               : String                                    @mandatory;
        EntityID                : String;
        SoldToParty             : String;
        SalesOrganization       : String;
        DistributionChannel     : String;
        OrganizationDivision    : String;
        PurchaseOrderByCustomer : String;
        TotalNetAmount          : Decimal(15);
        TransactionCurrency     : String;
        ShippingCondition       : String;
        ShipDate                : Date;
        ApplicationID           : String;
        ReleaseID               : String;
        TheaterID               : String;
        Circuit                 : String;
        TimeofEntry             : Time;
        BookingType             : String;
        PackageName             : String;
        ScreeningIndicator      : String;
        PlayStartDate           : Date;
        PlayEndDate             : Date;
        BranchID                : String;
        DepotID                 : String;
        SoundID                 : String;
        Language                : String;
        SubtitleType            : String;
        PrintFormat             : String;
        ReleaseHold             : String;
        ShipPriority            : String;
        AuditoriumType          : String;
        PrintQuality            : String;
        FilmStock               : String;
        Key_Content             : String;
        UUID                    : String;
        CountryCode             : String;
        ScreenID                : String;
        SingleScreen            : String;
        Releasempm              : String;
        Territory               : String;
        DeliveryOnDate          : Date;
        ApprovedScreensList     : String;
        ReleaseName             : String;
        ReleaseShortName        : String;
        ReleaseNameHO           : String;
        ReleaseTitleHO          : String;
        _Item                   : Composition of many BookingSalesorderItem
                                      on $self.SalesOrder = _Item.SalesOrder    @readonly;
        _Partner                : Composition of many BookingSalesorderPartner
                                      on $self.SalesOrder = _Partner.SalesOrder @readonly;
        DistroSpecID            : Integer default 0                             @readonly;
}

@readonly
entity BookingSalesorderItem : managed {
    key SalesOrder               : String(10) @mandatory;
    key SalesOrderItem           : String(6) @mandatory;
        Product                  : String;
        RequestedQuantity        : Decimal(15, 3);
        RequestedQuantityISOUnit : String;
        Plant                    : String;
        ShippingPoint            : String;
        ProductGroup             : String;
        AdditionalMaterialGroup1 : String;
        ShipmentIndicator        : String;
        ScreeningIndicator       : String;
        PlayStartDate            : Date;
        PlayEndDate              : Date;
        BranchID                 : String;
        DepotID                  : String;
        SoundID                  : String;
        Language                 : String;
        SubtitleType             : String;
        PrintFormat              : String;
        ReleaseHold              : String;
        ShipPriority             : String;
        AuditoriumType           : String;
        PrintQuality             : String;
        FilmStock                : String;
        Key_Content              : String;
        LongText                 : LargeString;
        CTT                      : String;
        CPLUUID                  : String;
        PricingReferenceMaterial : String;
        StartDate                : Date;
        StartTime                : Time;
        EndDate                  : Date;
        EndTime                  : Time;
        InitialKeyDuration       : Integer;
        NextKeyDuration          : Integer;
        OffsetEPD                : Integer;
        InferKeyContentOrder     : Boolean;
        AggregateKey             : Boolean;
        ProcessKDMS              : Integer;
        ProcessScreeningKDMS     : Integer;
        MaxKDMSDuration          : Integer;
        StudioHoldOverRule       : String;
        DistroSpecPackageID      : UUID;
        DistroSpecPackageName    : String;
        KeyStartTime             : Time;
        KeyEndTime               : Time;
        AssetIDs                 : String;
        KrakenIDs                : String;
        ShippingType             : Association to one ShippingTypeMaster;
        SalesTerritory           : Association to one api.SalesDistricts;  
}
@readonly
entity BookingSalesorderPartner : managed {
    key SalesOrder      : String(10) @mandatory;
    key PartnerFunction : String(2);
        Customer        : String(10);
        PartnerFunctionInternalCode: String(2);
        Supplier: String(10);
        Personnel: String(8);
        ContactPerson: String(10);
        WorkAssignmentExternalID: String(100);
        ReferenceBusinessPartner: String(10);
        AddressID: String(10);
        VATRegistration: String(20);
}

entity ShippingConditionTypeMapping {
    key ShippingCondition       : String(2);
        ShippingType            : String(2);
        ShippingTypeDescription : String;
}

entity ShippingTypeMaster {
    key ID                      : String(2);
        ShippingTypeDescription : String;
}

entity KalmusTheaterStudio: managed{
    key PartnerfunctionSP: String;
    key Studio: String;
    StudioName: String;

    key PartnerfunctionSH: String;
    key Theater:String;
    TheaterName: String;

    StudioShorts: String;
}
// Maccs_Dchub
entity Maccs_Dchub : managed {
    key requestId                     : String(18) @mandatory;
        product                       : String(16);
        titleId                       : Integer    @mandatory;
        titleExternalRef              : Integer    @mandatory;
        titleDescription              : String(40);
    key cinemaId                      : String(10) @mandatory;
        screenId                      : String(40);
        screenNumber                  : Integer    @mandatory;
        cinemaDescription             : String(40);
        cinemaTerritory               : String(2)  @mandatory;
        recipientExternalRef          : String(10);
        versionId                     : Integer;
        versionDescription            : String(20);
        versionExternalRefVendor      : String(20);
        versionExternalRefDistributor : String(10);
        versionAdditionalInfo         : String(20);
        startDate                     : Date       @mandatory;
        endDate                       : Date       @mandatory;
        deliveryDate                  : Date       @mandatory;
    key customerRef                   : String(20) @mandatory;
        distributorId                 : Integer;
        distributorDescription        : String(15);
        distributorKDMArchive         : String(20);
        hasDcp                        : String;
        doNotShip                     : String;
        circuitingFrom                : String(10);
        screeningTime                 : Time;
        showcode                      : String(10);
        techCheckKey                  : String;
    key quantity                      : Integer    @mandatory;
        requestType                   : String(10);
        requestStatusCode             : Integer;
        requestStatusDescription      : String(20);
        remark                        : String(40);
        bookerName                    : String(20) @mandatory;
}


/// Comscore Hollywood

entity TheatreOrderRequest : managed {
    key StudioID             : String(50);
    key GenerateDate         : Date;
    key Version              : String(50);
        ServerName           : String(50);
        DataBaseName         : String(50);
        notes                : String(500);
        // Compositions
        Theatre_Ass          : Composition of many Theatre
                                   on Theatre_Ass.Request = $self;
        Content_Ass          : Composition of many DigitalComposition
                                   on Content_Ass.Request = $self;
        DigitalKeyOrders_Ass : Composition of many DigitalKeyOrder
                                   on DigitalKeyOrders_Ass.Request = $self;
        MediaOrder_Ass       : Composition of many MediaOrder
                                   on MediaOrder_Ass.Request = $self;
}

entity Theatre : managed {
    key ID          : String(50);
        Name        : String(200);
        City        : String(200);
        State       : String(100);
        PostalCode  : String(50);
        CountryCode : String(50);
        Address     : String(500);
        Request     : Association to TheatreOrderRequest;

}

entity MediaOrder : managed {
        mediaType         : String;
    key mediaOrderId      : Integer;
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
        Request           : Association to TheatreOrderRequest;
}

entity DigitalComposition : managed {
    key ID       : String(50);
        Title    : String(500);
        CPL_UUID : String(100);
        FilmID   : String(100);
        Request  : Association to TheatreOrderRequest;
}

entity DigitalKeyOrder : managed {
    key DigitalKeyOrderID : String(50);
        ContentID         : String(50);
        Screens           : String(200);
        CancelFlag        : Boolean;
        LicenseBeginDate  : DateTime;
        LicenseEndDate    : DateTime;
        Request           : Association to TheatreOrderRequest;
}

/// Disney OFE
entity OrderRequest : managed {
        ShowTimeType         : String(50);
    key OrderID              : Integer;
    key ContentOrderID       : Integer;
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
        DeliveryAddress      : Composition of one AddressType on DeliveryAddress.OrderRequest = $self;
        PhysicalAddress      : Composition of one AddressType on PhysicalAddress.OrderRequest = $self;
        Package              : Composition of one PackageType on Package.OrderRequest = $self;
        Vendor               : Composition of one VendorType on Vendor.OrderRequest = $self;
}

entity AddressType {
    key SiteID       : String(50);
        SiteName     : String(200);
        CircuitName  : String(200);
        ShortName    : String(50);
        Address1     : String(200);
        Address2     : String(200);
        City         : String(100);
        State        : String(50);
        Territory    : String(100);
        ISO          : String(10);
        PostalCode   : String(20);
        Region       : String(50);
 key   OrderRequest : Association to OrderRequest;
}

entity PackageType {
    key ID           : Integer;
        Description  : String(200);
        TitleName    : String(500);
    key OrderRequest : Association to OrderRequest;
        Compositions : Composition of one CompositionType
                           on Compositions.Package = $self;
}

entity CompositionType {
    key ID                : String;
    key UUID              : String(500);
        ContentUniqueID   : String(100);
        Description       : String(500);
        TrackLanguage     : String(100);
        Sub1              : String(100);
        Sub2              : String(100);
        ContentType       : String(50);
        ContentSize       : String(200);
        IsUpdated         : Boolean;
        CompositionStatus : String(50);
     key Package           : Association to PackageType;
}

entity VendorType {
    key ID           : Integer;
        Name         : String(200);
        Email        : String(500);
        Phone        : String(50);
        Fax          : String(50);
    key OrderRequest : Association to OrderRequest;
}

//OFE Key

entity OFEOrders : managed {
    key orderId       : Integer;
    key studioId      : String;
    key generatedDate : DateTime;
        keyOrders     : Composition of many KeyOrders
                            on keyOrders.OrderRequest = $self;
}

entity KeyOrders {
    key id                 : Integer;
        showtimeType       : String;
        contentDescription : String;
        cpl                : String;
        licenseBeginDate   : DateTime;
        licenseEndDate     : DateTime;
        isSpecialDelivery  : Boolean;
        cancelOrder        : String;
        screenId           : String;
        contacts           : Composition of many Contacts
                                 on contacts.KeyOrderRequest = $self;
        site               : Composition of one Site
                                 on site.KeyOrderRequest = $self;
        OrderRequest       : Association to OFEOrders;
}

entity Site {
    key siteID          : String;
        siteName        : String;
        physicalAddress : String;
        deliveryAddress : String;
        KeyOrderRequest : Association to KeyOrders;
}

entity Contacts {
    key email           : String;
    key KeyOrderRequest : Association to KeyOrders;
}

entity Titles : cuid, managed {
    key MaterialMasterTitleID : String     @Common.Label: 'Material Master Title ID';
    key LocalTitleId          : String      @Common.Label: 'Local Title ID' @default:cuid;
    key RegionCode            : String(4)   @Common.Label: 'Region Code';
        OriginalTitleName     : String(240) @Common.Label: 'Original Title Name';
        TitleType             : String(10)  @Common.Label: 'Title Type';
        TitleCategory         : String(20)  @Common.Label: 'Title Category';
        RegionalTitleName     : String(240) @Common.Label: 'Regional Title Name';
        ShortTitle            : String(240) @Common.Label: 'Short Title';
        SecurityTitle         : String(240) @Common.Label: 'Security Title';
        LanguageCode          : String(4)   @Common.Label: 'Language Code';
        ReleaseDate           : Date        @Common.Label: 'Release Date';
        RepertoryDate         : Date        @Common.Label: 'Repertory Date';
        Format                : String(8)   @Common.Label: 'Format';
        ReleaseSize           : String(20)  @Common.Label: 'Release Size';
        Ratings               : String(80)  @Common.Label: 'Ratings';
        ReelCountEstimated    : Integer     @Common.Label: 'Reel Count Estimated';
        AssetVaultTitleId     : String(50)  @Common.Label: 'Asset Vault Title ID';
        ImdbId                : String(50)  @Common.Label: 'IMDB ID';
        StudioTitleId         : String(50)  @Common.Label: 'Studio Title ID';
        GofilexTitleId        : String(50)  @Common.Label: 'Gofilex Title Id';
        StudioDistributor     : String(20)  @Common.Label: 'Studio Distributor';
        UseSecureName         : String(5)   @Common.Label: 'Use Secure Name';
        IsMarkedForDeletion   : Boolean default false;
        ExternalTitleIDs_Ass  : Composition of many ExternalTitleIDs
                                    on ExternalTitleIDs_Ass.Title = $self;
        Ratings_Ass           : Composition of many Ratings
                                    on Ratings_Ass.Title = $self;
}

entity ExternalTitleIDs : cuid, managed {
    IDType         : String(20);
    IDValue        : String(50);
    Title          : Association to Titles;
}

entity Ratings : cuid, managed {
    RatingCode     : String(20);
    AgencyName     : String(40);
    Title          : Association to Titles;
}

define view RatingsConcat as
    select from Ratings {
        Title.MaterialMasterTitleID,
       // Title.LocalTitleId,
        Title.ID,
        // Title.RegionCode,
        STRING_AGG(
            RatingCode, ','
        ) as RatingCode : String
    }
    group by
        Title.MaterialMasterTitleID,
       // Title.LocalTitleId,
        Title.ID;
        // Title.RegionCode;

define view TitleV as
    select from Titles
    left outer join RatingsConcat
        on RatingsConcat.MaterialMasterTitleID = Titles.MaterialMasterTitleID
    left outer join ExternalTitleIDs
        on ExternalTitleIDs.Title = Title    
    distinct
    {
        
        key Titles.MaterialMasterTitleID,
        key Titles.LocalTitleId,
        key Titles.ID,
        Key Titles.TitleType,
            Titles.RegionCode,
            Titles.OriginalTitleName,        
            Titles.TitleCategory,
            Titles.RegionalTitleName,
            Titles.ShortTitle,
            Titles.SecurityTitle,
            Titles.LanguageCode,
            Titles.ReleaseDate,
            Titles.RepertoryDate,
            Titles.Format,
            Titles.ReleaseSize,
            Titles.Ratings,
            Titles.ReelCountEstimated,
            Titles.AssetVaultTitleId,
            Titles.ImdbId,
            Titles.StudioTitleId,
            Titles.StudioDistributor,
            Titles.GofilexTitleId,
            Titles.UseSecureName,
            Titles.IsMarkedForDeletion,  
            RatingsConcat.RatingCode,
            ExternalTitleIDs.IDType,
            ExternalTitleIDs.IDValue,
            '' as Region :String(500),
            '' as TitleCategoryText :String(500),
            '' as LangCodeText :String(500),
            '' as StudioText :String(500)
            // @cds.persistence.skip
            // to_CountryText   : Association to api.CountryText 
            //          on to_CountryText.Country = $self.RegionCode
    };


@cds.persistence.exists
entity Batch : cuid, managed {
    BatchNumber      : String(10) @mandatory;
    StorageLocation  : String(4);
    Plant            : String(4);
    InventoryBinID   : String(10);
    InventoryBinName : String(40);
    Status           : Int16;
    BatchNumberU     : String(10);
}