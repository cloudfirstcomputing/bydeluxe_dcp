namespace dcn.db;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity StatusStaging : cuid, managed {
    BookingID              : String(40);
    OrderID                : String(40);
    StatusTypeCode         : Integer;
    StatusTypeDescription  : String(100);
    StatusCode             : Integer;
    StatusDescription      : String(100);
    StatusTimeStamp        : Timestamp @cds.on.insert: $now;
    DistributorId          : Integer;
    OriginatingEnvironment : String(1);
    studioId               : String(10);
    studioMediaOrderId     : String(40);
    studioRequestId        : String(40);
    studioName             : String(40);
    SalesOrder             : String(10);
    SapDocType             : String(4);
    SapDocStatus           : String(10);
    StudioBusinessUnit     : String(10);
    VersionDescription     : String(100);
    CplUUID                : String(40);
    DeliveryMethod         : String(100);
    TrackingNumber         : String(100);
    Carrier                : String(40);
    ShipDate               : Timestamp;
    OrderType              : String(10);
    SNSQueueStatus         : String(1);
    Reasons                : Composition of many {
                                 ID                : UUID;
                                 ReasonDescription : String(200)
                             }
}

entity StatusConversion : cuid, managed {
    StatusTypeCode        : Integer      @mandatory;
    StatusType            : String(20)   @mandatory;
    StatusTypeDescription : String(100);
    StatusCode            : Integer      @mandatory;
    StatusDescription     : String(100);
    OrderType             : String(10)   @mandatory;
    SapDocType            : String(4);
    Preference            : String(4);
    SapDocStatus          : String(1000) @UI.MultiLineText
}

entity StatusWebHooks : cuid {
    DeliveryNumber  : String(10);
    TrackingNumber  : String(100);
    ShippyProStatus : String(20);
    Date            : Date;
    Time            : Time;
}

entity InterfaceStatus : cuid {
    Studio         : String(10);
    StudioName     : String(40);
    TheaterID      : String(10);
    TheaterName    : String(40);
    SalesOrder     : String(10);
    DeliveryNumber : String(10);
    OrderType      : String(10);
    BookingID      : String(40);
    OrderID        : String(40);
    Title          : String(20);
    DeliveryMethod : String(100);
    StatusDate     : Date;
    StatusTime     : Time;
    StatusName     : String(40);
    StatusNote     : String(200);
}
