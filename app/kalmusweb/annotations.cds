using BookingOrderService as service from '../../srv/dcp-service';
annotate service.KalmusTheaterStudio with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : Studio,
            },
            {
                $Type : 'UI.DataField',
                Value : StudioName,
            },
            {
                $Type : 'UI.DataField',
                Value : PartnerfunctionSP,
            },
            {
                $Type : 'UI.DataField',
                Value : Theater,
            },
            {
                $Type : 'UI.DataField',
                Value : TheaterName,
            },
            {
                $Type : 'UI.DataField',
                Value : PartnerfunctionSH,
            },
            {
                $Type : 'UI.DataField',
                Value : StudioShorts,
            },
            {
                $Type : 'UI.DataField',
                Value : Active,
            },
            {
                $Type : 'UI.DataField',
                Value : Freeze,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : Studio,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : StudioName,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : PartnerfunctionSP,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Theater,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : TheaterName,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : PartnerfunctionSH,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : StudioShorts,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Active,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Freeze,
            ![@UI.Importance] : #High,
        },
    ],
    UI.HeaderInfo : {
        TypeName : '{i18n>Partner}',
        TypeNamePlural : '{i18n>Partners}',
        Title : {
            $Type : 'UI.DataField',
            Value : Studio,
        },
    },
);
annotate service.KalmusTheaterStudio with{
    // Studio @Common:{Label : 'Studio',};
    Studio @(
            Common.Label : 'Studio',
            Common.ValueList: {
                $Type: 'Common.ValueListType',
                CollectionPath: 'StudioVH',
                Parameters: [
                    {
                        $Type: 'Common.ValueListParameterInOut',
                        LocalDataProperty: Studio,
                        ValueListProperty: 'BusinessPartner'
                    },
                    {
                        $Type: 'Common.ValueListParameterInOut',
                        LocalDataProperty: StudioName,
                        ValueListProperty: 'BusinessPartnerFullName'
                    }
                ]
            },
            Common.Text: {
	            $value                : StudioName,
	          ![@UI.TextArrangement]: #TextSeparate,
	        },
        ); 
    StudioName @Common:{Label : 'Studio Name',};
    PartnerfunctionSP  @Common:{Label : 'Partner Function (SP)'};
    
    Theater @(
            Common.Label : 'Theater',
            Common.ValueList: {
                $Type: 'Common.ValueListType',
                CollectionPath: 'TheaterVH',
                Parameters: [
                    {
                        $Type: 'Common.ValueListParameterInOut',
                        LocalDataProperty: Theater,
                        ValueListProperty: 'BusinessPartner'
                    },
                    {
                        $Type: 'Common.ValueListParameterInOut',
                        LocalDataProperty: TheaterName,
                        ValueListProperty: 'BusinessPartnerFullName'
                    }
                ]
            },
            Common.Text: {
	            $value                : TheaterName,
	          ![@UI.TextArrangement]: #TextSeparate,
	        },
        ); 
    TheaterName @Common:{Label : 'Theater Name',};
    
    PartnerfunctionSH @Common:{Label : 'Partner Function (SH)',};
    StudioShorts @Common:{Label : 'Studio Shorts',};
    Active @Common:{Label : 'Active',};
    Freeze @Common:{Label : 'Freeze',};
            
}

