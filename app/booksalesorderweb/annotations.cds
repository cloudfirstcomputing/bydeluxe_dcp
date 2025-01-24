using BookingOrderService as service from '../../srv/dcp-service';
using from '../../db/dcp';

annotate service.BookingSalesOrder with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Bookingid}',
                Value : BookingID,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Applicationid}',
                Value : ApplicationID,
            },
            {
                $Type : 'UI.DataField',
                Value : DistroSpecID,
                Label : '{i18n>Distrospecid}',
            },
            {
                $Type : 'UI.DataField',
                Value : DistroSpecPackageID,
                Label : '{i18n>Distrospecpackageid}',
            },
            {
                $Type : 'UI.DataField',
                Value : DistroSpecPackageName,
                Label : '{i18n>Distrospecpackagename}',
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Soldtoparty}',
                Value : SoldToParty,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Salesorganization}',
                Value : SalesOrganization,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Distributionchannel}',
                Value : DistributionChannel,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Organizationdivision}',
                Value : OrganizationDivision,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Purchaseorderbycustomer}',
                Value : PurchaseOrderByCustomer,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Creationdate}',
                Value : CreationDate,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Creationtime}',
                Value : CreationTime,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Totalnetamount}',
                Value : TotalNetAmount,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Transactioncurrency}',
                Value : TransactionCurrency,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Shippingcondition}',
                Value : ShippingCondition,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Shipdate}',
                Value : ShipDate,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Releaseid}',
                Value : ReleaseID,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Theaterid}',
                Value : TheaterID,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Circuit}',
                Value : Circuit,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Timeofentry}',
                Value : TimeofEntry,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Bookingtype}',
                Value : BookingType,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Packagename}',
                Value : PackageName,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Uuid}',
                Value : UUID,
            },
            {
                $Type : 'UI.DataField',
                Value : ApprovedScreensList,
                Label : 'ApprovedScreensList',
            },
            {
                $Type : 'UI.DataField',
                Value : AuditoriumType,
                Label : 'AuditoriumType',
            },
            {
                $Type : 'UI.DataField',
                Value : BranchID,
                Label : 'BranchID',
            },
            {
                $Type : 'UI.DataField',
                Value : CountryCode,
                Label : 'CountryCode',
            },
            {
                $Type : 'UI.DataField',
                Value : DeliveryOnDate,
                Label : 'DeliveryOnDate',
            },
            {
                $Type : 'UI.DataField',
                Value : DepotID,
                Label : 'DepotID',
            },
            {
                $Type : 'UI.DataField',
                Value : EntityID,
                Label : 'EntityID',
            },
            {
                $Type : 'UI.DataField',
                Value : FilmStock,
                Label : 'FilmStock',
            },
            {
                $Type : 'UI.DataField',
                Value : Key_Content,
                Label : 'Key_Content',
            },
            {
                $Type : 'UI.DataField',
                Value : Language,
                Label : 'Language',
            },
            {
                $Type : 'UI.DataField',
                Value : PlayEndDate,
                Label : 'PlayEndDate',
            },
            {
                $Type : 'UI.DataField',
                Value : PlayStartDate,
                Label : 'PlayStartDate',
            },
            {
                $Type : 'UI.DataField',
                Value : PrintFormat,
                Label : 'PrintFormat',
            },
            {
                $Type : 'UI.DataField',
                Value : PrintQuality,
                Label : 'PrintQuality',
            },
            {
                $Type : 'UI.DataField',
                Value : ReleaseHold,
                Label : 'ReleaseHold',
            },
            {
                $Type : 'UI.DataField',
                Value : Releasempm,
                Label : 'Releasempm',
            },
            {
                $Type : 'UI.DataField',
                Value : ReleaseNameHO,
                Label : 'ReleaseNameHO',
            },
            {
                $Type : 'UI.DataField',
                Value : ReleaseShortName,
                Label : 'ReleaseShortName',
            },
            {
                $Type : 'UI.DataField',
                Value : ReleaseTitleHO,
                Label : 'ReleaseTitleHO',
            },
            {
                $Type : 'UI.DataField',
                Value : ScreenID,
                Label : 'ScreenID',
            },
            {
                $Type : 'UI.DataField',
                Value : ScreeningIndicator,
                Label : 'ScreeningIndicator',
            },
            {
                $Type : 'UI.DataField',
                Value : ShipPriority,
                Label : 'ShipPriority',
            },
            {
                $Type : 'UI.DataField',
                Value : SingleScreen,
                Label : 'SingleScreen',
            },
            {
                $Type : 'UI.DataField',
                Value : SoundID,
                Label : 'SoundID',
            },
            {
                $Type : 'UI.DataField',
                Value : StartDate,
                Label : 'StartDate',
            },
            {
                $Type : 'UI.DataField',
                Value : StartTime,
                Label : 'StartTime',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleType,
                Label : 'SubtitleType',
            },
            {
                $Type : 'UI.DataField',
                Value : Territory,
                Label : 'Territory',
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : '{i18n>SalesOrderInformation}',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Item}',
            ID : 'i18nItem',
            Target : '_Item/@UI.LineItem#i18nItem',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Partner}',
            ID : 'i18nPartner',
            Target : '_Partner/@UI.LineItem#i18nPartner',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Salesorder}',
            Value : SalesOrder,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Bookingid}',
            Value : BookingID,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : ApplicationID,
            Label : '{i18n>Applicationid}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : DistroSpecID,
            Label : '{i18n>Distrospecid}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : DistroSpecPackageID,
            Label : '{i18n>Distrospecpackageid}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : DistroSpecPackageName,
            Label : '{i18n>Distrospecpackagename}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Soldtoparty}',
            Value : SoldToParty,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Salesorganization}',
            Value : SalesOrganization,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Distributionchannel}',
            Value : DistributionChannel,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : ShipDate,
            Label : '{i18n>Shipdate}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : TotalNetAmount,
            Label : '{i18n>Totalnetamount}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : TransactionCurrency,
            Label : '{i18n>Transactioncurrency}',
            ![@UI.Importance] : #High,
        },
    ],
    UI.FieldGroup #i18nItems : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    },
    UI.FieldGroup #i18nItems1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    },
    UI.DeleteHidden : true,
    UI.SelectionFields : [
        SalesOrder,
    ],
);

