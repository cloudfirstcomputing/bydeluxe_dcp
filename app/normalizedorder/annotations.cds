using from '../../srv/dcp-service';
using from '../../db/dcp';

annotate BookingOrderService.StudioFeed with{
    Status              @Common: {
        Label          : '{i18n>Status}',
        Text: {
	            $value                : Status.Status,
	          ![@UI.TextArrangement]: #TextFirst,
        }
    };
    // PlayStartTime @UI:{
    //     DateTimeStyle : 'long',
    // };
    Origin              @Common: {
        Label          : '{i18n>Origin}',
        FieldControl : #ReadOnly,
        Text: {
	            $value                : Origin.OriginText,
	          ![@UI.TextArrangement]: #TextFirst,
        },        
        ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'Origins',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Origin_OriginID,
                    ValueListProperty: 'OriginID',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'OriginText',
                },
            ]
        },
    };
    OrderType              @Common: {
        Label          : '{i18n>Ordertype}',
        FieldControl : #Mandatory,
        Text: {
	            $value                : OrderType.name,
	          ![@UI.TextArrangement]: #TextFirst,
        },        
        ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'OrderTypes',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: OrderType_code,
                    ValueListProperty: 'code',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name',
                },
            ]
        }
    };
    BookingType              @Common: {
        Label          : '{i18n>Bookingtype}',
        FieldControl: #ReadOnly,
        Text: {
	            $value                : BookingType.Description,
	          ![@UI.TextArrangement]: #TextFirst,
        },        
        ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'BookingTypeVH',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: BookingType_ID,
                    ValueListProperty: 'ID',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Description',
                },
            ]
        }
    };
    Title              @Common: {
        Label          : '{i18n>Title}',
        FieldControl : #Mandatory,
        // Text           : Title.ProductName,
        // TextArrangement: #TextFirst,
        Text: {
	            $value                : TitleText,
	          ![@UI.TextArrangement]: #TextFirst,
        },        
        ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'TitleCustVH',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Title_Product,
                    ValueListProperty: 'Product',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'ProductName',
                },
            ]
        }
    };    
    Studio              @Common: {
        Label          : '{i18n>Studio}',
        FieldControl : #Mandatory,
        Text: {
	            $value                : StudioText,
	          ![@UI.TextArrangement]: #TextFirst,
        },        
        ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'StudioVH',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Studio_BusinessPartner,
                    ValueListProperty: 'BusinessPartner',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'BusinessPartnerFullName',
                },
            ]
        }
    };
    OrderID @Common.FieldControl: #ReadOnly;
    BookingID @Common.FieldControl : #Mandatory;
    TheaterID @Common : { 
        Label          : '{i18n>Title}',
        FieldControl : #Mandatory,
        Text: {
	            $value                : TheaterID,
	          ![@UI.TextArrangement]: #TextOnly,
        },        
        ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'KalmusTheaterStudio',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: TheaterID,
                    ValueListProperty: 'Theater',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'TheaterName',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Studio',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'StudioName',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'StudioShorts',
                }
            ]
        }
     };
    EntityID @Common.FieldControl : #Mandatory;
    CustomerReference @Common.FieldControl : #Mandatory;
    RequestedDelivDate @Common.FieldControl : #Mandatory;
    // TheaterID @Common.FieldControl : #Mandatory;
    PlayStartDate @Common.FieldControl : #Mandatory;
    PlayEndDate @Common.FieldControl : #Mandatory;
    
    
}
annotate BookingOrderService.KalmusTheaterStudio with {
    // BusinessPartner         @Common: {Label: '{i18n>Studio}', };
    // BusinessPartnerFullName @Common: {Label: '{i18n>StudioName}', };
    Freeze     @UI.HiddenFilter;
    Active     @UI.HiddenFilter;
    ID     @UI.HiddenFilter;
};
annotate BookingOrderService.StudioFeed with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : BookingID,
            Label : '{i18n>Bookingid}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : EntityID,
            Label : '{i18n>Entityid}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : SalesOrder,
            Label : '{i18n>Salesorder}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : OrderType_code,
            Label : '{i18n>Ordertype}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Title_Product,
            Label : '{i18n>Title}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Studio_BusinessPartner,
            Label : '{i18n>Studio}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : RequestedDelivDate,
            Label : '{i18n>Requesteddelivdate}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : CustomerReference,
            Label : '{i18n>Customerreference}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Remediation,
            Label : '{i18n>Remediation}',
        },
        {
            $Type : 'UI.DataField',
            Value : createdAt,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Origin_OriginID,
            Label : '{i18n>Originoriginid}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Status_ID,
            Label : '{i18n>Statusid}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : BookingType_ID,
            Label : '{i18n>Bookingtype}',
        },
        {
            $Type : 'UI.DataField',
            Value : BookerName,
            Label : '{i18n>Bookername}',
        },
        {
            $Type : 'UI.DataField',
            Value : Warnings,
            Label : '{i18n>Warnings}',
        },
        {
            $Type : 'UI.DataField',
            Value : ApprovedScreens,
            Label : '{i18n>Approvedscreens}',
        },
        {
            $Type : 'UI.DataField',
            Value : DepotID,
            Label : '{i18n>Depotid}',
        },
        {
            $Type : 'UI.DataField',
            Value : KeyDeliveryOnDate,
            Label : '{i18n>Keydeliveryondate}',
        },
        {
            $Type : 'UI.DataField',
            Value : KeyEndDate,
            Label : '{i18n>Keyenddate}',
        },
        {
            $Type : 'UI.DataField',
            Value : KeyEndTime,
            Label : '{i18n>Keyendtime}',
        },
        {
            $Type : 'UI.DataField',
            Value : KeyStartDate,
            Label : '{i18n>Keystartdate}',
        },
        {
            $Type : 'UI.DataField',
            Value : KeyStartTime,
            Label : '{i18n>Keystarttime}',
        },
        {
            $Type : 'UI.DataField',
            Value : Language,
            Label : '{i18n>Language}',
        },
        {
            $Type : 'UI.DataField',
            Value : OrderID,
            Label : '{i18n>Orderid}',
        },
        {
            $Type : 'UI.DataField',
            Value : PlayStartDate,
            Label : '{i18n>Playstartdate}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : PlayStartTime,
            Label : '{i18n>Playstarttime}',
        },
        {
            $Type : 'UI.DataField',
            Value : PlayEndDate,
            Label : '{i18n>Playenddate}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : PlayEndTime,
            Label : '{i18n>Playendtime}',
        },
        {
            $Type : 'UI.DataField',
            Value : PrintFormat,
            Label : '{i18n>Printformat}',
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
            Value : ShipPriority,
            Label : '{i18n>Shippriority}',
        },
        {
            $Type : 'UI.DataField',
            Value : TheaterID,
            Label : '{i18n>Theaterid}',
        },
        {
            $Type : 'UI.DataField',
            Value : HFR,
            Label : '{i18n>Hfr}',
        },
        {
            $Type : 'UI.DataField',
            Value : ErrorMessage,
            Label : '{i18n>Errormessage}',
            ![@UI.Importance] : #High,
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>GeneralInfo}',
            ID : 'i18nGeneralInfo',
            Target : '@UI.FieldGroup#i18nGeneralInfo1',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Items}',
            ID : 'i18nItems',
            Target : 'to_Item/@UI.LineItem#i18nItems',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Partners}',
            ID : 'i18nPartners',
            Target : 'to_Partner/@UI.LineItem#i18nPartners',
        },
    ],
    UI.FieldGroup #i18nGeneralInfo : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    },
    UI.FieldGroup #i18nGeneralInfo1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : BookingID,
                Label : '{i18n>Bookingid}',
            },
            {
                $Type : 'UI.DataField',
                Value : EntityID,
                Label : '{i18n>Entityid}',
            },
            {
                $Type : 'UI.DataField',
                Value : Title_Product,
                Label : '{i18n>Title}',
            },
            {
                $Type : 'UI.DataField',
                Value : Studio_BusinessPartner,
                Label : '{i18n>Studio}',
            },
            {
                $Type : 'UI.DataField',
                Value : CustomerReference,
                Label : '{i18n>Customerreference}',
            },
            {
                $Type : 'UI.DataField',
                Value : OrderType_code,
                Label : '{i18n>Ordertype}',
            },
            {
                $Type : 'UI.DataField',
                Value : RequestedDelivDate,
                Label : '{i18n>Requesteddelivdate}',
            },
            {
                $Type : 'UI.DataField',
                Value : BookingType_ID,
                Label : '{i18n>Bookingtype}',
            },
            {
                $Type : 'UI.DataField',
                Value : SalesOrder,
                Label : '{i18n>Salesorder}',
            },
            {
                $Type : 'UI.DataField',
                Value : TheaterID,
                Label : '{i18n>Theaterid}',
            },
            {
                $Type : 'UI.DataField',
                Value : PlayStartDate,
                Label : '{i18n>Playstartdate}',
            },
            {
                $Type : 'UI.DataField',
                Value : PlayStartTime,
                Label : '{i18n>Playstarttime}',
            },
            {
                $Type : 'UI.DataField',
                Value : PlayEndDate,
                Label : '{i18n>Playenddate}',
            },
            {
                $Type : 'UI.DataField',
                Value : PlayEndTime,
                Label : '{i18n>Playendtime}',
            },
            {
                $Type : 'UI.DataField',
                Value : Origin_OriginID,
                Label : '{i18n>Originoriginid}',
            },
            {
                $Type : 'UI.DataField',
                Value : ErrorMessage,
                Label : '{i18n>Errormessage}',
            },
            {
                $Type : 'UI.DataField',
                Value : ApprovedScreens,
                Label : '{i18n>Approvedscreens}',
            },
            {
                $Type : 'UI.DataField',
                Value : BookerName,
                Label : '{i18n>Bookername}',
            },
            {
                $Type : 'UI.DataField',
                Value : createdAt,
            },
            {
                $Type : 'UI.DataField',
                Value : createdBy,
            },
            {
                $Type : 'UI.DataField',
                Value : HFR,
                Label : '{i18n>Hfr}',
            },
            {
                $Type : 'UI.DataField',
                Value : KeyDeliveryOnDate,
                Label : '{i18n>Keydeliveryondate}',
            },
            {
                $Type : 'UI.DataField',
                Value : KeyStartDate,
                Label : '{i18n>Keystartdate}',
            },
            {
                $Type : 'UI.DataField',
                Value : KeyStartTime,
                Label : '{i18n>Keystarttime}',
            },
            {
                $Type : 'UI.DataField',
                Value : KeyEndDate,
                Label : '{i18n>Keyenddate}',
            },
            {
                $Type : 'UI.DataField',
                Value : KeyEndTime,
                Label : '{i18n>Keyendtime}',
            },
            {
                $Type : 'UI.DataField',
                Value : Language,
                Label : '{i18n>Language}',
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedAt,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedBy,
            },
            {
                $Type : 'UI.DataField',
                Value : OrderID,
                Label : '{i18n>Orderid}',
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
                Value : Remediation,
                Label : '{i18n>Remediation}',
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
                Value : ShipPriority,
                Label : 'ShipPriority',
            },
            {
                $Type : 'UI.DataField',
                Value : Status_ID,
                Label : '{i18n>Statusid}',
            },
            {
                $Type : 'UI.DataField',
                Value : Warnings,
                Label : '{i18n>Warnings}',
            },
        ],
    },
    UI.SelectionPresentationVariant #table : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : createdAt,
                    Descending : true,
                }
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
    },
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : BookingID,
        },
        TypeName : '{i18n>StudioFeed}',
        TypeNamePlural : '{i18n>StudioFeeds}',
    },
    UI.SelectionFields : [
        Title_Product,
        OrderType_code,
        BookingID,
        Origin_OriginID,
    ],
);
annotate BookingOrderService.StudioFeed with @(Capabilities:{
        SearchRestrictions:{
            Searchable: false
        },
        NavigationRestrictions : {
            $Type : 'Capabilities.NavigationRestrictionsType',
            RestrictedProperties : [
                {
                    $Type : 'Capabilities.NavigationPropertyRestriction',
                    NavigationProperty : DraftAdministrativeData,
                    FilterRestrictions : {
                        $Type : 'Capabilities.FilterRestrictionsType',
                        Filterable : false,
                    },
                },
            ],
        }        
});
annotate BookingOrderService.BookingSalesorderItem with @(
    UI.LineItem #i18nItems : [
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
            Value : AdditionalMaterialGroup1,
            Label : '{i18n>Additionalmaterialgroup1}',
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
            Value : ShippingType_ID,
            Label : '{i18n>Shippingtype}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : CPLUUID,
            Label : '{i18n>Cpluuid}',
        },
        {
            $Type : 'UI.DataField',
            Value : CTT,
            Label : '{i18n>CTT}',
        },
        {
            $Type : 'UI.DataField',
            Value : AssetIDs,
            Label : '{i18n>AssetIDs}',
        },
        {
            $Type : 'UI.DataField',
            Value : KrakenIDs,
            Label : '{i18n>KrakenIDs}',
        },
        {
            $Type : 'UI.DataField',
            Value : PricingReferenceMaterial,
            Label : '{i18n>Pricereferncematerialproduct}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : AggregateKey,
            Label : '{i18n>Aggregatekey}',
        },
        {
            $Type : 'UI.DataField',
            Value : AuditoriumType,
            Label : '{i18n>Auditoriumtype}',
        },
        {
            $Type : 'UI.DataField',
            Value : BranchID,
            Label : '{i18n>Branchid}'
        },
        {
            $Type : 'UI.DataField',
            Value : FilmStock,
            Label : '{i18n>Filmstock}'
        },
        {
            $Type : 'UI.DataField',
            Value : InferKeyContentOrder,
            Label : '{i18n>Inferkeycontentorder}',
        },
        {
            $Type : 'UI.DataField',
            Value : InitialKeyDuration,
            Label : '{i18n>Initialkeyduration}',
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
            Value : MaxKDMSDuration,
            Label : '{i18n>Maxkdmsduration}',
        },
        {
            $Type : 'UI.DataField',
            Value : NextKeyDuration,
            Label : '{i18n>Nextkeyduration}',
        },
        {
            $Type : 'UI.DataField',
            Value : OffsetEPD,
            Label : '{i18n>Offsetepd}',
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
            Value : PrintQuality,
            Label : '{i18n>Printquality}',
        },
        {
            $Type : 'UI.DataField',
            Value : ProcessKDMS,
            Label : '{i18n>Processkdms}',
        },
        {
            $Type : 'UI.DataField',
            Value : ProcessScreeningKDMS,
            Label : '{i18n>Processscreeningkdms}',
        },
        {
            $Type : 'UI.DataField',
            Value : ReleaseHold,
            Label : '{i18n>Releasehold}',
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
            Value : StudioHoldOverRule,
            Label : '{i18n>Studioholdoverrule}',
        },
        {
            $Type : 'UI.DataField',
            Value : SubtitleType,
            Label : '{i18n>Shippingtype}',
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
                Value : AdditionalMaterialGroup1,
                Label : '{i18n>Additionalmaterialgroup1}',
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
                Value : ShippingType_ID,
                Label : '{i18n>Shippingtype}',
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
            {
                $Type : 'UI.DataField',
                Value : CPLUUID,
                Label : '{i18n>Cpluuid}',
            },
            {
                $Type : 'UI.DataField',
                Value : CTT,
                Label : '{i18n>CTT}',
            },
            {
                $Type : 'UI.DataField',
                Value : PricingReferenceMaterial,
                Label : '{i18n>Pricereferncematerialproduct}',
            },
            {
                $Type : 'UI.DataField',
                Value : AggregateKey,
                Label : '{i18n>Aggregatekey}',
            },
            {
                $Type : 'UI.DataField',
                Value : InferKeyContentOrder,
                Label : '{i18n>Inferkeycontentorder}',
            },
            {
                $Type : 'UI.DataField',
                Value : InitialKeyDuration,
                Label : '{i18n>Initialkeyduration}',
            },
            {
                $Type : 'UI.DataField',
                Value : KeyStartTime,
                Label : '{i18n>Keystarttime}',
            },
            {
                $Type : 'UI.DataField',
                Value : KeyEndTime,
                Label : '{i18n>Keyendtime}',
            },
            {
                $Type : 'UI.DataField',
                Value : StartDate,
                Label : '{i18n>Startdate}',
            },
            {
                $Type : 'UI.DataField',
                Value : StartTime,
                Label : '{i18n>Starttime}',
            },
            {
                $Type : 'UI.DataField',
                Value : EndDate,
                Label : '{i18n>Enddate}',
            },
            {
                $Type : 'UI.DataField',
                Value : EndTime,
                Label : '{i18n>Endtime}',
            },
            {
                $Type : 'UI.DataField',
                Value : MaxKDMSDuration,
                Label : '{i18n>Maxkdmsduration}',
            },
            {
                $Type : 'UI.DataField',
                Value : NextKeyDuration,
                Label : '{i18n>Nextkeyduration}',
            },
            {
                $Type : 'UI.DataField',
                Value : OffsetEPD,
                Label : '{i18n>Offsetepd}',
            },
            {
                $Type : 'UI.DataField',
                Value : ProcessKDMS,
                Label : '{i18n>Processkdms}',
            },
            {
                $Type : 'UI.DataField',
                Value : ProcessScreeningKDMS,
                Label : '{i18n>Processscreeningkdms}',
            },
            {
                $Type : 'UI.DataField',
                Value : StudioHoldOverRule,
                Label : '{i18n>Studioholdoverrule}',
            },
        ],    
    },
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : SalesOrderItem,
        },
        TypeName : '',
        TypeNamePlural : '',
    },
);

annotate BookingOrderService.BookingSalesorderPartner with @(
    UI.LineItem #i18nPartners : [
        {
            $Type : 'UI.DataField',
            Value : PartnerFunction,
            Label : '{i18n>Partnerfunction}',
        },
        {
            $Type : 'UI.DataField',
            Value : Customer,
            Label : '{i18n>Customer}',
        },
    ]
);

annotate BookingOrderService.OrderTypes with {
    code @(
        Common.Label : '{i18n>Ordertype}',
        Common.Text : name,
    )
};

annotate BookingOrderService.StudioFeed with {
    BookingID @Common.Label : '{i18n>Bookingid}'
};

