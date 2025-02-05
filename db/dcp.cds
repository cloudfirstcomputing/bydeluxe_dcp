namespace dcp.db;

using {managed} from '@sap/cds/common';
using api from './common';

entity TitleVH as projection on api.Products;

entity dcpcontent : managed {
        ApplicationID       : String(20) not null          @mandatory;
    key BookingID           : String(10) not null          @mandatory;
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
        StartTime           : Time not null           @mandatory;
        EndDate             : Date not null                @mandatory;
        EndTime             : Time not null           @mandatory;
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
        StartDate               : Date;
        StartTime               : Time;
        EndDate                 : Date;
        EndTime                 : Time;
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
        KeyStartTime             : Time;
        KeyEndTime               : Time;
        InitialKeyDuration       : Integer;
        NextKeyDuration          : Integer;
        OffsetEPD                : Integer;
        InferKeyContentOrder     : Boolean;
        AggregateKey             : Boolean;
        ProcessKDMS              : Integer;
        ProcessScreeningKDMS     : Integer;
        MaxKDMSDuration          : Integer;
        StudioHoldOverRule       : String(10);
        SalesTerritory           : Association to one api.SalesDistricts;
}

entity BookingSalesorderPartner : managed {
    key SalesOrder      : String(10) not null @mandatory;
    key PartnerFunction : String(2) not null;
        Customer        : String(10);

}
