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
                Label : '{i18n>Theaterid}',
                Value : TheaterID,
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
                Value : SalesOrder,
                Label : '{i18n>Salesorder}',
            },
            {
                $Type : 'UI.DataField',
                Value : UUID,
                Label : '{i18n>Uuid}',
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
                Label : '{i18n>Territory}',
                Value : Territory,
            },
            {
                $Type : 'UI.DataField',
                Value : Status_ID,
                Label : '{i18n>Status}',
            },
            {
                $Type : 'UI.DataField',
                Value : AuditoriumType,
                Label : 'AuditoriumType',
            },
            {
                $Type : 'UI.DataField',
                Value : BranchID,
                Label : 'BranchID',
            },
            {
                $Type : 'UI.DataField',
                Value : Circuit,
                Label : 'Circuit',
            },
            {
                $Type : 'UI.DataField',
                Value : ErrorMessage,
                Label : 'ErrorMessage',
            },
            {
                $Type : 'UI.DataField',
                Value : FilmStock,
                Label : 'FilmStock',
            },
            {
                $Type : 'UI.DataField',
                Value : Language,
                Label : 'Language',
            },
            {
                $Type : 'UI.DataField',
                Value : PackageName,
                Label : 'PackageName',
            },
            {
                $Type : 'UI.DataField',
                Value : PrintFormat,
                Label : 'PrintFormat',
            },
            {
                $Type : 'UI.DataField',
                Value : PrintQuality,
                Label : 'PrintQuality',
            },
            {
                $Type : 'UI.DataField',
                Value : ReleaseHold,
                Label : 'ReleaseHold',
            },
            {
                $Type : 'UI.DataField',
                Value : ScreeningIndicator,
                Label : 'ScreeningIndicator',
            },
            {
                $Type : 'UI.DataField',
                Value : ShipmentIndicator,
                Label : 'ShipmentIndicator',
            },
            {
                $Type : 'UI.DataField',
                Value : SoundID,
                Label : 'SoundID',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleType,
                Label : 'SubtitleType',
            },
            {
                $Type : 'UI.DataField',
                Value : TimeofEntry,
                Label : 'TimeofEntry',
            }
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
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
            Value : ShipmentIndicator,
            Label : '{i18n>Shipmentindicator}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : ShipDate,
            Label : '{i18n>Shipdate}',
            ![@UI.Importance] : #High,
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
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : UUID,
            Label : '{i18n>Uuid}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Status_ID,
            Label : '{i18n>Statusid}',
            ![@UI.Importance] : #High,
        },
    ],
    UI.FieldGroup #i18nAdditionalDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
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
                Value : ErrorMessage,
                Label : '{i18n>Errormessage}',
            },
        ],
    },    
);
annotate service.dcpcontent with {
    Status  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'BookingStatus',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Status_ID,
                    ValueListProperty: 'Status',
                },
                // {
                //     $Type            : 'Common.ValueListParameterOut',
                //     LocalDataProperty: Status,
                //     ValueListProperty: 'StatusDesc',
                // },
                // {
                //     $Type            : 'Common.ValueListParameterDisplayOnly',
                //     ValueListProperty: 'Status',
                // },
            ],
        },
        Common.ValueListWithFixedValues: false,
        Common.Text : {
            $value : Status.Status,
            ![@UI.TextArrangement] : #TextFirst
        },
    );    
};


