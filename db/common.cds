using {API_BUSINESS_PARTNER as bupa} from '../srv/external/API_BUSINESS_PARTNER.csn';
using {YY1_SHIPPINGCONDITION_CDS as shipcond} from '../srv/external/YY1_SHIPPINGCONDITION_CDS.csn';
using {API_PRODUCT_SRV as product} from '../srv/external/API_PRODUCT_SRV.csn';

context api {

    entity ShippingConditions as projection on shipcond.YY1_ShippingCondition;

    entity BusinessPartners   as
        projection on bupa.A_BusinessPartner {
            key BusinessPartner,
                BusinessPartnerType,
                BusinessPartnerFullName
        }

    entity Products           as projection on product.A_Product;
}
