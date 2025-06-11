using DcnStatusService as service from '../../srv/dcn-service';

annotate service.StatusConversion with @(
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'StatusTypeCode',
                Value: StatusTypeCode,
            },
            {
                $Type: 'UI.DataField',
                Label: 'StatusType',
                Value: StatusType,
            },
            {
                $Type: 'UI.DataField',
                Label: 'StatusTypeDescription',
                Value: StatusTypeDescription,
            },
            {
                $Type: 'UI.DataField',
                Label: 'StatusCode',
                Value: StatusCode,
            },
            {
                $Type: 'UI.DataField',
                Label: 'StatusDescription',
                Value: StatusDescription,
            },
            {
                $Type: 'UI.DataField',
                Label: 'OrderType',
                Value: OrderType,
            },
            {
                $Type: 'UI.DataField',
                Label: 'SapDocType',
                Value: SapDocType,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Preference',
                Value: Preference,
            },
            {
                $Type: 'UI.DataField',
                Label: 'SapDocStatus',
                Value: SapDocStatus,
            },
        ],
    },
    UI.Facets                    : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup',
    }, ],
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Label: 'StatusTypeCode',
            Value: StatusTypeCode,
        },
        {
            $Type: 'UI.DataField',
            Label: 'StatusType',
            Value: StatusType,
        },
        {
            $Type: 'UI.DataField',
            Label: 'StatusCode',
            Value: StatusCode,
        },
        {
            $Type: 'UI.DataField',
            Label: 'StatusDescription',
            Value: StatusDescription,
        },
        {
            $Type: 'UI.DataField',
            Label: 'OrderType',
            Value: OrderType,
        },
    ],
);
