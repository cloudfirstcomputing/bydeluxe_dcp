using DistributionService as service from '../../srv/dist-service';

annotate service.DCPMaterialConfig with {
    ID               @UI.Hidden;
    AssetVaultID     @Common: {
        Label          : '{i18n>AssetVaultID}',
        Text           : AssetVaultID.AssetMapIDDescription,
        TextArrangement: #TextOnly,
    };
    to_Plant         @Common: {Label: '{i18n>Plant}', };
    to_SalesDelivery @Common: {Label: '{i18n>ProductSalesOrg}', };
};

annotate service.DCPMaterialConfig.to_Plant with {
    Plant           @Common: {Label: '{i18n>Plant}', };
    StorageLocation @Common: {Label: '{i18n>StorageLocation}', };
};

annotate service.DCPMaterialConfig.to_SalesDelivery with {
    ProductSalesOrg         @Common: {Label: '{i18n>ProductSalesOrg}', };
    ProductDistributionChnl @Common: {Label: '{i18n>ProductDistributionChnl}', };
};

annotate service.AssetVaultVH with {
    AssetVaultID          @Common: {
        Label: '{i18n>AssetVaultID}',
        Text : AssetMapIDDescription
    };
    AssetMapIDDescription @Common: {Label: '{i18n>Description}'};
};


annotate service.DCPMaterialConfig with @(
    UI.HeaderInfo                : {
        Title         : {
            $Type: 'UI.DataField',
            Value: AssetVaultID_AssetVaultID,
        },
        TypeName      : '{i18n>DCPMaterial}',
        TypeNamePlural: '{i18n>DCPMaterials}',
    },

    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [{
            $Type: 'UI.DataField',
            Value: AssetVaultID_AssetVaultID,

        }, ],
    },
    UI.Facets                    : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'GeneratedFacet1',
            Label : '{i18n>GeneralInformation}',
            Target: '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'to_Plant',
            Target: 'to_Plant/@UI.LineItem',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'to_SalesDelivery',
            Target: 'to_SalesDelivery/@UI.LineItem',
        },
    ],
    UI.LineItem                  : [{
        $Type                : 'UI.DataField',
        Value                : AssetVaultID_AssetVaultID,
        ![@HTML5.CssDefaults]: {
            $Type: 'HTML5.CssDefaultsType',
            width: 'auto'
        },
    }, ],
);

annotate service.DCPMaterialConfig.to_Plant with @(
    UI.HeaderInfo           : {
        Title         : {
            $Type: 'UI.DataField',
            Value: Plant_Plant,
        },
        TypeName      : '{i18n>Plant}',
        TypeNamePlural: '{i18n>Plants}',
    },
    UI.LineItem             : [
        {
            $Type                : 'UI.DataField',
            ![@HTML5.CssDefaults]: {
                $Type: 'HTML5.CssDefaultsType',
                width: 'auto',
            },
            Value                : Plant_Plant,
        },
        {
            $Type                : 'UI.DataField',
            Value                : StorageLocation_StorageLocation,
            ![@HTML5.CssDefaults]: {
                $Type: 'HTML5.CssDefaultsType',
                width: 'auto'
            },
        },
    ],
    UI.FieldGroup #PlantMain: {
        $Type: 'UI.FieldGroupType',
        Label: '',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Plant_Plant,
            },
            {
                $Type: 'UI.DataField',
                Value: StorageLocation_StorageLocation,
            },
        ],
    },
    UI.Facets               : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : '{i18n>GeneralInformation}',
        Target: '@UI.FieldGroup#PlantMain',
    }, ]
);

annotate service.DCPMaterialConfig.to_SalesDelivery with @(
    UI.HeaderInfo                   : {
        Title         : {
            $Type: 'UI.DataField',
            Value: ProductSalesOrg_SalesOrganization,
        },
        Description   : {
            $Type: 'UI.DataField',
            Value: ProductDistributionChnl_DistributionChannel,
        },
        TypeName      : '{i18n>SalesOrg}',
        TypeNamePlural: '{i18n>SalesOrg}',
    },
    UI.LineItem                     : [

        {
            $Type                : 'UI.DataField',
            Value                : ProductSalesOrg_SalesOrganization,
            ![@HTML5.CssDefaults]: {
                $Type: 'HTML5.CssDefaultsType',
                width: 'auto'
            },
        },
        {
            $Type                : 'UI.DataField',
            Value                : ProductDistributionChnl_DistributionChannel,
            ![@HTML5.CssDefaults]: {
                $Type: 'HTML5.CssDefaultsType',
                width: 'auto'
            },
        },
    ],
    UI.FieldGroup #SalesDeliveryMain: {
        $Type: 'UI.FieldGroupType',
        Label: '',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: ProductSalesOrg_SalesOrganization,
            },
            {
                $Type: 'UI.DataField',
                Value: ProductDistributionChnl_DistributionChannel,
            },
        ],
    },
    UI.Facets                       : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : '{i18n>GeneralInformation}',
        Target: '@UI.FieldGroup#SalesDeliveryMain',
    }, ]
);

annotate service.DCPMaterialConfig with {
    AssetVaultID @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'AssetVaultVH',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: AssetVaultID_AssetVaultID,
                    ValueListProperty: 'AssetVaultID',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'AssetMapIDDescription',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    )
};

annotate service.DCPMaterialConfig.to_Plant with {
    Plant           @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'Plants',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: Plant_Plant,
                    ValueListProperty: 'Plant',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'PlantName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    StorageLocation @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'StorageLocations',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterIn',
                    LocalDataProperty: Plant_Plant,
                    ValueListProperty: 'Plant',
                },
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: StorageLocation_StorageLocation,
                    ValueListProperty: 'StorageLocation',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'StorageLocationName',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
};

annotate service.DCPMaterialConfig.to_SalesDelivery with {
    ProductSalesOrg         @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'SalesOrganizations',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: ProductSalesOrg_SalesOrganization,
                    ValueListProperty: 'SalesOrganization',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Name',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
    ProductDistributionChnl @(
        Common.ValueList               : {
            $Type          : 'Common.ValueListType',
            CollectionPath : 'DistributionChannels',
            SearchSupported: false,
            Parameters     : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: ProductDistributionChnl_DistributionChannel,
                    ValueListProperty: 'DistributionChannel',
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Name',
                },
            ],
        },
        Common.ValueListWithFixedValues: false
    );
}
