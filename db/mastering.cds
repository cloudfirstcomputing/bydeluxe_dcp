using {Country} from '@sap/cds/common';
using from '@sap/cds-common-content';

namespace deluxe.mastering;

entity SalesOrders {
  key ID                                  : Integer;
  key LineItem                            : Integer;
      TitleID                             : String(40) @assert.format: '^[A-Za-z0-9]+$';
      StudioID                            : String(10) @assert.format: '^[A-Za-z0-9]+$';
      StudioName                          : String(40);
      OrderStatus                         : String(14);
      TitleName                           : String(40);
      IntendedPrimaryTerritory            : String(2);
      IntendedSecondaryTerritory          : String(2);
      MasteringFacility                   : String(4);
      Rating                              : String(8);
      Encrypted                           : String(12);
      ReelCount                           : Integer    @assert.range : [
        0,
        999
      ];
      Branched                            : Boolean;
      IntendedPackaging                   : String enum {
        Full;
        Partial
      };
      PackagingStandard                   : String(12);
      ContentKind                         : String(5);
      ContentTypeModifiers                : String(10);
      VersionNumber                       : String(10);
      VersionType                         : String(2) enum {
        OV;
        VF
      };
      VersionDescription                  : String(40);
      BaseCPL                             : String(40);
      NotbeforeApproved                   : String(12);
      ContainerResolution                 : String(2);
      ActivePictureResolution             : String(12);
      ImageDimension                      : String(2);
      ImageStandard                       : String(18);
      LightLevel                          : String(10);
      FrameRate                           : Integer    @assert.range : [
        0,
        99
      ];
      TargetMaxBitRate                    : Integer    @assert.range : [
        0,
        9999
      ];
      TextedTextless                      : String(12);
      AspectRatio                         : String(10);
      AudioLanguage                       : String(2);
      AudioChannelConfiguration           : Decimal(4, 1);
      AudioChannelCount                   : Integer    @assert.range : [
        0,
        9999
      ];
      AUXBackup                           : Boolean;
      AUXType                             : String(10);
      AdditionalAudioTracks               : String(8);
      Subtitles                           : String(8);
      SubtitleLanguage                    : String(2);
      ForcedNarrative                     : String(8);
      SubtitleDimension                   : String(2);
      SubtitleFormat                      : String(4);
      SubtitleExcludedReels               : Integer    @assert.range : [
        0,
        9999
      ];
      HearingImpairedEnhancedAudio        : Boolean;
      VisuallyImpairedDescriptiveAudio    : Boolean;
      OpenCaptions                        : String(12);
      OCAPDimensions                      : String(2);
      OCAPFormat                          : String(4);
      OCAPLanguage                        : String(2);
      OCAPExcludedReels                   : Integer    @assert.range : [
        0,
        9999
      ];
      ClosedCaptions                      : String(12);
      CCAPFormat                          : String(4);
      CCAPLanguage                        : String(2);
      CCAPExcludedReels                   : Integer    @assert.range : [
        0,
        9999
      ];
      CensorEditsCut                      : Boolean;
      EditID                              : String(12);
      HTReelID                            : String(12);
      InsertID                            : String(12);
      RequestedMasteringFacility          : String(18);
      ForcedNarrativeSubtitleDeliveryDate : Date;
      LocalisedGFXDeliveryDate            : Date;
      HIDeliveryDate                      : Date;
      VIDeliveryDate                      : Date;
      SLDeliveryDate                      : Date;
      HLTDeliveryDate                     : Date;
      OVSourceAssetDeliveryDeadline       : Date;
      LVSourceAssetDeliveryDeadline       : Date;
      MasteringStartDate                  : Date;
      MasteringEndDate                    : Date;
      MasteringDeadline                   : Date;
      ReleaseDate                         : Date;
      BusinessPartnerDKDM                 : String(40);
      BusinessPartnerDCP                  : String(40);
      StudioContentID                     : String(18) @assert.format: '^[A-Za-z0-9]+$';
      CTT                                 : String(128);
      UUID                                : String(40);
      Comments                            : String(64);
      ImageEssence                        : Association to ImageEssence;
      AudioEssence                        : Association to AudioEssence;
      AUXEssence                          : Association to AUXEssence;
      SubtitlesEssence                    : Association to SubtitleEssence;
      OpenCaptionsEssence                 : Association to OCAPEssence;
      ClosedCaptionsEssence               : Association to CCAPEssence;
      CensorEdits                         : String(8)  @assert.format: '^[A-Za-z0-9]+$';
      DFXInserts                          : String(8)  @assert.format: '^[A-Za-z0-9]+$';
      Stereography                        : Boolean;
      ClientQC                            : Boolean;
      QToutput                            : Boolean;
      ProductionOrderNumber               : Integer;
}

entity ImageEssence {
  key ID                      : String(8) @assert.format: '^[A-Za-z0-9]+$';
      TitleID                 : String(40);
      ContainerResolution     : String(2);
      ActivePictureResolution : String(12);
      ImageDimension          : String(2);
      ImageStandard           : String(18);
      LightLevel              : String(10);
      FrameRate               : Integer   @assert.range : [
        0,
        99
      ];
      TargetMaxBitRate        : Integer   @assert.range : [
        0,
        9999
      ];
      TextedTextless          : String(12);
      DCDM_Received           : Date;
      IOP_MXF_Received        : Date;
      SMPTE_MXF_Received      : Date;
      BPNumber                : String(10);
      IOP_CPL                 : String(50);
      SMPTE_CPL               : String(50);
      Reels                   : Composition of many ImageReels
                                  on Reels.parent = $self;
}

