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
using {API_BILLING_DOCUMENT_SRV as Billing} from '../srv/external/API_BILLING_DOCUMENT_SRV';
using {Distrospec_SRV as Distro} from '../srv/external/Distrospec_SRV';
using {YY1_CUSTOMERCOMPANYBYPLANT_CDS as custplant} from '../srv/external/YY1_CUSTOMERCOMPANYBYPLANT_CDS';
using {YY1_SLSORGANIZATIONDISTRCH_CDS as slsdist} from '../srv/external/YY1_SLSORGANIZATIONDISTRCH_CDS';
using {API_COMPANYCODE_SRV as company} from '../srv/external/API_COMPANYCODE_SRV';
using {YY1_CLFNCHARACTERISTIC_CDS as charac} from '../srv/external/YY1_CLFNCHARACTERISTIC_CDS';
using {ZCL_INVFORM as invoice} from '../srv/external/ZCL_INVFORM';
using {CE_BANK_0003 as S4_Bank} from '../srv/external/CE_BANK_0003.csn';
using {API_BILL_OF_MATERIAL_SRV as matbom} from '../srv/external/API_BILL_OF_MATERIAL_SRV';
using {PRODUCTIONVERSION as prodver} from '../srv/external/PRODUCTIONVERSION';
using {YY1_VALUATIONAREA_CDS as valuation} from '../srv/external/YY1_VALUATIONAREA_CDS';

context api {

    entity Regions                      as projection on region.ZI_Region;
    entity ShippingConditions           as projection on shipcond.ZI_ShippingCondition;

    entity BusinessPartners             as
        projection on bupa.A_BusinessPartner {
            key BusinessPartner,
                BusinessPartnerType,
                BusinessPartnerFullName
        }

    entity BusinessPartnersV1           as
        projection on bupa.A_BusinessPartner {
            key BusinessPartner,
                BusinessPartnerType,
                BusinessPartnerFullName
        }

    entity Products                     as projection on product.A_Product;
    entity ProductGroup                 as projection on prdgrp.A_ProductGroup;
    entity ProductGroup1                as projection on prdgrp1.YY1_AdditionalMaterialGrp1;
    entity DeliveryPriority             as projection on delvprior.YY1_DeliveryPriority;
    entity CustomerGroup                as projection on custgrp.A_CustomerGroup;
    entity Country                      as projection on country.A_Country;
    entity CountryText                  as projection on country.A_CountryText;
    entity Plants                       as projection on plant.A_Plant;
    entity StorageLocations             as projection on sloc.YY1_StorageLocation;
    entity SalesOrganizations           as projection on salesorg.A_SalesOrganization;
    entity DistributionChannels         as projection on distch.A_DistributionChannel;
    entity SalesOrderHeader             as projection on salesorderv2.A_SalesOrder;
    entity SalesDistricts               as projection on salesdist.A_SalesDistrict;
    entity SalesOrderItem               as projection on salesorderv2.A_SalesOrderItem;
    entity SalesOrderItemText           as projection on salesorderv2.A_SalesOrderItemText;
    entity ShippingType_VH              as projection on S4_ShippingType.YY1_I_ShippingType;
    entity ShippingPoint_VH             as projection on S4_ShippingPoint.YY1_I_ShippingPoint;
    entity Parameters                   as projection on Parameter.YY1_PARAMETER;
    entity MaterialDocumentHeader       as projection on MaterialDoc.A_MaterialDocumentHeader;
    entity MaterialDocumentItem         as projection on MaterialDoc.A_MaterialDocumentItem;
    entity ProductionOrder              as projection on s4_productionOrder.A_ProductionOrder_2;
    entity BillingDocument              as projection on Billing.A_BillingDocument;
    entity BillingDocumentItem          as projection on Billing.A_BillingDocumentItem;
    entity CountriesApi                 as projection on Distro.Countries;
    entity BillingDocumentPartner       as projection on Billing.A_BillingDocumentPartner;
    entity BillingDocumentItemText      as projection on Billing.A_BillingDocumentItemText;
    entity BillingDocumentItemPrcgElmnt as projection on Billing.A_BillingDocumentItemPrcgElmnt;
    entity CustomerCompany              as projection on bupa.A_CustomerCompany;
    entity CustomerPlant                as projection on custplant.YY1_CustomerCompanyByPlant;
    entity SalesOrgDistCh               as projection on slsdist.YY1_SlsOrganizationDistrCh;
    entity Company                      as projection on company.A_CompanyCode;
    entity Characteristic               as projection on charac.YY1_ClfnCharacteristic;
    entity AddressPostal                as projection on invoice.AddressPostal;
    entity AddressPhoneNumber           as projection on invoice.AddressPhoneNumber;
    entity AddressEmailAddress          as projection on invoice.AddressEmailAddress;
    entity AddlCompanyCodeInformation   as projection on invoice.AddlCompanyCodeInformation;
    entity CoCodeCountryVATReg          as projection on invoice.CoCodeCountryVATReg;
    entity PaymentTermsText             as projection on invoice.PaymentTermsText;
    entity JournalEntryItem             as projection on invoice.JournalEntryItem;
    entity HouseBank                    as projection on invoice.HouseBank;
    entity PricingConditionTypeText     as projection on invoice.PricingConditionTypeText;
    entity SalesOrderHeaderPartner      as projection on salesorderv2.A_SalesOrderHeaderPartner;
    entity SalesOrderItemPartner        as projection on salesorderv2.A_SalesOrderItemPartner;
    entity CustSalesPartnerFunc         as projection on bupa.A_CustSalesPartnerFunc;

    entity Bank                         as
        projection on S4_Bank.Bank {
            *,
            _BankAddress
        };

    entity BankAddress                  as projection on S4_Bank.BankAddress;
    entity MaterialBOM                  as projection on matbom.MaterialBOM;
    entity ProductionVersion            as projection on prodver.ProductionVersion;
    entity YY1_ValuationArea            as projection on valuation.YY1_ValuationArea;
}
