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
            Value : ProductDesc,
            Label : '{i18n>ProductDescription}',
        },
        {
            $Type : 'UI.DataField',
            Value : MaterialGroup,
            Label : '{i18n>MaterialGroup}',
        },
        {
            $Type : 'UI.DataField',
            Value : AdditionalMaterialGroup1,
            Label : '{i18n>Additionalmaterialgroup1}',
        },
         {
            $Type : 'UI.DataField',
            Value : AdditionalMaterialGroup1Name,
            Label : '{i18n>AdditionalMaterialGroup1Name}',
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
            Value : PlantName,
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
            Value : OverallSDProcessStatusDesc,
            Label : '{i18n>OverallSDProcessStatusDesc}',
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
        // {
        //     $Type : 'UI.DataField',
        //     Value : ActualGoodsMovementDate,
        //     Label : '{i18n>Actualgoodsmovementdate}',
        // },
        {
            $Type : 'UI.DataField',
            Value : BPCountry,
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
        {
            $Type : 'UI.DataField',
            Value : DeliveryStatusDescription,
            Label : '{i18n>DeliveryStatusDescription}',
        },
        {
            $Type : 'UI.DataField',
            Value : ShipDate,
            Label : '{i18n>Shipdate1}',
        },
        {
            $Type : 'UI.DataField',
            Value : RegionNameDes,
            Label : '{i18n>RegionName}',
        }
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
                Value : PlantName,
                Label : '{i18n>Plantname}',
            },
            {
                $Type : 'UI.DataField',
                Value : BPPostalCode,
                Label : '{i18n>Postalcode}',
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
                Value : BPCountry,
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
            {
                $Type : 'UI.DataField',
                Value : BookerName,
                Label : '{i18n>Bookername}',
            },
            {
                $Type : 'UI.DataField',
                Value : BPCityName,
                Label : '{i18n>Cityname}',
            },
            {
                $Type : 'UI.DataField',
                Value : NetAmount,
                Label : '{i18n>Netamount}',
            },
            {
                $Type : 'UI.DataField',
                Value : TransactionCurrency,
                Label : '{i18n>Transactioncurrency}',
            },
            {
                $Type : 'UI.DataField',
                Value : ReferenceSDDocument,
                Label : '{i18n>Referencesddocument1}',
            },
            {
                $Type : 'UI.DataField',
                Value : ReferenceBusinessPartner,
                Label : 'Ship-To BP',
            },
            {
                $Type : 'UI.DataField',
                Value : BPRegion,
                Label : '{i18n>DistributionFilterRegion}',
            },
            {
                $Type : 'UI.DataField',
                Value : BPStreetName,
                Label : '{i18n>Streetname}',
            },
            {
                $Type : 'UI.DataField',
                Value : ShippingPoint,
                Label : '{i18n>Shippingpoint}',
            },
            {
                $Type : 'UI.DataField',
                Value : ShipDate,
                Label : '{i18n>ShipDate}',
            },
                   {
            $Type : 'UI.DataField',
            Value : ProductDesc,
            Label : '{i18n>ProductDescription}',
        },
         {
            $Type : 'UI.DataField',
            Value : DeliveryStatusDescription,
            Label : '{i18n>DeliveryStatusDescription}',
        },
         {
            $Type : 'UI.DataField',
            Value : OverallSDProcessStatusDesc,
            Label : '{i18n>OverallSDProcessStatusDesc}',
        },
         {
            $Type : 'UI.DataField',
            Value : RegionNameDes,
            Label : '{i18n>RegionName}',
        },
         {
            $Type : 'UI.DataField',
            Value : AdditionalMaterialGroup1Name,
            Label : '{i18n>AdditionalMaterialGroup1Name}',
        }
        ],
    },
    UI.HeaderInfo : {
        TypeName : '{i18n>Proforma}',
        TypeNamePlural : '{i18n>Proforma}',
        Title : {
            $Type : 'UI.DataField',
            Value : SalesDocument,
        },
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

