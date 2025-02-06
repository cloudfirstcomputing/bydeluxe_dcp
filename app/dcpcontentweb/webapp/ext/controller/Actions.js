sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/library",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/json/JSONModel"
], function (MessageToast, coreLibrary, MessageBox, Fragment, BusyIndicator, JSONModel) {
    'use strict';
    var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
    return {
        handleProcess: function (oEvent) {
            let aData = [];
            var that = this;
            let aSelectedItems = this.editFlow.getView().byId("dcpcontentweb::dcpcontentList--fe::table::dcpcontent::LineItem-innerTable").getSelectedItems();
            for (var i in aSelectedItems) {
                var oEntry = aSelectedItems[i].getBindingContext().getObject();
                if (!oEntry) {
                    MessageBox.error(`No entries selected for posting. Please make a selection and proceed`, {
                        title: "Error",
                        contentWidth: "auto",
                        styleClass: sResponsivePaddingClasses
                    });
                    aData = [];
                    break;
                }
                else if (oEntry?.SalesOrder) {
                    MessageBox.error(`Posting is already done for ${oEntry.ApplicationID} - ${oEntry.BookingID}. Sales Order is: ${oEntry.SalesOrder}`, {
                        title: "Error",
                        contentWidth: "auto",
                        styleClass: sResponsivePaddingClasses
                    });
                    aData = [];
                    break;
                }
                else if (!oEntry?.BookingID) {
                    MessageBox.error(`Retry after selecting Booking ID from table settings`, {
                        title: "Error",
                        contentWidth: "auto",
                        styleClass: sResponsivePaddingClasses
                    });
                    aData = [];
                    break;
                }
                else if (oEntry.ErrorMessage) {
                    MessageBox.error(`Selection contains entries to be reconciled`, {
                        title: "Error",
                        contentWidth: "auto",
                        styleClass: sResponsivePaddingClasses
                    });
                    aData = [];
                    break;
                }
                else {
                    aData.push(oEntry.BookingID);
                }
            }
            if (aData?.length) {
                var oModel = this.getModel();
                that.obj = this;
                var oActionODataContextBinding = oModel.bindContext("/processContent(...)");
                oActionODataContextBinding.setParameter("bookingIDs", aData);
                BusyIndicator.show();
                oActionODataContextBinding.execute().then(
                    function (param) {
                        var oActionContext = oActionODataContextBinding.getBoundContext();

                        if (oActionContext.getObject()?.value?.message) {
                            let aMessages = JSON.parse(oActionContext.getObject()?.value?.message);
                            if (aMessages?.length) {
                                let aErrors = aMessages.filter((entry) => { return entry.status === "E" });
                                let aWarnings = aMessages.filter((entry) => { return entry.status === "W" });
                                let aSuccess = aMessages.filter((entry) => { return entry.status === "S" });

                                if (aErrors?.length) {
                                    MessageBox.error("Action failed", {
                                        title: "Error",
                                        details: JSON.stringify(aMessages.map((entry) => { return entry.message })),
                                        contentWidth: "auto",
                                        styleClass: sResponsivePaddingClasses
                                    });
                                }
                                else if (aWarnings?.length) {
                                    MessageBox.warning("Action has been completed with warning", {
                                        title: "Warning",
                                        details: JSON.stringify(aMessages.map((entry) => { return entry.message })),
                                        contentWidth: "auto",
                                        styleClass: sResponsivePaddingClasses
                                    });
                                }
                                else if (aSuccess?.length) {
                                    MessageBox.success("Action has been completed successfully", {
                                        title: "Success",
                                        details: JSON.stringify(aMessages.map((entry) => { return entry.message })),
                                        contentWidth: "auto",
                                        styleClass: sResponsivePaddingClasses
                                    });
                                }
                                else {
                                    MessageBox.alert("No response received", {
                                        title: "Alert",
                                        contentWidth: "auto",
                                        styleClass: sResponsivePaddingClasses
                                    });
                                }
                            }
                        }
                        BusyIndicator.hide();
                        oModel.refresh();
                    }.bind(this)
                ).catch(
                    (err, param2) => {
                        
                        BusyIndicator.hide();
                        MessageBox.error("Error occured", {
                            title: "Error",
                            details: err,
                            contentWidth: "auto",
                            styleClass: sResponsivePaddingClasses
                        });
                    }
                );
            }
        },
        handleReconcile: function () {
            let aData = [];
            let aSelectedItems = this.editFlow.getView().byId("dcpcontentweb::dcpcontentList--fe::table::dcpcontent::LineItem-innerTable").getSelectedItems();
            for (var i in aSelectedItems) {
                var oEntry = aSelectedItems[i].getBindingContext().getObject();
                if (!oEntry) {
                    MessageBox.error(`No entries selected for reconciliation. Please make a selection and proceed`, {
                        title: "Error",
                        contentWidth: "auto",
                        styleClass: sResponsivePaddingClasses
                    });
                    aData = [];
                    break;
                }
                else if (oEntry?.SalesOrder || !oEntry.ErrorMessage) {
                    MessageBox.error(`Reconciliation can be done only for failed entries`, {
                        title: "Error",
                        contentWidth: "auto",
                        styleClass: sResponsivePaddingClasses
                    });
                    aData = [];
                    break;
                }
                else if (!oEntry?.BookingID) {
                    MessageBox.error(`Retry after selecting Booking ID from table settings`, {
                        title: "Error",
                        contentWidth: "auto",
                        styleClass: sResponsivePaddingClasses
                    });
                    aData = [];
                    break;
                }
                else {
                    aData.push(oEntry.BookingID);
                }
            }
            if (aData?.length) {
                var oModel = this.getModel();
                var oActionODataContextBinding = oModel.bindContext("/processContent(...)");
                oActionODataContextBinding.setParameter("bookingIDs", aData);                
                BusyIndicator.show();
                oActionODataContextBinding.execute().then(
                    function (param) {
                        var oActionContext = oActionODataContextBinding.getBoundContext();

                        if (oActionContext.getObject()?.value?.message) {
                            let aMessages = JSON.parse(oActionContext.getObject()?.value?.message);
                            if (aMessages?.length) {
                                let aErrors = aMessages.filter((entry) => { return entry.status === "E" });
                                let aWarnings = aMessages.filter((entry) => { return entry.status === "W" });
                                let aSuccess = aMessages.filter((entry) => { return entry.status === "S" });

                                if (aErrors?.length) {
                                    MessageBox.error("Action failed", {
                                        title: "Error",
                                        details: JSON.stringify(aMessages.map((entry) => { return entry.message })),
                                        contentWidth: "auto",
                                        styleClass: sResponsivePaddingClasses
                                    });
                                }
                                else if (aWarnings?.length) {
                                    MessageBox.warning("Action has been completed with warning", {
                                        title: "Warning",
                                        details: JSON.stringify(aMessages.map((entry) => { return entry.message })),
                                        contentWidth: "auto",
                                        styleClass: sResponsivePaddingClasses
                                    });
                                }
                                else if (aSuccess?.length) {
                                    MessageBox.success("Action has been completed successfully", {
                                        title: "Success",
                                        details: JSON.stringify(aMessages.map((entry) => { return entry.message })),
                                        contentWidth: "auto",
                                        styleClass: sResponsivePaddingClasses
                                    });
                                }
                                else {
                                    MessageBox.alert("No response received", {
                                        title: "Alert",
                                        contentWidth: "auto",
                                        styleClass: sResponsivePaddingClasses
                                    });
                                }
                            }
                        }
                        
                        BusyIndicator.hide();
                        oModel.refresh();
                    }.bind(this)
                ).catch(
                    (err, param2) => {
                        BusyIndicator.hide();
                        MessageBox.error("Error occured", {
                            title: "Error",
                            details: err,
                            contentWidth: "auto",
                            styleClass: sResponsivePaddingClasses
                        });
                    }
                );
            }
        },
        createReferenceSalesOrder: function () {
            var that = this;
            var oView = this.getEditFlow().getView();
            oView.setModel(new JSONModel({ "plantSelected": "", "shipConditionSelected": "", "salesOrder": "", "bookingID": "" }), "dialogModel");
            var oResourceBundle = oView.getModel("i18n").getResourceBundle();
            var ref = this;
            let aSelectedItems = this.editFlow.getView().byId("dcpcontentweb::dcpcontentList--fe::table::dcpcontent::LineItem-innerTable").getSelectedItems();
            if (aSelectedItems.length > 1) {
                MessageBox.error("Select One entry", {
                    title: "Error",
                    details: "Please Select Sales order for remediation",
                    contentWidth: "auto",
                    styleClass: sResponsivePaddingClasses
                });
                return;
            }
            var oEntry = aSelectedItems[0].getBindingContext().getObject();
            if (!oEntry?.SalesOrder) {
                MessageBox.error("Invalid Selection", {
                    title: "Error",
                    details: "Remediation is already done for the selection",
                    contentWidth: "auto",
                    styleClass: sResponsivePaddingClasses
                });
                return;
            }
            else if (oEntry?.ReferenceSDDocument) {
                MessageBox.error("Invalid Selection", {
                    title: "Error",
                    details: "Remediation is already done for the selection",
                    contentWidth: "auto",
                    styleClass: sResponsivePaddingClasses
                });
                return;
            }
            else {
                oView.getModel("dialogModel").setProperty("/salesOrder", oEntry?.SalesOrder)
                oView.getModel("dialogModel").setProperty("/bookingID", oEntry?.BookingID)
                // Code to open fragment dialog
                if (!this._pDialog) {
                    this._pDialog = Fragment.load({
                        name: "dcpcontentweb.ext.fragments.createRefSalesOrder",
                        controller: {

                            // onCloseBtnPress: function (oEvent) {
                            //     oEvent.getSource().getParent().close();
                            // },

                            // Code to generate confirmation dialog for upload
                            handleRefSalesorderCreation: function () {
                                that.obj = this;
                                MessageBox.confirm(oResourceBundle.getText("confirmSOCreation"), {
                                    title: oResourceBundle.getText("confirmSOCreationTitle"),
                                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                    emphasizedAction: MessageBox.Action.OK,
                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {

                                            // BusyIndicator.show();
                                            var oModel = that.obj.getModel();
                                            var oViewModel = that.obj.getModel("dialogModel");
                                            var sDeliveryDate = oViewModel?.getProperty("/deliveryDateSelected")?.toISOString()?.split("T")[0];
                                            var oActionODataContextBinding = oModel.bindContext("/remediateContentSalesOrder(...)");
                                            oActionODataContextBinding.setParameter("bookingID", oViewModel?.getProperty("/bookingID"));
                                            oActionODataContextBinding.setParameter("salesOrder", oViewModel?.getProperty("/salesOrder"));
                                            oActionODataContextBinding.setParameter("plant", oViewModel?.getProperty("/plantSelected"));
                                            oActionODataContextBinding.setParameter("shippingCondition", oViewModel?.getProperty("/shipConditionSelected"));
                                            oActionODataContextBinding.setParameter("deliveryDate", sDeliveryDate);
                                            sap.ui.getCore().byId('refSalesOrderDialog').setBusy(true);
                                            oActionODataContextBinding.execute().then(
                                                function (param) {
                                                    var oActionContext = oActionODataContextBinding.getBoundContext();

                                                    if (oActionContext.getObject()?.value?.message) {
                                                        let aMessages = JSON.parse(oActionContext.getObject()?.value?.message);
                                                        if (aMessages?.length) {
                                                            let aErrors = aMessages.filter((entry) => { return entry.status === "E" });
                                                            let aWarnings = aMessages.filter((entry) => { return entry.status === "W" });
                                                            let aSuccess = aMessages.filter((entry) => { return entry.status === "S" });

                                                            if (aErrors?.length) {
                                                                MessageBox.error("Action failed", {
                                                                    title: "Error",
                                                                    details: JSON.stringify(aMessages.map((entry) => { return entry.message })),
                                                                    contentWidth: "auto",
                                                                    styleClass: sResponsivePaddingClasses
                                                                });
                                                            }
                                                            else if (aWarnings?.length) {
                                                                MessageBox.warning("Action has been completed with warning", {
                                                                    title: "Warning",
                                                                    details: JSON.stringify(aMessages.map((entry) => { return entry.message })),
                                                                    contentWidth: "auto",
                                                                    styleClass: sResponsivePaddingClasses
                                                                });
                                                            }
                                                            else if (aSuccess?.length) {
                                                                MessageBox.success("Action has been completed successfully", {
                                                                    title: "Success",
                                                                    details: JSON.stringify(aMessages.map((entry) => { return entry.message })),
                                                                    contentWidth: "auto",
                                                                    styleClass: sResponsivePaddingClasses
                                                                });
                                                            }
                                                            else {
                                                                MessageBox.alert("No response received", {
                                                                    title: "Alert",
                                                                    contentWidth: "auto",
                                                                    styleClass: sResponsivePaddingClasses
                                                                });
                                                            }
                                                        }
                                                    }
                                                    oModel.refresh();
                                                    sap.ui.getCore().byId('refSalesOrderDialog').setBusy(false);
                                                    sap.ui.getCore().byId('refSalesOrderDialog').close();
                                                }.bind(that.obj)
                                            ).catch(
                                                (err, param2) => {
                                                    MessageBox.error("Error occured", {
                                                        title: "Error",
                                                        details: err,
                                                        contentWidth: "auto",
                                                        styleClass: sResponsivePaddingClasses
                                                    });
                                                }
                                            );


                                        }
                                        // else if (oAction === MessageBox.Action.CANCEL) {

                                        // }
                                    }
                                });
                            }.bind(oView),

                            // Code to call CAP action and pass the file in binary format
                            confirmRefSalesOrderCreate: function () { },
                            onCloseBtnPress: function (oEvent) {
                                oEvent.getSource().getParent().close();
                            },
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

        }
    };
});
