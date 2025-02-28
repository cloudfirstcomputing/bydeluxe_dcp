namespace dcp.db;

using {
    managed,
    cuid
} from '@sap/cds/common';
using api from './common';

entity TitleVH as projection on api.Products;

entity dcpcontent : managed {
        ApplicationID       : String(20) not null          @mandatory;
    key BookingID           : String(10) not null          @mandatory;
    key Version             : Integer not null;
        IsActive            : String(1) not null;
        EntityID            : String;
        ReleaseID           : String(10) not null          @mandatory;
        TheaterID           : String(12) not null          @mandatory;
        Circuit             : String(12);
        ShipmentIndicator   : String(1) not null           @mandatory;
        ScreeningIndicator  : String(1)                    @mandatory;
        PlayStartDate       : Date not null                @mandatory;
        PlayEndDate         : Date not null                @mandatory;
        BranchID            : String(2) not null           @mandatory;
        DepotID             : String(1);
        SoundID             : String(8) not null           @mandatory;
        Language            : String(3) not null           @mandatory;
        SubtitleType        : String(1);
        PrintFormat         : String(3) not null           @mandatory;
        ReleaseHold         : String(1) not null           @mandatory;
        ShipDate            : Date not null                @mandatory;
        ShipPriority        : String(2) not null           @mandatory;
        AuditoriumType      : String(1) not null           @mandatory;
        PrintQuality        : String(4) not null           @mandatory;
        FilmStock           : String(4) not null           @mandatory;
        Key_Content         : String(1) not null           @mandatory;
        TimeofEntry         : Time;
        BookingType         : String(4) not null           @mandatory;
        PackageName         : String not null              @mandatory;
        UUID                : String(40) not null;
        Territory           : String(2) not null           @mandatory;
        Status              : Association to BookingStatus @mandatory;
        SalesOrder          : String                       @readonly;
        ErrorMessage        : String                       @readonly;
        ReferenceSDDocument : String                       @readonly;
        Warnings            : String
}

entity dcpkey : managed {
        ApplicationID       : String(20) not null          @mandatory;
    key BookingID           : String(10) not null          @mandatory;
    key Version             : Integer not null;
        IsActive            : String(1) not null;
        EntityID            : String;
        ReleaseID           : String(10) not null          @mandatory;
        TheaterID           : String(12) not null          @mandatory;
        Circuit             : String(12);
        ShipmentIndicator   : String(1) not null           @mandatory;
        ScreeningIndicator  : String(1)                    @mandatory;
        PlayStartDate       : Date not null                @mandatory;
        PlayEndDate         : Date not null                @mandatory;
        BranchID            : String(2) not null           @mandatory;
        DepotID             : String(1);
        SoundID             : String(8) not null           @mandatory;
        Language            : String(3) not null           @mandatory;
        SubtitleType        : String(1) not null           @mandatory;
        PrintFormat         : String(3);
        ReleaseHold         : String(1) not null           @mandatory;
        BookingUpdater      : String(10) not null          @mandatory;
        ShipDate            : Date not null                @mandatory;
        ShipPriority        : String(2) not null           @mandatory;
        AuditoriumType      : String(1) not null           @mandatory;
        PrintQuality        : String(4) not null           @mandatory;
        FilmStock           : String(4) not null           @mandatory;
        CountryCode         : String(2) not null           @mandatory;
        ScreenID            : String(1) not null           @mandatory;
        SingleScreen        : String not null              @mandatory;
        StartDate           : Date not null                @mandatory;
        StartTime           : Time not null                @mandatory;
        EndDate             : Date not null                @mandatory;
        EndTime             : Time not null                @mandatory;
        Key_Content         : String(1) not null           @mandatory;
        UUID                : String(40) not null          @mandatory;
        TimeofEntry         : Time;
        BookingType         : String(4) not null           @mandatory;
        PackageName         : String not null              @mandatory;
        Releasempm          : String(12) not null          @mandatory;
        Territory           : String(2) not null           @mandatory;
        DeliveryOnDate      : Date not null                @mandatory;
        ApprovedScreensList : String not null              @mandatory;
        ReleaseName         : String(40) not null          @mandatory;
        ReleaseShortName    : String(2) not null           @mandatory;
        ReleaseNameHO       : String(40) not null          @mandatory;
        ReleaseTitleHO      : String(40);
        Status              : Association to BookingStatus @mandatory;
        SalesOrder          : String                       @readonly;
        ErrorMessage        : String                       @readonly;
        ReferenceSDDocument : String                       @readonly;
        Warnings            : String
}

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
    key SalesOrder              : String(10) not null                           @mandatory;
    key BookingID               : String(10) not null                           @mandatory;
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
        ApplicationID           : String(20) not null;
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
        SubtitleType            : String(1);
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
        DistroSpecPackageID     : UUID;
        DistroSpecPackageName   : String(40);
}

