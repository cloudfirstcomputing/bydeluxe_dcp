using DistributionService as service from '../../srv/dist-service';
annotate service.DCPMaterialConfig with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Plant',
                Value : Plant,
            },
            {
                $Type : 'UI.DataField',
                Label : 'StorageLocation',
                Value : StorageLocation,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductSalesOrg',
                Value : ProductSalesOrg,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductDistributionChnl',
                Value : ProductDistributionChnl,
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
            Label : 'Plant',
            Value : Plant,
        },
        {
            $Type : 'UI.DataField',
            Label : 'StorageLocation',
            Value : StorageLocation,
        },
        {
            $Type : 'UI.DataField',
            Label : 'ProductSalesOrg',
            Value : ProductSalesOrg,
        },
        {
            $Type : 'UI.DataField',
            Label : 'ProductDistributionChnl',
            Value : ProductDistributionChnl,
        },
    ],
);

