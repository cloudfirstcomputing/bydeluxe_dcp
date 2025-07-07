using DistributionService as service from '../../srv/dist-service';

@(
    Common                                : {SemanticKey: [DistroSpecID], },
    UI.SelectionPresentationVariant #table: {
        $Type              : 'UI.SelectionPresentationVariantType',
        PresentationVariant: {
            $Type         : 'UI.PresentationVariantType',
            Visualizations: ['@UI.LineItem',
            ],
            SortOrder     : [{
                $Type     : 'Common.SortOrderType',
                Property  : DistroSpecID,
                Descending: false,
            }, ],
        },
        SelectionVariant   : {
            $Type        : 'UI.SelectionVariantType',
            SelectOptions: [],
        },
    },
)
annotate service.DistroSpec with {
    DistroSpecID       @Common: {Label: '{i18n>DistroSpecID}', };
    Name               @Common: {Label: '{i18n>Name}', };
    Title              @Common: {
        Label          : '{i18n>Title}',
        Text           : Title.ProductName,
        TextArrangement: #TextOnly,
    };
    Status             @Common: {Label: '{i18n>Active}', };
    DeliverySequence1  @Common: {
        Label          : '{i18n>DeliverySequence1}',
        Text           : DeliverySequence1.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliverySequence2  @Common: {
        Label          : '{i18n>DeliverySequence2}',
        Text           : DeliverySequence2.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliverySequence3  @Common: {
        Label          : '{i18n>DeliverySequence3}',
        Text           : DeliverySequence3.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliverySequence4  @Common: {
        Label          : '{i18n>DeliverySequence4}',
        Text           : DeliverySequence4.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliverySequence5  @Common: {
        Label          : '{i18n>DeliverySequence5}',
        Text           : DeliverySequence5.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliverySequence6  @Common: {
        Label          : '{i18n>DeliverySequence6}',
        Text           : DeliverySequence6.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliverySequence7  @Common: {
        Label          : '{i18n>DeliverySequence7}',
        Text           : DeliverySequence7.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliverySequence8  @Common: {
        Label          : '{i18n>DeliverySequence8}',
        Text           : DeliverySequence8.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliverySequence9  @Common: {
        Label          : '{i18n>DeliverySequence9}',
        Text           : DeliverySequence9.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliverySequence10 @Common: {
        Label          : '{i18n>DeliverySequence10}',
        Text           : DeliverySequence10.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    ReleaseDate        @Common: {Label: '{i18n>ReleaseDate}', };
    RepertoryDate      @Common: {Label: '{i18n>RepertoryDate}', };
};

annotate service.StudioKey with {
    Studio             @Common: {
        Label          : '{i18n>Studio}',
        Text           : Studio.BusinessPartnerFullName,
        TextArrangement: #TextOnly,
    };
    KeyStartTime       @Common: {Label: '{i18n>KeyStartTime}', };
    KeyEndTime         @Common: {Label: '{i18n>KeyEndTime}', };
    InitialKeyDuration @Common: {Label: '{i18n>InitialKeyDuration}', };
    NextKeyDuration    @Common: {Label: '{i18n>NextKeyDuration}', };
    OffsetBPD          @Common: {Label: '{i18n>OffsetBPD}', };
    OffsetEPD          @Common: {Label: '{i18n>OffsetEPD}', };
    // AggregateKey         @Common: {Label: '{i18n>AggregateKey}', };
    ProcessKDMS        @Common: {Label: '{i18n>ProcessKDMS}', };
// ProcessScreeningKDMS @Common: {Label: '{i18n>ProcessScreeningKDMS}', };
// MaxKDMSDuration      @Common: {Label: '{i18n>MaxKDMSDuration}', };
// StudioHoldOverRule   @Common: {Label: '{i18n>StudioHoldOverRule}', };
// SalesTerritory       @Common: {
//     Label          : '{i18n>SalesTerritory}',
//     Text           : SalesTerritory.Name,
//     TextArrangement: #TextOnly,
// };
};

annotate service.CustomerRef with {
    CustomerReference @Common: {Label: '{i18n>CustomerReference}', };
};

annotate service.StdKey2KeyR with {
    Rule @Common: {
        Label                   : 'Rule',
        ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'KeyRules',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Rule,
                    ValueListProperty: 'Rule',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Country',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Studio',
                },
            ],
        },
        ValueListWithFixedValues: true
    };
};


annotate service.Package with {
    PackageName      @Common: {Label: '{i18n>PackageName}', };
    Priority         @Common: {Label: '{i18n>Priority}', };
    OrderType        @Common: {Label: '{i18n>OrderType}', };
    GofilexTitleID   @Common: {Label: '{i18n>GofilexTitleID}', };
    KrakenID         @Common: {Label: '{i18n>KrakenID}', };
    DeliveryMethod1  @Common: {
        Label          : '{i18n>DeliveryMethod1}',
        Text           : DeliveryMethod1.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliveryMethod2  @Common: {
        Label          : '{i18n>DeliveryMethod2}',
        Text           : DeliveryMethod2.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliveryMethod3  @Common: {
        Label          : '{i18n>DeliveryMethod3}',
        Text           : DeliveryMethod3.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliveryMethod4  @Common: {
        Label          : '{i18n>DeliveryMethod4}',
        Text           : DeliveryMethod4.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliveryMethod5  @Common: {
        Label          : '{i18n>DeliveryMethod5}',
        Text           : DeliveryMethod5.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliveryMethod6  @Common: {
        Label          : '{i18n>DeliveryMethod6}',
        Text           : DeliveryMethod6.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliveryMethod7  @Common: {
        Label          : '{i18n>DeliveryMethod7}',
        Text           : DeliveryMethod7.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliveryMethod8  @Common: {
        Label          : '{i18n>DeliveryMethod8}',
        Text           : DeliveryMethod8.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliveryMethod9  @Common: {
        Label          : '{i18n>DeliveryMethod9}',
        Text           : DeliveryMethod9.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    DeliveryMethod10 @Common: {
        Label          : '{i18n>DeliveryMethod10}',
        Text           : DeliveryMethod10.ShippingConditionName,
        TextArrangement: #TextOnly,
    };
    ValidFrom        @Common: {Label: '{i18n>ValidFrom}', };
    ValidTo          @Common: {Label: '{i18n>ValidTo}', };
};

annotate service.KeyPackage with {
    PackageName @Common: {Label: '{i18n>PackageName}', };
    Priority    @Common: {Label: '{i18n>Priority}', };
    OrderType   @Common: {Label: '{i18n>OrderType}', };
    ValidFrom   @Common: {Label: '{i18n>ValidFrom}', };
    ValidTo     @Common: {Label: '{i18n>ValidTo}', };
};

annotate service.DistRestrictions with {
    Theater                    @Common: {Label: '{i18n>Theater}', };
    Circuit                    @Common: {
        Label          : '{i18n>Circuit}',
        Text           : Circuit.Name,
        TextArrangement: #TextOnly,
    };
    DistributionFilterRegion   @Common: {
        Label          : '{i18n>DistributionFilterRegion}',
        Text           : DistributionFilterRegion.Code,
        TextArrangement: #TextOnly,
    };
    // DistributionFilterCountry  @Common: {
    //     Label          : '{i18n>DistributionFilterCountry}',
    //     Text           : DistributionFilterCountry.name,
    //     TextArrangement: #TextOnly,
    // };
    // DistributionFilterCity     @Common: {Label: '{i18n>DistributionFilterCity}', };
    // DistributionFilterPostal   @Common: {Label: '{i18n>DistributionFilterPostal}', };
    DistributionFilterLanguage @Common: {
        Label          : '{i18n>Language}',
        Text           : DistributionFilterLanguage.name,
        TextArrangement: #TextOnly,
    };
    PlayBackCapability1        @Common: {Label: '{i18n>PlayBackCapability1}', };
    PlayBackCapability2        @Common: {Label: '{i18n>PlayBackCapability2}', };
    PlayBackCapability3        @Common: {Label: '{i18n>PlayBackCapability3}', };
    PlayBackCapability4        @Common: {Label: '{i18n>PlayBackCapability4}', };
    PlayBackCapability5        @Common: {Label: '{i18n>PlayBackCapability5}', };
    PlayBackCapability6        @Common: {Label: '{i18n>PlayBackCapability6}', };
    PlayBackCapability7        @Common: {Label: '{i18n>PlayBackCapability7}', };
    PlayBackCapability8        @Common: {Label: '{i18n>PlayBackCapability8}', };
    PlayBackCapability9        @Common: {Label: '{i18n>PlayBackCapability9}', };
    PlayBackCapability10       @Common: {Label: '{i18n>PlayBackCapability10}', };
    TrailMixSub                @Common: {Label: '{i18n>TrailMixSub}', };
};

annotate service.KeyDistRestrictions with {
    Theater                    @Common: {Label: '{i18n>Theater}', };
    Circuit                    @Common: {
        Label          : '{i18n>Circuit}',
        Text           : Circuit.Name,
        TextArrangement: #TextOnly,
    };
    DistributionFilterRegion   @Common: {
        Label          : '{i18n>DistributionFilterRegion}',
        Text           : DistributionFilterRegion.Code,
        TextArrangement: #TextOnly,
    };
    // DistributionFilterCountry  @Common: {
    //     Label          : '{i18n>DistributionFilterCountry}',
    //     Text           : DistributionFilterCountry.name,
    //     TextArrangement: #TextOnly,
    // };
    // DistributionFilterCity     @Common: {Label: '{i18n>DistributionFilterCity}', };
    // DistributionFilterPostal   @Common: {Label: '{i18n>DistributionFilterPostal}', };
    DistributionFilterLanguage @Common: {
        Label          : '{i18n>Language}',
        Text           : DistributionFilterLanguage.name,
        TextArrangement: #TextOnly,
    };
    PlayBackCapability1        @Common: {Label: '{i18n>PlayBackCapability1}', };
    PlayBackCapability2        @Common: {Label: '{i18n>PlayBackCapability2}', };
    PlayBackCapability3        @Common: {Label: '{i18n>PlayBackCapability3}', };
    PlayBackCapability4        @Common: {Label: '{i18n>PlayBackCapability4}', };
    PlayBackCapability5        @Common: {Label: '{i18n>PlayBackCapability5}', };
    PlayBackCapability6        @Common: {Label: '{i18n>PlayBackCapability6}', };
    PlayBackCapability7        @Common: {Label: '{i18n>PlayBackCapability7}', };
    PlayBackCapability8        @Common: {Label: '{i18n>PlayBackCapability8}', };
    PlayBackCapability9        @Common: {Label: '{i18n>PlayBackCapability9}', };
    PlayBackCapability10       @Common: {Label: '{i18n>PlayBackCapability10}', };
    TrailMixSub                @Common: {Label: '{i18n>TrailMixSub}', };
};

annotate service.CPLDetail with {
    CPLUUID  @Common: {Label: '{i18n>CPL}'};
    CTT      @Common: {Label: '{i18n>CTT}'};
    Email    @Common: {Label: '{i18n>Email}'};
    Download @Common: {Label: '{i18n>Download}'};
};

annotate service.DCPMaterials with {
    DCPMaterialNumber        @Common: {
        Label: '{i18n>DCPMaterial}',
        Text : DCPMaterialNumber.ProductName,
    };
    PublishDateOffset        @Common: {Label: '{i18n>PublishDateOffset}', };
    CTT                      @Common: {Label: '{i18n>CTT}', }  @UI.MultiLineText;
    CPLUUID                  @Common: {Label: '{i18n>CPL}', }  @UI.MultiLineText;
    RevealPublishGlobalDate  @Common: {Label: '{i18n>RevealPublishGlobalDate}', };
    RevealPublishGlobalTime  @Common: {Label: '{i18n>RevealPublishGlobalTime}', };
    RevealPublishLocalDate   @Common: {Label: '{i18n>RevealPublishLocalDate}', };
    RevealPublishLocalTime   @Common: {Label: '{i18n>RevealPublishLocalTime}', };
    SatelliteFlightStartDate @Common: {Label: '{i18n>SatelliteFlightStartDate}', };
    SatelliteFlightStartTime @Common: {Label: '{i18n>SatelliteFlightStartTime}', };
    SatelliteFlightEndDate   @Common: {Label: '{i18n>SatelliteFlightEndDate}', };
    SatelliteFlightEndTime   @Common: {Label: '{i18n>SatelliteFlightEndTime}', };
};

annotate service.CplList with {
    LinkedCTT     @Common: {Label: '{i18n>CTT}'};
    LinkedCPLUUID @Common: {Label: '{i18n>CPL}'};
    AssetMapUUID  @Common: {Label: '{i18n>AssetMapUUID}'}  @UI.HiddenFilter;
    Email         @Common: {Label: '{i18n>Email}'}         @UI.HiddenFilter;
    Download      @Common: {Label: '{i18n>Download}'}      @UI.HiddenFilter;
    ProjectID     @UI.HiddenFilter;

};

annotate service.Studios with {
    BusinessPartner         @Common: {Label: '{i18n>Studio}', };
    BusinessPartnerFullName @Common: {Label: '{i18n>StudioName}', };
    BusinessPartnerType     @UI.HiddenFilter;
};

annotate service.GeoRegions with {
    _Territory @UI.HiddenFilter;
}

annotate service.Languages with {
    descr @UI.HiddenFilter;
}

annotate service.PlayBackCapability1 with {
    CharcInternalID          @UI.HiddenFilter;
    CharcValuePositionNumber @UI.HiddenFilter;
    CharcValue;
    Characteristic;
}

annotate service.PlayBackCapability2 with {
    CharcInternalID          @UI.HiddenFilter;
    CharcValuePositionNumber @UI.HiddenFilter;
    CharcValue;
    Characteristic;
}

annotate service.PlayBackCapability3 with {
    CharcInternalID          @UI.HiddenFilter;
    CharcValuePositionNumber @UI.HiddenFilter;
    CharcValue;
    Characteristic;
}

annotate service.PlayBackCapability4 with {
    CharcInternalID          @UI.HiddenFilter;
    CharcValuePositionNumber @UI.HiddenFilter;
    CharcValue;
    Characteristic;
}

annotate service.PlayBackCapability5 with {
    CharcInternalID          @UI.HiddenFilter;
    CharcValuePositionNumber @UI.HiddenFilter;
    CharcValue;
    Characteristic;
}

annotate service.PlayBackCapability6 with {
    CharcInternalID          @UI.HiddenFilter;
    CharcValuePositionNumber @UI.HiddenFilter;
    CharcValue;
    Characteristic;
}

annotate service.PlayBackCapability7 with {
    CharcInternalID          @UI.HiddenFilter;
    CharcValuePositionNumber @UI.HiddenFilter;
    CharcValue;
    Characteristic;
}

annotate service.PlayBackCapability8 with {
    CharcInternalID          @UI.HiddenFilter;
    CharcValuePositionNumber @UI.HiddenFilter;
    CharcValue;
    Characteristic;
}

annotate service.PlayBackCapability9 with {
    CharcInternalID          @UI.HiddenFilter;
    CharcValuePositionNumber @UI.HiddenFilter;
    CharcValue;
    Characteristic;
}

annotate service.Theaters with {
    BusinessPartner         @Common: {Label: '{i18n>Theater}', };
    BusinessPartnerFullName @Common: {Label: '{i18n>TheaterName}', };
    BusinessPartnerType     @UI.HiddenFilter;
};

annotate service.ShippingConditions with {
    ShippingCondition     @Common: {Label: '{i18n>ShippingCondition}', };
    ShippingConditionName @Common: {Label: '{i18n>Description}', };
};

annotate service.DCPProducts with {
    Product      @Common: {Label: '{i18n>Product}', };
    ProductName  @Common: {Label: '{i18n>ProductDesc}'};
    Product_Text @UI.HiddenFilter;
    ProductType  @UI.HiddenFilter;
};

annotate service.Titles with {
    Product      @Common: {Label: '{i18n>Title}', };
    ProductName  @Common: {Label: '{i18n>Description}'};
    Product_Text @UI.HiddenFilter;
    ProductType  @UI.HiddenFilter;
};

annotate service.DeliveryPriority with {
    DeliveryPriority     @Common: {Label: '{i18n>DeliveryPriority}', };
    DeliveryPriorityDesc @common: {Label: '{i18n>Description}'};
};

annotate service.CustomerGroup with {
    CustomerGroup @Common      : {Label: '{i18n>CustomerGroup}', };
    Name          @Common.Label: '{i18n>Description}';
    to_Text       @UI.HiddenFilter;
};

annotate service.SalesDistricts with {
    SalesDistrict @Common      : {Label: '{i18n>SalesDistrict}', };
    Name          @Common.Label: '{i18n>Description}';
    to_Text       @UI.HiddenFilter;
};

annotate service.DistroSpec with @(
    UI.SelectionFields     : [Title_Product],
    UI.HeaderInfo          : {
        Title         : {
            $Type: 'UI.DataField',
            Value: Name,
        },
        TypeName      : '{i18n>DistroSpec}',
        TypeNamePlural: '{i18n>DistroSpecs}',
    },
    UI.FieldGroup #General : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: DistroSpecID,
            },
            {
                $Type: 'UI.DataField',
                Value: Name,
            },
            {
                $Type: 'UI.DataField',
                Value: Title_Product,
            },
            {
                $Type: 'UI.DataField',
                Value: ReleaseDate,
            },
            {
                $Type: 'UI.DataField',
                Value: RepertoryDate,
            },
            {
                $Type: 'UI.DataField',
                Value: Status,
            }
        ],
    },
    UI.FieldGroup #Delivery: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: DeliverySequence1_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliverySequence2_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliverySequence3_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliverySequence4_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliverySequence5_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliverySequence6_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliverySequence7_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliverySequence8_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliverySequence9_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliverySequence10_ShippingCondition,
            },
        ]
    },
    UI.Facets              : [
        {
            $Type : 'UI.CollectionFacet',
            ID    : 'PackageCollection',
            Label : '{i18n>GeneralInfo}',
            Facets: [{
                $Type : 'UI.ReferenceFacet',
                ID    : 'General',
                // Label : '{i18n>GeneralInfo}',
                Target: '@UI.FieldGroup#General',
            }, ],
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'Delivery',
            Label : '{i18n>DeliverySeq}',
            Target: '@UI.FieldGroup#Delivery',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'StudioKey',
            Label : '{i18n>StudioKey}',
            Target: 'to_StudioKey/@UI.LineItem',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'Package',
            Label : '{i18n>Package}',
            Target: 'to_Package/@UI.LineItem',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'KeyPackage',
            Label : '{i18n>KeyPackage}',
            Target: 'to_KeyPackage/@UI.LineItem',
        },
    ],
    UI.LineItem            : [
        {
            $Type: 'UI.DataField',
            Value: DistroSpecID,
        },
        {
            $Type: 'UI.DataField',
            Value: Name,
        },
        {
            $Type: 'UI.DataField',
            Value: Title_Product,
        },
        {
            $Type: 'UI.DataField',
            Value: Status,
        },
    ],
);

annotate service.StudioKey with @(
    UI.HeaderInfo           : {
        Title         : {
            $Type: 'UI.DataField',
            Value: Studio_BusinessPartner,
        },
        TypeName      : '{i18n>Studio}',
        TypeNamePlural: '{i18n>Studio}',
    },
    UI.FieldGroup #StudioKey: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Studio_BusinessPartner,
            },
            {
                $Type: 'UI.DataField',
                Value: KeyStartTime,
            },
            {
                $Type: 'UI.DataField',
                Value: KeyEndTime,
            },
            {
                $Type: 'UI.DataField',
                Value: InitialKeyDuration,
            },
            {
                $Type: 'UI.DataField',
                Value: NextKeyDuration,
            },
            {
                $Type: 'UI.DataField',
                Value: OffsetBPD,
            },
            {
                $Type: 'UI.DataField',
                Value: OffsetEPD,
            },
            // {
            //     $Type: 'UI.DataField',
            //     Value: AggregateKey,
            // },
            {
                $Type: 'UI.DataField',
                Value: ProcessKDMS,
            },
        // {
        //     $Type: 'UI.DataField',
        //     Value: ProcessScreeningKDMS,
        // },
        // {
        //     $Type: 'UI.DataField',
        //     Value: MaxKDMSDuration,
        // },
        // {
        //     $Type: 'UI.DataField',
        //     Value: StudioHoldOverRule,
        // },
        // {
        //     $Type: 'UI.DataField',
        //     Value: SalesTerritory_SalesDistrict,
        // },
        ],
    },
    UI.LineItem             : [{
        $Type: 'UI.DataField',
        Value: Studio_BusinessPartner,
    }, ],
    UI.Facets               : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'StudioKey1',
            Label : '{i18n>StudioKey}',
            Target: '@UI.FieldGroup#StudioKey',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'CustRef',
            Label : '{i18n>CustomerReference}',
            Target: 'to_CustomerRef/@UI.LineItem',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'KeyRule',
            Label : '{i18n>KeyRule}',
            Target: 'to_KeyRule/@UI.LineItem',
        },
    ],
);

annotate service.CustomerRef with @(
    UI.LineItem                     : [{
        $Type: 'UI.DataField',
        Value: CustomerReference,
    }, ],
    UI.FieldGroup #CustomerReference: {
        $Type: 'UI.FieldGroupType',
        Data : [{
            $Type: 'UI.DataField',
            Value: CustomerReference,
        }, ]
    },
    UI.HeaderInfo                   : {
        Title         : {
            $Type: 'UI.DataField',
            Value: CustomerReference,
        },
        TypeName      : '{i18n>CustomerReference}',
        TypeNamePlural: '{i18n>CustomerReference}',
    },
    UI.Facets                       : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'CustRef1',
        Target: '@UI.FieldGroup#CustomerReference',
    }, ]
);

annotate service.StdKey2KeyR with @(
    UI.LineItem           : [{
        $Type: 'UI.DataField',
        Value: Rule,
    }, ],
    UI.FieldGroup #KeyRule: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Rule,
            },
            {
                $Type: 'UI.DataField',
                Value: Country,
            },
            {
                $Type: 'UI.DataField',
                Value: Studio,
            },
            {
                $Type: 'UI.DataField',
                Value: DeluxeBookClassType,
            },
            {
                $Type: 'UI.DataField',
                Value: ClientBookClassType,
            },
            {
                $Type: 'UI.DataField',
                Value: InitialKeyStartCalcOrigin,
            },
            {
                $Type: 'UI.DataField',
                Value: InitialKeyStartOffset,
            },
            {
                $Type: 'UI.DataField',
                Value: InitialKeyEndCalcOrigin,
            },
            {
                $Type: 'UI.DataField',
                Value: InitialKeyEndOffset,
            },
            {
                $Type: 'UI.DataField',
                Value: NextKeyStartCalcOrigin,
            },
            {
                $Type: 'UI.DataField',
                Value: NextKeyEndCalcOrigin,
            },
            {
                $Type: 'UI.DataField',
                Value: NextKeyEndOffset,
            },
        ]
    },
    UI.HeaderInfo         : {
        Title         : {
            $Type: 'UI.DataField',
            Value: Rule,
        },
        TypeName      : '{i18n>KeyRule}',
        TypeNamePlural: '{i18n>KeyRules}',
    },
    UI.Facets             : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'KeyRule1',
        Target: '@UI.FieldGroup#KeyRule',
    }, ]
);

