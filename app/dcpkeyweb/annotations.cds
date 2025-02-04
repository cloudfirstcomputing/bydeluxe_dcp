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
                Value : EntityID,
                Label : '{i18n>Entityid}',
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Releaseid}',
                Value : ReleaseID,
            },
            {
                $Type : 'UI.DataField',
                Value : EntityID,
                Label : '{i18n>Entityid}',
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Theaterid}',
                Value : TheaterID,
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
                Label : '{i18n>Bookingtype}',
                Value : BookingType,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Releasempm}',
                Value : Releasempm,
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
                Value : ReleaseTitleHO,
            },
            {
                $Type : 'UI.DataField',
                Value : UUID,
                Label : '{i18n>Uuid}',
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : '{i18n>GeneralInfo}',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>AdditionalDetails}',
            ID : 'i18nAdditionalDetails',
            Target : '@UI.FieldGroup#i18nAdditionalDetails',
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
            Value : EntityID,
            Label : '{i18n>Entityid}',
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
            Value : Territory,
            Label : 'Territory',
        },
        {
            $Type : 'UI.DataField',
            Value : SalesOrder,
            Label : '{i18n>Salesorder}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : ErrorMessage,
            Label : '{i18n>Errormessage}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Language,
            Label : '{i18n>Language}',
        },
        {
            $Type : 'UI.DataField',
            Value : Status_ID,
            Label : '{i18n>Status}',
        },
        {
            $Type : 'UI.DataField',
            Value : UUID,
            Label : '{i18n>Uuid}',
            ![@UI.Importance] : #High,
        },
    ],
    UI.FieldGroup #i18nAdditionalDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : PrintFormat,
                Label : 'PrintFormat',
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
                Label : '{i18n>Timeofentry}',
                Value : TimeofEntry,
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
                Value : ErrorMessage,
                Label : '{i18n>Errormessage}',
            },
        ],
    },
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : BookingID,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
);

