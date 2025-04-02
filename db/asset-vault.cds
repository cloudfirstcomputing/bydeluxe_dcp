namespace deluxe.assetvault;

entity DistributionDcp {
    key ProjectID                      : String(40) @mandatory;
        ProjectType                    : String(2);
        AssetMapID                     : String(40);
        AssetMapIDDescription          : String(80);
        AnnotationText                 : String;
        ExternalReference              : String;
        VolumeName                     : String(80);
        AssetMapFileSize               : String(80);
        Title                          : String(40);
        KrakenTitleID                  : String(40);
        // Rating                : String(40);
        VersionDescription             : String(100);
        CreatedinSAP                   : Boolean    @mandatory;
        DCP                            : String(40);
        EDeliveryApacTitleId           : String(40);
        EDeliveryNoramTitleId          : String(40);
        KencastID                      : String(40);
        MaxCPLDuration                 : String(12);
        StartOfCredit                  : String;
        StartOfCrawl                   : String;
        DcpFormats                     : String(80);
        Resolution                     : String(40);
        AspectRatio                    : String(80);
        PictureFormats                 : String(40);
        AudioFormats                   : String(40);
        AnyAtmos                       : Integer;
        AnyCCAP                        : Integer;
        AnyOCAP                        : Integer;
        AnyHI                          : Integer;
        AnyVI                          : Integer;
        AnySLV                         : Integer;
        PublishDaysBeforePlaydate      : String(40);
        SatelliteDistributionStartDate : String(40);
        SatelliteDistributionEndDate   : String(40);
        _Items                         : Composition of many {
                                             key ID                    : UUID;
                                                 DcpProjectID          : String(40);
                                                 ProjectTypeID         : String(40);
                                                 AssetMapUUID          : String(40);
                                                 ContentKind           : String(40);
                                                 DCDMFlag              : String(10);
                                                 LinkedDCP             : String(40);
                                                 LinkedCPLUUID         : String(40)  @mandatory;
                                                 LinkedCTT             : String(500) @mandatory;
                                                 VersionDescription    : String(100);
                                                 DistributionSize      : String(40);
                                                 RunTime               : String(12);
                                                 StartOfCredits        : String(12);
                                                 StartOfCrawl          : String(12);
                                                 DKDMS3location        : String;
                                                 CPLS3location         : String;
                                                 AtmosFlag             : Integer;
                                                 ClosedCaptionsFlag    : Integer;
                                                 SignLanguageVideoFlag : Integer;
                                                 DcpFormatType         : String(40);
                                                 SoundFormat           : String(10);
                                                 DcpResolution         : String(10);
                                                 AspectRatio           : String(10);
                                                 PictureFormat         : String(10);
                                                 KDMFlag               : Boolean;
                                                 Email                 : Boolean;
                                                 Download              : Boolean;
                                         }
};

entity MediaFiles {
    key name    : String(255);
        content : LargeBinary @Core.MediaType; // This stores the binary content
}
