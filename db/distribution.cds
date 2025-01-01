using {
    managed,
    cuid
} from '@sap/cds/common';
using api from './common';

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
        DCPMaterial       : Association to one DCPMaterialVH;
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
    key PackageUUID                     : UUID;
        PackageName                     : String(40)                                @mandatory;
        Priority                        : Association to one api.DeliveryPriority   @mandatory;
        Theater                         : Association to one TheaterVH;
        Circuit                         : String(10);
        StudioCircuitName               : String(10)                                @mandatory;
        DistributionFilterRegion        : String(3)                                 @mandatory;
        DistributionFilterCountry       : String(3)                                 @mandatory;
        DistributionFilterCity          : String(3)                                 @mandatory;
        DistributionFilterPostal        : String(3)                                 @mandatory;
        PrimaryTerritory                : String(5)                                 @mandatory enum {
            NORAM;
            APAC;
            LATAM;
            EMEA;
        };
        SecondaryTerritory              : String(5) enum {
            NORAM;
            APAC;
            LATAM;
            EMEA;
        };
        ContentIndicator                : String(1) enum {
            K;
            C
        };
        PrimaryTerritoryDeliveryMethod  : Association to one api.ShippingConditions @mandatory;
        SecondaryTerritoryDeliveryethod : Association to one api.ShippingConditions;
        Language                        : String(3);
        DeliveryKind                    : String(2);
        ValidFrom                       : Date                                      @mandatory;
        ValidTo                         : Date                                      @mandatory;
        to_DCPMaterial                  : Composition of many DCPMaterials
                                              on to_DCPMaterial.to_Package = $self;
        to_DistroSpec                   : Association to DistroSpec;
}

entity DCPMaterials {
    key DCPMaterialUUID : UUID;
        CTT             : String(40);
        CPLName         : String(40);
        Picture         : String(2);
        Audio           : String(2);
        Attribute1      : String(18);
        Attribute2      : String(18);
        Attribute3      : String(18);
        Attribute4      : String(18);
        Attribute5      : String(18);
        Attribute6      : String(18);
        Attribute7      : String(18);
        Attribute8      : String(18);
        Attribute9      : String(18);
        Attribute10     : String(18);
        // DCPMaterialText : String(40) @mandatory;
        to_Package      : Association to Package;
        to_DistroSpec   : Association to DistroSpec;
// Title = to_DistroSpec.Title;
}

entity DCPMaterialConfig : cuid, managed {
    Description      : String(40);
    to_SalesDelivery : Composition of many {
                           key ProductSalesOrg         : String(4);
                           key ProductDistributionChnl : String(2);
                       };
    to_Plant         : Composition of many {
                           key Plant           : String(4);
                               StorageLocation : String(4);
                       }
};
