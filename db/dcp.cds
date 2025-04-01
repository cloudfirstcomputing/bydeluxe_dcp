namespace dcp.db;

using {
    managed,
    cuid
} from '@sap/cds/common';
using api from './common';

entity TitleVH as projection on api.Products;

entity dcpcontent : managed {
        ApplicationID       : String(20) @mandatory;
    key BookingID           : String(10) @mandatory;
    key Version             : Integer;
        IsActive            : String(1);
        EntityID            : String;
        ReleaseID           : String(10) @mandatory;
        TheaterID           : String(12) @mandatory;
        Circuit             : String(12);
        ShipmentIndicator   : String(1)  @mandatory;
        ScreeningIndicator  : String(1)  @mandatory;
        PlayStartDate       : Date       @mandatory;
        PlayEndDate         : Date       @mandatory;
        BranchID            : String(2)  @mandatory;
        DepotID             : String(1);
        SoundID             : String(8)  @mandatory;
        Language            : String(3)  @mandatory;
        SubtitleType        : String(2);
        PrintFormat         : String(3)  @mandatory;
        ReleaseHold         : String(1)  @mandatory;
        ShipDate            : Date       @mandatory;
        ShipPriority        : String(2)  @mandatory;
        AuditoriumType      : String(1)  @mandatory;
        PrintQuality        : String(4)  @mandatory;
        FilmStock           : String(4)  @mandatory;
        Key_Content         : String(1)  @mandatory;
        TimeofEntry         : Time;
        BookingType         : String(4)  @mandatory;
        PackageName         : String     @mandatory;
        UUID                : String(40);
        Territory           : String(2)  @mandatory;
        //Key Specific
        BookingUpdater      : String(10);
        CountryCode         : String(2);
        ScreenID            : String(1);
        SingleScreen        : String;
        StartDate           : Date;
        StartTime           : Time;
        EndDate             : Date;
        EndTime             : Time;
        DeliveryOnDate      : Date;
        ApprovedScreensList : String;
        ReleaseName         : String(40);
        ReleaseShortName    : String(2);
        ReleaseNameHO       : String(40);
        ReleaseTitleHO      : String(40);
        //Common custom fields
        Status              : Association to BookingStatus;
        SalesOrder          : String     @readonly;
        ErrorMessage        : String     @readonly;
        ReferenceSDDocument : String     @readonly;
        Warnings            : String
}

entity dcpkey : managed {
        ApplicationID       : String(20)                   @mandatory;
    key BookingID           : String(10)                   @mandatory;
    key Version             : Integer;
        IsActive            : String(1);
        EntityID            : String;
        ReleaseID           : String(10)                   @mandatory;
        TheaterID           : String(12)                   @mandatory;
        Circuit             : String(12);
        ShipmentIndicator   : String(1)                    @mandatory;
        ScreeningIndicator  : String(1)                    @mandatory;
        PlayStartDate       : Date                         @mandatory;
        PlayEndDate         : Date                         @mandatory;
        BranchID            : String(2)                    @mandatory;
        DepotID             : String(1);
        SoundID             : String(8)                    @mandatory;
        Language            : String(3)                    @mandatory;
        SubtitleType        : String(2)                    @mandatory;
        PrintFormat         : String(3);
        ReleaseHold         : String(1)                    @mandatory;
        BookingUpdater      : String(10)                   @mandatory;
        ShipDate            : Date                         @mandatory;
        ShipPriority        : String(2)                    @mandatory;
        AuditoriumType      : String(1)                    @mandatory;
        PrintQuality        : String(4)                    @mandatory;
        FilmStock           : String(4)                    @mandatory;
        CountryCode         : String(2)                    @mandatory;
        ScreenID            : String(1)                    @mandatory;
        SingleScreen        : String                       @mandatory;
        StartDate           : Date                         @mandatory;
        StartTime           : Time                         @mandatory;
        EndDate             : Date                         @mandatory;
        EndTime             : Time                         @mandatory;
        Key_Content         : String(1)                    @mandatory;
        UUID                : String(40)                   @mandatory;
        TimeofEntry         : Time;
        BookingType         : String(4)                    @mandatory;
        PackageName         : String                       @mandatory;
        Releasempm          : String(12)                   @mandatory;
        Territory           : String(2)                    @mandatory;
        DeliveryOnDate      : Date                         @mandatory;
        ApprovedScreensList : String                       @mandatory;
        ReleaseName         : String(40)                   @mandatory;
        ReleaseShortName    : String(2)                    @mandatory;
        ReleaseNameHO       : String(40)                   @mandatory;
        ReleaseTitleHO      : String(40);
        Status              : Association to BookingStatus @mandatory;
        SalesOrder          : String                       @readonly;
        ErrorMessage        : String                       @readonly;
        ReferenceSDDocument : String                       @readonly;
        Warnings            : String
}

