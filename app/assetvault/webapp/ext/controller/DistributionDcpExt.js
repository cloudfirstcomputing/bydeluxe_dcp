sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (MessageToast, BusyIndicator, JSONModel, Fragment) {
    'use strict';

    return {
        onCreateDcp: function (err1, aSelectedContext, oEventM) {

            var oView = this.getEditFlow().getView(), that = this;
            var oEditFlow = this.editFlow
            oView.setModel(new JSONModel({ customerCompany: null }), "localModel");
            that.aSelectedContext = aSelectedContext;
            // Code to get i18n resource bundle
            var oResourceBundle = oView.getModel("i18n").getResourceBundle();

            // Code to open fragment dialog
            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    name: "com.dlx.assetvault.ext.fragments.createDcp",
                    controller: {
                        // Code to generate confirmation dialog for upload
                        handleUploadPress: function () {
                            that.Obj = this;
                            that.Obj.callUploadAction();
                        },
                        // Code to get the control in local run
                        getControlLocalRun: function (id) {
                            var oControl;

                            for (var j = 0; j < oView.getDependents()[0].getContent()[0].getContent()[0].getContent().length; j++) {
                                if (oView.getDependents()[0].getContent()[0].getContent()[0].getContent()[j].getId() === id) {
                                    oControl = oView.getDependents()[0].getContent()[0].getContent()[0].getContent()[j];
                                }
                            }
                            return oControl;
                        },

                        // Code to get the control in launchpad run
                        getControlLaunchpadRun: function (id) {
                            var oControl;

                            for (var i = 0; i < oView.getDependents().length; i++) {
                                if (oView.getDependents()[i].getContent !== undefined) {
                                    for (var j = 0; j < oView.getDependents()[i].getContent()[0].getContent()[0].getContent().length; j++) {
                                        if (oView.getDependents()[i].getContent()[0].getContent()[0].getContent()[j].getId() === id) {
                                            oControl = oView.getDependents()[i].getContent()[0].getContent()[0].getContent()[j];
                                        }
                                    }
                                } else {
                                    continue;
                                }
                            }
                            return oControl;
                        },

                        // Code to close the opened upload dialog
                        onCloseBtnPress: function (oEvent) {
                            oEvent.getSource().getParent().close();
                            this.fieldCancel();
                        },

                        // Code to upload the excelsheet data
                        callUploadAction: function (data, filename) {
                            // BusyIndicator.show();
                            that.Obj = this;
                            var oCustomer;
                            var oTitle;
                            //     var uploadSuccess = oResourceBundle.getText("uploadSuccess"),
                            //         uploadSuccessTitle = oResourceBundle.getText("uploadSuccessTitle"),
                            //         uploadSuccessCount = oResourceBundle.getText("uploadSuccessCount"),
                            //         uploadErrorTitle = oResourceBundle.getText("uploadErrorTitle"),
                            //         uploadError = oResourceBundle.getText("uploadError"),
                            //         uploadFailed = oResourceBundle.getText("uploadFailed");

                            if (oView.getDependents().length === 1) {
                                oCustomer = that.Obj.getControlLocalRun("customer");
                                oTitle = that.Obj.getControlLocalRun("title");
                            } else {
                                oCustomer = that.Obj.getControlLaunchpadRun("customer");
                                oTitle = that.Obj.getControlLaunchpadRun("title");
                            }

                            oEditFlow.invokeAction("AssetVaultService.createDcp", {
                                contexts: that.aSelectedContext,
                                requiresNavigation: false,
                                skipParameterDialog: true,
                                invocationGrouping: true,
                                parameterValues: [{ name: 'Customer', value: oCustomer.getSelectedKey() },
                                { name: 'Title', value: oTitle.getSelectedKey() }]
                            }).then((val) => {
                                oEditFlow.getView().getModel().refresh();
                                that.Obj.fieldCancel();
                                // BusyIndicator.hide();
                                oView.getModel("localModel").setProperty("/customerCompany", []);
                                oView.getDependents()[1].close()
                            }).catch((err) => {
                                // BusyIndicator.hide();
                            });

                        },
                        fieldCancel: function () {
                            that.btnAccess = this;
                            var oCustomer;
                            var oTitle;
                            // Get FileUploader and clear the selected file
                            if (oView.getDependents().length === 1) {
                                oCustomer = that.Obj.getControlLocalRun("customer");
                                oTitle = that.Obj.getControlLocalRun("title");
                            } else {
                                oCustomer = that.Obj.getControlLaunchpadRun("customer");
                                oTitle = that.Obj.getControlLaunchpadRun("title");
                            }
                            oCustomer.clearSelection(); oTitle.clearSelection();

                        }
                    }
                }).then(function (oDialog) {
                    // Code to add controls to opened dialog
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._pDialog.then(function (oDialog) {
                // Code to open the dialog
                oDialog.open();
            });

        }
    };
});
