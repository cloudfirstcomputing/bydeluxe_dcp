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
                Value : DKDMDeliveryPartnerInfo,
                Label : '{i18n>DkdmDeliveryPartnerInformation}',
            },
            {
                $Type : 'UI.DataField',
                Value : DCPDeliveryPartnerInfo,
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
            Label : 'Material',
            Value : Material,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>InternalOrderStatus1}',
            Value : InternalOrderStatus,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>CreationDate}',
            Value : CreationDate,
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
            Value : TitleID,
            Label : '{i18n>Title}',
        },
        {
            $Type : 'UI.DataField',
            Value : StudioID,
            Label : 'Studio',
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
        }
    ],
);

annotate service.InsertEditDetails with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Image Essence',
            ID : 'ImageEssence',
            Target : '@UI.FieldGroup#ImageEssence',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Audio Essence',
            ID : 'AudioEssence',
            Target : '@UI.FieldGroup#AudioEssence',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Aux Essence',
            ID : 'AuxEssence',
            Target : '@UI.FieldGroup#AuxEssence',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'SubTitle Essence',
            ID : 'SubTitleEssence',
            Target : '@UI.FieldGroup#SubTitleEssence',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Open Caption Essence',
            ID : 'OpenCaptionEssence',
            Target : '@UI.FieldGroup#OpenCaptionEssence',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Closed Caption Essence',
            ID : 'ClosedCaptionEssence',
            Target : '@UI.FieldGroup#ClosedCaptionEssence',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Edit Essence',
            ID : 'EditEssence',
            Target : '@UI.FieldGroup#EditEssence',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Insert Essence',
            ID : 'InsertEssence',
            Target : '@UI.FieldGroup#InsertEssence',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'HTR Essence Group',
            ID : 'HTREssenceGroup',
            Target : '@UI.FieldGroup#HTREssenceGroup',
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
    UI.FieldGroup #ImageEssence : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.ID,
                Label : '{i18n>ImageEssenceId}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.Resolution,
                Label : '{i18n>Resolution}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.AspectRatio,
                Label : '{i18n>AspectRatio}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.ContainerHeight,
                Label : '{i18n>ContainerHeight}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.ContainerWidth,
                Label : '{i18n>ContainerWidth}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.ActivePictureHeight,
                Label : '{i18n>ActivePictureHeight}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.ActivePictureWidth,
                Label : '{i18n>ActivePictureWidth}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.ImageDimension,
                Label : '{i18n>ImageDimension}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.ImageStandard,
                Label : '{i18n>ImageStandard}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.LightLevel,
                Label : '{i18n>LightLevel}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.TargetMaxBitRate,
                Label : '{i18n>TargetMaxBitRate}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.TextedTextless,
                Label : '{i18n>Textedtextless}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.ImageLanguages,
                Label : '{i18n>ImageLanguages}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.LocalisedGFXDeliveryDate,
                Label : '{i18n>LocalisedGfxDfxDelivery}',
            },
            {
                $Type : 'UI.DataField',
                Value : ImageEssence.ImageIngestRequired,
                Label : '{i18n>ImageIngestRequired}',
            },
        ],
    },
    UI.FieldGroup #AudioEssence : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : AudioEssence.ID,
                Label : '{i18n>AudioEssenceId}',
            },
            {
                $Type : 'UI.DataField',
                Value : AudioEssence.AudioChannelConfiguration,
                Label : '{i18n>AudioChannelConfiguration}',
            },
            {
                $Type : 'UI.DataField',
                Value : AudioEssence.AudioChannelCount,
                Label : '{i18n>AudioChannelCount}',
            },
            {
                $Type : 'UI.DataField',
                Value : AudioEssence.AudioLanguage,
                Label : '{i18n>AudioLanguage}',
            },
            {
                $Type : 'UI.DataField',
                Value : AudioEssence.HI,
                Label : '{i18n>HiHearingImpaired}',
            },
            {
                $Type : 'UI.DataField',
                Value : AudioEssence.VI,
                Label : '{i18n>Vi}',
            },
            {
                $Type : 'UI.DataField',
                Value : AudioEssence.AdditionalAudioTracks,
                Label : '{i18n>AdditionalAudioTracks}',
            },
            {
                $Type : 'UI.DataField',
                Value : AudioEssence.AudioDeliveryDate,
                Label : '{i18n>AudioDeliveryDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : AudioEssence.HIDeliveryDate,
                Label : '{i18n>HiDeliveryDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : AudioEssence.VIDeliveryDate,
                Label : '{i18n>ViDeliveryDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : AudioEssence.SLDeliveryDate,
                Label : '{i18n>SlDeliveryDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : AudioEssence.AudioIngestRequired,
                Label : '{i18n>AudioIngestRequired}',
            },
        ],
    },
    UI.FieldGroup #AuxEssence : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : AUXEssence.ID,
                Label : '{i18n>AuxEssenceId}',
            },
            {
                $Type : 'UI.DataField',
                Value : AUXEssence.AUXType,
                Label : '{i18n>AuxType}',
            },
            {
                $Type : 'UI.DataField',
                Value : AUXEssence.AUXLanguages,
                Label : '{i18n>AuxLanguages}',
            },
            {
                $Type : 'UI.DataField',
                Value : AUXEssence.AUXBackup,
                Label : '{i18n>AuxBackup}',
            },
            {
                $Type : 'UI.DataField',
                Value : AUXEssence.AUXIngestRequired,
                Label : '{i18n>AuxIngestRequired}',
            },
        ],
    },
    UI.FieldGroup #SubTitleEssence : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : SubtitleEssence.ID,
                Label : '{i18n>SubtitlesEssenceId}',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleEssence.Subtitles,
                Label : '{i18n>Subtitles}',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleEssence.SubtitleLanguage,
                Label : 'SubtitleLanguage',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleEssence.SubtitleDimension,
                Label : '{i18n>SubtitleDimension}',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleEssence.SubtitleFormat,
                Label : '{i18n>SubtitleFormat}',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleEssence.SubtitleExcludedReels,
                Label : '{i18n>SubtitleExcludedReels}',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleEssence.ForcedNarrative,
                Label : '{i18n>ForcedNarrative}',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleEssence.ForcedNarrativeDetails,
                Label : '{i18n>ForcedNarrativeDetails}',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleEssence.SubtitleDeliveryDate,
                Label : '{i18n>SubtitleDeliveryDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleEssence.ForcedNarrativeSubtitleDeliveryDate,
                Label : '{i18n>ForcedNarrativeSubtitleDelivery}',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleEssence.SubtitleIngestRequired,
                Label : '{i18n>SubtitleIngestRequired}',
            },
        ],
    },
    UI.FieldGroup #OpenCaptionEssence : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : OpenCaptionsEssence.ID,
                Label : '{i18n>OpenCaptionsEssenceId}',
            },
            {
                $Type : 'UI.DataField',
                Value : OpenCaptionsEssence.OpenCaptions,
                Label : 'OpenCaptions',
            },
            {
                $Type : 'UI.DataField',
                Value : OpenCaptionsEssence.OCAPLanguage,
                Label : 'OCAP Language',
            },
            {
                $Type : 'UI.DataField',
                Value : OpenCaptionsEssence.OCAPDimensions,
                Label : '{i18n>Ocapdimensions}',
            },
            {
                $Type : 'UI.DataField',
                Value : OpenCaptionsEssence.OCAPFormat,
                Label : '{i18n>OcapFormat}',
            },
            {
                $Type : 'UI.DataField',
                Value : OpenCaptionsEssence.OCAPExcludedReels,
                Label : '{i18n>OcapExcludedReels}',
            },
            {
                $Type : 'UI.DataField',
                Value : OpenCaptionsEssence.OCAPDeliveryDate,
                Label : '{i18n>OcapDeliveryDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : OpenCaptionsEssence.OCAPIngestRequired,
                Label : '{i18n>OcapIngestRequired}',
            },
        ],
    },
    UI.FieldGroup #ClosedCaptionEssence : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ClosedCaptionsEssence.ID,
                Label : '{i18n>ClosedCaptionsEssenceId}',
            },
            {
                $Type : 'UI.DataField',
                Value : ClosedCaptionsEssence.ClosedCaptions,
                Label : '{i18n>ClosedCaptions}',
            },
            {
                $Type : 'UI.DataField',
                Value : ClosedCaptionsEssence.CCAPLanguage,
                Label : '{i18n>CcapLanguage}',
            },
            {
                $Type : 'UI.DataField',
                Value : ClosedCaptionsEssence.CCAPFormat,
                Label : '{i18n>CcapFormat}',
            },
            {
                $Type : 'UI.DataField',
                Value : ClosedCaptionsEssence.CCAPExcludedReels,
                Label : '{i18n>CcapExcludedReels}',
            },
            {
                $Type : 'UI.DataField',
                Value : ClosedCaptionsEssence.CCAPDeliveryDate,
                Label : '{i18n>CcapDeliveryDate}',
            },
            {
                $Type : 'UI.DataField',
                Value : ClosedCaptionsEssence.CCAPIngestRequired,
                Label : '{i18n>CcapIngestRequired}',
            },
        ],
    },
    UI.FieldGroup #EditEssence : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : EditEssenceID,
                Label : '{i18n>EditEssenceId}',
            },
            {
                $Type : 'UI.DataField',
                Value : Edits,
                Label : 'Edits',
            },
            {
                $Type : 'UI.DataField',
                Value : EstimatedEditCount,
                Label : '{i18n>EstimatedEditCount}',
            },
        ],
    },
    UI.FieldGroup #HTREssenceGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : HTREssence.HeadTailReels,
                Label : '{i18n>HeadTailReels}',
            },
            {
                $Type : 'UI.DataField',
                Value : HTREssence.HLTDeliveryDate,
                Label : '{i18n>HltsDeliveryDate}',
            },
        ],
    },
    UI.FieldGroup #InsertEssence : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : InsertEssenceID,
                Label : '{i18n>InsertEssenceId}',
            },
            {
                $Type : 'UI.DataField',
                Value : Inserts,
                Label : '{i18n>Inserts}',
            },
            {
                $Type : 'UI.DataField',
                Value : EstimatedInsertCount,
                Label : '{i18n>EstimatedInsertCount}',
            },
        ],
    },
);

annotate service.PartnerDetails with @(
    UI.LineItem #Partner : [
        {
            $Type : 'UI.DataField',
            Value : StudioID,
            Label : '{i18n>StudioId}',
        },
    ]
);

annotate service.MasteringHubMain with {
    TitleID @Common.Text : Title
};

annotate service.MasteringHubMain with {
    StudioID @Common.Text : StudioName
};

