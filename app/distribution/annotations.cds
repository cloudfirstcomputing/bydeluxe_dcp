using DistributionService as service from '../../srv/dist-service';

@Common: {SemanticKey: [DistroSpecID], }
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
    PackageName               @Common: {Label: '{i18n>PackageName}', };
    Priority                  @Common: {Label: '{i18n>Priority}', };
    Theater                   @Common: {Label: '{i18n>Theater}', };
    DistributionFilterRegion  @Common: {Label: '{i18n>DistributionFilterRegion}', };
    DistributionFilterCountry @Common: {Label: '{i18n>DistributionFilterCountry}', };
    DistributionFilterOther   @Common: {Label: '{i18n>DistributionFilterOther}', };
    DeliveryMethod            @Common: {Label: '{i18n>DeliveryMethod}', };
    DeliveryKind              @Common: {Label: '{i18n>DeliveryKind}', };
    ValidFrom                 @Common: {Label: '{i18n>ValidFrom}', };
    ValidTo                   @Common: {Label: '{i18n>ValidTo}', };
};

annotate service.DCPMaterials with {
    CTT             @Common: {Label: '{i18n>CTT}', };
    CPLName         @Common: {Label: '{i18n>CPLName}', };
    Picture         @Common: {Label: '{i18n>Picture}', };
    Audio           @Common: {Label: '{i18n>Audio}', };
    DCPMaterialText @Common: {Label: '{i18n>DCPMaterialText}', };
    DCPMaterial     @Common: {Label: '{i18n>DCPMaterial}', };
};

annotate service.BusinessPartners with {
    BusinessPartner         @Common: {Label: '{i18n>Studio}', };
    BusinessPartnerFullName @Common: {Label: '{i18n>StudioName}', };
};

annotate service.ShippingConditions with {
    ShippingCondition @Common: {Label: '{i18n>ShippingCondition}', };
};


annotate service.DistroSpec with @(
    UI.HeaderInfo         : {
        Title         : {
            $Type: 'UI.DataField',
            Value: Title,
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
                Value: Title,
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
            Value: Title,
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
    UI.HeaderInfo         : {
        Title         : {
            $Type: 'UI.DataField',
            Value: Theater,
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
                Value: Theater,
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
                Value: DistributionFilterOther,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliveryMethod_ShippingCondition,
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
            Value: DeliveryMethod_ShippingCondition,
        },
        {
            $Type: 'UI.DataField',
            Value: DeliveryKind,
        },
    ]
);

annotate service.DCPMaterials with @(
    UI.HeaderInfo         : {
        Title         : {
            $Type: 'UI.DataField',
            Value: DCPMaterial,
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
                Value: DCPMaterial,
            },
            {
                $Type: 'UI.DataField',
                Value: DCPMaterialText,
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
            Value: DCPMaterial,
        },
        {
            $Type: 'UI.DataField',
            Value: DCPMaterialText,
        },
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
    Studio @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            // Label         : '{i18n>Studio}',
            CollectionPath: 'BusinessPartners',
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
    )
};

annotate service.Package with {
DeliveryMethod @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            // Label         : '{i18n>Studio}',
            CollectionPath: 'ShippingConditions',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliveryMethod_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    )
}