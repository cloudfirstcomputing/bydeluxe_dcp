using DistributionService as service from '../../srv/dist-service';

annotate service.ShippingType with {
    ShippingType     @Common: {Label: '{i18n>ShippingType}', };
    ShippingTypeName @Common: {Label: '{i18n>ShippingTypeName}', };
};


annotate service.DCPMaterialMapping with {
    ID;
    createdAt;
    createdBy;
    modifiedAt;
    modifiedBy;
    ShippingType  @Common: {Label: '{i18n>ShippingType}', };
    Variable      @Common: {Label: '{i18n>Variable}', };
    Material      @Common: {Label: '{i18n>Material}', };
    MaterialGroup @Common: {Label: '{i18n>MaterialGroup}', };
};


annotate service.ProductGroup1 with {
    AdditionalMaterialGroup1     @Common: {Label: '{i18n>AdditionalMaterialGroup1}', };
    Language;
    AdditionalMaterialGroup1Name @Common: {Label: '{i18n>AdditionalMaterialGroup1Name}', };
};


annotate service.DCPMaterialMapping with @(
    UI.SelectionFields           : [
        Material,
        MaterialGroup,
        ShippingType
    ],
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: ShippingType,
            },
            {
                $Type: 'UI.DataField',
                Value: Variable,
            },
            {
                $Type: 'UI.DataField',
                Value: Material,
            },
            {
                $Type: 'UI.DataField',
                Value: MaterialGroup,
            },
        ],
    },
    UI.Facets                    : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : '{i18n>GeneralInformation}',
        Target: '@UI.FieldGroup#GeneratedGroup',
    }, ],
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Value: ShippingType,
        },
        {
            $Type: 'UI.DataField',
            Value: Variable,
        },
        {
            $Type: 'UI.DataField',
            Value: Material,
        },
        {
            $Type: 'UI.DataField',
            Value: MaterialGroup,
        },

    ],
);

annotate service.DCPMaterialMapping with {
    ShippingType  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingType',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: ShippingType,
                    ValueListProperty: 'ShippingType',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingTypeName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    Material      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'DCPMapProducts',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Material,
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
    MaterialGroup @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ProductGroup1',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: MaterialGroup,
                    ValueListProperty: 'AdditionalMaterialGroup1',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'AdditionalMaterialGroup1Name',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
};