annotate service.Package with @(
    UI.HeaderInfo                       : {
        Title         : {
            $Type: 'UI.DataField',
            Value: PackageName,
        },
        TypeName      : '{i18n>Package}',
        TypeNamePlural: '{i18n>Packages}',
    },
    UI.FieldGroup #_Package             : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: PackageName,
            },
            {
                $Type: 'UI.DataField',
                Value: Priority,
            },
            {
                $Type: 'UI.DataField',
                Value: OrderType_code,
            },
            {
                $Type: 'UI.DataField',
                Value: GofilexTitleID,
            },
            {
                $Type: 'UI.DataField',
                Value: KrakenID,
            }
        ],
    },
    UI.FieldGroup #_PackageValidityDate : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: ValidFrom,
            },
            {
                $Type: 'UI.DataField',
                Value: ValidTo,
            },
        ],
    },
    UI.FieldGroup #_PackageDeliveryethod: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: DeliveryMethod1_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliveryMethod2_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliveryMethod3_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliveryMethod4_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliveryMethod5_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliveryMethod6_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliveryMethod7_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliveryMethod8_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliveryMethod9_ShippingCondition,
            },
            {
                $Type: 'UI.DataField',
                Value: DeliveryMethod10_ShippingCondition,
            },
        ],
    },
    UI.Facets                           : [
        {
            $Type : 'UI.CollectionFacet',
            ID    : 'PackageCollection',
            Label : '{i18n>PackageInfo}',
            Facets: [
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : '_Package',
                    Label : '{i18n>GeneralInfo}',
                    Target: '@UI.FieldGroup#_Package',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : '_PackageValidityDate',
                    Label : '{i18n>PackageValidityDate}',
                    Target: '@UI.FieldGroup#_PackageValidityDate',
                },
            ],
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : '_PackageDeliveryethod',
            Label : '{i18n>DeliveryPreferences}',
            Target: '@UI.FieldGroup#_PackageDeliveryethod',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : '_PackageFilter',
            Label : '{i18n>ContentRestriction}',
            Target: 'to_DistRestriction/@UI.LineItem',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'DCPMaterial',
            Label : '{i18n>DCPMaterial}',
            Target: 'to_DCPMaterial/@UI.LineItem',
        },
    ],
    UI.LineItem                         : [
        {
            $Type: 'UI.DataField',
            Value: PackageName,
        },
        {
            $Type: 'UI.DataField',
            Value: Priority,
        },
        {
            $Type: 'UI.DataField',
            Value: ValidFrom,
        },
        {
            $Type: 'UI.DataField',
            Value: ValidTo,
        },
    ]
);

