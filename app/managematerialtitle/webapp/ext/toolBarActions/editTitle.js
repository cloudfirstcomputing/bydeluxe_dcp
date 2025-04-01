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
        fnEditTitle: function (oEvent) {
            var oView = this.getEditFlow().getView();  // Get the view context correctly
            var that = this;


            // Load the fragment only once
            if (!this._oDialogE) {
                Fragment.load({
                    id: oView.getId(),  // Ensure unique fragment ID within the view
                    name: "com.dlx.managematerialtitle.ext.toolBarActions.EditTitle",
                    controller: {
                        handleValueHelp : function (oEvent) {                            
                            this._sInputId = oEvent.getSource().getId();
                    
                            // create value help dialog
                            if (!this._aValueHelpDialog) {
                                this._aValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "com.dlx.managematerialtitle.ext.toolBarActions.ValueHelpDialog",  
                                    controller: this
                                }).then(function(oValueHelpDialog){
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }
                    
                            // open value help dialog
                            this._aValueHelpDialog.then(function(oValueHelpDialog){
                                oValueHelpDialog.open();
                            });
                        },
                    
                        _handleValueHelpSearch : function (oEvent) {
                            var sValue = oEvent.getParameter("value");
                            var oFilter = new Filter(
                                "BusinessPartnerFullName",
                                FilterOperator.Contains, sValue
                            );
                            oEvent.getSource().getBinding("items").filter([oFilter]);
                        },
                    
                        _handleValueHelpClose : function (oEvent) {
                            var oSelectedItem = oEvent.getParameter("selectedItem");
                            if (oSelectedItem) {
                                var productInput = oView.byId(this._sInputId);
                                productInput.setValue(oSelectedItem.getTitle());
                            }
                            oEvent.getSource().getBinding("items").filter([]);
                        },
                        handleValueHelplg : function (oEvent) {                            
                            this._sInputId = oEvent.getSource().getId();
                    
                            // create value help dialog
                            if (!this._bValueHelpDialog) {
                                this._bValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "com.dlx.managematerialtitle.ext.toolBarActions.ValueHelpDialogLg",  
                                    controller: this
                                }).then(function(oValueHelpDialog){
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }
                    
                            // open value help dialog
                            this._bValueHelpDialog.then(function(oValueHelpDialog){
                                oValueHelpDialog.open();
                            });
                        },
                    
                        _handleValueHelpSearchlg : function (oEvent) {
                            var sValue = oEvent.getParameter("value");
                            var oFilter = new Filter(
                                "name",
                                FilterOperator.Contains, sValue
                            );
                            oEvent.getSource().getBinding("items").filter([oFilter]);
                        },
                    
                        _handleValueHelpCloselg : function (oEvent) {
                            var oSelectedItem = oEvent.getParameter("selectedItem");
                            if (oSelectedItem) {
                                var productInput = oView.byId(this._sInputId);
                                productInput.setValue(oSelectedItem.getTitle());
                            }
                            oEvent.getSource().getBinding("items").filter([]);
                        },
                        handleValueHelprc : function (oEvent) {                            
                            this._sInputId = oEvent.getSource().getId();
                    
                            // create value help dialog
                            if (!this._cValueHelpDialog) {
                                this._cValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "com.dlx.managematerialtitle.ext.toolBarActions.ValueHelpDialogRc",  
                                    controller: this
                                }).then(function(oValueHelpDialog){
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }
                    
                            // open value help dialog
                            this._cValueHelpDialog.then(function(oValueHelpDialog){
                                oValueHelpDialog.open();
                            });
                        },
                    
                        _handleValueHelpSearchlg : function (oEvent) {
                            var sValue = oEvent.getParameter("value");
                            var oFilter = new Filter(
                                "name",
                                FilterOperator.Contains, sValue
                            );
                            oEvent.getSource().getBinding("items").filter([oFilter]);
                        },
                    
                        _handleValueHelpCloselg : function (oEvent) {
                            var oSelectedItem = oEvent.getParameter("selectedItem");
                            if (oSelectedItem) {
                                var productInput = oView.byId(this._sInputId);
                                productInput.setValue(oSelectedItem.getTitle());
                            }
                            oEvent.getSource().getBinding("items").filter([]);
                        },
                        onCancelEdit: function () {
                            if (this._oDialogE) {
                                this._oDialogE.close();
                            }
                        }.bind(that),
                        onSaveEdit: function (event) {
                            var oContext = this._controller._getTable()._oTable.getSelectedItem().getBindingContext()
                            var oModel = oView.getModel();

                            var oData = oContext.getObject();


                            var oPostData = oView.getModel("formModel").getData();
                            if (oPostData.ReleaseDate) {
                                oPostData.ReleaseDate = new Date(oPostData.ReleaseDate).toISOString().split("T")[0]; // "YYYY-MM-DD"
                            }
                            if (oPostData.RepertoryDate) {
                                oPostData.RepertoryDate = new Date(oPostData.RepertoryDate).toISOString().split("T")[0]; // "YYYY-MM-DD"
                            }
                            if (oPostData.Ratings) {
                                oPostData.Ratings_Ass = oPostData.Ratings.split(",").map(rating => ({
                                    RatingCode: rating.trim()
                                }));
                            }
                            var sKey = `(MaterialMasterTitleID=${oData.MaterialMasterTitleID},LocalTitleId='${oData.LocalTitleId}',ID=${oData.ID},RegionCode='${oData.RegionCode}')`;
                            var updateCall = $.ajax({
                                url: `${oModel.sServiceUrl}Titles${sKey}`,
                                type: "PUT", // Use PATCH or PUT based on your OData service
                                contentType: "application/json",
                                data: JSON.stringify(oPostData),
                                success: function (response) {
                                    this.postTitles(oPostData, oPostData.MaterialMasterTitleID);
                                    console.log("Update successful:", response);
                                    oView.getModel().refresh();
                                    if (that._oDialogE) {
                                        that._oDialogE.close();
                                    }

                                }.bind(this),
                                error: function (xhr, status, error) {
                                    console.error("Update failed:", status, error, xhr.responseText);
                                    if (that._oDialogE) {
                                        that._oDialogE.close();
                                    }
                                }
                            });

                        }.bind(that),
                    }
                }).then(function (oDialog) {
                    that._oDialogE = oDialog;
                    var oContext = that._controller._getTable()._oTable.getSelectedItem().getBindingContext();
                    var oFormModel = new sap.ui.model.json.JSONModel(oContext.getObject());
                    var sTitleType = oFormModel.getData().TitleType;
                    // if (sTitleType === "Parent") {
                    //     MessageToast.show("Select a non Parent Item to Edit!");
                    //     return;
                    // }
                    oDialog.open();


                    oView.setModel(oFormModel, "formModel");
                    oView.addDependent(oDialog);

                });
            } else {
                var oContext = that._controller._getTable()._oTable.getSelectedItem().getBindingContext();
                var oFormModel = new sap.ui.model.json.JSONModel(oContext.getObject());
                var sTitleType = oFormModel.getData().TitleType;
                // if (sTitleType === "Parent") {
                //     MessageToast.show("Select a non Parent Item to Edit!");
                //     return;
                // }
                oView.setModel(oFormModel, "formModel");
                this._oDialogE.open();
            }

            this.postTitles = function (oData, Product) {
                var oModel = oView.getModel();

                var oPatchData = {
                    Product: Product,
                    ProductGroup: oData.TitleCategory,
                    ProductType: "SERV", //TitleType
                    BaseUnit: "EA",
                    ProductManufacturerNumber: "",
                    to_ProductBasicText: [
                        {
                            Product: Product,
                            Language: "EN", //LanguageCode
                            LongText: oData.RegionalTitleName
                        }
                    ],
                    to_Description: [
                        {
                            Product: Product,
                            Language: "EN",
                            ProductDescription: oData.OriginalTitleName
                        }
                    ]
                };
                
                var updateCall = $.ajax({
                    url: `${oModel.sServiceUrl}editProduct`, // Call the action instead of the entity
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({ input: oPatchData }), // Pass data under `input`
                    success: function (response) {
                        console.log("Product Edit successful:", response.Product);
                        oView.getModel().refresh();
                        oData.MaterialMasterTitleID = response.Product
                        this.postTitles(oData, response.Product)
                    }.bind(this),
                    error: function (xhr, status, error) {
                        console.error("Product Edit failed:", status, error, xhr.responseText);
                    }
                });
            }
        },


    };
});