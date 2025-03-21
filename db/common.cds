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
using {YY1_I_SHIPPINGPOINT_CDS_0001 as S4_ShippingPoint} from '../srv/external/YY1_I_SHIPPINGPOINT_CDS_0001';
using {YY1_I_SHIPPINGTYPE_CDS_0001 as S4_ShippingType} from '../srv/external/YY1_I_SHIPPINGTYPE_CDS_0001';
using {YY1_PARAMETER_CDS_0001 as Parameter} from '../srv/external/YY1_PARAMETER_CDS_0001';
using {API_MATERIAL_DOCUMENT_SRV as MaterialDoc} from '../srv/external/API_MATERIAL_DOCUMENT_SRV';
using {API_PRODUCTION_ORDER_2_SRV as s4_productionOrder} from '../srv/external/API_PRODUCTION_ORDER_2_SRV';
using {API_PRODUCTGROUP_SRV as prdgrp} from '../srv/external/API_PRODUCTGROUP_SRV';
using {YY1_ADDITIONALMATERIALGRP1_CDS as prdgrp1} from '../srv/external/YY1_ADDITIONALMATERIALGRP1_CDS';

context api {

    entity Regions                as projection on region.ZI_Region;
    entity ShippingConditions     as projection on shipcond.ZI_ShippingCondition;

    entity BusinessPartners       as
        projection on bupa.A_BusinessPartner {
            key BusinessPartner,
                BusinessPartnerType,
                BusinessPartnerFullName
        }

    entity Products               as projection on product.A_Product;
    entity ProductGroup           as projection on prdgrp.A_ProductGroup;
    entity ProductGroup1          as projection on prdgrp1.YY1_AdditionalMaterialGrp1;
    entity DeliveryPriority       as projection on delvprior.YY1_DeliveryPriority;
    entity CustomerGroup          as projection on custgrp.A_CustomerGroup;
    entity Country                as projection on country.A_Country;
    entity Plants                 as projection on plant.A_Plant;
    entity StorageLocations       as projection on sloc.YY1_StorageLocation;
    entity SalesOrganizations     as projection on salesorg.A_SalesOrganization;
    entity DistributionChannels   as projection on distch.A_DistributionChannel;
    entity SalesOrderHeader       as projection on salesorderv2.A_SalesOrder;
    entity SalesDistricts         as projection on salesdist.A_SalesDistrict;
    entity SalesOrderItem         as projection on salesorderv2.A_SalesOrderItem;
    entity ShippingType_VH        as projection on S4_ShippingType.YY1_I_ShippingType;
    entity ShippingPoint_VH       as projection on S4_ShippingPoint.YY1_I_ShippingPoint;
    entity Parameters             as projection on Parameter.YY1_PARAMETER;
    entity MaterialDocumentHeader as projection on MaterialDoc.A_MaterialDocumentHeader;
    entity ProductionOrder        as projection on s4_productionOrder.A_ProductionOrder_2;
}
