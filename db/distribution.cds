using {managed} from '@sap/cds/common';

namespace deluxe.distribution;

using {API_BUSINESS_PARTNER as bupa} from '../srv/external/API_BUSINESS_PARTNER';
using {YY1_SHIPPINGCONDITION_CDS as shipcond} from '../srv/external/YY1_SHIPPINGCONDITION_CDS';

entity BusinessPartners  as
    projection on bupa.A_BusinessPartner {
        key BusinessPartner,
            BusinessPartnerType,
            BusinessPartnerFullName
    }

entity ShippingConditions as projection on shipcond.YY1_ShippingCondition;

entity DistroSpec : managed {
    key DistroSpecUUID    : UUID;
        DistroSpecID      : Integer default 0 @readonly;
        Name              : String(40)        @mandatory;
        Title             : String(40)        @mandatory;
        Studio            : Association to one BusinessPartners;
        CustomerReference : String(40);
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
        PackageName               : String(40)                           @mandatory;
        Priority                  : String(2)                            @mandatory;
        Theater                   : String(10);
        DistributionFilterRegion  : String(3);
        DistributionFilterCountry : String(3);
        DistributionFilterOther   : String(3);
        DeliveryMethod            : Association to one ShippingConditions @mandatory;
        DeliveryKind              : String(2);
        ValidFrom                 : Date                                 @mandatory;
        ValidTo                   : Date                                 @mandatory;
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
        DCPMaterialText : String(40) @mandatory;
        DCPMaterial     : String(18);
        to_Package      : Association to Package;
        to_DistroSpec   : Association to DistroSpec;
// Title = to_DistroSpec.Title;
}
