using DistributionService as service from '../../srv/dist-service';
annotate service.DCPMaterialMapping with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
            $Type : 'UI.DataField',
            Label : 'Shipping Type',
            Value : ShippingType,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Variable',
            Value : Variable,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Material',
            Value : Material,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Material Group',
            Value : MaterialGroup,
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
            Label : 'Shipping Type',
            Value : ShippingType,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Variable',
            Value : Variable,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Material',
            Value : Material,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Material Group',
            Value : MaterialGroup,
        },
        
    ],
);

annotate service.DCPMaterialMapping with {
    ShippingType @(
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
    Material @(
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
            CollectionPath : 'ProductGroup',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: MaterialGroup,
                    ValueListProperty: 'MaterialGroup',
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