namespace deluxe.assetvault;

entity AssetVault {
    key AssetVaultID          : String(40) @mandatory;
        ProjectType           : String(2);
        AssetMapID            : String(40);
        AssetMapIDDescription : String(80);
        Title                 : String(40);
        VersionDescription    : String(40);
        CreatedinSAP          : Boolean    @mandatory;
        DCP                   : String(40);
        GoFilexTitleID_NORAM  : String(40);
        KENCASTID             : String(40);
        _Items                : Composition of many {
                                    key ID                  : UUID;
                                        ProjectID           : String(40);
                                        ProjectType         : String(40);
                                        ProjectAssetMapUUID : String(40);
                                        DCDMFlag            : String(10);
                                        LinkedDCP           : String(40);
                                        LinkedCPLUUID       : String(40) @mandatory;
                                        LinkedCTT           : String(80) @mandatory;
                                        VersionDescription  : String(40);
                                        RunTime             : String(10);
                                        StartOfCredits      : String(10);
                                        StartOfCrawl        : String(10);
                                        DKDMS3location      : String;
                                        CPLS3location       : String;
                                }
};
