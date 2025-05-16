using AssetVaultService as service from '../../srv/asset-vault';

annotate service.DistributionDcp with {
    ProjectID                      @Common: {Label: '{i18n>DistPrjID}', };
    AssetMapID                     @Common: {Label: '{i18n>AssetMapID}', };
    AssetMapIDDescription          @Common: {Label: '{i18n>AssetMapIDDescription}', };
    AnnotationText                 @Common: {Label: '{i18n>AnnotationText}', };
    AssetMapFileSize               @Common: {Label: '{i18n>AssetMapFileSize}', };
    CreatedinSAP                   @Common: {Label: '{i18n>CreatedinSAP}', };
    DCP                            @Common: {Label: '{i18n>DCP}', };
    Title                          @Common: {Label: '{i18n>Title}', };
    EDeliveryApacTitleId           @Common: {Label: '{i18n>EDeliveryApacTitleId}', };
    EDeliveryNoramTitleId          @Common: {Label: '{i18n>EDeliveryNoramTitleId}', };
    KencastID                      @Common: {Label: '{i18n>KENCASTID}', };
    ProjectType                    @Common: {Label: '{i18n>ProjectType}', };
    VersionDescription             @Common: {Label: '{i18n>VersionDescription}', };
    ExternalReference              @Common: {Label: '{i18n>ExternalReference}', };
    VolumeName                     @Common: {Label: '{i18n>VolumeName}', };
    KrakenTitleID                  @Common: {Label: '{i18n>KrakenTitleID}', };
    MaxCPLDuration                 @Common: {Label: '{i18n>MaxCPLDuration}', };
    StartOfCredit                  @Common: {Label: '{i18n>StartOfCredit}', };
    StartOfCrawl                   @Common: {Label: '{i18n>StartOfCrawl}', };
    DcpFormats                     @Common: {Label: '{i18n>DcpFormats}', };
    Resolution                     @Common: {Label: '{i18n>Resolution}', };
    AspectRatio                    @Common: {Label: '{i18n>AspectRatio}', };
    AnyAtmos                       @Common: {Label: '{i18n>AnyAtmos}', };
    AnyCCAP                        @Common: {Label: '{i18n>AnyCCAP}', };
    AnyOCAP                        @Common: {Label: '{i18n>AnyOCAP}', };
    AnyHI                          @Common: {Label: '{i18n>AnyHI}', };
    AnyVI                          @Common: {Label: '{i18n>AnyVI}', };
    AnySLV                         @Common: {Label: '{i18n>AnySLV}', };
    PublishDaysBeforePlaydate      @Common: {Label: '{i18n>PublishDaysBeforePlaydate}', };
    PictureFormats                 @Common: {Label: '{i18n>PictureFormats}', };
    AudioFormats                   @Common: {Label: '{i18n>AudioFormats}', };
    SatelliteDistributionStartDate @Common: {Label: '{i18n>SatelliteDistributionStartDate}', };
    SatelliteDistributionEndDate   @Common: {Label: '{i18n>SatelliteDistributionEndDate}', };
};

annotate service.DistributionDcp._Items with {
    LinkedDCP             @Common: {Label: '{i18n>LinkedDCP}', };
    LinkedCPLUUID         @Common: {Label: '{i18n>LinkedCPLUUID}', };
    LinkedCTT             @Common: {Label: '{i18n>LinkedCTT}', };
    ProjectTypeID         @Common: {Label: '{i18n>ProjectType}', };
    AssetMapUUID          @Common: {Label: '{i18n>ProjectAssetMapUUID}', };
    DCDMFlag              @Common: {Label: '{i18n>DCDMFlag}', };
    VersionDescription    @Common: {Label: '{i18n>VersionDescription}', };
    RunTime               @Common: {Label: '{i18n>RunTime}', };
    StartOfCredits        @Common: {Label: '{i18n>StartOfCredits}', };
    StartOfCrawl          @Common: {Label: '{i18n>StartOfCrawl}', };
    DKDMS3location        @Common: {Label: '{i18n>DKDMS3location}', };
    CPLS3location         @Common: {Label: '{i18n>CPLS3location}', };
    DcpProjectID          @Common: {Label: '{i18n>DcpProjectID}', };
    ContentKind           @Common: {Label: '{i18n>ContentKind}', };
    DistributionSize      @Common: {Label: '{i18n>DistributionSize}', };
    AtmosFlag             @Common: {Label: '{i18n>AtmosFlag}', };
    ClosedCaptionsFlag    @Common: {Label: '{i18n>ClosedCaptionsFlag}', };
    SignLanguageVideoFlag @Common: {Label: '{i18n>SignLanguageVideoFlag}', };
    DcpFormatType         @Common: {Label: '{i18n>DcpFormatType}', };
    SoundFormat           @Common: {Label: '{i18n>SoundFormat}', };
    DcpResolution         @Common: {Label: '{i18n>DcpResolution}', };
    AspectRatio           @Common: {Label: '{i18n>AspectRatio}', };
    PictureFormat         @Common: {Label: '{i18n>PictureFormat}', };
    KDMFlag               @Common: {Label: '{i18n>KDMFlag}', };
    Email                 @Common: {Label: '{i18n>Email}', };
    Download              @Common: {Label: '{i18n>Download}', };

};

