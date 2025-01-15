using AssetVaultService as service from '../../srv/asset-vault';

annotate service.AssetVault with {
    AssetVaultID          @Common: {Label: '{i18n>AssetVaultID}', };
    AssetMapID            @Common: {Label: '{i18n>AssetMapID}', };
    AssetMapIDDescription @Common: {Label: '{i18n>AssetMapIDDescription}', };
    CreatedinSAP          @Common: {Label: '{i18n>CreatedinSAP}', };
    DCP                   @Common: {Label: '{i18n>DCP}', };
    Title                 @Common: {Label: '{i18n>Title}', };
    GoFilexTitleID_NORAM  @Common: {Label: '{i18n>GoFilexTitleID_NORAM}', };
    KENCASTID;
    ProjectType;
    VersionDescription;
};

annotate service.AssetVault._Items with {
    LinkedDCP     @Common: {Label: '{i18n>LinkedDCP}', };
    LinkedCPLUUID @Common: {Label: '{i18n>LinkedCPLUUID}', };
    LinkedCTT     @Common: {Label: '{i18n>LinkedCTT}', };
    ProjectID;
    ProjectType;
    ProjectAssetMapUUID;
    DCDMFlag;
    VersionDescription;
    RunTime;
    StartOfCredits;
    StartOfCrawl;
};

annotate service.AssetVault with @(
    UI.DeleteHidden              : true,
    UI.CreateHidden              : true,
    UI.UpdateHidden              : true,
    UI.HeaderInfo                : {
        TypeName      : '{i18n>AssetVault}',
        TypeNamePlural: '{i18n>AssetVaults}',
        Title         : {
            $Type: 'UI.DataField',
            Value: AssetMapID,
        },
        Description   : {
            $Type: 'UI.DataField',
            Value: AssetMapIDDescription,
        },
    },
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: AssetVaultID,
            },
            {
                $Type: 'UI.DataField',
                Value: AssetMapID,
            },
            {
                $Type: 'UI.DataField',
                Value: AssetMapIDDescription,
            },
            {
                $Type: 'UI.DataField',
                Value: CreatedinSAP,
            },
            {
                $Type: 'UI.DataField',
                Value: DCP,
            },
            {
                $Type: 'UI.DataField',
                Value: Title,
            },
            {
                $Type: 'UI.DataField',
                Value: ProjectType,
            },
            {
                $Type: 'UI.DataField',
                Value: VersionDescription,
            },
            {
                $Type: 'UI.DataField',
                Value: GoFilexTitleID_NORAM,
            },
            // {
            {
                $Type: 'UI.DataField',
                Value: KENCASTID,
            },
        ],
    },
    UI.Facets                    : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet1',
            Label : '{i18n>GeneralInformation}',
            Target: '@UI.FieldGroup#GeneratedGroup',
        },
        {
            ID    : '_Items',
            Label : 'Items',
            $Type : 'UI.ReferenceFacet',
            Target: '_Items/@UI.LineItem',
        }
    ],
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Value: AssetVaultID,
        },
        {
            $Type: 'UI.DataField',
            Value: AssetMapID,
        },
        {
            $Type: 'UI.DataField',
            Value: AssetMapIDDescription,
        },
        {
            $Type: 'UI.DataField',
            Value: CreatedinSAP,
        },
        {
            $Type: 'UI.DataField',
            Value: DCP,
        },
    ],
);

annotate service.AssetVault._Items with @(
    UI.LineItem          : [
        {
            $Type                : 'UI.DataField',
            Value                : LinkedDCP,
            ![@HTML5.CssDefaults]: {
                $Type: 'HTML5.CssDefaultsType',
                width: 'auto',
            },
        },
        {
            $Type                : 'UI.DataField',
            Value                : LinkedCPLUUID,
            ![@HTML5.CssDefaults]: {
                $Type: 'HTML5.CssDefaultsType',
                width: 'auto',
            },
        },
        {
            $Type                : 'UI.DataField',
            Value                : LinkedCTT,
            ![@HTML5.CssDefaults]: {
                $Type: 'HTML5.CssDefaultsType',
                width: 'auto',
            },
        },
    ],
    UI.HeaderInfo        : {
        TypeName      : '{i18n>Item}',
        TypeNamePlural: '{i18n>Items}',
        Title         : {
            $Type: 'UI.DataField',
            Value: LinkedCTT,
        },
        Description   : {
            $Type: 'UI.DataField',
            Value: LinkedCPLUUID,
        },
    },
    UI.Facets            : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet2',
        Label : '{i18n>ItemInformation}',
        Target: '@UI.FieldGroup#_Items',
    }, ],
    UI.FieldGroup #_Items: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: LinkedDCP,
            },
            {
                $Type: 'UI.DataField',
                Value: LinkedCTT,
            },
            {
                $Type: 'UI.DataField',
                Value: LinkedCPLUUID,
            },
            {
                $Type: 'UI.DataField',
                Value: ProjectID,
            },
            {
                $Type: 'UI.DataField',
                Value: ProjectAssetMapUUID,
            },
            {
                $Type: 'UI.DataField',
                Value: ProjectType,
            },
            {
                $Type: 'UI.DataField',
                Value: RunTime,
            },
            {
                $Type: 'UI.DataField',
                Value: StartOfCrawl,
            },
            {
                $Type: 'UI.DataField',
                Value: StartOfCredits,
            },
            {
                $Type: 'UI.DataField',
                Value: DCDMFlag,
            },
            {
                $Type: 'UI.DataField',
                Value: VersionDescription,
            },
        ],
    }
);