annotate service.KeyPackage with @(
    UI.HeaderInfo                         : {
        Title         : {
            $Type: 'UI.DataField',
            Value: PackageName,
        },
        TypeName      : '{i18n>KeyPackage}',
        TypeNamePlural: '{i18n>KeyPackages}',
    },
    UI.FieldGroup #_KeyPackage            : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: PackageName,
            },
            {
                $Type: 'UI.DataField',
                Value: Priority,
            },
            {
                $Type: 'UI.DataField',
                Value: OrderType_code,
            },
        ],
    },
    UI.FieldGroup #_KeyPackageValidityDate: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: ValidFrom,
            },
            {
                $Type: 'UI.DataField',
                Value: ValidTo,
            },
        ],
    },
    UI.Facets                             : [
        {
            $Type : 'UI.CollectionFacet',
            ID    : 'KeyPackageCollection',
            Label : '{i18n>PackageInfo}',
            Facets: [
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : '_KeyPackage',
                    Label : '{i18n>GeneralInfo}',
                    Target: '@UI.FieldGroup#_KeyPackage',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : '_KeyPackageValidityDate',
                    Label : '{i18n>PackageValidityDate}',
                    Target: '@UI.FieldGroup#_KeyPackageValidityDate',
                },
            ],
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : '_KeyPackageFilter',
            Label : '{i18n>KeyRestriction}',
            Target: 'to_DistRestriction/@UI.LineItem',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'CPLDetail',
            Label : '{i18n>CPLDetail}',
            Target: 'to_CPLDetail/@UI.LineItem',
        },
    ],
    UI.LineItem                           : [
        {
            $Type: 'UI.DataField',
            Value: PackageName,
        },
        {
            $Type: 'UI.DataField',
            Value: Priority,
        },
        {
            $Type: 'UI.DataField',
            Value: ValidFrom,
        },
        {
            $Type: 'UI.DataField',
            Value: ValidTo,
        },
    ]
);

