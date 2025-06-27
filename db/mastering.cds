using {
  managed,
  cuid,
} from '@sap/cds/common';
using from '@sap/cds-common-content';
using api from './common';

namespace deluxe.mastering;

entity CPLSalesOrders : cuid {
  SalesOrderNumber                    : Integer;
  LineItem                            : Integer;
  Material                            : String(40);
  OrderStatus                         : String(20);
  TitleID                             : String(40);
  Studio                              : Association to one api.BusinessPartners;
  MasteringFacility                   : String(4);
  RequestedMasteringFacility          : String(4);
  PackagingStandard                   : String(20);
  ContentKind                         : String(3);
  ContentTypeModifiers                : String(100);
  IntendedPrimaryTerritory            : String(3);
  IntendedSecondaryTerritory          : String(500);
  Rating                              : String(400);
  Encrypted                           : Boolean;
  VersionNumber                       : String(10);
  VersionType                         : String(4) enum {
    OV;
    VF
  };
  VersionDescription                  : String(100);
  BaseCompositionReelCount            : Integer @assert.range: [
    1,
    100
  ];
  Branched                            : Boolean;
  IntendedPackaging                   : String(100);
  CTTConvention                       : String(800);
  StudioContentID                     : String(20);
  HeadTailReels                       : Boolean;
  PrecedingSODID                      : String(10);
  BaseCPL                             : String(200);
  NotbeforeApproved                   : String(40);
  NotbeforeCompleted                  : String(40);
  ImageEssence                        : Association to one EssenceGroup;
  Resolution                          : String(2);
  AspectRatio                         : String(12);
  AudioEssence                        : Association to one EssenceGroup;
  HearingImpairedEnhancedAudio        : Boolean;
  VisuallyImpairedDescriptiveAudio    : Boolean;
  AdditionalAudioTracks               : String(100);
  AUXBackup                           : Boolean;
  AUXEssence                          : Association to one EssenceGroup;
  AUXLanguage                         : String(20);
  SubtitlesEssence                    : Association to one EssenceGroup;
  Subtitles                           : String(12);
  SubtitleExcludedReels               : String(100);
  OpenCaptionsEssence                 : Association to one EssenceGroup;
  OpenCaptions                        : String(12);
  OCAPExcludedReels                   : String(100);
  ClosedCaptionsEssence               : Association to one EssenceGroup;
  ClosedCaptions                      : String(12);
  CCAPExcludedReels                   : String(100);
  EditEssence                         : Association to one InsertEditGroup;
  Edits                               : Boolean;
  InsertEssence                       : Association to one InsertEditGroup;
  Inserts                             : Boolean;
  GeneralOrderNotes                   : String(2000);
  LocalApprovalStatus                 : String(12);
  Translator                          : String(20);
  AudioDeliveryDate                   : DateTime;
  SubtitleDeliveryDate                : DateTime;
  ForcedNarrativeSubtitleDeliveryDate : DateTime;
  LocalisedGFXDeliveryDate            : DateTime;
  OCAPDeliveryDate                    : DateTime;
  CCAPDeliveryDate                    : DateTime;
  HIDeliveryDate                      : DateTime;
  VIDeliveryDate                      : DateTime;
  SLDeliveryDate                      : DateTime;
  HLTDeliveryDate                     : DateTime;
  OVSourceAssetDeliveryDeadline       : DateTime;
  LVSourceAssetDeliveryDeadline       : DateTime;
  RequestedMasteringStartDate         : DateTime;
  RequestedMasteringEndDate           : DateTime;
  RequestedMasteringDeadline          : DateTime;
  ReleaseDate                         : Date;
  DKDMDeliveryPartnerInformation      : String(40);
  DCPDeliveryPartnerInformation       : String(40);
  AVID_CPL                            : String(20);
  CTT                                 : String(128);
  CPL_UUID                            : String(40);
  ImageIngestRequired                 : Boolean;
  AudioIngestRequired                 : Boolean;
  AUXIngestRequired                   : Boolean;
  SubtitleIngestRequired              : Boolean;
  OCAPIngestRequired                  : Boolean;
  CCAPIngestRequired                  : Boolean;
  Stereography                        : Boolean;
  ClientQC                            : Boolean;
  QToutput                            : Integer @assert.range: [
    0,
    9999
  ];
  ProductionOrderNumber               : Integer;
}

