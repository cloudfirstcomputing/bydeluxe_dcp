using DistributionService as service from '../../srv/dist-service';

@Common: {SemanticKey: [DistroSpecID], }
annotate service.DistroSpec with {
    DistroSpecID      @Common: {Label: '{i18n>DistroSpecID}', };
    Name              @Common: {Label: '{i18n>Name}', };
    Title             @Common: {Label: '{i18n>Title}', };
    Studio            @Common: {Label: '{i18n>Studio}', };
    DCPMaterial       @Common: {Label: '{i18n>DCPMaterial}', };
    CustomerReference @Common: {Label: '{i18n>CustomerReference}', };
    ValidFrom         @Common: {
        Label       : '{i18n>ValidFrom}',
        FieldControl: FieldControl,
    };
    ValidTo           @Common: {Label: '{i18n>ValidTo}', };
};

annotate service.Package with {
    PackageName                     @Common: {Label: '{i18n>PackageName}', };
    Priority                        @Common: {Label: '{i18n>Priority}', };
    Theater                         @Common: {Label: '{i18n>Theater}', };
    Circuit                         @Common: {Label: '{i18n>Circuit}', };
    StudioCircuitName               @Common: {Label: '{i18n>StudioCircuitName}', };
    DistributionFilterRegion        @Common: {Label: '{i18n>DistributionFilterRegion}', };
    DistributionFilterCountry       @Common: {Label: '{i18n>DistributionFilterCountry}', };
    DistributionFilterCity          @Common: {Label: '{i18n>DistributionFilterCity}', };
    DistributionFilterPostal        @Common: {Label: '{i18n>DistributionFilterPostal}', };
    PrimaryTerritory                @Common: {Label: '{i18n>PrimaryTerritory}', };
    SecondaryTerritory              @Common: {Label: '{i18n>SecondaryTerritory}', };
    ContentIndicator                @Common: {Label: '{i18n>ContentIndicator}', };
    PrimaryTerritoryDeliveryMethod  @Common: {Label: '{i18n>PrimaryTerritoryDeliveryMethod}', };
    SecondaryTerritoryDeliveryethod @Common: {Label: '{i18n>SecondaryTerritoryDeliveryethod}', };
    Language                        @Common: {Label: '{i18n>Language}', };
    DeliveryKind                    @Common: {Label: '{i18n>DeliveryKind}', };
    ValidFrom                       @Common: {Label: '{i18n>ValidFrom}', };
    ValidTo                         @Common: {Label: '{i18n>ValidTo}', };
};

annotate service.DCPMaterials with {
    CTT         @Common: {Label: '{i18n>CTT}', };
    CPLName     @Common: {Label: '{i18n>CPLName}', };
    Picture     @Common: {Label: '{i18n>Picture}', };
    Audio       @Common: {Label: '{i18n>Audio}', };
    Attribute1  @Common: {Label: '{i18n>Attribute1}', };
    Attribute2  @Common: {Label: '{i18n>Attribute2}', };
    Attribute3  @Common: {Label: '{i18n>Attribute3}', };
    Attribute4  @Common: {Label: '{i18n>Attribute4}', };
    Attribute5  @Common: {Label: '{i18n>Attribute5}', };
    Attribute6  @Common: {Label: '{i18n>Attribute6}', };
    Attribute7  @Common: {Label: '{i18n>Attribute7}', };
    Attribute8  @Common: {Label: '{i18n>Attribute8}', };
    Attribute9  @Common: {Label: '{i18n>Attribute9}', };
    Attribute10 @Common: {Label: '{i18n>Attribute10}', };
};

annotate service.Studios with {
    BusinessPartner         @Common: {Label: '{i18n>Studio}', };
    BusinessPartnerFullName @Common: {Label: '{i18n>StudioName}', };
};

annotate service.ShippingConditions with {
    ShippingCondition @Common: {Label: '{i18n>ShippingCondition}', };
};

annotate service.DCPProducts with {
    Product @Common: {Label: '{i18n>Product}', };
};