annotate service.DistRestrictions with @(
    UI.LineItem                         : [
        // {
        //     $Type: 'UI.DataField',
        //     Value: DistributionFilterCountry_code,
        // },
        {
            $Type: 'UI.DataField',
            Value: DistributionFilterRegion_ID,
        },
        // {
        //     $Type: 'UI.DataField',
        //     Value: DistributionFilterCity,
        // },
        // {
        //     $Type: 'UI.DataField',
        //     Value: DistributionFilterPostal,
        // },
        {
            $Type: 'UI.DataField',
            Value: Circuit_CustomerGroup,
        },
        {
            $Type: 'UI.DataField',
            Value: Theater_BusinessPartner,
        },
        {
            $Type: 'UI.DataField',
            Value: DistributionFilterLanguage_code,
        },
    ],
    UI.HeaderInfo                       : {
        TypeName      : '{i18n>DistRestriction}',
        TypeNamePlural: '{i18n>DistRestrictions}',
    },
    UI.FieldGroup #_PlayBackCapabilities: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability1,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability2,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability3,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability4,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability5,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability6,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability7,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability8,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability9,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability10,
            },
        ]
    },
    UI.FieldGroup #_DistRestriction     : {
        $Type: 'UI.FieldGroupType',
        Data : [
            // {
            //     $Type: 'UI.DataField',
            //     Value: DistributionFilterCountry_code,
            // },
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterRegion_ID,
            },
            // {
            //     $Type: 'UI.DataField',
            //     Value: DistributionFilterCity,
            // },
            // {
            //     $Type: 'UI.DataField',
            //     Value: DistributionFilterPostal,
            // },
            {
                $Type: 'UI.DataField',
                Value: Circuit_CustomerGroup,
            },
            {
                $Type: 'UI.DataField',
                Value: Theater_BusinessPartner,
            },
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterLanguage_code,
            },
            {
                $Type: 'UI.DataField',
                Value: TrailMixSub_code,
            },
        ]
    },
    UI.Facets                           : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : '_DistRest',
            Label : '{i18n>DistRestriction}',
            Target: '@UI.FieldGroup#_DistRestriction',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : '_DistRestPlay',
            Label : '{i18n>PlayBackCapabilities}',
            Target: '@UI.FieldGroup#_PlayBackCapabilities',
        },
    ],
);

