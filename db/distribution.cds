using {
    managed,
    cuid,
    Country,
    Language
} from '@sap/cds/common';
using from '@sap/cds-common-content';
using api from './common';
using deluxe.assetvault as av from './asset-vault';

namespace deluxe.distribution;

entity DCPMaterialVH as projection on api.Products;
entity TitleVH       as projection on api.Products;
entity StudioVH      as projection on api.BusinessPartners;
entity TheaterVH     as projection on api.BusinessPartners;

entity DistroSpec : managed {
    key DistroSpecUUID     : UUID;
        DistroSpecID       : Integer default 0          @readonly;
        Name               : String(40)                 @mandatory;
        Title              : Association to one TitleVH @mandatory;
        ReleaseDate        : Date;
        RepertoryDate      : Date;
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
            ReadOnly     = 1;
            Optional     = 3;
            Mandatory    = 7;
        };
        to_Package         : Composition of many Package
                                 on to_Package.to_DistroSpec = $self;
        to_KeyPackage      : Composition of many KeyPackage
                                 on to_KeyPackage.to_DistroSpec = $self;
        to_StudioKey       : Composition of many StudioKey
                                 on to_StudioKey.to_DistroSpec = $self;
};

entity StudioKey {
    key StudioKeyUUID        : UUID;
        Studio               : Association to one StudioVH;
        KeyStartTime         : Time;
        KeyEndTime           : Time;
        InitialKeyDuration   : Integer;
        NextKeyDuration      : Integer;
        OffsetBPD            : Integer;
        OffsetEPD            : Integer;
        AggregateKey         : Boolean;
        ProcessKDMS          : Integer;
        ProcessScreeningKDMS : Integer;
        MaxKDMSDuration      : Integer;
        StudioHoldOverRule   : String(10);
        SalesTerritory       : Association to one api.SalesDistricts;
        to_DistroSpec        : Association to DistroSpec;
        to_CustomerRef       : Composition of many CustomerRef
                                   on to_CustomerRef.to_StudioKey = $self;
};

entity CustomerRef {
    key ID                : UUID;
        CustomerReference : String(40);
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
        OrderType          : String(1) enum {
            Content = 'C';
            Keys    = 'K';
            Both    = 'B';
        };
        to_CPLDetail       : Composition of many CPLDetail
                                 on to_CPLDetail.to_KeyPackage = $self;
        to_DistRestriction : Composition of many KeyDistRestrictions
                                 on to_DistRestriction.to_KeyPackage = $self;
        to_DistroSpec      : Association to DistroSpec;
};

entity Package {
    key PackageUUID        : UUID;
        PackageName        : String(40) @mandatory;
        Priority           : Integer    @assert.range: [
            0,
            99
        ]  @mandatory;
        OrderType          : String(1) enum {
            Content = 'C';
            Keys    = 'K';
            Both    = 'B';
        };
        ValidFrom          : Date       @mandatory;
        ValidTo            : Date       @mandatory;
        GofilexTitleID     : String;                 
        DeliveryMethod1    : Association to api.ShippingConditions;
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
    DistributionFilterRegion   : Association to one api.Regions;
    DistributionFilterCountry  : Country;
    DistributionFilterCity     : String;
    DistributionFilterPostal   : String;
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
    TrailMixSub                : String(1) enum {
        Monthly = 'M';
        Weekly  = 'W';
        NA      = '0';
    };
    to_Package                 : Association to Package;
    to_DistroSpec              : Association to DistroSpec;
};

entity KeyDistRestrictions : cuid {
    Theater                    : Association to one TheaterVH;
    Circuit                    : Association to one api.CustomerGroup;
    DistributionFilterRegion   : Association to one api.Regions;
    DistributionFilterCountry  : Country;
    DistributionFilterCity     : String;
    DistributionFilterPostal   : String;
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
    TrailMixSub                : String(1) enum {
        Monthly = 'M';
        Weekly  = 'W';
        NA      = '0';
    };
    to_KeyPackage              : Association to KeyPackage;
    to_DistroSpec              : Association to DistroSpec;
};

entity CPLDetail : cuid {
    CPLUUID          : String(40) @mandatory;
    virtual CTT      : String;
    virtual Email    : Boolean;
    virtual Download : Boolean;
    to_KeyPackage    : Association to KeyPackage;
}

entity DCPMaterials {
    key DCPMaterialUUID          : UUID;
        DCPMaterialNumber        : Association to one DCPMaterialVH @mandatory;
        PublishDateOffset        : Integer                          @assert.range: [
            0,
            999
        ];
        virtual CTT              : String;
        virtual CPLUUID          : String;
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

entity DCPMaterialConfig : cuid, managed {
    ProjectID        : Association to one av.DistributionDcp @mandatory;
    to_SalesDelivery : Composition of many {
                           key ProductSalesOrg         : Association to one api.SalesOrganizations   @mandatory;
                           key ProductDistributionChnl : Association to one api.DistributionChannels @mandatory;
                       };
    to_Plant         : Composition of many {
                           key Plant           : Association to one api.Plants           @mandatory;
                               StorageLocation : Association to one api.StorageLocations @mandatory;
                       }
};

entity DCPMaterialMapping : cuid, managed {
    ShippingType  : String(2);
    Variable      : String(200);
    Material      : String(40);
    MaterialGroup : String(10);
}
