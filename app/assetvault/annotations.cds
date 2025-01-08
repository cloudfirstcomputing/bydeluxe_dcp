using AssetVaultService as service from '../../srv/asset-vault';

annotate service.AssetVault with {
    AssetVaultID          @Common: {Label: '{i18n>AssetVaultID}', };
    AssetMapID            @Common: {Label: '{i18n>AssetMapID}', };
    AssetMapIDDescription @Common: {Label: '{i18n>AssetMapIDDescription}', };
    CreatedinSAP          @Common: {Label: '{i18n>CreatedinSAP}', };
    DCP                   @Common: {Label: '{i18n>DCP}', };
    // Title                 @Common: {Label: '{i18n>Title}', };
    GoFilexTitleID_NORAM  @Common: {Label: '{i18n>GoFilexTitleID_NORAM}', };
    // GoFilexTitleID_EMEA   @Common: {Label: '{i18n>GoFilexTitleID_EMEA}', };
    // GoFilexTitleID_APAC   @Common: {Label: '{i18n>GoFilexTitleID_APAC}', };
    // GoFilexTitleID_LATAM  @Common: {Label: '{i18n>GoFilexTitleID_LATAM}', };
    // KENCASTID_NORAM       @Common: {Label: '{i18n>KENCASTID_NORAM}', };
    // KENCASTID_EMEA        @Common: {Label: '{i18n>KENCASTID_EMEA}', };
    // KENCASTID_APAC        @Common: {Label: '{i18n>KENCASTID_APAC}', };
    // KENCASTID_LATAM       @Common: {Label: '{i18n>KENCASTID_LATAM}', };
    // NBPTitleID_NORAM      @Common: {Label: '{i18n>NBPTitleID_NORAM}', };
    // NBPTitleID_EMEA       @Common: {Label: '{i18n>NBPTitleID_EMEA}', };
    // NBPTitleID_APAC       @Common: {Label: '{i18n>NBPTitleID_APAC}', };
    // NBPTitleID_LATAM      @Common: {Label: '{i18n>NBPTitleID_LATAM}', };
    KENCASTID;
};

annotate service.AssetVault._Items with {
    up_;
    ID;
    LinkedDCP     @Common: {Label: '{i18n>LinkedDCP}', };
    LinkedCPLUUID @Common: {Label: '{i18n>LinkedCPLUUID}', };
    LinkedCTT     @Common: {Label: '{i18n>LinkedCTT}', };
    // PrintFormat   @Common: {Label: '{i18n>PrintFormat}', };
    // FilmStock     @Common: {Label: '{i18n>FilmStock}', };
    // Audio         @Common: {Label: '{i18n>Audio}', };
    Attribute1    @Common: {Label: '{i18n>Attribute1}', };
    Attribute2    @Common: {Label: '{i18n>Attribute2}', };
    Attribute3    @Common: {Label: '{i18n>Attribute3}', };
    Attribute4    @Common: {Label: '{i18n>Attribute4}', };
    Attribute5    @Common: {Label: '{i18n>Attribute5}', };
    Attribute6    @Common: {Label: '{i18n>Attribute6}', };
    Attribute7    @Common: {Label: '{i18n>Attribute7}', };
    Attribute8    @Common: {Label: '{i18n>Attribute8}', };
    Attribute9    @Common: {Label: '{i18n>Attribute9}', };
    Attribute10   @Common: {Label: '{i18n>Attribute10}', };
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
            // {
            //     $Type: 'UI.DataField',
            //     Value: Title,
            // },
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
            // {
            //     $Type: 'UI.DataField',
            //     Value: FilmStock,
            // },
            // {
            //     $Type: 'UI.DataField',
            //     Value: Audio,
            // },
            {
                $Type: 'UI.DataField',
                Value: Attribute1,
            },
            {
                $Type: 'UI.DataField',
                Value: Attribute2,
            },
            {
                $Type: 'UI.DataField',
                Value: Attribute3,
            },
            {
                $Type: 'UI.DataField',
                Value: Attribute4,
            },
            {
                $Type: 'UI.DataField',
                Value: Attribute5,
            },
            {
                $Type: 'UI.DataField',
                Value: Attribute6,
            },
            {
                $Type: 'UI.DataField',
                Value: Attribute7,
            },
            {
                $Type: 'UI.DataField',
                Value: Attribute8,
            },
            {
                $Type: 'UI.DataField',
                Value: Attribute9,
            },
            {
                $Type: 'UI.DataField',
                Value: Attribute10,
            },
        ],
    }
);