entity ImageReels {
  key parent       : Association to ImageEssence;
  key ID           : String(40);
      ImageReel    : String(40);
      AV_Source    : String(40);
      AV_IOP_MXF   : String(40);
      AV_SMPTE_MXF : String(40);

}

entity AudioEssence {
  key ID                        : String(8) @assert.format: '^[A-Za-z0-9]+$';
      TitleID                   : String(40);
      AudioEssenceType          : String(12);
      AudioLanguage             : String(2);
      AudioChannelConfiguration : Integer   @assert.range : [
        0,
        9999
      ];
      AudioChannelCount         : Integer   @assert.range : [
        0,
        9999
      ];
      WAV_Received              : Date;
      IOP_MXF_Received          : Date;
      SMPTE_MXF_Received        : Date;
      BPNumber                  : String(10);
      IOP_CPL                   : String(50);
      SMPTE_CPL                 : String(50);
      Reels                     : Composition of many AudioReels
                                    on Reels.parent = $self;
}

entity AudioReels {
  key parent       : Association to AudioEssence;
  key ID           : String(40);
      AudioReel    : String(40);
      AV_Source    : String(40);
      AV_WAV_Group : String(40);
      AV_IOP_MXF   : String(40);
      AV_SMPTE_MXF : String(40);
}

entity AUXEssence {
  key ID                 : String(8) @assert.format: '^[A-Za-z0-9]+$';
      TitleID            : String(40);
      AUXType            : String(10);
      SMPTE_MXF_Received : Date;
      BPNumber           : String(10);
      SMPTE_CPL          : String(50);
      Reels              : Composition of many AUXReels
                             on Reels.parent = $self;
}

entity AUXReels {
  key parent       : Association to AUXEssence;
  key ID           : String(40);
      AUXReel      : String(40);
      AV_Source    : String(40);
      AV_SMPTE_MXF : String(40);
}

entity SubtitleEssence {
  key ID                 : String(8) @assert.format: '^[A-Za-z0-9]+$';
      TitleID            : String(40);
      SubtitleLanguage   : String(2);
      ForcedNarrative    : String(8);
      SubtitleDimension  : String(2);
      SubtitleFormat     : String(4);
      Subtitles_Received : Date;
      IOP_MXF_Received   : Date;
      SMPTE_MXF_Received : Date;
      BPNumber           : String(10);
      IOP_CPL            : String(50);
      SMPTE_CPL          : String(50);
      Reels              : Composition of many SubtitleReels
                             on Reels.parent = $self;
}

entity SubtitleReels {
  key parent       : Association to SubtitleEssence;
  key ID           : String(40);
      SubtitleReel : String(40);
      AV_Source    : String(40);
      AV_IOP_MXF   : String(40);
      AV_SMPTE_MXF : String(40);
}

entity OCAPEssence {
  key ID                 : String(8) @assert.format: '^[A-Za-z0-9]+$';
      TitleID            : String(40);
      OCAPDimensions     : String(2);
      OCAPFormat         : String(4);
      OCAPLanguage       : String(2);
      OCAPExcludedReels  : Integer   @assert.range : [
        0,
        9999
      ];
      OCAP_Received      : Date;
      IOP_MXF_Received   : Date;
      SMPTE_MXF_Received : Date;
      BPNumber           : String(10);
      IOP_CPL            : String(50);
      SMPTE_CPL          : String(50);
      Reels              : Composition of many OCAPReels
                             on Reels.parent = $self;
}

entity OCAPReels {
  key parent       : Association to OCAPEssence;
  key ID           : String(40);
      OCAPReel     : String(40);
      AV_Source    : String(40);
      AV_IOP_MXF   : String(40);
      AV_SMPTE_MXF : String(40);
}

entity CCAPEssence {
  key ID                 : String(8) @assert.format: '^[A-Za-z0-9]+$';
      TitleID            : String(40);
      OCAPDimensions     : String(2);
      OCAPFormat         : String(4);
      OCAPLanguage       : String(2);
      OCAPExcludedReels  : Integer   @assert.range : [
        0,
        9999
      ];
      OCAP_Received      : Date;
      IOP_MXF_Received   : Date;
      SMPTE_MXF_Received : Date;
      BPNumber           : String(10);
      IOP_CPL            : String(50);
      SMPTE_CPL          : String(50);
      Reels              : Composition of many CCAPReels
                             on Reels.parent = $self;
}

entity CCAPReels {
  key parent       : Association to CCAPEssence;
  key ID           : String(40);
      CCAPReel     : String(40);
      AV_Source    : String(40);
      AV_IOP_MXF   : String(40);
      AV_SMPTE_MXF : String(40);
}

entity HeadTailReels {
  key HTReelID       : String(40);
  key SO             : Integer;
  key LineItem       : Integer;
      HeadTail_Order : String(18);
      Type           : String(18);
}

entity Edits {
  key EditID   : String(40);
  key SO       : Integer;
  key LineItem : Integer;
      Edit     : String(18);
      Type     : String(18);
      TimeCode : String(10);
}

entity Inserts {
  key InsertID : String(40);
  key SO       : Integer;
  key LineItem : Integer;
      Insert   : String(18);
      Type     : String(18);
      TimeCode : String(10);
}
