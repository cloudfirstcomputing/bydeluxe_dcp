using {
    managed,
    cuid,
    Country,
    sap.common.CodeList,
    Language
} from '@sap/cds/common';
using from '@sap/cds-common-content';
using api from './common';

namespace deluxe.distribution;

entity DCPMaterialVH as projection on api.ZI_DCPPRODUCT_VH;
entity TitleVH       as projection on api.ZI_TITLES_VH;
entity StudioVH      as projection on api.ZI_Studio;
entity TheaterVH     as projection on api.ZI_Theater;

entity DistroSpec : managed {
    key DistroSpecUUID     : UUID;
        DistroSpecID       : Integer default 0          @readonly;
        Name               : String(40)                 @mandatory;
        Title              : Association to one TitleVH @mandatory;
        ReleaseDate        : Date;
        RepertoryDate      : Date;
        Status             : Boolean;
        DeliverySequence1  : Association to api.ShippingConditions;
        DeliverySequence2  : Association to api.ShippingConditions;
        DeliverySequence3  : Association to api.ShippingConditions;
        DeliverySequence4  : Association to api.ShippingConditions;
        DeliverySequence5  : Association to api.ShippingConditions;
        DeliverySequence6  : Association to api.ShippingConditions;
        DeliverySequence7  : Association to api.ShippingConditions;
        DeliverySequence8  : Association to api.ShippingConditions;
        DeliverySequence9  : Association to api.ShippingConditions;
        DeliverySequence10 : Association to api.ShippingConditions;
        FieldControl       : Int16                      @odata.Type: 'Edm.Byte' enum {
            Inapplicable = 0;
            ReadOnly = 1;
            Optional = 3;
            Mandatory = 7;
        };
        to_Package         : Composition of many Package
                                 on to_Package.to_DistroSpec = $self;
        to_KeyPackage      : Composition of many KeyPackage
                                 on to_KeyPackage.to_DistroSpec = $self;
        to_StudioKey       : Composition of many StudioKey
                                 on to_StudioKey.to_DistroSpec = $self;
};

entity StudioKey {
    key StudioKeyUUID      : UUID;
        Studio             : Association to one StudioVH;
        KeyStartTime       : Time;
        KeyEndTime         : Time;
        InitialKeyDuration : Integer;
        NextKeyDuration    : Integer;
        OffsetBPD          : Integer;
        OffsetEPD          : Integer;
        // AggregateKey         : Boolean;
        ProcessKDMS        : Integer;
        // ProcessScreeningKDMS : Integer;
        // MaxKDMSDuration      : Integer;
        // StudioHoldOverRule   : String(10);
        // SalesTerritory       : Association to one api.SalesDistricts;
        to_DistroSpec      : Association to DistroSpec;
        to_CustomerRef     : Composition of many CustomerRef
                                 on to_CustomerRef.to_StudioKey = $self;
};

entity CustomerRef {
    key ID                : UUID;
        CustomerReference : String(40) @mandatory;
        to_StudioKey      : Association to StudioKey;
        to_DistroSpec     : Association to DistroSpec;
};

entity KeyPackage {
    key PackageUUID        : UUID;
        PackageName        : String(40) @mandatory;
        Priority           : Integer    @assert.range: [
            0,
            99
        ]  @mandatory;
        ValidFrom          : Date       @mandatory;
        ValidTo            : Date       @mandatory;
        OrderType          : orderType  @mandatory;
        to_CPLDetail       : Composition of many CPLDetail
                                 on to_CPLDetail.to_KeyPackage = $self;
        to_DistRestriction : Composition of many KeyDistRestrictions
                                 on to_DistRestriction.to_KeyPackage = $self;
        to_DistroSpec      : Association to DistroSpec;
};

entity Package {
    key PackageUUID        : UUID;
        PackageName        : String(40)                            @mandatory;
        Priority           : Integer                               @assert.range: [
            0,
            99
        ]  @mandatory;
        OrderType          : orderType                             @mandatory;
        ValidFrom          : Date                                  @mandatory;
        ValidTo            : Date                                  @mandatory;
        GofilexTitleID     : String;
        KrakenID           : String;
        DeliveryMethod1    : Association to api.ShippingConditions @mandatory;
        DeliveryMethod2    : Association to api.ShippingConditions;
        DeliveryMethod3    : Association to api.ShippingConditions;
        DeliveryMethod4    : Association to api.ShippingConditions;
        DeliveryMethod5    : Association to api.ShippingConditions;
        DeliveryMethod6    : Association to api.ShippingConditions;
        DeliveryMethod7    : Association to api.ShippingConditions;
        DeliveryMethod8    : Association to api.ShippingConditions;
        DeliveryMethod9    : Association to api.ShippingConditions;
        DeliveryMethod10   : Association to api.ShippingConditions;
        to_DCPMaterial     : Composition of many DCPMaterials
                                 on to_DCPMaterial.to_Package = $self;
        to_DistRestriction : Composition of many DistRestrictions
                                 on to_DistRestriction.to_Package = $self;
        to_DistroSpec      : Association to DistroSpec;
}

