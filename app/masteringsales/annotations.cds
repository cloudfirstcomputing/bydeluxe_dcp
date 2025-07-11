using MasteringService as service from '../../srv/mast-service';
annotate service.MasteringHubMain with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : '{i18n>SalesorderNumber}',
                Value : SalesOrderNumber,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>LineItem}',
                Value : LineItem,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Material}',
                Value : Material,
            },
            {
                $Type : 'UI.DataField',
                Value : InternalOrderStatus,
                Label : '{i18n>InternalOrderStatus}',
            },
            {
                $Type : 'UI.DataField',
                Value : CreationDate,
                Label : '{i18n>CreationDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : InternalLastModifiedDate,
                Label : '{i18n>InternalLastModifiedDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : InternalCancellationDate,
                Label : '{i18n>InternalCancellationDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : CustomerOrderStatus,
                Label : '{i18n>CustomerOrderStatus}',
            },
            {
                $Type : 'UI.DataField',
                Value : CustomerLastModifiedDate,
                Label : '{i18n>CustomerLastModifiedDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : CustomerCancellationDate,
                Label : '{i18n>CustomerCancellationDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : TitleID,
                Label : '{i18n>Title}',
            },
            {
                $Type : 'UI.DataField',
                Value : StudioID,
                Label : '{i18n>Studio}',
            },
            {
                $Type : 'UI.DataField',
                Value : MasteringFacility,
                Label : '{i18n>MasteringFacility}',
            },
            {
                $Type : 'UI.DataField',
                Value : RequestedMasteringFacility,
                Label : '{i18n>RequestedMasteringFacilityorganization}',
            },
            {
                $Type : 'UI.DataField',
                Value : PackagingStandard,
                Label : '{i18n>PackagingStandard}',
            },
            {
                $Type : 'UI.DataField',
                Value : ContentKind,
                Label : '{i18n>Contentkind}',
            },
            {
                $Type : 'UI.DataField',
                Value : VersionNumber,
                Label : '{i18n>VersionNumber}',
            },
            {
                $Type : 'UI.DataField',
                Value : ContentTypeModifiers,
                Label : '{i18n>ContentTypeModifiers}',
            },
            {
                $Type : 'UI.DataField',
                Value : IntendedPrimaryTerritory,
                Label : '{i18n>IntendedPrimaryTerritory}',
            },
            {
                $Type : 'UI.DataField',
                Value : IntendedSecondaryTerritory,
                Label : '{i18n>IntendedSecondaryTerritory}',
            },
            {
                $Type : 'UI.DataField',
                Value : Rating,
                Label : '{i18n>Rating}',
            },
            {
                $Type : 'UI.DataField',
                Value : Encrypted,
                Label : '{i18n>Encrypted}',
            },
            {
                $Type : 'UI.DataField',
                Value : VersionType,
                Label : '{i18n>VersionType}',
            },
            {
                $Type : 'UI.DataField',
                Value : VersionDescription,
                Label : '{i18n>VersionDescription}',
            },
            {
                $Type : 'UI.DataField',
                Value : BaseCompositionReelCount,
                Label : '{i18n>Basecompositionreelcount}',
            },
            {
                $Type : 'UI.DataField',
                Value : Branched,
                Label : '{i18n>Branched}',
            },
            {
                $Type : 'UI.DataField',
                Value : IntendedPackaging,
                Label : '{i18n>IntendedPackaging}',
            },
            {
                $Type : 'UI.DataField',
                Value : StudioRequestedCTT,
                Label : '{i18n>StudioRequestedCtt}',
            },
            {
                $Type : 'UI.DataField',
                Value : CTTRecommendedToProduction,
                Label : '{i18n>CttRecommendedToProduction}',
            },
            {
                $Type : 'UI.DataField',
                Value : StudioContentID,
                Label : '{i18n>Studiocontentid}',
            },
            {
                $Type : 'UI.DataField',
                Value : StudioContentDescription,
                Label : '{i18n>StudioContentDescription}',
            },
            {
                $Type : 'UI.DataField',
                Value : HeadTailReels,
                Label : '{i18n>Headtailreels}',
            },
            {
                $Type : 'UI.DataField',
                Value : PrecedingSODID,
                Label : '{i18n>PrecedingDocument}',
            },
            {
                $Type : 'UI.DataField',
                Value : BaseCPLs,
                Label : '{i18n>BaseCpls}',
            },
            {
                $Type : 'UI.DataField',
                Value : NotBeforeApproved,
                Label : '{i18n>NotbeforeApproved}',
            },
            {
                $Type : 'UI.DataField',
                Value : NotBeforeCompleted,
                Label : '{i18n>Notbeforecompleted}',
            },
            {
                $Type : 'UI.DataField',
                Value : OVSourceAssetDeliveryDeadline,
                Label : '{i18n>OvSourceAssetDelivery}',
            },
            {
                $Type : 'UI.DataField',
                Value : LVSourceAssetDeliveryDeadline,
                Label : '{i18n>LvSourceAssetDelivery}',
            },
            {
                $Type : 'UI.DataField',
                Value : RequestedMasteringStartDate,
                Label : '{i18n>RequestedMasteringStartDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : RequestedMasteringEndDate,
                Label : '{i18n>RequestedMasteringEndDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : RequestedMasteringDeadline,
                Label : '{i18n>RequestedMasteringDeadline}',
            },
            {
                $Type : 'UI.DataField',
                Value : ReleaseDate,
                Label : '{i18n>ReleaseDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : createdBy,
                Label : '{i18n>CreatedBy}',
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedBy,
                Label : '{i18n>ChangedBy}',
            },
            {
                $Type : 'UI.DataField',
                Value : insertEdit.GeneralOrderNotes,
                Label : '{i18n>GeneralOrderNotes}',
            },
            {
                $Type : 'UI.DataField',
                Value : insertEdit.LocalApprovalStatus,
                Label : '{i18n>LocalApprovalStatus}',
            },
            {
                $Type : 'UI.DataField',
                Value : insertEdit.Translator,
                Label : '{i18n>Translator}',
            },
            {
                $Type : 'UI.DataField',
                Value : partner.DKDMDeliveryPartnerInfo,
                Label : '{i18n>DkdmDeliveryPartnerInformation}',
            },
            {
                $Type : 'UI.DataField',
                Value : partner.DCPDeliveryPartnerInfo,
                Label : '{i18n>DcpDeliveryPartnerInformation}',
            },
            {
                $Type : 'UI.DataField',
                Value : Stereography,
                Label : '{i18n>Stereography}',
            },
            {
                $Type : 'UI.DataField',
                Value : ClientQC,
                Label : '{i18n>ClientQc}',
            },
            {
                $Type : 'UI.DataField',
                Value : QTOutputs,
                Label : '{i18n>QtOutputs}',
            },
            {
                $Type : 'UI.DataField',
                Value : DFX,
                Label : '{i18n>Dfx}',
            },
            {
                $Type : 'UI.DataField',
                Value : ProductionOrderNumber,
                Label : '{i18n>ProductionOrderNumber}',
            },
            {
                $Type : 'UI.DataField',
                Value : CTTFinal,
                Label : '{i18n>CttFinal}',
            },
            {
                $Type : 'UI.DataField',
                Value : CPL_UUID,
                Label : 'CPL_UUID',
            },
            {
                $Type : 'UI.DataField',
                Value : AVID_CPL,
                Label : '{i18n>AvidcplAssetVaultId}',
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
            Value : parent.LineItem,
            Label : '{i18n>LineItem}',
        },
        {
            $Type : 'UI.DataField',
            Value : FrameRate,
            Label : '{i18n>FrameRate}',
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

annotate service.MasteringHubMain with {
    TitleID @Common.Text : Title
};

annotate service.MasteringHubMain with {
    StudioID @Common.Text : StudioName
};

