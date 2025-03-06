using BookingOrderService as service from '../../srv/dcp-service';
annotate service.TitleV with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'MaterialMasterTitleID',
                Value : MaterialMasterTitleID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'RegionCode',
                Value : RegionCode,
            },
            {
                $Type : 'UI.DataField',
                Label : 'OriginalTitleName',
                Value : OriginalTitleName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'TitleType',
                Value : TitleType,
            },
            {
                $Type : 'UI.DataField',
                Label : 'TitleCategory',
                Value : TitleCategory,
            },
            {
                $Type : 'UI.DataField',
                Label : 'RegionalTitleName',
                Value : RegionalTitleName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ShortTitle',
                Value : ShortTitle,
            },
            {
                $Type : 'UI.DataField',
                Label : 'SecurityTitle',
                Value : SecurityTitle,
            },
            {
                $Type : 'UI.DataField',
                Label : 'LanguageCode',
                Value : LanguageCode,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ReleaseDate',
                Value : ReleaseDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'RepertoryDate',
                Value : RepertoryDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Format',
                Value : Format,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ReleaseSize',
                Value : ReleaseSize,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Ratings',
                Value : Ratings,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ReelCountEstimated',
                Value : ReelCountEstimated,
            },
            {
                $Type : 'UI.DataField',
                Label : 'AssetVaultTitleId',
                Value : AssetVaultTitleId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ImdbId',
                Value : ImdbId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'StudioTitleId',
                Value : StudioTitleId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'StudioDistributor',
                Value : StudioDistributor,
            },
            {
                $Type : 'UI.DataField',
                Label : 'RatingCode',
                Value : RatingCode,
            },
            {
                $Type : 'UI.DataField',
                Label : 'IDType',
                Value : IDType,
            },
            {
                $Type : 'UI.DataField',
                Label : 'IDValue',
                Value : IDValue,
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
            Label : 'MaterialMasterTitleID',
            Value : MaterialMasterTitleID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'RegionCode',
            Value : RegionCode,
        },
        {
            $Type : 'UI.DataField',
            Label : 'OriginalTitleName',
            Value : OriginalTitleName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'TitleType',
            Value : TitleType,
        },
        {
            $Type : 'UI.DataField',
            Label : 'TitleCategory',
            Value : TitleCategory,
        },
    ],
);

