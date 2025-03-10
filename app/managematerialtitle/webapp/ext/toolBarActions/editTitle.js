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
            if (!this._oDialog) {
                Fragment.load({
                    id: oView.getId(),  // Ensure unique fragment ID within the view
                    name: "com.dlx.managematerialtitle.ext.toolBarActions.EditTitle",
                    controller: {
                        onCancelEdit: function () {
                            if (this._oDialog) {
                                this._oDialog.close();
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
                            var sKey = `(MaterialMasterTitleID=${oData.MaterialMasterTitleID},LocalTitleId='${oData.LocalTitleId}',ID=${oData.ID},RegionCode='${oData.RegionCode}')`;
                            var updateCall = $.ajax({
                                url: `${oModel.sServiceUrl}Titles${sKey}`,
                                type: "PUT", // Use PATCH or PUT based on your OData service
                                contentType: "application/json",
                                data: JSON.stringify(oPostData),
                                success: function (response) {
                                    console.log("Update successful:", response);
                                    oView.getModel().refresh();
                                    if (that._oDialog) {
                                        that._oDialog.close();
                                    }

                                },
                                error: function (xhr, status, error) {
                                    console.error("Update failed:", status, error, xhr.responseText);
                                    if (that._oDialog) {
                                        that._oDialog.close();
                                    }
                                }
                            });

                        }.bind(that),
                    }
                }).then(function (oDialog) {
                    that._oDialog = oDialog;
                    oDialog.open();
                    var oContext = that._controller._getTable()._oTable.getSelectedItem().getBindingContext();
                    var oFormModel = new sap.ui.model.json.JSONModel(oContext.getObject());
                    oView.setModel(oFormModel, "formModel");
                    oView.addDependent(oDialog);

                });
            } else {
                this._oDialog.open();
            }
        },


    };
});