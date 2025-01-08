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
        // Theater                          : Association to one TheaterVH;
        // Circuit                          : Association to one api.CustomerGroup;
        // StudioCircuitName                : String(10)                                @mandatory;
        // DistributionFilterRegion         : Country                                   @mandatory;
        // DistributionFilterCountry        : Country                                   @mandatory;
        // DistributionFilterCity           : String                                    @mandatory;
        // DistributionFilterPostal         : String                                    @mandatory;
        // PrimaryTerritory                 : String(5)                                 @mandatory enum {
        //     NORAM;
        //     APAC;
        //     LATAM;
        //     EMEA;
        // };
        // SecondaryTerritory               : String(5) enum {
        //     NORAM;
        //     APAC;
        //     LATAM;
        //     EMEA;
        // };
        ContentIndicator        : String(1) enum {
            K;
            C
        };
        PrimaryDeliveryMethod   : Association to one api.ShippingConditions @mandatory;
        SecondaryDeliveryMethod : Association to one api.ShippingConditions;
        // BookingType                      : String(2) enum {
        //     NO;
        //     U;
        // };
        // DeliveryKind                     : String(2);
        // DepotID                          : Integer                                   @assert.range: [
        //     1,
        //     9
        // ];
        // BranchID                         : Integer                                   @assert.range: [
        //     1,
        //     99
        // ];
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
    to_Package                : Association to Package;
    to_DistroSpec             : Association to DistroSpec;
};

entity DCPMaterials {
    key DCPMaterialUUID   : UUID;
        DCPMaterialNumber : Association to one DCPMaterialVH @mandatory;
        virtual CTT       : String;
        virtual CPLUUID   : String;
        // PrintFormat       : String(3);
        // FilmStock         : String(3);
        // Audio             : String(2);
        // Language          : Language                         @mandatory;
        // SubtitleType      : String(2)                        @assert.format: '^[A-Z]+$';
        // SoundID           : String(8);
        // MediaType         : String(8);
        // ReelLength        : String(8);
        // DTSQuantity       : String(8);
        // AuditoriumType    : String(1)                        @assert.format: '^[A-Z]+$';
        // ScreenID          : Integer                          @assert.range : [
        //     1,
        //     9
        // ];
        // SingleScreen      : Integer                          @assert.range : [
        //     1,
        //     9
        // ];
        // HoldforRelease    : Boolean;
        // ApprovedScreens   : Integer                          @assert.range : [
        //     1,
        //     99
        // ];
        // Attribute1        : String(18);
        // Attribute2        : String(18);
        // Attribute3        : String(18);
        // Attribute4        : String(18);
        // Attribute5        : String(18);
        // Attribute6        : String(18);
        // Attribute7        : String(18);
        // Attribute8        : String(18);
        // Attribute9        : String(18);
        // Attribute10       : String(18);
        to_Package        : Association to Package;
        to_DistroSpec     : Association to DistroSpec;
}

entity DCPMaterialConfig : cuid, managed {
    AssetVaultID     : Association to one av.AssetVault @mandatory;
    to_SalesDelivery : Composition of many {
                           key ProductSalesOrg         : String(4) @mandatory;
                           key ProductDistributionChnl : String(2) @mandatory;
                       };
    to_Plant         : Composition of many {
                           key Plant           : String(4) @mandatory;
                               StorageLocation : String(4) @mandatory;
                       }
};
