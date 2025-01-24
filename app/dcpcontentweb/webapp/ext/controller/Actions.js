sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/library",
    "sap/m/MessageBox"
], function (MessageToast, coreLibrary, MessageBox) {
    'use strict';
    var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
    var that = this;
    return {
        handleProcess: function (oEvent) {
            let aData = [];
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
                var oActionODataContextBinding = oModel.bindContext("/processContent(...)");
                oActionODataContextBinding.setParameter("bookingIDs", aData);
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
                    }.bind(this)
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
        },
        _showMessages: function (oActionContext) {
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
                    }.bind(this)
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
        }
    };
});
