using from '../../srv/dcp-service';
using from '../../srv/external/YY1_PROFORMAREPORT_CDS_0001.csn';

annotate BookingOrderService.S4H_ProformaReport with @(
    Capabilities.Deletable: false,
    Capabilities.SearchRestrictions.Searchable: false,
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : SalesDocument,
            Label : '{i18n>Salesdocument}',
        },
        {
            $Type : 'UI.DataField',
            Value : SalesDocumentItem,
            Label : '{i18n>Salesdocumentitem}',
        },
        {
            $Type : 'UI.DataField',
            Value : SalesDocumentItemText,
            Label : '{i18n>SalesDocumentItemText}',
        },
        {
            $Type : 'UI.DataField',
            Value : PricingReferenceMaterial,
            Label : '{i18n>Pricingreferencematerial}',
        },
        {
            $Type : 'UI.DataField',
            Value : AdditionalMaterialGroup1,
            Label : '{i18n>Additionalmaterialgroup1}',
        },
        {
            $Type : 'UI.DataField',
            Value : PlayStartDate,
            Label : '{i18n>Playstartdate}',
        },
        {
            $Type : 'UI.DataField',
            Value : PlayEndDate,
            Label : '{i18n>Playenddate}',
        },
        {
            $Type : 'UI.DataField',
            Value : Plant,
            Label : '{i18n>Plant}',
        },
        {
            $Type : 'UI.DataField',
            Value : CreationDate,
            Label : '{i18n>Creationdate}',
        },
        {
            $Type : 'UI.DataField',
            Value : LastChangeDate,
            Label : '{i18n>Lastchangedate}',
        },
        {
            $Type : 'UI.DataField',
            Value : OverallSDProcessStatus,
            Label : '{i18n>Overallsdprocessstatus}',
        },
        {
            $Type : 'UI.DataField',
            Value : PackageTitle,
            Label : '{i18n>Packagetitle}',
        },
        {
            $Type : 'UI.DataField',
            Value : RequestID,
            Label : '{i18n>Requestid}',
        },
        {
            $Type : 'UI.DataField',
            Value : ActualGoodsMovementDate,
            Label : '{i18n>Actualgoodsmovementdate}',
        },
        {
            $Type : 'UI.DataField',
            Value : Country,
            Label : '{i18n>DistributionFilterCountry}',
        },
        {
            $Type : 'UI.DataField',
            Value : ShippingCondition,
            Label : '{i18n>Shippingcondition}',
        },
        {
            $Type : 'UI.DataField',
            Value : TotalDeliveryStatus,
            Label : '{i18n>Totaldeliverystatus}',
        },
    ],
    UI.SelectionFields : [
        CreationDate,
        SalesDocument,
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>GeneralInfo}',
            ID : 'i18nGeneralInfo',
            Target : '@UI.FieldGroup#i18nGeneralInfo',
        },
    ],
    UI.FieldGroup #i18nGeneralInfo : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : SalesDocument,
            },
            {
                $Type : 'UI.DataField',
                Value : SalesDocumentItem,
                Label : '{i18n>Salesdocumentitem}',
            },
            {
                $Type : 'UI.DataField',
                Value : SalesDocumentItemText,
                Label : '{i18n>SalesDocumentItemText}',
            },
            {
                $Type : 'UI.DataField',
                Value : CreationDate,
            },
            {
                $Type : 'UI.DataField',
                Value : LastChangeDate,
                Label : '{i18n>Lastchangedate}',
            },
            {
                $Type : 'UI.DataField',
                Value : Plant,
                Label : '{i18n>Plant}',
            },
            {
                $Type : 'UI.DataField',
                Value : PlayStartDate,
                Label : '{i18n>Playstartdate}',
            },
            {
                $Type : 'UI.DataField',
                Value : PlayEndDate,
                Label : '{i18n>Playenddate}',
            },
            {
                $Type : 'UI.DataField',
                Value : PricingReferenceMaterial,
                Label : '{i18n>Pricingreferencematerial}',
            },
            {
                $Type : 'UI.DataField',
                Value : ActualGoodsMovementDate,
                Label : '{i18n>Actualgoodsmovementdate}',
            },
            {
                $Type : 'UI.DataField',
                Value : AdditionalMaterialGroup1,
                Label : '{i18n>Additionalmaterialgroup1}',
            },
            {
                $Type : 'UI.DataField',
                Value : AddressID,
                Label : '{i18n>Addressid}',
            },
            {
                $Type : 'UI.DataField',
                Value : Country,
                Label : '{i18n>DistributionFilterCountry}',
            },
            {
                $Type : 'UI.DataField',
                Value : OverallSDProcessStatus,
                Label : '{i18n>Overallsdprocessstatus}',
            },
            {
                $Type : 'UI.DataField',
                Value : PackageTitle,
                Label : '{i18n>Packagetitle}',
            },
            {
                $Type : 'UI.DataField',
                Value : PartnerFunction,
                Label : '{i18n>Partnerfunction}',
            },
            {
                $Type : 'UI.DataField',
                Value : RequestID,
                Label : '{i18n>Requestid}',
            },
            {
                $Type : 'UI.DataField',
                Value : ShippingCondition,
                Label : '{i18n>Shippingcondition}',
            },
            {
                $Type : 'UI.DataField',
                Value : TotalDeliveryStatus,
                Label : '{i18n>Totaldeliverystatus}',
            },
        ],
    },
);

annotate BookingOrderService.S4H_ProformaReport with {
    CreationDate @Common.Label : '{i18n>Creationdate}';     
    Plant @(
            Common.Text: {
            $value                : PlantName,
          ![@UI.TextArrangement]: #TextFirst,
        },
            Common.Label : '{i18n>Plant}',
        );
    
    TransactionCurrency @Semantics.currencyCode: true;
    NetAmount @Semantics.amount.currencyCode: 'TransactionCurrency'
};

annotate BookingOrderService.S4H_ProformaReport with {
    SalesDocument @Common.Label : '{i18n>Salesdocument}'
};

annotate BookingOrderService.S4H_ProformaReport with {
    PartnerFunction @Common.Label : 'PartnerFunction'
};