entity StudioFeed : cuid, managed {
    BookingID          : String                       ;
    SourceSystem       : String                       ;
    EntityID           : String                       ;
    Origin             : Association to Origin        ;
    // Origin             : String        ;
    Studio             : String                       ;
    CustomerReference  : String;
    Title              : String                       ;
    CreatedOn          : Date;
    RequestedDelivDate : Date                         ;
    ReleaseID          : String;
    OrderType          : String                       ;
    RecordType         : String;
    BookingType        : String;
    TheaterID          : String;
    Circuit            : String;
    BookerName         : String;
    RequestId          : String;
    OrderID            : String;
    PlayStartDate      : Date ;
    PlayStartTime      : Time ;
    PlayEndDate        : Date ;
    PlayEndTime        : Time;
    KeyDeliveryOnDate  : Date;
    KeyStartDate       : Date;
    KeyStartTime       : Time;
    KeyEndDate         : Date;
    KeyEndTime         : Time;
    HFR                : String;
    ShipmentIndicator  : String;
    ScreeningIndicator : String;
    DepotID            : String;
    SoundID            : String;
    Language           : String;
    SubtitleType1      : String;
    SubtitleType2      : String;
    PrintFormat        : String;
    ShipPriority       : Integer                      @assert.range: [
        1,
        5
    ];
    PrintQuality       : String;
    ApprovedScreens    : String;
    CTTs               : String;
    CPLUUIDs           : String;
    CountryCode        : String;
    ScreenID           : String;
    ContentType        : String;
    CancelOrder        : String;
    DeliveryType       : String;
    //Common custom fields
    RemediationCounter : Integer                      @readonly;
    Version            : Integer                      @readonly;
    IsActive           : String(1)                    @readonly;
    Remediation        : String                       @readonly;
    Status             : Association to BookingStatus;
    SalesOrder         : String                       ;
    ErrorMessage       : String                       @readonly;
    Warnings           : String                       @readonly;

    to_Item: Composition of many BookingSalesorderItem
                                      on $self.SalesOrder = to_Item.SalesOrder    @readonly;
    @readonly
    to_Partner                : Composition of many BookingSalesorderPartner
                                      on $self.SalesOrder = to_Partner.SalesOrder;                                      
}

entity Origin {
    key OriginID   : String(1) enum {
            F;
            P;
            S;
            M;
        };
        OriginText : String;
};

entity BookingStatus {
    key ID     : String(1) enum {
            A;
            C;
            D
        };
        Status : String;
};

// @cds.redirection.target: 'BookingOrderService.BookingSalesOrder'
@readonly
entity BookingSalesOrder : managed {
    key SalesOrder              : String(10)                                    @mandatory;
    key BookingID               : String(10)                                    @mandatory;
        EntityID                : String;
        SoldToParty             : String(10);
        SalesOrganization       : String(4);
        DistributionChannel     : String(2);
        OrganizationDivision    : String(2);
        PurchaseOrderByCustomer : String(35);
        TotalNetAmount          : Decimal(15);
        TransactionCurrency     : String(3);
        ShippingCondition       : String(2);
        ShipDate                : Date;
        ApplicationID           : String(20);
        ReleaseID               : String(10);
        TheaterID               : String(12);
        Circuit                 : String(12);
        TimeofEntry             : Time;
        BookingType             : String(4);
        PackageName             : String;
        ScreeningIndicator      : String(1);
        PlayStartDate           : Date;
        PlayEndDate             : Date;
        BranchID                : String(2);
        DepotID                 : String(1);
        SoundID                 : String(8);
        Language                : String(3);
        SubtitleType            : String(2);
        PrintFormat             : String(3);
        ReleaseHold             : String(1);
        ShipPriority            : String(2);
        AuditoriumType          : String(1);
        PrintQuality            : String(4);
        FilmStock               : String(4);
        Key_Content             : String(1);
        UUID                    : String(40);
        CountryCode             : String(2);
        ScreenID                : String(1);
        SingleScreen            : String;
        Releasempm              : String(12);
        Territory               : String(2);
        DeliveryOnDate          : Date;
        ApprovedScreensList     : String;
        ReleaseName             : String(40);
        ReleaseShortName        : String(2);
        ReleaseNameHO           : String(40);
        ReleaseTitleHO          : String(40);
        _Item                   : Composition of many BookingSalesorderItem
                                      on $self.SalesOrder = _Item.SalesOrder    @readonly;
        _Partner                : Composition of many BookingSalesorderPartner
                                      on $self.SalesOrder = _Partner.SalesOrder @readonly;
        DistroSpecID            : Integer default 0                             @readonly;
}