entity EssenceGroup : managed {
  key ID                           : String(8) @assert.format: '^[A-Za-z0-9]+$';
      EssenceType                  : String(20);
      EssenceSubType               : String(100);
      ContainerHeight              : Integer;
      ContainerWidth               : Integer;
      ActivePictureHeigth          : Integer;
      ActivePictureWidth           : Integer;
      ImageDimension               : String(2);
      ImageStandard                : String(20);
      LightLevel                   : String(20);
      FrameRate                    : Decimal;
      TargetMaxBitRate             : Decimal;
      TextedTextless               : String(20);
      ImageLanguage                : String(100);
      AudioChannelConfiguration    : String(20);
      AudioChannelCount            : Integer   @assert.range : [
        1,
        16
      ];
      AudioLanguage                : String(20);
      AUXType                      : String(12);
      ForcedNarrative              : Boolean;
      ForcedNarrativeDetails       : String(1000);
      SubtitleDimension            : String(2);
      SubtitleFormat               : String(10);
      OCAPLanguage                 : String(20);
      OCAPDimensions               : String(2);
      OCAPFormat                   : String(10);
      CCAPLanguage                 : String(20);
      CCAPFormat                   : String(10);
      Component_Essence_Group_ID_1 : String(8);
      Component_Essence_Group_ID_2 : String(8);
      Component_Essence_Group_ID_3 : String(8);
      Component_Essence_Group_ID_4 : String(8);
      Component_Essence_Group_ID_5 : String(8);
      Component_Essence_Group_ID_6 : String(8);
      Source_Create_Receive        : String(2000);
      IOP_MXF_Create_Receive       : String(2000);
      SMPTE_MXF_Create_Receive     : String(2000);
      SupplyingVendor              : Association to one api.BusinessPartners;
      IOP_CPL                      : String(40);
      SMTPE_CPL                    : String(40);
      _Reels                       : Composition of many Reels
                                       on _Reels.parent = $self;
}

entity Reels {
  key parent       : Association to EssenceGroup;
  key ID           : Integer;
      AV_Source    : String(20);
      AV_WAV_Group : String(20);
      AV_IOP_MXF   : String(20);
      AV_SMPTE_MXF : String(20);
}

entity InsertEditGroup : managed {
  key ID                       : String(8);
      Type                     : String(1) enum {
        Insert = 'I';
        Edit   = 'E'
      };
      SubType                  : String(100);
      EstimateInsertCount      : Integer;
      EstimatedEditCount       : Integer;
      GroupStatus              : String(12);
      Source_Create_Receive    : String(2000);
      IOP_MXF_Create_Receive   : String(2000);
      SMPTE_MXF_Create_Receive : String(2000);
      BP                       : Association to one api.BusinessPartners;
      IOP_CPL                  : String(40);
      SMTPE_CPL                : String(40);
      _Items                   : Composition of many InsertEditItem
                                   on _Items.parent = $self
}

entity InsertEditItem {
  key parent      : Association to InsertEditGroup;
  key ID          : Integer;
      Type        : String(20);
      Timecode    : String(12);
      MergeMethod : String(20);
      AV_Source   : String(20);
      AV_Proof    : String(20);
      AV_Final    : String(20);
}

entity HeadTailReels {
  key Position         : String(10);
  key PositionSequence : Integer;
      _SalesOrder      : Association to one CPLSalesOrders
}