annotate service.DistributionDcp with @(
    UI.DeleteHidden              : true,
    UI.CreateHidden              : true,
    UI.UpdateHidden              : true,
    UI.HeaderInfo                : {
        TypeName      : '{i18n>DistributionDcp}',
        TypeNamePlural: '{i18n>DistributionDcp}',
        Title         : {
            $Type: 'UI.DataField',
            Value: AssetMapID,
        },
        Description   : {
            $Type: 'UI.DataField',
            Value: AssetMapIDDescription,
        },
    },
    UI.SelectionFields           : [CreatedinSAP],
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: ProjectID,
            },
            {
                $Type: 'UI.DataField',
                Value: AssetMapID,
            },
            {
                $Type: 'UI.DataField',
                Value: ProjectType,
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
                Value: ExternalReference,
            },
            {
                $Type: 'UI.DataField',
                Value: VolumeName,
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
                Value: KrakenTitleID,
            },
            {
                $Type: 'UI.DataField',
                Value: VersionDescription,
            },
            {
                $Type: 'UI.DataField',
                Value: EDeliveryApacTitleId,
            },
            {
                $Type: 'UI.DataField',
                Value: EDeliveryNoramTitleId,
            },
            {
                $Type: 'UI.DataField',
                Value: KencastID,
            },
            {
                $Type: 'UI.DataField',
                Value: MaxCPLDuration,
            },
            {
                $Type: 'UI.DataField',
                Value: StartOfCredit,
            },
            {
                $Type: 'UI.DataField',
                Value: StartOfCrawl,
            },
            {
                $Type: 'UI.DataField',
                Value: DcpFormats,
            },
            {
                $Type: 'UI.DataField',
                Value: Resolution,
            },
            {
                $Type: 'UI.DataField',
                Value: AspectRatio,
            },
            {
                $Type: 'UI.DataField',
                Value: PictureFormats,
            },
            {
                $Type: 'UI.DataField',
                Value: AudioFormats,
            },
            {
                $Type: 'UI.DataField',
                Value: AnyAtmos,
            },
            {
                $Type: 'UI.DataField',
                Value: AnyCCAP,
            },
            {
                $Type: 'UI.DataField',
                Value: AnyOCAP,
            },
            {
                $Type: 'UI.DataField',
                Value: AnyHI,
            },
            {
                $Type: 'UI.DataField',
                Value: AnyVI,
            },
            {
                $Type: 'UI.DataField',
                Value: AnySLV,
            },
            {
                $Type: 'UI.DataField',
                Value: PublishDaysBeforePlaydate,
            },
            {
                $Type: 'UI.DataField',
                Value: SatelliteDistributionStartDate,
            },
            {
                $Type: 'UI.DataField',
                Value: SatelliteDistributionEndDate,
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
            Value: ProjectID,
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

annotate service.DistributionDcp._Items with @(
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
                Value: DcpProjectID,
            },
            {
                $Type: 'UI.DataField',
                Value: ProjectTypeID,
            },
            {
                $Type: 'UI.DataField',
                Value: AssetMapUUID,
            },
            {
                $Type: 'UI.DataField',
                Value: ContentKind,
            },
            {
                $Type: 'UI.DataField',
                Value: DCDMFlag,
            },
            {
                $Type: 'UI.DataField',
                Value: VersionDescription,
            },
            {
                $Type: 'UI.DataField',
                Value: DistributionSize,
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
                Value: DKDMS3location,
            },
            {
                $Type: 'UI.DataField',
                Value: CPLS3location,
            },
            {
                $Type: 'UI.DataField',
                Value: AtmosFlag,
            },
            {
                $Type: 'UI.DataField',
                Value: ClosedCaptionsFlag,
            },
            {
                $Type: 'UI.DataField',
                Value: SignLanguageVideoFlag,
            },
            {
                $Type: 'UI.DataField',
                Value: DcpFormatType,
            },
            {
                $Type: 'UI.DataField',
                Value: KDMFlag,
            },
            {
                $Type: 'UI.DataField',
                Value: Email,
            },
            {
                $Type: 'UI.DataField',
                Value: Download,
            },
        ],
    }
);