annotate service.KeyDistRestrictions with @(
    UI.LineItem                         : [
        // {
        //     $Type: 'UI.DataField',
        //     Value: DistributionFilterCountry_code,
        // },
        {
            $Type: 'UI.DataField',
            Value: DistributionFilterRegion_ID,
        },
        // {
        //     $Type: 'UI.DataField',
        //     Value: DistributionFilterCity,
        // },
        // {
        //     $Type: 'UI.DataField',
        //     Value: DistributionFilterPostal,
        // },
        {
            $Type: 'UI.DataField',
            Value: Circuit_CustomerGroup,
        },
        {
            $Type: 'UI.DataField',
            Value: Theater_BusinessPartner,
        },
        {
            $Type: 'UI.DataField',
            Value: DistributionFilterLanguage_code,
        },
    ],
    UI.HeaderInfo                       : {
        TypeName      : '{i18n>DistRestriction}',
        TypeNamePlural: '{i18n>DistRestrictions}',
    },
    UI.FieldGroup #_PlayBackCapabilities: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability1,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability2,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability3,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability4,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability5,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability6,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability7,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability8,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability9,
            },
            {
                $Type: 'UI.DataField',
                Value: PlayBackCapability10,
            },
        ]
    },
    UI.FieldGroup #_DistRestriction     : {
        $Type: 'UI.FieldGroupType',
        Data : [
            // {
            //     $Type: 'UI.DataField',
            //     Value: DistributionFilterCountry_code,
            // },
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterRegion_ID,
            },
            // {
            //     $Type: 'UI.DataField',
            //     Value: DistributionFilterCity,
            // },
            // {
            //     $Type: 'UI.DataField',
            //     Value: DistributionFilterPostal,
            // },
            {
                $Type: 'UI.DataField',
                Value: Circuit_CustomerGroup,
            },
            {
                $Type: 'UI.DataField',
                Value: Theater_BusinessPartner,
            },
            {
                $Type: 'UI.DataField',
                Value: DistributionFilterLanguage_code,
            },
            {
                $Type: 'UI.DataField',
                Value: TrailMixSub_code,
            },
        ]
    },
    UI.Facets                           : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : '_KeyDistRest',
            Label : '{i18n>DistRestriction}',
            Target: '@UI.FieldGroup#_DistRestriction',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : '_KeyDistRestPlay',
            Label : '{i18n>PlayBackCapabilities}',
            Target: '@UI.FieldGroup#_PlayBackCapabilities',
        },
    ],
);

