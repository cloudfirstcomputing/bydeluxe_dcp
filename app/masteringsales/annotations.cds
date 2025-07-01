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
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Items',
            ID : 'Items',
            Target : 'insertEdit/@UI.LineItem#Items',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Partner',
            ID : 'Partner',
            Target : 'partner/@UI.LineItem#Partner',
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
    ],
    UI.LineItem #Items : [
        {
            $Type : 'UI.DataField',
            Value : EditEssenceID,
            Label : 'EditEssenceID',
        },
        {
            $Type : 'UI.DataField',
            Value : Edits,
            Label : 'Edits',
        },
        {
            $Type : 'UI.DataField',
            Value : EstimatedEditCount,
            Label : 'EstimatedEditCount',
        },
        {
            $Type : 'UI.DataField',
            Value : EstimatedInsertCount,
            Label : 'EstimatedInsertCount',
        },
        {
            $Type : 'UI.DataField',
            Value : GeneralOrderNotes,
            Label : 'GeneralOrderNotes',
        },
        {
            $Type : 'UI.DataField',
            Value : InsertEssenceID,
            Label : 'InsertEssenceID',
        },
        {
            $Type : 'UI.DataField',
            Value : Inserts,
            Label : 'Inserts',
        },
        {
            $Type : 'UI.DataField',
            Value : LocalApprovalStatus,
            Label : 'LocalApprovalStatus',
        },
        {
            $Type : 'UI.DataField',
            Value : modifiedAt,
        },
        {
            $Type : 'UI.DataField',
            Value : modifiedBy,
        },
    ],
);

annotate service.PartnerDetails with @(
    UI.LineItem #Partner : [
        {
            $Type : 'UI.DataField',
            Value : DCPDeliveryPartnerInfo,
            Label : 'DCPDeliveryPartnerInfo',
        },
        {
            $Type : 'UI.DataField',
            Value : DKDMDeliveryPartnerInfo,
            Label : 'DKDMDeliveryPartnerInfo',
        },
        {
            $Type : 'UI.DataField',
            Value : modifiedAt,
        },
        {
            $Type : 'UI.DataField',
            Value : modifiedBy,
        },
    ]
);

