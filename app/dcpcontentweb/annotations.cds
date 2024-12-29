using BookingOrderService as service from '../../srv/dcp-service';
annotate service.dcpcontent with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Applicationid}',
                Value : ApplicationID,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Releaseid}',
                Value : ReleaseID,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Theaterid}',
                Value : TheaterID,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Circuit}',
                Value : Circuit,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Shipmentindicator}',
                Value : ShipmentIndicator,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Screeningindicator}',
                Value : ScreeningIndicator,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Playstartdate}',
                Value : PlayStartDate,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Playenddate}',
                Value : PlayEndDate,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Branchid}',
                Value : BranchID,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Depotid}',
                Value : DepotID,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Soundid}',
                Value : SoundID,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Language}',
                Value : Language,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Subtitletype}',
                Value : SubtitleType,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Printformat}',
                Value : PrintFormat,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Releasehold}',
                Value : ReleaseHold,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Shipdate}',
                Value : ShipDate,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Shippriority}',
                Value : ShipPriority,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Auditoriumtype}',
                Value : AuditoriumType,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Printquality}',
                Value : PrintQuality,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Filmstock}',
                Value : FilmStock,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Keycontent}',
                Value : Key_Content,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Timeofentry}',
                Value : TimeofEntry,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Bookingtype}',
                Value : BookingType,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Packagename}',
                Value : PackageName,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Territory}',
                Value : Territory,
            },
            {
                $Type : 'UI.DataField',
                Value : Status,
                Label : '{i18n>Status}',
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Bookingid}',
            Value : BookingID,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Applicationid}',
            Value : ApplicationID,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Releaseid}',
            Value : ReleaseID,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Theaterid}',
            Value : TheaterID,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Circuit}',
            Value : Circuit,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : ShipmentIndicator,
            Label : '{i18n>Shipmentindicator}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : ScreeningIndicator,
            Label : '{i18n>Screeningindicator}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : PlayStartDate,
            Label : '{i18n>Playstartdate}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : PlayEndDate,
            Label : '{i18n>Playenddate}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : BranchID,
            Label : '{i18n>Branchid}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : DepotID,
            Label : '{i18n>Depotid}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : SoundID,
            Label : '{i18n>Soundid}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Language,
            Label : '{i18n>Language}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Status,
            Label : '{i18n>Status}',
            ![@UI.Importance] : #High,
        },
    ],
);