entity DistRestrictions : cuid {
    Theater                    : Association to one TheaterVH;
    Circuit                    : Association to one api.CustomerGroup;
    DistributionFilterRegion   : Association to one GeoRegions;
    // DistributionFilterCountry  : Country;
    // DistributionFilterCity     : String;
    // DistributionFilterPostal   : String;
    DistributionFilterLanguage : Language;
    PlayBackCapability1        : String(40);
    PlayBackCapability2        : String(40);
    PlayBackCapability3        : String(40);
    PlayBackCapability4        : String(40);
    PlayBackCapability5        : String(40);
    PlayBackCapability6        : String(40);
    PlayBackCapability7        : String(40);
    PlayBackCapability8        : String(40);
    PlayBackCapability9        : String(40);
    PlayBackCapability10       : String(40);
    TrailMixSub                : trailMix;
    to_Package                 : Association to Package;
    to_DistroSpec              : Association to DistroSpec;
};

entity KeyDistRestrictions : cuid {
    Theater                    : Association to one TheaterVH;
    Circuit                    : Association to one api.CustomerGroup;
    DistributionFilterRegion   : Association to one GeoRegions;
    // DistributionFilterCountry  : Country;
    // DistributionFilterCity     : String;
    // DistributionFilterPostal   : String;
    DistributionFilterLanguage : Language;
    PlayBackCapability1        : String(40);
    PlayBackCapability2        : String(40);
    PlayBackCapability3        : String(40);
    PlayBackCapability4        : String(40);
    PlayBackCapability5        : String(40);
    PlayBackCapability6        : String(40);
    PlayBackCapability7        : String(40);
    PlayBackCapability8        : String(40);
    PlayBackCapability9        : String(40);
    PlayBackCapability10       : String(40);
    TrailMixSub                : trailMix;
    to_KeyPackage              : Association to KeyPackage;
    to_DistroSpec              : Association to DistroSpec;
};

entity CPLDetail : cuid {
            CPLUUID       : String(40) @mandatory;
    virtual CTT           : String;
    virtual Email         : Boolean;
    virtual Download      : Boolean;
            to_KeyPackage : Association to KeyPackage;
}

entity DCPMaterials {
    key     DCPMaterialUUID          : UUID;
            DCPMaterialNumber        : Association to one DCPMaterialVH @mandatory;
            PublishDateOffset        : Integer                          @assert.range: [
                0,
                999
            ];
    virtual CTT                      : String;
    virtual CPLUUID                  : String;
            RevealPublishGlobalDate  : Date;
            RevealPublishGlobalTime  : Time;
            RevealPublishLocalDate   : Date;
            RevealPublishLocalTime   : Time;
            SatelliteFlightStartDate : Date;
            SatelliteFlightStartTime : Time;
            SatelliteFlightEndDate   : Date;
            SatelliteFlightEndTime   : Time;
            to_Package               : Association to Package;
            to_DistroSpec            : Association to DistroSpec;
}

entity DCPMaterialMapping : cuid, managed {
    ShippingType  : String(2);
    Variable      : String(200);
    Material      : String(40);
    MaterialGroup : String(10);
    Plant         : String(4);
    CompanyCode   : String(4);
    ProfitCenter  : String(10);
}

entity GeoRegions {
    key ID          : String(4);
        Code        : String(10);
        Description : String(100);
        _Territory  : Association to one GeoRegions;
};

entity GeoCountries {
    key ID         : String(5);
        Country    : String(3);
        SAPCountry : String(3);
        _Region    : Association to one GeoRegions;
}

type orderType : Association to OrderType;
type trailMix  : Association to TrailMix;

entity OrderType : CodeList {
    key code : String(4);
};

entity TrailMix : CodeList {
    key code : String(4);
};

entity KeyRules : cuid, managed {
    Rule                      : Integer;
    Country                   : String(3);
    Studio                    : String(10);
    DeluxeBookClassType       : String(40);
    ClientBookClassType       : String(40);
    InitialKeyStartCalcOrigin : String(200);
    InitialKeyStartOffset     : String(40);
    InitialKeyEndCalcOrigin   : String(200);
    InitialKeyEndOffset       : String(40);
    NextKeyStartCalcOrigin    : String(100);
    NextKeyEndCalcOrigin      : String(100);
    NextKeyEndOffset          : String(100);
}

entity ContentRules : cuid, managed {
    Rule                : Integer;
    DeliveryMethod      : String(2);
    Country             : String(3);
    DeluxeBookClassType : String(40);
    ClientBookClassType : String(40);
    CutoffCalcOrigin    : String(100);
    OffsetStartOffset   : String(100);
}
