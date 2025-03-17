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
            if (!this._oDialogL) {
                Fragment.load({
                    id: oView.getId(),
                    name: "com.dlx.managematerialtitle.ext.extActionLocalC.CreateLocalTitle",
                    controller: {
                        onCancel: function () {
                            if (this._oDialogL) {
                                this._oDialogL.close();
                            }
                        }.bind(that),
                        onSaveLineItem: function (event) {
                            var oContext = event.getSource().getBindingContext();
                            var oModel = oView.getModel();

                            var oData = oView.getModel("formModel").getData();                            
                            if (oData.ReleaseDate) {
                                oData.ReleaseDate = new Date(oData.ReleaseDate).toISOString().split("T")[0];
                            }
                            if (oData.RepertoryDate) {
                                oData.RepertoryDate = new Date(oData.RepertoryDate).toISOString().split("T")[0];
                            }
                            oData.TitleType = "Local"; // Setting Title Type to Local
                            var updateCall = $.ajax({
                                url: `${oModel.sServiceUrl}Titles`,
                                type: "POST",
                                contentType: "application/json",
                                data: JSON.stringify(oData),
                                success: function (response) {
                                    console.log("Update successful:", response);
                                    oView.getModel().refresh();
                                    if (that._oDialogL) {
                                        that._oDialogL.close();
                                    }

                                },
                                error: function (xhr, status, error) {
                                    console.error("Update failed:", status, error, xhr.responseText);
                                }
                            });

                        }.bind(that),
                    }
                }).then(function (oDialog) {
                    that._oDialogL = oDialog;
                    var oContext = that._controller._getTable()._oTable.getSelectedItem().getBindingContext();
                    var oFormModel = new sap.ui.model.json.JSONModel(oContext.getObject());
                    var sTitleType = oFormModel.getData().TitleType;
                    if (!sTitleType || sTitleType === "Local") {
                        MessageToast.show("Select a Parent Item to Create Local Title!");
                        return;
                    }

                    // Set the model to the view
                    oView.setModel(oFormModel, "formModel");
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                var oContext = that._controller._getTable()._oTable.getSelectedItem().getBindingContext();
                var oFormModel = new sap.ui.model.json.JSONModel(oContext.getObject());
                var sTitleType = oFormModel.getData().TitleType;
                if (!sTitleType || sTitleType === "Local") {
                    MessageToast.show("Select a Parent Item to Create Local Title!");
                    return;
                }
                oView.setModel(oFormModel, "formModel");
                this._oDialogL.open();
            }
        },


    };
});