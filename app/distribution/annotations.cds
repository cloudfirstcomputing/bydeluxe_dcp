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
    Title             @Common: {
        Label          : '{i18n>Title}',
        Text           : Title.Name,
        TextArrangement: #TextOnly,
    };
    Studio            @Common: {
        Label          : '{i18n>Studio}',
        Text           : Studio.BusinessPartnerFullName,
        TextArrangement: #TextOnly,
    };
    CustomerReference @Common: {Label: '{i18n>CustomerReference}', };
    ValidFrom         @Common: {
        Label       : '{i18n>ValidFrom}',
        FieldControl: FieldControl,
    };
    ValidTo           @Common: {Label: '{i18n>ValidTo}', };
};

annotate service.Package with {
    PackageName             @Common: {Label: '{i18n>PackageName}', };
    Priority                @Common: {
        Label: '{i18n>Priority}',
        Text : Priority.DeliveryPriorityDesc,
    };
    ContentIndicator        @Common: {Label: '{i18n>ContentIndicator}', };
    PrimaryDeliveryMethod   @Common: {
        Label          : '{i18n>PrimaryDeliveryMethod}',
        Text           : PrimaryDeliveryMethod.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    SecondaryDeliveryMethod @Common: {
        Label          : '{i18n>SecondaryDeliveryMethod}',
        Text           : SecondaryDeliveryMethod.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    ValidFrom               @Common: {Label: '{i18n>ValidFrom}', };
    ValidTo                 @Common: {Label: '{i18n>ValidTo}', };
};

annotate service.DistRestrictions with {
    Theater                   @Common: {Label: '{i18n>Theater}', };
    Circuit                   @Common: {
        Label          : '{i18n>Circuit}',
        Text           : Circuit.Name,
        TextArrangement: #TextOnly,
    };
    DistributionFilterRegion  @Common: {
        Label          : '{i18n>DistributionFilterRegion}',
        Text           : DistributionFilterRegion.RegionName,
        TextArrangement: #TextOnly,
    };
    DistributionFilterCountry @Common: {
        Label          : '{i18n>DistributionFilterCountry}',
        Text           : DistributionFilterCountry.name,
        TextArrangement: #TextOnly,
    };
    DistributionFilterCity    @Common: {Label: '{i18n>DistributionFilterCity}', };
    DistributionFilterPostal  @Common: {Label: '{i18n>DistributionFilterPostal}', };
    OffsetRule                @Common: {Label: '{i18n>OffsetRule}', };
};


annotate service.DCPMaterials with @(Common: {SideEffects: {
    SourceProperties: [DCPMaterialNumber_Product],
    TargetProperties: [
        'CPLUUID',
        'CTT'
    ]
}}) {
    DCPMaterialNumber @Common: {
        Label: '{i18n>DCPMaterial}',
        Text : DCPMaterialNumber.Name,
    };
    CTT               @Common: {Label: '{i18n>CTT}', }  @UI.MultiLineText;
    CPLUUID           @Common: {Label: '{i18n>CPL}', }  @UI.MultiLineText;
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
            Value: PackageName,
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
                Value: ContentIndicator,
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
                Value: PrimaryDeliveryMethod_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: SecondaryDeliveryMethod_ShippingCondition,
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
                    Label : '{i18n>PackageValidityDate}',
                    Target: '@UI.FieldGroup#_PackageValidityDate',
                },
            ],
        },

        {
            $Type : 'UI.ReferenceFacet',
            ID    : '_PackageFilter',
            Label : '{i18n>DistRestriction}',
            Target: 'to_DistRestriction/@UI.LineItem',
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
            Value: ContentIndicator,
        },
        {
            $Type: 'UI.DataField',
            Value: PrimaryDeliveryMethod_ShippingCondition,
        },
        {
            $Type: 'UI.DataField',
            Value: SecondaryDeliveryMethod_ShippingCondition,
        },
    ]
);

