namespace dcp.db;

using {
    managed
} from '@sap/cds/common';

entity dcpcontent : managed {
        ApplicationID      : String(20) not null;
    key BookingID          : String(10) not null;
        ReleaseID          : String(10) not null @mandatory;
        TheaterID          : String(12) not null @mandatory;
        Circuit            : String(12);
        ShipmentIndicator  : String(1) not null @mandatory;
        ScreeningIndicator : String(1) not null @mandatory;
        PlayStartDate      : Date not null @mandatory;
        PlayEndDate        : Date not null @mandatory;
        BranchID           : String(2) not null @mandatory;
        DepotID            : String(1);
        SoundID            : String(8) not null @mandatory;
        Language           : String(3) not null @mandatory;
        SubtitleType       : String(1) not null @mandatory;
        PrintFormat        : String(3) not null @mandatory;
        ReleaseHold        : String(1) not null @mandatory;
        ShipDate           : Date not null @mandatory;
        ShipPriority       : String(2) not null @mandatory;
        AuditoriumType     : String(1) not null @mandatory;
        PrintQuality       : String(4) not null @mandatory;
        FilmStock          : String(4) not null @mandatory;
        Key_Content        : String(1) not null @mandatory;
        TimeofEntry        : String(16) not null @mandatory;
        BookingType        : String(4) not null @mandatory;
        PackageName        : String not null @mandatory;
        UUID               : UUID;
        Territory          : String(2) not null @mandatory;
        Status             : String(1) not null;
        SalesOrder         : String;
}

entity dcpkey : managed {
        ApplicationID       : String(20) not null;
    key BookingID           : String(10) not null;
        ReleaseID           : String(10) not null;
        TheaterID           : String(12) not null;
        Circuit             : String(12);
        ShipmentIndicator   : String(1) not null;
        ScreeningIndicator  : String(1) not null;
        PlayStartDate       : Date not null;
        PlayEndDate         : Date not null;
        BranchID            : String(2) not null;
        DepotID             : String(1);
        SoundID             : String(8) not null;
        Language            : String(3) not null;
        SubtitleType        : String(1) not null;
        PrintFormat         : String(3);
        ReleaseHold         : String(1) not null;
        BookingUpdater      : String(10) not null;
        ShipDate            : Date not null;
        ShipPriority        : String(2) not null;
        AuditoriumType      : String(1) not null;
        PrintQuality        : String(4) not null;
        FilmStock           : String(4) not null;
        CountryCode         : String(2) not null;
        ScreenID            : String(1) not null;
        SingleScreen        : String not null;
        StartDate           : Date not null;
        StartTime           : Timestamp not null;
        EndDate             : Date not null;
        EndTime             : Timestamp not null;
        Key_Content         : String(1) not null;
        UUID                : UUID;
        TimeofEntry         : String(16) not null;
        BookingType         : String(4) not null;
        PackageName         : String not null;
        Releasempm          : String(12) not null;
        Territory           : String(2) not null;
        DeliveryOnDate      : Date not null;
        ApprovedScreensList : String not null;
        ReleaseName         : String(40) not null;
        ReleaseShortName    : String(2) not null;
        ReleaseNameHO       : String(40) not null;
        ReleaseTtileHO      : String(40) not null;
        Status             : String(1) not null;
        SalesOrder         : String;
}