annotate service.DistroSpec with @(
    UI.SelectionFields    : [
        DCPMaterial_Product,
        Studio_BusinessPartner,
        Title_Product
    ],
    UI.HeaderInfo         : {
        Title         : {
            $Type: 'UI.DataField',
            Value: Title_Product,
        },
        TypeName      : '{i18n>DistroSpec}',
        TypeNamePlural: '{i18n>DistroSpecs}',
    },
    UI.FieldGroup #General: {
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
                Value: DCPMaterial_Product,
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
    },
    UI.Facets             : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'General',
            Label : '{i18n>GeneralInfo}',
            Target: '@UI.FieldGroup#General',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'Package',
            Label : '{i18n>Package}',
            Target: 'to_Package/@UI.LineItem',
        },
    ],
    UI.LineItem           : [
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
            Value: DCPMaterial_Product,
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
    UI.HeaderInfo          : {
        Title         : {
            $Type: 'UI.DataField',
            Value: Theater_BusinessPartner,
        },
        TypeName      : '{i18n>Package}',
        TypeNamePlural: '{i18n>Packages}',
    },
    UI.FieldGroup #_Package: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: PackageName,
            },
            {
                $Type: 'UI.DataField',
                Value: Priority,
            },
            {
                $Type: 'UI.DataField',
                Value: Theater_BusinessPartner,
            },
            {
                $Type: 'UI.DataField',
                Value: Circuit,
            },
            {
                $Type: 'UI.DataField',
                Value: StudioCircuitName,
            },
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterRegion,
            },
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterCountry,
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
                Value: PrimaryTerritoryDeliveryMethod_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: SecondaryTerritoryDeliveryethod_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: Language,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliveryKind,
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
    },
    UI.Facets              : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : '_Package',
            Label : '{i18n>PackageInfo}',
            Target: '@UI.FieldGroup#_Package',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'DCPMaterial',
            Label : '{i18n>DCPMaterial}',
            Target: 'to_DCPMaterial/@UI.LineItem',
        },
    ],
    UI.LineItem            : [
        {
            $Type: 'UI.DataField',
            Value: PackageName,
        },
        {
            $Type: 'UI.DataField',
            Value: Priority,
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
            Value: CPLName,
        },
        TypeName      : '{i18n>DCPMaterial}',
        TypeNamePlural: '{i18n>DCPMaterials}',
    },
    UI.FieldGroup #_DCPMaterial: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: CTT,
            },
            {
                $Type: 'UI.DataField',
                Value: CPLName,
            },
            {
                $Type: 'UI.DataField',
                Value: Picture,
            },
            {
                $Type: 'UI.DataField',
                Value: Audio,
            },
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
    UI.Facets                  : [{
        $Type : 'UI.ReferenceFacet',
        ID    : '_DCPMaterial',
        Label : '{i18n>DCPMaterial}',
        Target: '@UI.FieldGroup#_DCPMaterial',
    }, ],
    UI.LineItem                : [
        {
            $Type: 'UI.DataField',
            Value: CTT,
        },
        {
            $Type: 'UI.DataField',
            Value: CPLName,
        },
    ]
);

annotate service.DistroSpec with {
    Studio      @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Studios',
            Parameters    : [
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
    DCPMaterial @(
        Common.ValueList               : {
            $Type                    : 'Common.ValueListType',
            CollectionPath           : 'DCPProducts',
            SelectionVariantQualifier: '',
            Parameters               : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: DCPMaterial_Product,
                ValueListProperty: 'Product',
            }, ],
        },
        Common.ValueListWithFixedValues: false
    );
    Title       @(
        Common.ValueList               : {
            $Type                    : 'Common.ValueListType',
            CollectionPath           : 'Titles',
            SelectionVariantQualifier: '',
            Parameters               : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: Title_Product,
                ValueListProperty: 'Product',
            }, ],
        },
        Common.ValueListWithFixedValues: false
    )

};

annotate service.Package with {
    PrimaryTerritoryDeliveryMethod  @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            // Label         : '{i18n>Studio}',
            CollectionPath: 'ShippingConditions',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: PrimaryTerritoryDeliveryMethod_ShippingCondition,
                ValueListProperty: 'ShippingCondition',
            }, ],
        },
        Common.ValueListWithFixedValues: false
    );
    SecondaryTerritoryDeliveryethod @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            // Label         : '{i18n>Studio}',
            CollectionPath: 'ShippingConditions',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: SecondaryTerritoryDeliveryethod_ShippingCondition,
                ValueListProperty: 'ShippingCondition',
            }, ],
        },
        Common.ValueListWithFixedValues: false
    );
    Theater                         @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Theaters',
            Parameters    : [
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
}
