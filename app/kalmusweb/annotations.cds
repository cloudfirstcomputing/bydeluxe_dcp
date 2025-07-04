using BookingOrderService as service from '../../srv/dcp-service';
annotate service.KalmusTheaterStudio with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : PartnerfunctionSP,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Studio',
                Value : Studio,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Studio Name',
                Value : StudioName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Partner Function(SH)',
                Value : PartnerfunctionSH,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Theater',
                Value : Theater,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Theatername}',
                Value : TheaterName,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Studioshorts}',
                Value : StudioShorts,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Active}',
                Value : Active,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Freeze}',
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
            Value : PartnerfunctionSP,
        },
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
            Value : PartnerfunctionSH,
        },
        {
            $Type : 'UI.DataField',
            Value : Theater,
        },
        {
            $Type : 'UI.DataField',
            Value : TheaterName
        },
        {
            $Type : 'UI.DataField',
            Value : StudioShorts,
            Label : '{i18n>Studioshorts}',
        },
        {
            $Type : 'UI.DataField',
            Value : Active
        },
        {
            $Type : 'UI.DataField',
            Value : Freeze
        },
    ],
);
annotate service.KalmusTheaterStudio with{
    PartnerfunctionSP @Common:{Label : 'Partner Function (SP)'};
    Studio @Common:{Label : 'Studio',};
    StudioName @Common:{Label : 'Studio Name',};
    TheaterName @Common:{Label : 'Theater Name',};
    Theater @Common:{Label : 'Theaer',};
    PartnerfunctionSH @Common:{Label : 'Partner Function (SH)',};
    Active @Common:{Label : 'Active',};
    Freeze @Common:{Label : 'Freeze',};
            
}

