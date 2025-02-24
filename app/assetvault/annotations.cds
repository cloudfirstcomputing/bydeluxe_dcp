using AssetVaultService as service from '../../srv/asset-vault';

annotate service.AssetVault with {
    AssetVaultID          @Common: {Label: '{i18n>DistPrjID}', };
    AssetMapID            @Common: {Label: '{i18n>AssetMapID}', };
    AssetMapIDDescription @Common: {Label: '{i18n>AssetMapIDDescription}', };
    AnnotationText        @Common: {Label: '{i18n>AnnotationText}', };
    AssetMapFileSize      @Common: {Label: '{i18n>AssetMapFileSize}', };
    CreatedinSAP          @Common: {Label: '{i18n>CreatedinSAP}', };
    DCP                   @Common: {Label: '{i18n>DCP}', };
    Title                 @Common: {Label: '{i18n>Title}', };
    GoFilexTitleID_NORAM  @Common: {Label: '{i18n>GoFilexTitleID_NORAM}', };
    KENCASTID             @Common: {Label: '{i18n>KENCASTID}', };
    ProjectType           @Common: {Label: '{i18n>ProjectType}', };
    VersionDescription    @Common: {Label: '{i18n>VersionDescription}', };
    ExternalReference     @Common: {Label: '{i18n>ExternalReference}', };
    Rating                @Common: {Label: '{i18n>Rating}', };
    RunTime               @Common: {Label: '{i18n>RunTime}', };
    EndCreditOffset       @Common: {Label: '{i18n>EndCreditOffset}', };
    ImageFormats          @Common: {Label: '{i18n>ImageFormats}', };
    AudioFormats          @Common: {Label: '{i18n>AudioFormats}', };
    AccessibilityFeatures @Common: {Label: '{i18n>AccessibilityFeatures}', };
    EDeliveryDate         @Common: {Label: '{i18n>EDeliveryDate}', };
    EDeliveryTime         @Common: {Label: '{i18n>EDeliveryTime}', };
    SatelliteFlightDate   @Common: {Label: '{i18n>SatelliteFlightDate}', };
    SatelliteFlightTime   @Common: {Label: '{i18n>SatelliteFlightTime}', };
};

annotate service.AssetVault._Items with {
    LinkedDCP           @Common: {Label: '{i18n>LinkedDCP}', };
    LinkedCPLUUID       @Common: {Label: '{i18n>LinkedCPLUUID}', };
    LinkedCTT           @Common: {Label: '{i18n>LinkedCTT}', };
    ProjectID           @Common: {Label: '{i18n>ProjectID}', };
    ProjectType         @Common: {Label: '{i18n>ProjectType}', };
    ProjectAssetMapUUID @Common: {Label: '{i18n>ProjectAssetMapUUID}', };
    DCDMFlag            @Common: {Label: '{i18n>DCDMFlag}', };
    VersionDescription  @Common: {Label: '{i18n>VersionDescription}', };
    RunTime             @Common: {Label: '{i18n>RunTime}', };
    StartOfCredits      @Common: {Label: '{i18n>StartOfCredits}', };
    StartOfCrawl        @Common: {Label: '{i18n>StartOfCrawl}', };
    DKDMS3location      @Common: {Label: '{i18n>DKDMS3location}', };
    CPLS3location       @Common: {Label: '{i18n>CPLS3location}', };
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
                Value: AnnotationText,
            },
            {
                $Type: 'UI.DataField',
                Value: AssetMapFileSize,
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
            {
                $Type: 'UI.DataField',
                Value: AccessibilityFeatures,
            },
            {
                $Type: 'UI.DataField',
                Value: AudioFormats,
            },
            {
                $Type: 'UI.DataField',
                Value: EndCreditOffset,
            },
            {
                $Type: 'UI.DataField',
                Value: ExternalReference,
            },
            {
                $Type: 'UI.DataField',
                Value: ImageFormats,
            },
            {
                $Type: 'UI.DataField',
                Value: Rating,
            },
            {
                $Type: 'UI.DataField',
                Value: RunTime,
            },
            {
                $Type: 'UI.DataField',
                Value: EDeliveryDate,
            },
            {
                $Type: 'UI.DataField',
                Value: EDeliveryTime,
            },
            {
                $Type: 'UI.DataField',
                Value: SatelliteFlightDate,
            },
            {
                $Type: 'UI.DataField',
                Value: SatelliteFlightTime,
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