annotate service.DistRestrictions with @(
    UI.LineItem                    : [
        {
            $Type: 'UI.DataField',
            Value: DistributionFilterCountry_code,
        },
        {
            $Type: 'UI.DataField',
            Value: DistributionFilterRegion_Region,
        },
        {
            $Type: 'UI.DataField',
            Value: DistributionFilterCity,
        },
        {
            $Type: 'UI.DataField',
            Value: DistributionFilterPostal,
        },
        {
            $Type: 'UI.DataField',
            Value: Circuit_CustomerGroup,
        },
        {
            $Type: 'UI.DataField',
            Value: Theater_BusinessPartner,
        },
        {
            $Type: 'UI.DataField',
            Value: OffsetRule,
        },
    ],
    UI.HeaderInfo                  : {
        Title         : {
            $Type: 'UI.DataField',
            Value: DistributionFilterCountry_code,
        },
        TypeName      : '{i18n>DistRestriction}',
        TypeNamePlural: '{i18n>DistRestrictions}',
    },
    UI.FieldGroup #_DistRestriction: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterCountry_code,
            },
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterRegion_Region,
            },
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterCity,
            },
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterPostal,
            },
            {
                $Type: 'UI.DataField',
                Value: Circuit_CustomerGroup,
            },
            {
                $Type: 'UI.DataField',
                Value: Theater_BusinessPartner,
            },
            {
                $Type: 'UI.DataField',
                Value: OffsetRule,
            },
        ]
    },
    UI.Facets                      : [{
        $Type : 'UI.ReferenceFacet',
        ID    : '_DistRest',
        Label : '{i18n>DistRestriction}',
        Target: '@UI.FieldGroup#_DistRestriction',
    }, ],
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
        ]
    },
    UI.Facets                  : [{
        $Type : 'UI.ReferenceFacet',
        ID    : '_DCPMaterial',
        Label : '{i18n>DCPMaterial}',
        Target: '@UI.FieldGroup#_DCPMaterial',
    }, ],
    UI.LineItem                : [{
        $Type: 'UI.DataField',
        Value: DCPMaterialNumber_Product,
    }, ]
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
    PrimaryDeliveryMethod   @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PrimaryDeliveryMethod_ShippingCondition,
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
    SecondaryDeliveryMethod @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: SecondaryDeliveryMethod_ShippingCondition,
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
    Priority                @(
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
}

annotate service.DistRestrictions with {
    // PrimaryPlant             @(
    //     Common.ValueList               : {
    //         $Type          : 'Common.ValueListType',
    //         CollectionPath : 'Plants',
    //         SearchSupported: false,
    //         Parameters     : [
    //             {
    //                 $Type            : 'Common.ValueListParameterInOut',
    //                 LocalDataProperty: PrimaryPlant_Plant,
    //                 ValueListProperty: 'Plant',
    //             },
    //             {
    //                 $Type            : 'Common.ValueListParameterDisplayOnly',
    //                 ValueListProperty: 'PlantName',
    //             },
    //         ],
    //     },
    //     Common.ValueListWithFixedValues: false
    // );
    // SecondaryPlant           @(
    //     Common.ValueList               : {
    //         $Type          : 'Common.ValueListType',
    //         CollectionPath : 'Plants',
    //         SearchSupported: false,
    //         Parameters     : [
    //             {
    //                 $Type            : 'Common.ValueListParameterInOut',
    //                 LocalDataProperty: SecondaryPlant_Plant,
    //                 ValueListProperty: 'Plant',
    //             },
    //             {
    //                 $Type            : 'Common.ValueListParameterDisplayOnly',
    //                 ValueListProperty: 'PlantName',
    //             },
    //         ],
    //     },
    //     Common.ValueListWithFixedValues: false
    // );
    DistributionFilterRegion @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'Regions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterIn',
                    LocalDataProperty: DistributionFilterCountry_code,
                    ValueListProperty: 'Country',
                },
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DistributionFilterRegion_Region,
                    ValueListProperty: 'Region',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'RegionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    Theater                  @(
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
    Circuit                  @(
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
};

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
