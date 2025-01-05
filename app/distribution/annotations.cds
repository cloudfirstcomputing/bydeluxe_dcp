using DistributionService as service from '../../srv/dist-service';

@(
    Common                                : {SemanticKey: [DistroSpecID], },
    UI.SelectionPresentationVariant #table: {
        $Type              : 'UI.SelectionPresentationVariantType',
        PresentationVariant: {
            $Type         : 'UI.PresentationVariantType',
            Visualizations: ['@UI.LineItem', ],
            SortOrder     : [{
                $Type     : 'Common.SortOrderType',
                Property  : DistroSpecID,
                Descending: false,
            }, ],
        },
        SelectionVariant   : {
            $Type        : 'UI.SelectionVariantType',
            SelectOptions: [],
        },
    },
)
annotate service.DistroSpec with {
    DistroSpecID      @Common: {Label: '{i18n>DistroSpecID}', };
    Name              @Common: {Label: '{i18n>Name}', };
    Title             @Common: {Label: '{i18n>Title}', };
    Studio            @Common: {Label: '{i18n>Studio}', };
    CustomerReference @Common: {Label: '{i18n>CustomerReference}', };
    ValidFrom         @Common: {
        Label       : '{i18n>ValidFrom}',
        FieldControl: FieldControl,
    };
    ValidTo           @Common: {Label: '{i18n>ValidTo}', };
};

annotate service.Package with {
    PackageName                      @Common: {Label: '{i18n>PackageName}', };
    Priority                         @Common: {Label: '{i18n>Priority}', };
    Theater                          @Common: {Label: '{i18n>Theater}', };
    Circuit                          @Common: {Label: '{i18n>Circuit}', };
    StudioCircuitName                @Common: {Label: '{i18n>StudioCircuitName}', };
    DistributionFilterRegion         @Common: {Label: '{i18n>DistributionFilterRegion}', };
    DistributionFilterCountry        @Common: {Label: '{i18n>DistributionFilterCountry}', };
    DistributionFilterCity           @Common: {Label: '{i18n>DistributionFilterCity}', };
    DistributionFilterPostal         @Common: {Label: '{i18n>DistributionFilterPostal}', };
    PrimaryTerritory                 @Common: {Label: '{i18n>PrimaryTerritory}', };
    SecondaryTerritory               @Common: {Label: '{i18n>SecondaryTerritory}', };
    ContentIndicator                 @Common: {Label: '{i18n>ContentIndicator}', };
    PrimaryTerritoryDeliveryMethod   @Common: {Label: '{i18n>PrimaryTerritoryDeliveryMethod}', };
    SecondaryTerritoryDeliveryMethod @Common: {Label: '{i18n>SecondaryTerritoryDeliveryMethod}', };
    BookingType                      @Common: {Label: '{i18n>BookingType}', };
    DepotID                          @Common: {Label: '{i18n>DepotID}', };
    BranchID                         @Common: {Label: '{i18n>BranchID}', };
    DeliveryKind                     @Common: {Label: '{i18n>DeliveryKind}', };
    ValidFrom                        @Common: {Label: '{i18n>ValidFrom}', };
    ValidTo                          @Common: {Label: '{i18n>ValidTo}', };
};

