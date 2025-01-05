using {API_BUSINESS_PARTNER as bupa} from '../srv/external/API_BUSINESS_PARTNER.csn';
using {ZAPI_SHIPPINGCONDITION as shipcond} from '../srv/external/ZAPI_SHIPPINGCONDITION';
using {API_PRODUCT_SRV as product} from '../srv/external/API_PRODUCT_SRV.csn';
using {YY1_DELIVERYPRIORITY_CDS as delvprior} from '../srv/external/YY1_DELIVERYPRIORITY_CDS';
using {API_CUSTOMERGROUP_SRV as custgrp} from '../srv/external/API_CUSTOMERGROUP_SRV';
using {API_COUNTRY_SRV as country} from '../srv/external/API_COUNTRY_SRV';

context api {

    entity ShippingConditions as projection on shipcond.ZI_ShippingCondition;

    entity BusinessPartners   as
        projection on bupa.A_BusinessPartner {
            key BusinessPartner,
                BusinessPartnerType,
                BusinessPartnerFullName
        }

    entity Products           as projection on product.A_Product;
    entity DeliveryPriority   as projection on delvprior.YY1_DeliveryPriority;
    entity CustomerGroup      as projection on custgrp.A_CustomerGroup;
    entity Country            as projection on country.A_Country;
}
