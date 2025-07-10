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
            Value : InternalLastModifiedDate,
            Label : 'InternalLastModifiedDate',
        },
        {
            $Type : 'UI.DataField',
            Value : InternalCancellationDate,
            Label : 'InternalCancellationDate',
        },
        {
            $Type : 'UI.DataField',
            Value : TitleID,
            Label : 'TitleID',
        },
        {
            $Type : 'UI.DataField',
            Value : Title,
            Label : 'Title',
        },
        {
            $Type : 'UI.DataField',
            Value : StudioID,
            Label : 'StudioID',
        },
        {
            $Type : 'UI.DataField',
            Value : StudioName,
            Label : 'StudioName',
        },
        {
            $Type : 'UI.DataField',
            Value : MasteringFacility,
            Label : 'MasteringFacility',
        },
        {
            $Type : 'UI.DataField',
            Value : RequestedMasteringFacility,
            Label : 'RequestedMasteringFacility',
        },
        {
            $Type : 'UI.DataField',
            Value : PackagingStandard,
            Label : 'PackagingStandard',
        },
        {
            $Type : 'UI.DataField',
            Value : ContentKind,
            Label : 'ContentKind',
        },
        {
            $Type : 'UI.DataField',
            Value : VersionNumber,
            Label : 'VersionNumber',
        },
        {
            $Type : 'UI.DataField',
            Value : VersionDescription,
            Label : 'VersionDescription',
        },
        {
            $Type : 'UI.DataField',
            Value : BaseCompositionReelCount,
            Label : 'BaseCompositionReelCount',
        },
        {
            $Type : 'UI.DataField',
            Value : Branched,
            Label : 'Branched',
        },
        {
            $Type : 'UI.DataField',
            Value : IntendedPackaging,
            Label : 'IntendedPackaging',
        },
        {
            $Type : 'UI.DataField',
            Value : StudioRequestedCTT,
            Label : 'StudioRequestedCTT',
        },
        {
            $Type : 'UI.DataField',
            Value : CTTRecommendedToProduction,
            Label : 'CTTRecommendedToProduction',
        },
        {
            $Type : 'UI.DataField',
            Value : StudioContentID,
            Label : 'StudioContentID',
        },
        {
            $Type : 'UI.DataField',
            Value : StudioContentDescription,
            Label : 'StudioContentDescription',
        },
        {
            $Type : 'UI.DataField',
            Value : HeadTailReels,
            Label : 'HeadTailReels',
        },
        {
            $Type : 'UI.DataField',
            Value : PrecedingSODID,
            Label : 'PrecedingSODID',
        },
        {
            $Type : 'UI.DataField',
            Value : BaseCPLs,
            Label : 'BaseCPLs',
        },
        {
            $Type : 'UI.DataField',
            Value : NotBeforeApproved,
            Label : 'NotBeforeApproved',
        },
        {
            $Type : 'UI.DataField',
            Value : NotBeforeCompleted,
            Label : 'NotBeforeCompleted',
        },
        {
            $Type : 'UI.DataField',
            Value : OVSourceAssetDeliveryDeadline,
            Label : 'OVSourceAssetDeliveryDeadline',
        },
        {
            $Type : 'UI.DataField',
            Value : LVSourceAssetDeliveryDeadline,
            Label : 'LVSourceAssetDeliveryDeadline',
        },
        {
            $Type : 'UI.DataField',
            Value : RequestedMasteringStartDate,
            Label : 'RequestedMasteringStartDate',
        },
        {
            $Type : 'UI.DataField',
            Value : RequestedMasteringEndDate,
            Label : 'RequestedMasteringEndDate',
        },
        {
            $Type : 'UI.DataField',
            Value : RequestedMasteringDeadline,
            Label : 'RequestedMasteringDeadline',
        },
        {
            $Type : 'UI.DataField',
            Value : ReleaseDate,
            Label : 'ReleaseDate',
        },
        {
            $Type : 'UI.DataField',
            Value : createdBy,
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