annotate service.DCPMaterials with {
    DCPMaterialNumber @Common: {Label: '{i18n>DCPMaterial}', };
    CTT               @Common: {Label: '{i18n>CTT}', }  @UI.MultiLineText;
    CPLUUID           @Common: {Label: '{i18n>CPL}', }  @UI.MultiLineText;
    PrintFormat       @Common: {Label: '{i18n>PrintFormat}', };
    FilmStock         @Common: {Label: '{i18n>FilmStock}', };
    Audio             @Common: {Label: '{i18n>Audio}', };
    Language          @Common: {Label: '{i18n>Language}', };
    SubtitleType      @Common: {Label: '{i18n>SubtitleType}', };
    SoundID           @Common: {Label: '{i18n>SoundID}', };
    MediaType         @Common: {Label: '{i18n>MediaType}', };
    ReelLength        @Common: {Label: '{i18n>ReelLength}', };
    DTSQuantity       @Common: {Label: '{i18n>DTSQuantity}', };
    AuditoriumType    @Common: {Label: '{i18n>AuditoriumType}', };
    ScreenID          @Common: {Label: '{i18n>ScreenID}', };
    SingleScreen      @Common: {Label: '{i18n>SingleScreen}', };
    HoldforRelease    @Common: {Label: '{i18n>HoldforRelease}', };
    ApprovedScreens   @Common: {Label: '{i18n>ApprovedScreens}', };
    Attribute1        @Common: {Label: '{i18n>Attribute1}', };
    Attribute2        @Common: {Label: '{i18n>Attribute2}', };
    Attribute3        @Common: {Label: '{i18n>Attribute3}', };
    Attribute4        @Common: {Label: '{i18n>Attribute4}', };
    Attribute5        @Common: {Label: '{i18n>Attribute5}', };
    Attribute6        @Common: {Label: '{i18n>Attribute6}', };
    Attribute7        @Common: {Label: '{i18n>Attribute7}', };
    Attribute8        @Common: {Label: '{i18n>Attribute8}', };
    Attribute9        @Common: {Label: '{i18n>Attribute9}', };
    Attribute10       @Common: {Label: '{i18n>Attribute10}', };
};

annotate service.Studios with {
    BusinessPartner         @Common: {Label: '{i18n>Studio}', };
    BusinessPartnerFullName @Common: {Label: '{i18n>StudioName}', };
};

annotate service.Theaters with {
    BusinessPartner         @Common: {Label: '{i18n>Theater}', };
    BusinessPartnerFullName @Common: {Label: '{i18n>TheaterName}', };
};

annotate service.ShippingConditions with {
    ShippingCondition     @Common: {Label: '{i18n>ShippingCondition}', };
    ShippingConditionName @Common: {Label: '{i18n>Description}', };
};

annotate service.DCPProducts with {
    Product @Common: {Label: '{i18n>Product}', };
    Name    @common: {Label: '{i18n>ProductDesc}'}
};

annotate service.Titles with {
    Product @Common: {Label: '{i18n>Title}', };
    Name    @Common: {Label: '{i18n>Description}'}
};

annotate service.DeliveryPriority with {
    DeliveryPriority     @Common: {Label: '{i18n>DeliveryPriority}', };
    DeliveryPriorityDesc @common: {Label: '{i18n>Description}'}
};

annotate service.CustomerGroup with {
    CustomerGroup @Common      : {Label: '{i18n>CustomerGroup}', };
    Name          @Common.Label: '{i18n>Description}';
};

annotate service.DistroSpec with @(
    UI.SelectionFields         : [
        Studio_BusinessPartner,
        Title_Product
    ],
    UI.HeaderInfo              : {
        Title         : {
            $Type: 'UI.DataField',
            Value: Title_Product,
        },
        TypeName      : '{i18n>DistroSpec}',
        TypeNamePlural: '{i18n>DistroSpecs}',
    },

    UI.FieldGroup #ValidityDate: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: ValidFrom,
            },
            {
                $Type: 'UI.DataField',
                Value: ValidTo,
            },
        ],
    },
    UI.FieldGroup #General     : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: DistroSpecID,
            },
            {
                $Type: 'UI.DataField',
                Value: Name,
            },
            {
                $Type: 'UI.DataField',
                Value: Title_Product,
            },
            {
                $Type: 'UI.DataField',
                Value: Studio_BusinessPartner,
            },
            {
                $Type: 'UI.DataField',
                Value: CustomerReference,
            },
        ],
    },
    UI.Facets                  : [
        {
            $Type : 'UI.CollectionFacet',
            ID    : 'PackageCollection',
            Label : '{i18n>PackageInfo}',
            Facets: [
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : 'General',
                    Label : '{i18n>GeneralInfo}',
                    Target: '@UI.FieldGroup#General',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : 'ValidDate',
                    Label : '{i18n>ValidityDate}',
                    Target: '@UI.FieldGroup#ValidityDate',
                },
            ],
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'Package',
            Label : '{i18n>Package}',
            Target: 'to_Package/@UI.LineItem',
        },
    ],
    UI.LineItem                : [
        {
            $Type: 'UI.DataField',
            Value: DistroSpecID,
        },
        {
            $Type: 'UI.DataField',
            Value: Name,
        },
        {
            $Type: 'UI.DataField',
            Value: Title_Product,
        },
        {
            $Type: 'UI.DataField',
            Value: Studio_BusinessPartner,
        },
        {
            $Type: 'UI.DataField',
            Value: CustomerReference,
        },
        {
            $Type: 'UI.DataField',
            Value: ValidFrom,
        },
        {
            $Type: 'UI.DataField',
            Value: ValidTo,
        },
    ],
);

