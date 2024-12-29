using BookingOrderService as service from '../../srv/dcp-service';
annotate service.dcpkey with @(
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
                Label : '{i18n>Bookingupdater}',
                Value : BookingUpdater,
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
                Label : '{i18n>Countrycode}',
                Value : CountryCode,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Screenid}',
                Value : ScreenID,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Singlescreen}',
                Value : SingleScreen,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Startdate}',
                Value : StartDate,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Starttime}',
                Value : StartTime,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Enddate}',
                Value : EndDate,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Endtime}',
                Value : EndTime,
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
                Label : '{i18n>Releasempm}',
                Value : Releasempm,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Territory}',
                Value : Territory,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Deliveryondate}',
                Value : DeliveryOnDate,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Approvedscreenslist}',
                Value : ApprovedScreensList,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Releasename}',
                Value : ReleaseName,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Releaseshortname}',
                Value : ReleaseShortName,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Releasenameho}',
                Value : ReleaseNameHO,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Releasettileho}',
                Value : ReleaseTtileHO,
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
        },
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
            Value : ShipmentIndicator,
            Label : '{i18n>Shipmentindicator}',
        },
        {
            $Type : 'UI.DataField',
            Value : ScreeningIndicator,
            Label : '{i18n>Screeningindicator}',
        },
        {
            $Type : 'UI.DataField',
            Value : PlayStartDate,
            Label : '{i18n>Playstartdate}',
        },
        {
            $Type : 'UI.DataField',
            Value : PlayEndDate,
            Label : '{i18n>Playenddate}',
        },
        {
            $Type : 'UI.DataField',
            Value : BranchID,
            Label : '{i18n>Branchid}',
        },
        {
            $Type : 'UI.DataField',
            Value : DepotID,
            Label : '{i18n>Depotid}',
        },
        {
            $Type : 'UI.DataField',
            Value : SoundID,
            Label : '{i18n>Soundid}',
        },
        {
            $Type : 'UI.DataField',
            Value : Language,
            Label : '{i18n>Language}',
        },
        {
            $Type : 'UI.DataField',
            Value : SubtitleType,
            Label : '{i18n>Subtitletype}',
        },
        {
            $Type : 'UI.DataField',
            Value : Status,
            Label : '{i18n>Status}',
        },
    ],
);

