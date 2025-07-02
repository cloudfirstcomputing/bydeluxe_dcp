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
        {
            $Type : 'UI.DataField',
            Value : insertEdit.AudioEssence.AdditionalAudioTracks,
            Label : 'AdditionalAudioTracks',
        },
        {
            $Type : 'UI.DataField',
            Value : insertEdit.AudioEssence.AudioChannelConfiguration,
            Label : 'AudioChannelConfiguration',
        },
        {
            $Type : 'UI.DataField',
            Value : insertEdit.AudioEssence.AudioChannelCount,
            Label : 'AudioChannelCount',
        },
        {
            $Type : 'UI.DataField',
            Value : insertEdit.AudioEssence.AudioDeliveryDate,
            Label : 'AudioDeliveryDate',
        },
        {
            $Type : 'UI.DataField',
            Value : insertEdit.AudioEssence.AudioIngestRequired,
            Label : 'AudioIngestRequired',
        },
        {
            $Type : 'UI.DataField',
            Value : insertEdit.AudioEssence.AudioLanguage,
            Label : 'AudioLanguage',
        },
        {
            $Type : 'UI.DataField',
            Value : insertEdit.AudioEssence.ID,
            Label : 'ID',
        },
    ],
);

annotate service.InsertEditDetails with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Target : 'parent/@UI.LineItem',
            ID : 'items',
            Label : '{i18n>AudioEssence}',
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

