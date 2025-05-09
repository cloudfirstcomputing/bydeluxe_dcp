using from '../../srv/dcp-service';
using from '../../srv/external/YY1_PROFORMAREPORT_CDS_0001.csn';

annotate BookingOrderService.S4H_ProformaReport with @(
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
            Value : AdditionalMaterialGroup1,
            Label : '{i18n>Additionalmaterialgroup11}',
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
            Value : CreationDate,
            Label : '{i18n>Creationdate1}',
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
            Value : Plant,
            Label : '{i18n>Plant}',
        },
        {
            $Type : 'UI.DataField',
            Value : PlayEndDate,
            Label : '{i18n>Playenddate2}',
        },
        {
            $Type : 'UI.DataField',
            Value : PlayStartDate,
            Label : '{i18n>Playstartdate1}',
        },
        {
            $Type : 'UI.DataField',
            Value : RequestID,
            Label : '{i18n>Requestid1}',
        },
        {
            $Type : 'UI.DataField',
            Value : PricingReferenceMaterial,
            Label : '{i18n>Pricingreferencematerial}',
        },
        {
            $Type : 'UI.DataField',
            Value : ShippingCondition,
            Label : '{i18n>Shippingcondition1}',
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
);

annotate BookingOrderService.S4H_ProformaReport with {
    CreationDate @Common.Label : 'CreationDate'
};

annotate BookingOrderService.S4H_ProformaReport with {
    SalesDocument @Common.Label : 'SalesDocument'
};

annotate BookingOrderService.S4H_ProformaReport with {
    PartnerFunction @Common.Label : 'PartnerFunction'
};

