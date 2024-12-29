namespace dcp.db;

using {
    managed
} from '@sap/cds/common';

entity dcpcontent : managed {
        ApplicationID      : String(20) not null;
    key BookingID          : String(10) not null;
        ReleaseID          : String(10) not null;
        TheaterID          : String(12) not null;
        Circuit            : String(12);
        ShipmentIndicator  : String(1) not null;
        ScreeningIndicator : String(1) not null;
        PlayStartDate      : Date not null;
        PlayEndDate        : Date not null;
        BranchID           : String(2) not null;
        DepotID            : String(1);
        SoundID            : String(8) not null;
        Language           : String(3) not null;
        SubtitleType       : String(1) not null;
        PrintFormat        : String(3) not null;
        ReleaseHold        : String(1) not null;
        ShipDate           : Date not null;
        ShipPriority       : String(2) not null;
        AuditoriumType     : String(1) not null;
        PrintQuality       : String(4) not null;
        FilmStock          : String(4) not null;
        Key_Content        : String(1) not null;
        TimeofEntry        : String(16) not null;
        BookingType        : String(4) not null;
        PackageName        : String not null;
        UUID               : UUID;
        Territory          : String(2) not null;
        Status             : String(1) not null;
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
}
