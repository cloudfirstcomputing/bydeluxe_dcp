sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/library",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library"
], function (MessageToast, coreLibrary, MessageBox, Fragment, BusyIndicator, JSONModel, Spreadsheet, exportLibrary) {
    "use strict";

    return {
        /**
         * Opens the Add Title dialog
         */
        fnCreateTitle: function (oEvent) {
            var oView = this.getEditFlow().getView();  // Get the view context correctly
            var that = this;

            // Load the fragment only once
            if (!this._oDialog) {
              var oFragment = Fragment.load({
                    id: oView.getId(),  // Ensure unique fragment ID within the view
                    name: "com.dlx.managematerialtitle.ext.manageTitleExt.CreateTitle",
                    controller: {
                        onCancelCreate: function () {
                            if (this._oDialog) {
                                this._oDialog.close();
                            }
                        }.bind(that),
                        onSaveCreate: function(event) {
                            var oContext = event.getSource().getBindingContext();
                            var oModel = oView.getModel();                                                 
                           
                            var oData = oView.getModel("formModel").getData();
                            // oData.MaterialMasterTitleID = parseInt(oData.MaterialMasterTitleID);
                            // oData.MaterialMasterTitleID = Math.floor(100000 + Math.random() * 900000);
                            if (oData.ReleaseDate) {
                                oData.ReleaseDate = new Date(oData.ReleaseDate).toISOString().split("T")[0]; // "YYYY-MM-DD"
                            }
                            if (oData.RepertoryDate) {
                                oData.RepertoryDate = new Date(oData.RepertoryDate).toISOString().split("T")[0]; // "YYYY-MM-DD"
                            }

                            var oDataS4API = {
                                Product: "",
                                ProductGroup: oData.TitleCategory,
                                ProductType: "SERV", //TitleType
                                BaseUnit: "EA",
                                ProductManufacturerNumber: "",
                                to_ProductBasicText: [
                                    {
                                        Product: "",
                                        Language: "EN", //LanguageCode
                                        LongText: oData.RegionalTitleName
                                    }
                                ],
                                to_Description: [
                                    {
                                        Product: "",
                                        Language: "EN",
                                        ProductDescription: oData.OriginalTitleName
                                    }
                                ]
                            };
                
                            var updateCall = $.ajax({
                                url: `${oModel.sServiceUrl}createProduct`, // Call the action instead of the entity
                                type: "POST",
                                contentType: "application/json",
                                data: JSON.stringify({ input: oDataS4API }), // Pass data under `input`
                                success: function (response) {
                                    console.log("Product creation successful:", response.Product);
                                    oView.getModel().refresh();
                                    oData.MaterialMasterTitleID = response.Product
                                    this.postTitles(oData,response.Product)
                                }.bind(this),
                                error: function (xhr, status, error) {
                                    console.error("Product creation failed:", status, error, xhr.responseText);
                                }
                            });

                            
                        }.bind(that),
                    }  
                }).then(function (oDialog) {
                    that._oDialog = oDialog;
                    var oFormModel = new sap.ui.model.json.JSONModel({
                        MaterialMasterTitleID: "",
                        LocalTitleId: "", // This should be ignored while Creating
                        RegionCode: "",
                        OriginalTitleName: "",
                        TitleType: "",
                        TitleCategory: "",
                        RegionalTitleName: "",
                        ShortTitle: "",
                        SecurityTitle: "",
                        LanguageCode: "",
                        ReleaseDate: null,
                        RepertoryDate: null,
                        Format: "",
                        ReleaseSize: "",
                        Ratings: "",
                        ReelCountEstimated: null,
                        AssetVaultTitleId: "",
                        ImdbId: "",
                        StudioTitleId: "",
                        StudioDistributor: "",
                        Ratings_Ass: [],
                        ExternalTitleIDs_Ass: []
                        //IDType: "",
                        //IDValue: ""
                    });
                
                    // Set the model to the view
                    oView.setModel(oFormModel, "formModel");
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this._oDialog.open();
            }

            this.postTitles=function(oData,Product){
                var oModel = oView.getModel();   
                  var updateCall = $.ajax({
                                    url: `${oModel.sServiceUrl}Titles`, 
                                    type: "POST", // Use PATCH or PUT based on your OData service
                                    contentType: "application/json",                                
                                    data: JSON.stringify(oData),
                                    success: function (response) {
                                        console.log("Update successful:", response);
                                        MessageBox.success(oView.getController().getResourceBundle().getText("Success", [Product]), {
                                            title: oView.getController().getResourceBundle().getText("SuccessTitle"),
                                            actions: MessageBox.Action.OK,
                                            emphasizedAction: MessageBox.Action.OK,
                                            onClose: function (oAction) {
                                                if (oAction === MessageBox.Action.OK) {
                                                    // funcReset(oView, that);
                                                }
                                            }
                                        });
                                        oView.getModel().refresh();
                                        if (that._oDialog) {
                                            that._oDialog.close();
                                        }
    
                                    },
                                    error: function (xhr, status, error) {
                                        console.error("Update failed:", status, error, xhr.responseText);
                                    }
                                });
            }
        }

        
    };
});