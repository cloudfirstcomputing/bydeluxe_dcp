namespace deluxe.assetvault;

entity AssetVault {
    key AssetVaultID          : String(40) @mandatory;
        AssetMapID            : String(40);
        AssetMapIDDescription : String;
        CreatedinSAP          : Boolean    @mandatory;
        DCP                   : String(40);
        // Title                 : String(40);
        GoFilexTitleID_NORAM  : String(40);
        // GoFilexTitleID_EMEA   : String(40);
        // GoFilexTitleID_APAC   : String(40);
        // GoFilexTitleID_LATAM  : String(40);
        KENCASTID             : String(40);
        // KENCASTID_EMEA        : String(40);
        // KENCASTID_APAC        : String(40);
        // KENCASTID_LATAM       : String(40);
        // NBPTitleID_NORAM      : String(40);
        // NBPTitleID_EMEA       : String(40);
        // NBPTitleID_APAC       : String(40);
        // NBPTitleID_LATAM      : String(40);
        _Items                : Composition of many {
                                    key ID            : UUID;
                                        LinkedDCP     : String(40);
                                        LinkedCPLUUID : String(40) @mandatory;
                                        LinkedCTT     : String(50) @mandatory;
                                        // PrintFormat   : String(40);
                                        // FilmStock     : String(40);
                                        // Audio         : String(40);
                                        Attribute1    : String(40);
                                        Attribute2    : String(40);
                                        Attribute3    : String(40);
                                        Attribute4    : String(40);
                                        Attribute5    : String(40);
                                        Attribute6    : String(40);
                                        Attribute7    : String(40);
                                        Attribute8    : String(40);
                                        Attribute9    : String(40);
                                        Attribute10   : String(40);
                                }
};