annotate service.DCPMaterials with @(
    UI.HeaderInfo              : {
        Title         : {
            $Type: 'UI.DataField',
            Value: DCPMaterialNumber_Product,
        },
        TypeName      : '{i18n>DCPMaterial}',
        TypeNamePlural: '{i18n>DCPMaterials}',
    },
    UI.FieldGroup #_DCPMaterial: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: DCPMaterialNumber_Product,
            },
            {
                $Type: 'UI.DataField',
                Value: PublishDateOffset,
            },
            {
                $Type: 'UI.DataField',
                Value: RevealPublishGlobalDate,
            },
            {
                $Type: 'UI.DataField',
                Value: RevealPublishGlobalTime,
            },
            {
                $Type: 'UI.DataField',
                Value: RevealPublishLocalDate,
            },
            {
                $Type: 'UI.DataField',
                Value: RevealPublishLocalTime,
            },
            {
                $Type: 'UI.DataField',
                Value: SatelliteFlightStartDate,
            },
            {
                $Type: 'UI.DataField',
                Value: SatelliteFlightStartTime,
            },
            {
                $Type: 'UI.DataField',
                Value: SatelliteFlightEndDate,
            },
            {
                $Type: 'UI.DataField',
                Value: SatelliteFlightEndTime,
            },
        ]
    },
    UI.Facets                  : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : '_DCPMaterial',
            Label : '{i18n>DCPMaterial}',
            Target: '@UI.FieldGroup#_DCPMaterial',
        },
        {
            $Type        : 'UI.ReferenceFacet',
            ID           : 'DCPDetail',
            Label        : '{i18n>DCPDetail}',
            ![@UI.Hidden]: {$edmJson: {$Ne: [
                {$Path: 'IsActiveEntity'},
                true
            ]}},
            Target       : 'to_DCPDetail/@UI.LineItem',
        },
    ],
    UI.LineItem                : [{
        $Type: 'UI.DataField',
        Value: DCPMaterialNumber_Product,
    }, ]
);

