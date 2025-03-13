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
        fnAddLocalTitle: function (oEvent) {
            var oView = this.getEditFlow().getView(); 
            var that = this;

            // Load the fragment only once
            if (!this._oDialog) {
                Fragment.load({
                    id: oView.getId(),  
                    name: "com.dlx.managematerialtitle.ext.extActionLocalC.CreateLocalTitle",
                    controller: {
                        onCancel: function () {
                            if (this._oDialog) {
                                this._oDialog.close();
                            }
                        }.bind(that),
                        onSaveLineItem: function(event) {
                            var oContext = event.getSource().getBindingContext();
                            var oModel = oView.getModel();                                                 
                           
                            var oData = oView.getModel("formModel").getData();
                            oData.MaterialMasterTitleID = parseInt(oData.MaterialMasterTitleID);
                            oData.MaterialMasterTitleID = Math.floor(100000 + Math.random() * 900000);
                            if (oData.ReleaseDate) {
                                oData.ReleaseDate = new Date(oData.ReleaseDate).toISOString().split("T")[0]; 
                            }
                            if (oData.RepertoryDate) {
                                oData.RepertoryDate = new Date(oData.RepertoryDate).toISOString().split("T")[0]; 
                            }
                            var updateCall = $.ajax({
                                url: `${oModel.sServiceUrl}Titles`, 
                                type: "POST",
                                contentType: "application/json",                                
                                data: JSON.stringify(oData),
                                success: function (response) {
                                    console.log("Update successful:", response);
                                    oView.getModel().refresh();
                                    if (that._oDialog) {
                                        that._oDialog.close();
                                    }

                                },
                                error: function (xhr, status, error) {
                                    console.error("Update failed:", status, error, xhr.responseText);
                                }
                            });
                            
                        }.bind(that),
                    }  
                }).then(function (oDialog) {
                    that._oDialog = oDialog;
                    var oContext = that._controller._getTable()._oTable.getSelectedItem().getBindingContext();
                    var oFormModel = new sap.ui.model.json.JSONModel(oContext.getObject());
                    var sTitleType = oFormModel.getData().TitleType;
                    if (!sTitleType || sTitleType === "Local") {
                        MessageToast.show("Select a non Parent Item to Edit!");
                        return;
                    }
                
                    // Set the model to the view
                    oView.setModel(oFormModel, "formModel");
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this._oDialog.open();
            }
        },

        
    };
});