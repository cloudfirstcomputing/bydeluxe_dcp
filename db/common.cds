using {API_BUSINESS_PARTNER as bupa} from '../srv/external/API_BUSINESS_PARTNER.csn';
using {ZAPI_SHIPPINGCONDITION as shipcond} from '../srv/external/ZAPI_SHIPPINGCONDITION';
using {API_PRODUCT_SRV as product} from '../srv/external/API_PRODUCT_SRV.csn';
using {YY1_DELIVERYPRIORITY_CDS as delvprior} from '../srv/external/YY1_DELIVERYPRIORITY_CDS';
using {API_CUSTOMERGROUP_SRV as custgrp} from '../srv/external/API_CUSTOMERGROUP_SRV';
using {API_COUNTRY_SRV as country} from '../srv/external/API_COUNTRY_SRV';
using {ZAPI_REGION as region} from '../srv/external/ZAPI_REGION';
using {API_PLANT_SRV as plant} from '../srv/external/API_PLANT_SRV';
using {YY1_STORAGELOCATION_CDS as sloc} from '../srv/external/YY1_STORAGELOCATION_CDS';
using {API_SALESORGANIZATION_SRV as salesorg} from '../srv/external/API_SALESORGANIZATION_SRV';
using {API_DISTRIBUTIONCHANNEL_SRV as distch} from '../srv/external/API_DISTRIBUTIONCHANNEL_SRV';
using {API_SALES_ORDER_V2_SRV as salesorderv2} from '../srv/external/API_SALES_ORDER_V2_SRV';
using {API_SALESDISTRICT_SRV as salesdist} from '../srv/external/API_SALESDISTRICT_SRV';

context api {

    entity Regions              as projection on region.ZI_Region;
    entity ShippingConditions   as projection on shipcond.ZI_ShippingCondition;

    entity BusinessPartners     as
        projection on bupa.A_BusinessPartner {
            key BusinessPartner,
                BusinessPartnerType,
                BusinessPartnerFullName
        }

    entity Products             as projection on product.A_Product;
    entity DeliveryPriority     as projection on delvprior.YY1_DeliveryPriority;
    entity CustomerGroup        as projection on custgrp.A_CustomerGroup;
    entity Country              as projection on country.A_Country;
    entity Plants               as projection on plant.A_Plant;
    entity StorageLocations     as projection on sloc.YY1_StorageLocation;
    entity SalesOrganizations   as projection on salesorg.A_SalesOrganization;
    entity DistributionChannels as projection on distch.A_DistributionChannel;
    entity SalesOrderHeader     as projection on salesorderv2.A_SalesOrder;
    entity SalesDistricts       as projection on salesdist.A_SalesDistrict;
    entity SalesOrderItem       as projection on salesorderv2.A_SalesOrderItem;
}