annotate service.Package with @(
    UI.HeaderInfo                       : {
        Title         : {
            $Type: 'UI.DataField',
            Value: Theater_BusinessPartner,
        },
        TypeName      : '{i18n>Package}',
        TypeNamePlural: '{i18n>Packages}',
    },
    UI.FieldGroup #_Package             : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: PackageName,
            },
            {
                $Type: 'UI.DataField',
                Value: Priority_DeliveryPriority,
            },
            {
                $Type: 'UI.DataField',
                Value: Theater_BusinessPartner,
            },
            {
                $Type: 'UI.DataField',
                Value: Circuit_CustomerGroup,
            },
            {
                $Type: 'UI.DataField',
                Value: StudioCircuitName,
            },
            {
                $Type: 'UI.DataField',
                Value: PrimaryTerritory,
            },
            {
                $Type: 'UI.DataField',
                Value: SecondaryTerritory,
            },
            {
                $Type: 'UI.DataField',
                Value: ContentIndicator,
            },
            {
                $Type: 'UI.DataField',
                Value: BookingType,
            },
            {
                $Type: 'UI.DataField',
                Value: DepotID,
            },
            {
                $Type: 'UI.DataField',
                Value: BranchID,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliveryKind,
            },
        ],
    },
    UI.FieldGroup #Filters              : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterRegion_code,
            },
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterCountry_code,
            },
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterCity,
            },
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterPostal,
            },
        ],
    },
    UI.FieldGroup #_PackageValidityDate : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: ValidFrom,
            },
            {
                $Type: 'UI.DataField',
                Value: ValidTo,
            },
        ],
    },
    UI.FieldGroup #_PackageDeliveryethod: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: PrimaryTerritoryDeliveryMethod_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: SecondaryTerritoryDeliveryMethod_ShippingCondition,
            },
        ],
    },
    UI.Facets                           : [
        {
            $Type : 'UI.CollectionFacet',
            ID    : 'PackageCollection',
            Label : '{i18n>PackageInfo}',
            Facets: [
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : '_Package',
                    Label : '{i18n>GeneralInfo}',
                    Target: '@UI.FieldGroup#_Package',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : '_PackageDeliveryethod',
                    Label : '{i18n>DeliveryMethod}',
                    Target: '@UI.FieldGroup#_PackageDeliveryethod',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : '_PackageValidityDate',
                    Label : '{i18n>ValidityDate}',
                    Target: '@UI.FieldGroup#_PackageValidityDate',
                },
            ],
        },

        {
            $Type : 'UI.ReferenceFacet',
            ID    : '_PackageFilter',
            Label : '{i18n>DistributionFilter}',
            Target: '@UI.FieldGroup#Filters',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'DCPMaterial',
            Label : '{i18n>DCPMaterial}',
            Target: 'to_DCPMaterial/@UI.LineItem',
        },
    ],
    UI.LineItem                         : [
        {
            $Type: 'UI.DataField',
            Value: PackageName,
        },
        {
            $Type: 'UI.DataField',
            Value: Priority_DeliveryPriority,
        },
        {
            $Type: 'UI.DataField',
            Value: PrimaryTerritoryDeliveryMethod_ShippingCondition,
        },
        {
            $Type: 'UI.DataField',
            Value: DeliveryKind,
        },
        {
            $Type: 'UI.DataField',
            Value: Theater_BusinessPartner,
        },
    ]
);

