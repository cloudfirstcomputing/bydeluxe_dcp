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
                Label : 'InternalLastModifiedDate',
                Value : InternalLastModifiedDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'InternalCancellationDate',
                Value : InternalCancellationDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CustomerOrderStatus',
                Value : CustomerOrderStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CustomerLastModifiedDate',
                Value : CustomerLastModifiedDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CustomerCancellationDate',
                Value : CustomerCancellationDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'TitleID',
                Value : TitleID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Title',
                Value : Title,
            },
            {
                $Type : 'UI.DataField',
                Label : 'StudioID',
                Value : StudioID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'StudioName',
                Value : StudioName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'MasteringFacility',
                Value : MasteringFacility,
            },
            {
                $Type : 'UI.DataField',
                Label : 'RequestedMasteringFacility',
                Value : RequestedMasteringFacility,
            },
            {
                $Type : 'UI.DataField',
                Label : 'PackagingStandard',
                Value : PackagingStandard,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ContentKind',
                Value : ContentKind,
            },
            {
                $Type : 'UI.DataField',
                Label : 'VersionNumber',
                Value : VersionNumber,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ContentTypeModifiers',
                Value : ContentTypeModifiers,
            },
            {
                $Type : 'UI.DataField',
                Label : 'IntendedPrimaryTerritory',
                Value : IntendedPrimaryTerritory,
            },
            {
                $Type : 'UI.DataField',
                Label : 'IntendedSecondaryTerritory',
                Value : IntendedSecondaryTerritory,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Rating',
                Value : Rating,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Encrypted',
                Value : Encrypted,
            },
            {
                $Type : 'UI.DataField',
                Label : 'VersionType',
                Value : VersionType,
            },
            {
                $Type : 'UI.DataField',
                Label : 'VersionDescription',
                Value : VersionDescription,
            },
            {
                $Type : 'UI.DataField',
                Label : 'BaseCompositionReelCount',
                Value : BaseCompositionReelCount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Branched',
                Value : Branched,
            },
            {
                $Type : 'UI.DataField',
                Label : 'IntendedPackaging',
                Value : IntendedPackaging,
            },
            {
                $Type : 'UI.DataField',
                Label : 'StudioRequestedCTT',
                Value : StudioRequestedCTT,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CTTRecommendedToProduction',
                Value : CTTRecommendedToProduction,
            },
            {
                $Type : 'UI.DataField',
                Label : 'StudioContentID',
                Value : StudioContentID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'StudioContentDescription',
                Value : StudioContentDescription,
            },
            {
                $Type : 'UI.DataField',
                Label : 'HeadTailReels',
                Value : HeadTailReels,
            },
            {
                $Type : 'UI.DataField',
                Label : 'PrecedingSODID',
                Value : PrecedingSODID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'BaseCPLs',
                Value : BaseCPLs,
            },
            {
                $Type : 'UI.DataField',
                Label : 'NotBeforeApproved',
                Value : NotBeforeApproved,
            },
            {
                $Type : 'UI.DataField',
                Label : 'NotBeforeCompleted',
                Value : NotBeforeCompleted,
            },
            {
                $Type : 'UI.DataField',
                Label : 'OVSourceAssetDeliveryDeadline',
                Value : OVSourceAssetDeliveryDeadline,
            },
            {
                $Type : 'UI.DataField',
                Label : 'LVSourceAssetDeliveryDeadline',
                Value : LVSourceAssetDeliveryDeadline,
            },
            {
                $Type : 'UI.DataField',
                Label : 'RequestedMasteringStartDate',
                Value : RequestedMasteringStartDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'RequestedMasteringEndDate',
                Value : RequestedMasteringEndDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'RequestedMasteringDeadline',
                Value : RequestedMasteringDeadline,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ReleaseDate',
                Value : ReleaseDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'AVID_CPL',
                Value : AVID_CPL,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CTTFinal',
                Value : CTTFinal,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CPL_UUID',
                Value : CPL_UUID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Stereography',
                Value : Stereography,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ClientQC',
                Value : ClientQC,
            },
            {
                $Type : 'UI.DataField',
                Label : 'QTOutputs',
                Value : QTOutputs,
            },
            {
                $Type : 'UI.DataField',
                Label : 'DFX',
                Value : DFX,
            },
            {
                $Type : 'UI.DataField',
                Label : 'ProductionOrderNumber',
                Value : ProductionOrderNumber,
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