entity CPLSalesOrdersMaster {
  SalesOrderNumber                 : Integer;
  LineItemNumber                  : Integer;
  Material                        : String(40);
  InternalOrderStatus            : String(20);
  CreationDate                   : Timestamp;
  InternalLastModifiedDate      : Timestamp;
  InternalCancellationDate      : Timestamp;
  CustomerOrderStatus           : String(20);
  CustomerLastModifiedDate      : Timestamp;
  CustomerCancellationDate      : Timestamp;
  TitleID                        : String(40);
  Title                          : String(200);
  StudioID                       : Integer;
  StudioName                     : String(40);
  MasteringFacility             : String(4);
  RequestedMasteringFacility     : String(4);
  PackagingStandard              : String(20);
  ContentKind                    : String(3);
  VersionNumber                  : String(10);
  ContentTypeModifiers           : String(100);
  IntendedPrimaryTerritory       : String(3);
  IntendedSecondaryTerritory     : String(500);
  Rating                         : String(400);
  Encrypted                      : String(4);
  VersionType                    : String(4);
  VersionDescription             : String(100);
  BaseCompositionReelCount       : Integer;
  Branched                       : String(10);
  IntendedPackaging              : String(100);
  StudioRequestedCTT             : String(800);
  CTTRecommendedToProduction     : String(800);
  StudioContentID                : String(100);
  StudioContentDescription       : String(800);
  HeadTailReels                  : String(3);
  PrecedingSODID                 : String(10);
  BaseCPLs                       : String(200);
  NotBeforeApproved              : String(40);
  NotBeforeCompleted             : String(40);
  ImageEssenceId                 : String(8);
  Resolution                     : String(2);
  AspectRatio                    : String(12);
  ContainerHeight                : Integer;
  ContainerWidth                 : Integer;
  ActivePictureHeight            : Integer;
  ActivePictureWidth             : Integer;
  ImageDimension                 : String(2);
  ImageStandard                  : String(20);
  LightLevel                     : String(20);
  FrameRate                      : Decimal(8,3);
  TargetMaxBitRate               : Decimal(8,3);
  TextedTextless                 : String(20);
  ImageLanguages                 : String(100);
  AudioEssenceId                 : String(8);
  AudioChannelConfiguration      : String(20);
  AudioChannelCount              : Integer;
  AudioLanguage                  : String(200);
  HIEnhancedAudio                : String(4);
  VIDescriptiveAudio             : String(4);
  AdditionalAudioTracks          : String(100);
  AUXEssenceId                   : String(8);
  AUXType                        : String(12);
  AUXLanguages                   : String(20);
  AUXBackup                      : String(4);
  SubtitlesEssenceId             : String(8);
  Subtitles                      : String(12);
  SubtitleLanguage               : String(20);
  SubtitleDimension              : String(2);
  SubtitleFormat                 : String(10);
  SubtitleExcludedReels         : Integer;
  ForcedNarrative                : String(4);
  ForcedNarrativeDetails         : String(1000);
  OpenCaptionsEssenceId          : String(8);
  OpenCaptions                   : String(12);
  OCAPLanguage                   : String(20);
  OCAPDimensions                 : String(2);
  OCAPFormat                     : String(10);
  OCAPExcludedReels              : Integer;
  ClosedCaptionsEssenceId        : String(8);
  ClosedCaptions                 : String(4);
  CCAPLanguage                   : String(20);
  CCAPFormat                     : String(10);
  CCAPExcludedReels              : Integer;
  EditEssenceID                  : String(8);
  Edits                          : String(3);
  EstimatedEditCount             : Integer;
  InsertEssenceID                : String(8);
  Inserts                        : String(3);
  EstimatedInsertCount           : Integer;
  GeneralOrderNotes              : String(2000);
  LocalApprovalStatus            : String(12);
  Translator                     : String(20);
  AudioDeliveryDate              : Timestamp;
  SubtitleDeliveryDate           : Timestamp;
  ForcedNarrativeSubtitleDeliveryDate : Timestamp;
  LocalisedGFXDeliveryDate       : Timestamp;
  OCAPDeliveryDate               : Timestamp;
  CCAPDeliveryDate               : Timestamp;
  HIDeliveryDate                 : Timestamp;
  VIDeliveryDate                 : Timestamp;
  SLDeliveryDate                 : Timestamp;
  HLT_S_DeliveryDate             : Timestamp;
  OVSourceAssetDeliveryDeadline : Timestamp;
  LVSourceAssetDeliveryDeadline : Timestamp;
  RequestedMasteringStartDate    : Timestamp;
  RequestedMasteringEndDate      : Timestamp;
  RequestedMasteringDeadline     : Timestamp;
  ReleaseDate                    : Date;
  DKDMDPartnerInfo               : String(40);
  DCPDeliveryPartnerInfo         : String(40);
  AVID_CPL                       : String(20);
  CTTFinal                       : String(128);
  CPL_UUID                       : String(40);
  ImageIngestRequired            : String(8);
  AudioIngestRequired            : String(8);
  AUXIngestRequired              : String(8);
  SubtitleIngestRequired         : String(8);
  OCAPIngestRequired             : String(8);
  CCAPIngestRequired             : String(8);
  Stereography                   : String(8);
  ClientQC                       : String(8);
  QTOutputs                      : Integer;
  DFX                            : String(8);
  ProductionOrderNumber          : Integer;
}