annotate service.DCPMaterials with @(
    UI.HeaderInfo              : {
        Title         : {
            $Type: 'UI.DataField',
            Value: DCPMaterialNumber_Product,
        },
        TypeName      : '{i18n>DCPMaterial}',
        TypeNamePlural: '{i18n>DCPMaterials}',
    },
    UI.FieldGroup #_DCPMaterial: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: DCPMaterialNumber_Product,
            },
            {
                $Type: 'UI.DataField',
                Value: CTT,
            },
            {
                $Type: 'UI.DataField',
                Value: CPLUUID,
            },
            {
                $Type: 'UI.DataField',
                Value: PrintFormat,
            },
            {
                $Type: 'UI.DataField',
                Value: FilmStock,
            },
            {
                $Type: 'UI.DataField',
                Value: Audio,
            },
            {
                $Type: 'UI.DataField',
                Value: Language_code,
            },
            {
                $Type: 'UI.DataField',
                Value: SubtitleType,
            },
            {
                $Type: 'UI.DataField',
                Value: SoundID,
            },
            {
                $Type: 'UI.DataField',
                Value: MediaType,
            },
            {
                $Type: 'UI.DataField',
                Value: ReelLength,
            },
            {
                $Type: 'UI.DataField',
                Value: DTSQuantity,
            },
            {
                $Type: 'UI.DataField',
                Value: AuditoriumType,
            },
            {
                $Type: 'UI.DataField',
                Value: ScreenID,
            },
            {
                $Type: 'UI.DataField',
                Value: SingleScreen,
            },
            {
                $Type: 'UI.DataField',
                Value: HoldforRelease,
            },
            {
                $Type: 'UI.DataField',
                Value: ApprovedScreens,
            },
        ]
    },
    UI.FieldGroup #Attributes  : {
        $Type: 'UI.FieldGroupType',
        Data : [
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
        ]
    },
    UI.Facets                  : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : '_DCPMaterial',
            Label : '{i18n>DCPMaterial}',
            Target: '@UI.FieldGroup#_DCPMaterial',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'Attributes',
            Label : '{i18n>Attributes}',
            Target: '@UI.FieldGroup#Attributes',
        },
    ],
    UI.LineItem                : [
        {
            $Type: 'UI.DataField',
            Value: DCPMaterialNumber_Product,
        },
        {
            $Type: 'UI.DataField',
            Value: PrintFormat,
        },
        {
            $Type: 'UI.DataField',
            Value: FilmStock,
        },
        {
            $Type: 'UI.DataField',
            Value: Audio,
        },
    ]
);

annotate service.DistroSpec with {
    Studio @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'Studios',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Studio_BusinessPartner,
                    ValueListProperty: 'BusinessPartner',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'BusinessPartnerFullName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    Title  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'Titles',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Title_Product,
                    ValueListProperty: 'Product',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Name',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    )

};

annotate service.Package with {
    PrimaryTerritoryDeliveryMethod   @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PrimaryTerritoryDeliveryMethod_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    SecondaryTerritoryDeliveryMethod @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: SecondaryTerritoryDeliveryMethod_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    Theater                          @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'Theaters',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Theater_BusinessPartner,
                    ValueListProperty: 'BusinessPartner',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'BusinessPartnerFullName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    Priority                         @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'DeliveryPriority',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Priority_DeliveryPriority,
                    ValueListProperty: 'DeliveryPriority',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'DeliveryPriorityDesc',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    Circuit                          @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'CustomerGroup',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Circuit_CustomerGroup,
                    ValueListProperty: 'CustomerGroup',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Name',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
}

annotate service.DCPMaterials with {
    DCPMaterialNumber @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'DCPProducts',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DCPMaterialNumber_Product,
                    ValueListProperty: 'Product',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Name',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
};