@readonly
entity BookingSalesorderItem : managed {
    key SalesOrder               : String(10) not null @mandatory;
    key SalesOrderItem           : String(6) not null;
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
        SubtitleType             : String(1);
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
        ShippingType             : Association to one ShippingTypeMaster;
        SalesTerritory           : Association to one api.SalesDistricts;
}

entity BookingSalesorderPartner : managed {
    key SalesOrder      : String(10) not null @mandatory;
    key PartnerFunction : String(2) not null;
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
    key requestId                     : String(18) not null @mandatory;
        product                       : String(16);
        titleId                       : Integer not null    @mandatory;
        titleExternalRef              : Integer not null    @mandatory;
        titleDescription              : String(40);
    key cinemaId                      : String(10) not null @mandatory;
        screenId                      : String(40);
        screenNumber                  : Integer not null    @mandatory;
        cinemaDescription             : String(40);
        cinemaTerritory               : String(2) not null  @mandatory;
        recipientExternalRef          : String(10);
        versionId                     : Integer;
        versionDescription            : String(20);
        versionExternalRefVendor      : String(20);
        versionExternalRefDistributor : String(10);
        versionAdditionalInfo         : String(20);
        startDate                     : Date not null       @mandatory;
        endDate                       : Date not null       @mandatory;
        deliveryDate                  : Date not null       @mandatory;
    key customerRef                   : String(20) not null @mandatory;
        distributorId                 : Integer;
        distributorDescription        : String(15);
        distributorKDMArchive         : String(20);
        hasDcp                        : String;
        doNotShip                     : String;
        circuitingFrom                : String(10);
        screeningTime                 : Time;
        showcode                      : String(10);
        techCheckKey                  : String;
    key quantity                      : Integer             @mandatory;
        requestType                   : String(10);
        requestStatusCode             : Integer;
        requestStatusDescription      : String(20);
        remark                        : String(40);
        bookerName                    : String(20)          @mandatory;
}


/// Comscore Hollywood

entity TheatreOrderRequest : cuid, managed {
    key StudioID             : String(50);
    key GenerateDate         : DateTime;
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

entity Theatre : cuid, managed {
    key TheatreID   : String(50);
        Name        : String(200);
        City        : String(200);
        State       : String(100);
        PostalCode  : String(50);
        CountryCode : String(50);
        Address     : String(500);
        Request     : Association to TheatreOrderRequest;

}

entity MediaOrder : cuid, managed {
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

entity DigitalComposition : cuid, managed {
    key ContentID : String(50);
        Title     : String(500);
        CPL_UUID  : String(100);
        FilmID    : String(100);
        Request   : Association to TheatreOrderRequest;
}

entity DigitalKeyOrder : cuid, managed {
    key DigitalKeyOrderID : String(50);
        ContentID         : String(50);
        Screens           : String(200);
        CancelFlag        : Boolean;
        LicenseBeginDate  : DateTime;
        LicenseEndDate    : DateTime;
        Request           : Association to TheatreOrderRequest;
}

/// Disney OFE
entity OrderRequest : cuid, managed {
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

entity AddressType : cuid {
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

entity PackageType : cuid {
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

entity VendorType : cuid {
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
