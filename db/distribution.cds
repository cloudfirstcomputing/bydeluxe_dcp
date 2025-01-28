using {
    managed,
    cuid,
    Country,
// Language
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
    key DistroSpecUUID    : UUID;
        DistroSpecID      : Integer default 0          @readonly;
        Name              : String(40)                 @mandatory;
        Title             : Association to one TitleVH @mandatory;
        Studio            : Association to one StudioVH;
        CustomerReference : String(40);
        ValidFrom         : Date                       @mandatory;
        ValidTo           : Date                       @mandatory;
        FieldControl      : Int16                      @odata.Type: 'Edm.Byte' enum {
            Inapplicable = 0;
            ReadOnly     = 1;
            Optional     = 3;
            Mandatory    = 7;
        };
        to_Package        : Composition of many Package
                                on to_Package.to_DistroSpec = $self;
};

entity Package {
    key PackageUUID             : UUID;
        PackageName             : String(40)                                @mandatory;
        Priority                : Association to one api.DeliveryPriority   @mandatory;
        ContentIndicator        : String(1) enum {
            K;
            C
        };
        PrimaryDeliveryMethod   : Association to one api.ShippingConditions @mandatory;
        SecondaryDeliveryMethod : Association to one api.ShippingConditions;
        ValidFrom               : Date                                      @mandatory;
        ValidTo                 : Date                                      @mandatory;
        to_DCPMaterial          : Composition of many DCPMaterials
                                      on to_DCPMaterial.to_Package = $self;
        to_DistRestriction      : Composition of many DistRestrictions
                                      on to_DistRestriction.to_Package = $self;
        to_DistroSpec           : Association to DistroSpec;
}

entity DistRestrictions : cuid {
    Theater                   : Association to one TheaterVH;
    Circuit                   : Association to one api.CustomerGroup;
    DistributionFilterRegion  : Association to one api.Regions;
    DistributionFilterCountry : Country;
    DistributionFilterCity    : String;
    DistributionFilterPostal  : String;
    OffsetRule                : Integer @assert.range: [
        0,
        999
    ];
    // PrimaryPlant              : Association to one api.Plants;
    // SecondaryPlant            : Association to one api.Plants;
    to_Package                : Association to Package;
    to_DistroSpec             : Association to DistroSpec;
};

entity DCPMaterials {
    key DCPMaterialUUID   : UUID;
        DCPMaterialNumber : Association to one DCPMaterialVH @mandatory;
        virtual CTT       : String;
        virtual CPLUUID   : String;
        to_Package        : Association to Package;
        to_DistroSpec     : Association to DistroSpec;
}

entity DCPMaterialConfig : cuid, managed {
    AssetVaultID     : Association to one av.AssetVault @mandatory;
    to_SalesDelivery : Composition of many {
                           key ProductSalesOrg         : Association to one api.SalesOrganizations   @mandatory;
                           key ProductDistributionChnl : Association to one api.DistributionChannels @mandatory;
                       };
    to_Plant         : Composition of many {
                           key Plant           : Association to one api.Plants           @mandatory;
                               StorageLocation : Association to one api.StorageLocations @mandatory;
                       }
};