@readonly
entity BookingSalesorderItem : managed {
    key SalesOrder               : String(10) @mandatory;
    key SalesOrderItem           : String(6);
        Product                  : String(16);
        RequestedQuantity        : Decimal(15, 3);
        RequestedQuantityISOUnit : String(3);
        Plant                    : String(4);
        ShippingPoint            : String(4);
        ProductGroup             : String(9);
        ShipmentIndicator        : String(1);
        ScreeningIndicator       : String(1);
        PlayStartDate            : Date;
        PlayEndDate              : Date;
        BranchID                 : String(2);
        DepotID                  : String(1);
        SoundID                  : String(8);
        Language                 : String(3);
        SubtitleType             : String(2);
        PrintFormat              : String(3);
        ReleaseHold              : String(1);
        ShipPriority             : String(2);
        AuditoriumType           : String(1);
        PrintQuality             : String(4);
        FilmStock                : String(4);
        Key_Content              : String(1);
        LongText                 : LargeString;
        CTT                      : String;
        CPLUUID                  : String;
        PricingReferenceMaterial : String(40);
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
        StudioHoldOverRule       : String(10);
        DistroSpecPackageID      : UUID;
        DistroSpecPackageName    : String(40);
        KeyStartTime             : Time;
        KeyEndTime               : Time;
        ShippingType             : Association to one ShippingTypeMaster;
        SalesTerritory           : Association to one api.SalesDistricts;
}
@readonly
entity BookingSalesorderPartner : managed {
    key SalesOrder      : String(10) @mandatory;
    key PartnerFunction : String(2);
        Customer        : String(10);

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
        DeliveryAddress      : Composition of one AddressType;
        PhysicalAddress      : Composition of one AddressType;
        Package              : Composition of one PackageType;
        Vendor               : Composition of one VendorType;
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
        OrderRequest : Association to OrderRequest;
}

entity PackageType {
    key ID           : Integer;
        Description  : String(200);
        TitleName    : String(500);
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
        Package           : Association to PackageType;
}

entity VendorType {
    key ID           : Integer;
        Name         : String(200);
        Email        : String(500);
        Phone        : String(50);
        Fax          : String(50);
        OrderRequest : Association to OrderRequest;
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
    key MaterialMasterTitleID : Integer     @Common.Label: 'Material Master Title ID';
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
        StudioDistributor     : String(20)  @Common.Label: 'Studio Distributor';
        ExternalTitleIDs_Ass  : Composition of many ExternalTitleIDs
                                    on ExternalTitleIDs_Ass.Title = $self;
        Ratings_Ass           : Composition of many Ratings
                                    on Ratings_Ass.Title = $self;
}

entity ExternalTitleIDs : cuid, managed {
    IDType  : String(20);
    IDValue : String(50);
    Title   : Association to Titles;
}

entity Ratings : cuid, managed {
    RatingCode : String(20);
    AgencyName : String(40);
    Title      : Association to Titles;
}

define view RatingsConcat as
    select from Ratings {
        Title.MaterialMasterTitleID,
        Title.LocalTitleId,
        Title.ID,
        Title.RegionCode,
        STRING_AGG(
            RatingCode, ','
        ) as RatingCode : String
    }
    group by
        Title.MaterialMasterTitleID,
        Title.LocalTitleId,
        Title.ID,
        Title.RegionCode;

define view TitleV as
    select from Titles
    left outer join RatingsConcat
        on RatingsConcat.MaterialMasterTitleID = Titles.MaterialMasterTitleID
    left outer join ExternalTitleIDs
        on ExternalTitleIDs.Title = Title
    {

        key Titles.MaterialMasterTitleID,
        key Titles.LocalTitleId,
            Titles.ID,
            Titles.RegionCode,
            Titles.OriginalTitleName,
            Titles.TitleType,
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
            RatingsConcat.RatingCode,
            ExternalTitleIDs.IDType,
            ExternalTitleIDs.IDValue
    };
