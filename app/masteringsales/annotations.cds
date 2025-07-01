using MasteringService as service from '../../srv/mast-service';
annotate service.MasteringHubMain with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'SalesOrderNumber',
                Value : SalesOrderNumber,
            },
            {
                $Type : 'UI.DataField',
                Label : 'LineItem',
                Value : LineItem,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Material',
                Value : Material,
            }
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
            Label : 'SalesOrderNumber',
            Value : SalesOrderNumber,
        },
        {
            $Type : 'UI.DataField',
            Label : 'LineItem',
            Value : LineItem,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Material',
            Value : Material,
        },
        {
            $Type : 'UI.DataField',
            Label : 'InternalOrderStatus',
            Value : InternalOrderStatus,
        },
        {
            $Type : 'UI.DataField',
            Label : 'CreationDate',
            Value : CreationDate,
        },
    ],
);

annotate service.InsertEditDetails with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Target : 'parent/@UI.LineItem',
            Label : 'Items',
            ID : 'items',
        },
    ]
);

