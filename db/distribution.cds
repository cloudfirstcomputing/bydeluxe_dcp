using {
    managed,
    cuid
} from '@sap/cds/common';
using api from './common';

namespace deluxe.distribution;

entity DistroSpec : managed {
    key DistroSpecUUID    : UUID;
        DistroSpecID      : Integer default 0 @readonly;
        Name              : String(40)        @mandatory;
        Title             : String(40)        @mandatory;
        Studio            : Association to one api.BusinessPartners;
        CustomerReference : String(40);
        DCPMaterial       : Association to one api.Products;
        ValidFrom         : Date              @mandatory;
        ValidTo           : Date              @mandatory;
        FieldControl      : Int16             @odata.Type: 'Edm.Byte' enum {
            Inapplicable = 0;
            ReadOnly     = 1;
            Optional     = 3;
            Mandatory    = 7;
        };
        to_Package        : Composition of many Package
                                on to_Package.to_DistroSpec = $self;
};

entity Package {
    key PackageUUID               : UUID;
        PackageName               : String(40)                                @mandatory;
        Priority                  : String(2)                                 @mandatory;
        Theater                   : String(10);
        DistributionFilterRegion  : String(3);
        DistributionFilterCountry : String(3);
        DistributionFilterOther   : String(3);
        DeliveryMethod            : Association to one api.ShippingConditions @mandatory;
        DeliveryKind              : String(2);
        ValidFrom                 : Date                                      @mandatory;
        ValidTo                   : Date                                      @mandatory;
        to_DCPMaterial            : Composition of many DCPMaterials
                                        on to_DCPMaterial.to_Package = $self;
        to_DistroSpec             : Association to DistroSpec;
}

entity DCPMaterials {
    key DCPMaterialUUID : UUID;
        CTT             : String(40) @mandatory;
        CPLName         : String(40) @mandatory;
        Picture         : String(2)  @mandatory;
        Audio           : String(2)  @mandatory;
        // DCPMaterialText : String(40) @mandatory;
        to_Package      : Association to Package;
        to_DistroSpec   : Association to DistroSpec;
// Title = to_DistroSpec.Title;
}

entity DCPMaterialConfig : cuid {
    Plant                   : String(4);
    StorageLocation         : String(4);
    ProductSalesOrg         : String(4);
    ProductDistributionChnl : String(2);
};
