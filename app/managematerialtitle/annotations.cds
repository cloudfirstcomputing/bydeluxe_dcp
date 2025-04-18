using BookingOrderService as service from '../../srv/dcp-service';

annotate service.TitleV.MaterialMasterTitleID with @(
    Common.Text : '',
    UI.TextArrangement : #TextOnly
);


annotate service.TitleV with @(

    Capabilities.SearchRestrictions.Searchable: false,
    // Selection Fields (Filters in Fiori Elements)
    UI.SelectionFields : [
        MaterialMasterTitleID,
        TitleType,
        RegionCode,
        ReleaseDate,
        ImdbId
    ],

    // Define Table Columns in List Report
    UI.LineItem : [
        { $Type : 'UI.DataField', Value : MaterialMasterTitleID, Label : 'Material Master Title ID' },
        { $Type : 'UI.DataField', Value : LocalTitleId, Label : 'Local Title Id' },
        { $Type : 'UI.DataField', Value : OriginalTitleName, Label : 'Original Title Name' },
        { $Type : 'UI.DataField', Value : TitleType, Label : 'Title Type' },
        { $Type : 'UI.DataField', Value : TitleCategory, Label : 'Title Category' },
         {
            $Type : 'UI.DataField',
            Value : IsMarkedForDeletion,
            Label : 'Deleted',
        },
        { $Type : 'UI.DataField', Value : RegionalTitleName, Label : 'Regional Title Name' },
        { $Type : 'UI.DataField', Value : ShortTitle, Label : 'Short Title' },
        { $Type : 'UI.DataField', Value : SecurityTitle, Label : 'Security Title' },
        { $Type : 'UI.DataField', Value : RegionCode, Label : 'Region Code' },
        { $Type : 'UI.DataField', Value : LanguageCode, Label : 'Language Code' },
        { $Type : 'UI.DataField', Value : ReleaseDate, Label : 'Release Date' },
        { $Type : 'UI.DataField', Value : RepertoryDate, Label : 'Repertory Date' },
        { $Type : 'UI.DataField', Value : Format, Label : 'Format' },
        { $Type : 'UI.DataField', Value : ReleaseSize, Label : 'Release Size' },
        { $Type : 'UI.DataField', Value : Ratings, Label : 'Ratings' },
        { $Type : 'UI.DataField', Value : ReelCountEstimated, Label : 'Reel Count (Estimated)' },
        { $Type : 'UI.DataField', Value : AssetVaultTitleId, Label : 'Asset Vault Title Id' },
        { $Type : 'UI.DataField', Value : ImdbId, Label : 'IMDB ID' },
        { $Type : 'UI.DataField', Value : StudioTitleId, Label : 'Studio Title Id' },
        { $Type : 'UI.DataField', Value : StudioDistributor, Label : 'Studio/Distributor' },
        {
            $Type : 'UI.DataField',
            Value : GofilexTitleId,
        },
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : UseSecureName,
        },
        {
            $Type : 'UI.DataField',
            Value : RatingCode,
            Label : 'RatingCode',
            ![@UI.Hidden],
        },
        {
            $Type : 'UI.DataField',
            Value : IDType,
            Label : 'IDType',
            ![@UI.Hidden],
        },
        {
            $Type : 'UI.DataField',
            Value : IDValue,
            Label : 'IDValue',
            ![@UI.Hidden],
        },
    ],   

    // Define Field Group for Object Page Details
    UI.FieldGroup #GeneralInfo : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { $Type : 'UI.DataField', Value : MaterialMasterTitleID, Label : 'Material Master Title ID' },
            { $Type : 'UI.DataField', Value : RegionCode, Label : 'Region Code' },
            { $Type : 'UI.DataField', Value : OriginalTitleName, Label : 'Original Title Name' },
            { $Type : 'UI.DataField', Value : TitleType, Label : 'Title Type' },
            { $Type : 'UI.DataField', Value : TitleCategory, Label : 'Title Category' },
            { $Type : 'UI.DataField', Value : RegionalTitleName, Label : 'Regional Title Name' },
            { $Type : 'UI.DataField', Value : ShortTitle, Label : 'Short Title' },
            { $Type : 'UI.DataField', Value : SecurityTitle, Label : 'Security Title' },
            { $Type : 'UI.DataField', Value : LanguageCode, Label : 'Language Code' },
            { $Type : 'UI.DataField', Value : ReleaseDate, Label : 'Release Date' },
            { $Type : 'UI.DataField', Value : RepertoryDate, Label : 'Repertory Date' },
            { $Type : 'UI.DataField', Value : Format, Label : 'Format' },
            { $Type : 'UI.DataField', Value : ReleaseSize, Label : 'Release Size' },
            { $Type : 'UI.DataField', Value : Ratings, Label : 'Ratings' },
            { $Type : 'UI.DataField', Value : ReelCountEstimated, Label : 'Reel Count (Estimated)' },
            { $Type : 'UI.DataField', Value : AssetVaultTitleId, Label : 'Asset Vault Title Id' },
            { $Type : 'UI.DataField', Value : GofilexTitleId, Label : 'Gofilex Title Id' },
            { $Type : 'UI.DataField', Value : ImdbId, Label : 'IMDB ID' },
            { $Type : 'UI.DataField', Value : StudioTitleId, Label : 'Studio Title Id' },
            { $Type : 'UI.DataField', Value : StudioDistributor, Label : 'Studio/Distributor' },
            {
                $Type : 'UI.DataField',
                Value : UseSecureName,
            },
            {
                $Type : 'UI.DataField',
                Value : IsMarkedForDeletion,
                Label : 'IsMarkedForDeletion',
            },
            {
                $Type : 'UI.DataField',
                Value : LocalTitleId,
            },
        ]
    },

    // Define Facet for Object Page
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneralInfoFacet',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneralInfo'
        }
    ],

    UI.HeaderInfo: {
         TypeName: 'TitleV',
    TypeNamePlural: 'TitleV',
    Title: {
      Value: OriginalTitleName
    },
    Description: {
      Value:MaterialMasterTitleID
    }
    }

);



