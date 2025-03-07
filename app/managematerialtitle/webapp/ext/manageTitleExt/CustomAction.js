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
                Fragment.load({
                    id: oView.getId(),  // Ensure unique fragment ID within the view
                    name: "com.dlx.managematerialtitle.ext.manageTitleExt.CreateTitle",
                    controller: {
                        onCancel: function () {
                            if (this._oDialog) {
                                this._oDialog.close();
                            }
                        }.bind(that),
                        onSaveLineItem: function(event) {
                            var oContext = event.getSource().getBindingContext();
                            var oModel = oView.getModel();
                            var sServiceUrl = oModel.sServiceUrl + "TitleV";
                            var actionBinding = oModel.bindContext(sServiceUrl, oContext);
                            actionBinding.execute().then(function(response) {
                                console.log(response);
                            }).catch(function(error) {
                                console.log(error);
                            });
                        }.bind(that),
                    }  
                }).then(function (oDialog) {
                    that._oDialog = oDialog;
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this._oDialog.open();
            }
        },

        
    };
});