annotate service.BookingSalesorderItem with @(
    UI.LineItem #i18nItem : [
        {
            $Type : 'UI.DataField',
            Value : SalesOrderItem,
            Label : '{i18n>Salesorderitem}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Product,
            Label : '{i18n>Product}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : LongText,
            Label : '{i18n>Longtext}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : ProductGroup,
            Label : '{i18n>Productgroup}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : RequestedQuantity,
            Label : '{i18n>Requestedquantity}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Plant,
            Label : '{i18n>Plant}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : ShippingPoint,
            Label : '{i18n>Shippingpoint}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : CPLUUID,
            Label : 'CPLUUID',
        },
        {
            $Type : 'UI.DataField',
            Value : CTT,
            Label : 'CTT',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>ItemDetails}',
            ID : 'i18nItemDetails',
            Target : '@UI.FieldGroup#i18nItemDetails',
        },
    ],
    UI.FieldGroup #i18nItemDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : SalesOrder,
                Label : '{i18n>Salesorder}',
            },
            {
                $Type : 'UI.DataField',
                Value : AuditoriumType,
                Label : '{i18n>Auditoriumtype}',
            },
            {
                $Type : 'UI.DataField',
                Value : BranchID,
                Label : '{i18n>Branchid}',
            },
            {
                $Type : 'UI.DataField',
                Value : DepotID,
                Label : '{i18n>Depotid}',
            },
            {
                $Type : 'UI.DataField',
                Value : FilmStock,
                Label : '{i18n>Filmstock}',
            },
            {
                $Type : 'UI.DataField',
                Value : Key_Content,
                Label : '{i18n>Keycontent}',
            },
            {
                $Type : 'UI.DataField',
                Value : Language,
                Label : '{i18n>Language}',
            },
            {
                $Type : 'UI.DataField',
                Value : Plant,
                Label : '{i18n>Plant}',
            },
            {
                $Type : 'UI.DataField',
                Value : PlayEndDate,
                Label : '{i18n>Playenddate}',
            },
            {
                $Type : 'UI.DataField',
                Value : PlayStartDate,
                Label : '{i18n>Playstartdate}',
            },
            {
                $Type : 'UI.DataField',
                Value : PrintFormat,
                Label : '{i18n>Printformat}',
            },
            {
                $Type : 'UI.DataField',
                Value : PrintQuality,
                Label : '{i18n>Printquality}',
            },
            {
                $Type : 'UI.DataField',
                Value : Product,
                Label : '{i18n>Product}',
            },
            {
                $Type : 'UI.DataField',
                Value : LongText,
                Label : '{i18n>Longtext}',
            },
            {
                $Type : 'UI.DataField',
                Value : ProductGroup,
                Label : '{i18n>Productgroup}',
            },
            {
                $Type : 'UI.DataField',
                Value : ReleaseHold,
                Label : '{i18n>Releasehold}',
            },
            {
                $Type : 'UI.DataField',
                Value : RequestedQuantity,
                Label : '{i18n>Requestedquantity}',
            },
            {
                $Type : 'UI.DataField',
                Value : RequestedQuantityISOUnit,
                Label : '{i18n>Requestedquantityisounit}',
            },
            {
                $Type : 'UI.DataField',
                Value : ScreeningIndicator,
                Label : '{i18n>Screeningindicator}',
            },
            {
                $Type : 'UI.DataField',
                Value : ShipmentIndicator,
                Label : '{i18n>Shipmentindicator}',
            },
            {
                $Type : 'UI.DataField',
                Value : ShippingPoint,
                Label : '{i18n>Shippingpoint}',
            },
            {
                $Type : 'UI.DataField',
                Value : ShipPriority,
                Label : '{i18n>Shippriority}',
            },
            {
                $Type : 'UI.DataField',
                Value : SoundID,
                Label : '{i18n>Soundid}',
            },
            {
                $Type : 'UI.DataField',
                Value : SubtitleType,
                Label : '{i18n>Subtitletype}',
            },
        ],
    },
    UI.HeaderInfo : {
        TypeName : '{i18n>SalesOrderItem}',
        TypeNamePlural : '',
        Title : {
            $Type : 'UI.DataField',
            Value : SalesOrderItem,
        },
    },
);

annotate service.BookingSalesorderPartner with @(
    UI.LineItem #i18nPartner : [
        {
            $Type : 'UI.DataField',
            Value : Customer,
            Label : '{i18n>Customer}',
        },
        {
            $Type : 'UI.DataField',
            Value : PartnerFunction,
            Label : '{i18n>Partnerfunction}',
        },
    ]
);

annotate service.BookingSalesOrder with {
    ApplicationID @Common.Label : '{i18n>Applicationid}'
};

annotate service.BookingSalesOrder with {
    BookingID @Common.Label : '{i18n>Bookingid}'
};

annotate service.BookingSalesOrder with {
    SalesOrder @Common.Label : '{i18n>Salesorder}'
};

annotate service.BookingSalesOrder with {
    PurchaseOrderByCustomer @Common.Label : '{i18n>Purchaseorderbycustomer}'
};