annotate service.CPLDetail with @(
    UI.HeaderInfo            : {
        Title         : {
            $Type: 'UI.DataField',
            Value: CPLUUID,
        },
        TypeName      : '{i18n>CPLDetail}',
        TypeNamePlural: '{i18n>CPLDetails}',
    },
    UI.FieldGroup #_CPLDetail: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: CPLUUID,
            },
            {
                $Type: 'UI.DataField',
                Value: CTT,
            },
            {
                $Type: 'UI.DataField',
                Value: Email,
            },
            {
                $Type: 'UI.DataField',
                Value: Download,
            },
        ]
    },
    UI.Facets                : [{
        $Type : 'UI.ReferenceFacet',
        ID    : '_CPLDetail',
        Label : '{i18n>CPLDetail}',
        Target: '@UI.FieldGroup#_CPLDetail',
    }, ],
    UI.LineItem              : [
        {
            $Type        : 'UI.DataFieldForAction',
            Action       : 'DistributionService.setDownloadEmail',
            Label        : 'Set Download/Email',
            ![@UI.Hidden]: {$edmJson: {$Ne: [
                {$Path: 'IsActiveEntity'},
                true
            ]}},
        },
        {
            $Type                : 'UI.DataField',
            Value                : CPLUUID,
            ![@HTML5.CssDefaults]: {
                $Type: 'HTML5.CssDefaultsType',
                width: 'auto',
            },
        },
        {
            $Type                : 'UI.DataField',
            Value                : CTT,
            ![@HTML5.CssDefaults]: {
                $Type: 'HTML5.CssDefaultsType',
                width: 'auto',
            },
        },
        {
            $Type                : 'UI.DataField',
            Value                : Email,
            ![@HTML5.CssDefaults]: {
                $Type: 'HTML5.CssDefaultsType',
                width: 'auto',
            },
        },
        {
            $Type                : 'UI.DataField',
            Value                : Download,
            ![@HTML5.CssDefaults]: {
                $Type: 'HTML5.CssDefaultsType',
                width: 'auto',
            },
        },
    ]
);


annotate service.CplList with @(UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Value: LinkedCPLUUID,
    },
    {
        $Type: 'UI.DataField',
        Value: LinkedCTT,
    },
    {
        $Type: 'UI.DataField',
        Value: AssetMapUUID,
    },
    {
        $Type: 'UI.DataField',
        Value: Download,
    },
    {
        $Type: 'UI.DataField',
        Value: Email,
    },
]);

annotate service.StudioKey with {
    Studio @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'Studios',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Studio_BusinessPartner,
                    ValueListProperty: 'BusinessPartner',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'BusinessPartnerFullName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
// SalesTerritory @(
//     Common.ValueList               : {
//         $Type          : 'Common.ValueListType',
//         CollectionPath : 'SalesDistricts',
//         SearchSupported: false,
//         Parameters     : [
//             {
//                 $Type            : 'Common.ValueListParameterInOut',
//                 LocalDataProperty: SalesTerritory_SalesDistrict,
//                 ValueListProperty: 'SalesDistrict',
//             },
//             {
//                 $Type            : 'Common.ValueListParameterDisplayOnly',
//                 ValueListProperty: 'Name',
//             },
//         ],
//     },
//     Common.ValueListWithFixedValues: false
// );
};

annotate service.DistroSpec with {
    Title              @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'Titles',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Title_Product,
                    ValueListProperty: 'Product',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ProductName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliverySequence1  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliverySequence1_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliverySequence2  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliverySequence2_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliverySequence3  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliverySequence3_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliverySequence4  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliverySequence4_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliverySequence5  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliverySequence5_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliverySequence6  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliverySequence6_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliverySequence7  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliverySequence7_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliverySequence8  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliverySequence8_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliverySequence9  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliverySequence9_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliverySequence10 @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliverySequence10_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
};

annotate service.Package with {
    DeliveryMethod1  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliveryMethod1_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliveryMethod2  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliveryMethod2_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliveryMethod3  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliveryMethod3_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliveryMethod4  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliveryMethod4_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliveryMethod5  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliveryMethod5_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliveryMethod6  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliveryMethod6_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliveryMethod7  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliveryMethod7_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliveryMethod8  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliveryMethod8_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliveryMethod9  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliveryMethod9_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    DeliveryMethod10 @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'ShippingConditions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DeliveryMethod10_ShippingCondition,
                    ValueListProperty: 'ShippingCondition',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ShippingConditionName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
}

annotate service.DistRestrictions with {
    DistributionFilterRegion @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'GeoRegions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DistributionFilterRegion_ID,
                    ValueListProperty: 'ID',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Code',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Description',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    Theater                  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'Theaters',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Theater_BusinessPartner,
                    ValueListProperty: 'BusinessPartner',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'BusinessPartnerFullName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    Circuit                  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'CustomerGroup',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Circuit_CustomerGroup,
                    ValueListProperty: 'CustomerGroup',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Name',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability1      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability1',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability1,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability2      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability2',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability2,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability3      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability3',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability3,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability4      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability4',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability4,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability5      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability5',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability5,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability6      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability6',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability6,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability7      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability7',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability7,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability8      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability8',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability8,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability9      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability9',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability9,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability10     @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability10',
            SearchSupported: false,
            Parameters     : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: PlayBackCapability10,
                ValueListProperty: 'VariableValue',
            }, ],
        },
        Common.ValueListWithFixedValues: false
    );
};

annotate service.KeyDistRestrictions with {
    DistributionFilterRegion @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'GeoRegions',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DistributionFilterRegion_ID,
                    ValueListProperty: 'ID',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Code',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Description',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    Theater                  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'Theaters',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Theater_BusinessPartner,
                    ValueListProperty: 'BusinessPartner',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'BusinessPartnerFullName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    Circuit                  @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'CustomerGroup',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Circuit_CustomerGroup,
                    ValueListProperty: 'CustomerGroup',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Name',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability1      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability1',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability1,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability2      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability2',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability2,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability3      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability3',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability3,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability4      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability4',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability4,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability5      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability5',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability5,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability6      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability6',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability6,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability7      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability7',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability7,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability8      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability8',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability8,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability9      @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability9',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: PlayBackCapability9,
                    ValueListProperty: 'CharcValue',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Characteristic',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    PlayBackCapability10     @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'PlayBackCapability10',
            SearchSupported: false,
            Parameters     : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: PlayBackCapability10,
                ValueListProperty: 'VariableValue',
            }, ],
        },
        Common.ValueListWithFixedValues: false
    );
};

annotate service.DCPMaterials with {
    DCPMaterialNumber @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'DCPProducts',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: DCPMaterialNumber_Product,
                    ValueListProperty: 'Product',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ProductName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
};

annotate service.CPLDetail with {
    CPLUUID @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'CplList',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: CPLUUID,
                    ValueListProperty: 'LinkedCPLUUID',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'LinkedCTT',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'DCP',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
};
