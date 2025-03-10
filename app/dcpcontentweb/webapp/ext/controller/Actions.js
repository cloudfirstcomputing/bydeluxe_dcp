sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/library",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library"
], function (MessageToast, coreLibrary, MessageBox, Fragment, BusyIndicator, JSONModel,Spreadsheet,exportLibrary) {
    'use strict';
    var EdmType = exportLibrary.EdmType;
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
            oView.setModel(new JSONModel({ "plantSelected": "", "shipTypeSelected": "", "salesOrder": "", "bookingID": "" }), "dialogModel");
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
                if (!this._remediateDialog) {
                    this._remediateDialog = Fragment.load({
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
                                            // oActionODataContextBinding.setParameter("bookingID", oViewModel?.getProperty("/bookingID"));
                                            // oActionODataContextBinding.setParameter("salesOrder", oViewModel?.getProperty("/salesOrder"));
                                            // oActionODataContextBinding.setParameter("plant", oViewModel?.getProperty("/plantSelected"));
                                            // oActionODataContextBinding.setParameter("shippingType", oViewModel?.getProperty("/shipTypeSelected"));
                                            // oActionODataContextBinding.setParameter("shippingPoint", oViewModel?.getProperty("/shipPointSelected"));
                                            // oActionODataContextBinding.setParameter("deliveryDate", sDeliveryDate);
                                            oActionODataContextBinding.setParameter("oInput", {
                                                "bookingID": oViewModel?.getProperty("/bookingID"),
                                                "salesOrder": oViewModel?.getProperty("/salesOrder"),
                                                "plant": oViewModel?.getProperty("/plantSelected"),
                                                "shipTypeSelected": oViewModel?.getProperty("/shipTypeSelected"),
                                                "shipPointSelected": oViewModel?.getProperty("/shipPointSelected"),
                                                "deliveryDate": sDeliveryDate
                                            });
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
                                                    sap.ui.getCore().byId('refSalesOrderDialog').setBusy(false);
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
                this._remediateDialog.then(function (oDialog) {
                    // Code to open the dialog
                    oDialog.open();
                });
            }

        },
        handleMassUpload: function() {
            
            var oView = this.getEditFlow().getView(), that = this;

            // Code to get i18n resource bundle
            var oResourceBundle = oView.getModel("i18n").getResourceBundle();

            // Code to get Excelsheet fields
            that.uploadFile = [{
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt1"),
                "type": EdmType.Number
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt2"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt3"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt4"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt5"),
                "type": EdmType.String
            },{
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt6"),
                "type": EdmType.Number
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt7"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt8"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt9"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt10"),
                "type": EdmType.String
            },{
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt11"),
                "type": EdmType.Number
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt12"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt13"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt14"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt15"),
                "type": EdmType.String
            },{
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt16"),
                "type": EdmType.Number
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt17"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt18"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt19"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt20"),
                "type": EdmType.String
            },{
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt21"),
                "type": EdmType.Number
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt22"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt23"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt24"),
                "type": EdmType.String
            },{
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt25"),
                "type": EdmType.Number
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt26"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt27"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt28"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt29"),
                "type": EdmType.String
            },
            {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt30"),
                "type": EdmType.Number
            },{
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt31"),
                "type": EdmType.Number
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt32"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt33"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt34"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt35"),
                "type": EdmType.String
            },{
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt36"),
                "type": EdmType.Number
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt37"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt38"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt39"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt40"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt42"),
                "type": EdmType.String
            }];

            that.fieldNamesCAPM = [{
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt1"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt1")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt2"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt2")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt3"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt3")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt4"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt4")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt5"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt5")
            },{
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt6"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt6")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt7"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt7")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt8"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt8")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt9"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt9")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt10"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt10")
            },{
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt11"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt11")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt12"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt12")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt13"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt13")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt14"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt14")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt15"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt15")
            },{
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt16"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt16")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt17"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt17")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt18"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt18")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt19"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt19")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt20"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt20")
            },{
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt21"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt21")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt22"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt22")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt23"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt23")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt24"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt24")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt25"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt25")
            },{
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt26"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt26")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt27"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt27")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt28"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt28")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt29"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt29")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt30"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt30")
            },{
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt31"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt31")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt32"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt32")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt33"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt33")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt34"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt34")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt35"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt35")
            },{
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt36"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt36")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt37"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt37")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt38"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt38")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt39"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt39")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt40"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt40")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt41"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt41")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt42"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt42")
            }];

            // Code to open fragment dialog
            if (!this._uploadDialog) {
                this._uploadDialog = Fragment.load({
                    name: "dcpcontentweb.ext.fragments.uploadBookingFeed",
                    controller: {

                        // Code to allow user to download the template
                        handleDownloadTemplatePress: function () {
                            var aCols, oSettings, oSheet, fileName, oDataTemplate = [0];

                            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                                pattern: "MMM_dd_yyyy"
                            });
                            var oNow = new Date();
                            var getDateFrm = oDateFormat.format(oNow);
                            getDateFrm = `${getDateFrm}_${oNow.getHours()}_${oNow.getMinutes()}_${oNow.getSeconds()}`;

                            aCols = this.createColumnConfigTemplate();
                            fileName = "FeedUpload";

                            oSettings = {
                                workbook: {
                                    context: {
                                        sheetName: fileName
                                    },
                                    columns: aCols
                                },
                                dataSource: oDataTemplate,
                                fileName: "Template_" + fileName + "_" + `${getDateFrm}.xlsx`,
                                worker: true,
                                showProgress: true
                            };
                            oSheet = new Spreadsheet(oSettings);
                            oSheet.build()
                                .then(function () {
                                    MessageToast.show(oResourceBundle.getText("exportSuccessTemplate"));
                                })
                                .catch(function (sMessage) {
                                    MessageToast.show(oResourceBundle.getText("exportErrorTemplate") + " " + sMessage);
                                })
                                .finally(oSheet.destroy);
                        },

                        // Code to create columns configuration for downloadable templates
                        createColumnConfigTemplate: function () {
                            var aCols = [], column = that.uploadFile;

                            for (var h = 0; h < column.length; h++) {
                                aCols.push({
                                    label: column[h].bindedCol,
                                    property: column[h].bindedCol,
                                    type: column[h].type,
                                    width: column[h].width
                                });
                            }
                            return aCols;
                        },

                        // Code to detect buttons on local development run through index.html
                        localRunBtn: function (uploadBtnStatus) {
                            for (var n = 0; n < oView.getDependents()[0].getButtons().length; n++) {
                                if (oView.getDependents()[0].getButtons()[n].getId() === "uploadBtn") {
                                    oView.getDependents()[0].getButtons()[n].setEnabled(uploadBtnStatus);
                                }
                            }
                        },

                        // Code to detect buttons on launchpad run through component.js
                        launchpadRunBtn: function (uploadBtnStatus) {
                            for (var m = 0; m < oView.getDependents().length; m++) {
                                if (oView.getDependents()[m].getButtons !== undefined) {
                                    for (var n = 0; n < oView.getDependents()[m].getButtons().length; n++) {
                                        if (oView.getDependents()[m].getButtons()[n].getId() === "uploadBtn") {
                                            oView.getDependents()[m].getButtons()[n].setEnabled(uploadBtnStatus);
                                        }
                                    }
                                } else {
                                    continue;
                                }
                            }
                        },

                        // Code to get the fileuploader control in local run
                        getFileUploaderLocalRun: function () {
                            var oFileUploader;

                            for (var j = 0; j < oView.getDependents()[0].getContent()[0].getContent()[0].getContent().length; j++) {
                                if (oView.getDependents()[0].getContent()[0].getContent()[0].getContent()[j].getId() === "FileUploadFileUploader") {
                                    oFileUploader = oView.getDependents()[0].getContent()[0].getContent()[0].getContent()[j];
                                }
                            }
                            return oFileUploader;
                        },

                        // Code to get the fileuploader control in local run
                        getFileUploaderLaunchpadRun: function () {
                            var oFileUploader;

                            for (var i = 0; i < oView.getDependents().length; i++) {
                                if (oView.getDependents()[i].getContent !== undefined) {
                                    for (var j = 0; j < oView.getDependents()[i].getContent()[0].getContent()[0].getContent().length; j++) {
                                        if (oView.getDependents()[i].getContent()[0].getContent()[0].getContent()[j].getId() === "FileUploadFileUploader") {
                                            oFileUploader = oView.getDependents()[i].getContent()[0].getContent()[0].getContent()[j];
                                        }
                                    }
                                } else {
                                    continue;
                                }
                            }
                            return oFileUploader;
                        },

                        // Code to check extension of the file
                        handleTypeMissmatch: function (oEvent) {
                            that.btnAccess = this;

                            if (oView.getDependents().length === 1) {
                                that.btnAccess.localRunBtn(false);
                            } else {
                                that.btnAccess.launchpadRunBtn(false);
                            }

                            var aFileTypes = oEvent.getSource().getFileType();
                            aFileTypes.map(function (sType) {
                                return "*." + sType;
                            });
                            MessageBox.error(oResourceBundle.getText("typeMismatchMsg")
                                + oEvent.getParameter("fileType") + " " + oResourceBundle.getText("typeMismatchMsgJoin")
                                + " " + aFileTypes.join(", "));
                        },

                        // Code to check if new file is selected with browse button
                        handleValueChange: function (oEvent) {
                            that.btnAccess = this;

                            if (oView.getDependents().length === 1) {
                                that.btnAccess.localRunBtn(true);
                            } else {
                                that.btnAccess.launchpadRunBtn(true);
                            }

                            MessageToast.show(oResourceBundle.getText("uploadReady"));
                            this.file = oEvent.getParameters("files").files[0];
                        },

                        // Code to close the opened upload dialog
                        onCloseBtnPress: function (oEvent) {
                            oEvent.getSource().getParent().close();
                            this.fieldCancel();
                        },

                        // Code to generate confirmation dialog for upload
                        handleUploadPress: function () {
                            that.Obj = this;

                            MessageBox.confirm(oResourceBundle.getText("confirmUpload"), {
                                title: oResourceBundle.getText("confirmUploadTitle"),
                                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                emphasizedAction: MessageBox.Action.OK,
                                onClose: function (oAction) {
                                    if (oAction === MessageBox.Action.OK) {
                                        that.Obj.readFileBinary();
                                    } else if (oAction === MessageBox.Action.CANCEL) {
                                        that.Obj.fieldCancel();
                                    }
                                }
                            });
                        },

                        // Code to call CAP action and pass the file in binary format
                        readFileBinary: function () {
                            BusyIndicator.show();
                            var oFileUploader, file = this.file;
                            that.Obj = this;

                            if (oView.getDependents().length === 1) {
                                oFileUploader = that.Obj.getFileUploaderLocalRun();
                            } else {
                                oFileUploader = that.Obj.getFileUploaderLaunchpadRun();
                            }

                            if (!oFileUploader.getValue()) {
                                MessageBox.error(oResourceBundle.getText("noFile"));  // No file uploaded
                            } else {
                                oFileUploader.checkFileReadable().then(function () {
                                    if (file && window.FileReader) {
                                        var reader = new FileReader();
                                        reader.onload = function (e) {
                                            var data = e.target.result;
                                            that.Obj.validateTheExcelData(data, file.name);
                                        };
                                        reader.onerror = function (ex) {
                                            MessageBox.error(ex);
                                        };
                                        reader.readAsBinaryString(file);
                                    }
                                }, function () {
                                    MessageBox.error(oResourceBundle.getText("fileError"));
                                }).then(function () {
                                    oFileUploader.clear();
                                });
                            }
                        },

                        validateTheExcelData:function(data, filename){
                            that.Obj = this;
                            var response;

                            var uploadSuccess = oResourceBundle.getText("uploadSuccess"),
                                uploadSuccessTitle = oResourceBundle.getText("uploadSuccessTitle"),
                                uploadSuccessCount = oResourceBundle.getText("uploadSuccessCount"),
                                uploadErrorTitle = oResourceBundle.getText("uploadErrorTitle"),
                                uploadError = oResourceBundle.getText("uploadError"),
                                uploadFailed = oResourceBundle.getText("uploadFailed");

                            var batchModel = oView.getModel();
                            var oContext = batchModel.bindContext("/MassUploadBookingFeed(...)");
                            oContext.setParameter("fileData", data);
                            oContext.setParameter("fileName", filename);
                            oContext.setParameter("fieldNames", that.fieldNamesCAPM);

                            oContext.execute().then(function () {
                                response = oContext.getBoundContext().getObject();
                                if(response?.message){
                                    var aResponse = JSON.parse(response.message);
                                    var iSuccessCount = 0, iErrorCount = 0, iUpdateCount = 0;
                                    for(var i in aResponse){
                                        if(aResponse[i].Success){
                                            iSuccessCount = aResponse[i].Success.length;
                                        };
                                        if(aResponse[i].Error){
                                            iErrorCount = aResponse[i].Error.length; 
                                        };
                                        if(aResponse[i].UpdateSuccess){
                                            iUpdateCount = aResponse[i].UpdateSuccess.length; 
                                        };

                                    }
                                    if(iErrorCount){
                                        MessageBox.error(uploadError, {
                                            title: uploadErrorTitle + iErrorCount+ ' entries',
                                            actions: MessageBox.Action.OK,
                                            emphasizedAction: MessageBox.Action.OK,
                                            onClose: function (oAction) {
                                                if (oAction === MessageBox.Action.OK) {
                                                    that.Obj.fieldCancel();
                                                }
                                            }
                                        });
                                    }
                                    if(iSuccessCount ){
                                        MessageBox.success(`${iSuccessCount} entries were created/updated.`, {
                                            title: "Upload has been completed successfully",
                                            actions: MessageBox.Action.OK,
                                            emphasizedAction: MessageBox.Action.OK,
                                            onClose: function (oAction) {
                                                if (oAction === MessageBox.Action.OK) {
                                                    that.Obj.fieldCancel();
                                                }
                                            }
                                        });                                        
                                    }
                                }
                                if (response.acknowledgement === "error") {
                                    MessageBox.error(uploadError, {
                                        title: uploadErrorTitle,
                                        actions: MessageBox.Action.OK,
                                        emphasizedAction: MessageBox.Action.OK,
                                        onClose: function (oAction) {
                                            if (oAction === MessageBox.Action.OK) {
                                                that.Obj.fieldCancel();
                                                that.Obj.showErrorTable();
                                            }
                                        }
                                    });

                                } else {
                                    that.Obj.callUploadAction(data,filename);
                                    sap.ui.getCore().byId("dialog").close();
                                }
                                batchModel.refresh();
                                BusyIndicator.hide();
                                // }.bind(this), function (oErr) {  // Keeping it for bind reference

                            }, function (oErr) {
                                var errorCode = uploadFailed + " " + oErr.error.message;
                                MessageBox.error(errorCode, {
                                    title: uploadErrorTitle,
                                    actions: MessageBox.Action.OK,
                                    emphasizedAction: MessageBox.Action.OK,
                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {
                                            that.Obj.fieldCancel();
                                        }
                                    }
                                });
                                batchModel.refresh();
                                BusyIndicator.hide();
                            });
                        },

                        // Code to upload the excelsheet data
                        callUploadAction: function (data, filename) {
                            BusyIndicator.show();
                            that.Obj = this;
                            var response;

                            var uploadSuccess = oResourceBundle.getText("uploadSuccess"),
                                uploadSuccessTitle = oResourceBundle.getText("uploadSuccessTitle"),
                                uploadSuccessCount = oResourceBundle.getText("uploadSuccessCount"),
                                uploadErrorTitle = oResourceBundle.getText("uploadErrorTitle"),
                                uploadError = oResourceBundle.getText("uploadError"),
                                uploadFailed = oResourceBundle.getText("uploadFailed");

                            var batchModel = oView.getModel();
                            var oContext = batchModel.bindContext("/massUploadSerialNumbers(...)");
                            oContext.setParameter("fileData", data);
                            oContext.setParameter("fileName", filename);
                            oContext.setParameter("fieldNames", that.fieldNamesCAPM);

                            oContext.execute().then(function () {
                                response = oContext.getBoundContext().getObject();

                                if (response.acknowledgement === "error") {
                                    MessageBox.error(uploadError, {
                                        title: uploadErrorTitle,
                                        actions: MessageBox.Action.OK,
                                        emphasizedAction: MessageBox.Action.OK,
                                        onClose: function (oAction) {
                                            if (oAction === MessageBox.Action.OK) {
                                                that.Obj.fieldCancel();
                                                that.Obj.showErrorTable();
                                            }
                                        }
                                    });

                                } else {
                                    MessageBox.success(uploadSuccess + "\n\n" + uploadSuccessCount + " " + response.recordsUpdate, {
                                        title: uploadSuccessTitle,
                                        actions: MessageBox.Action.OK,
                                        emphasizedAction: MessageBox.Action.OK,
                                        onClose: function (oAction) {
                                            if (oAction === MessageBox.Action.OK) {
                                                that.Obj.fieldCancel();
                                            }
                                        }
                                    });
                                    sap.ui.getCore().byId("dialog").close();
                                }
                                batchModel.refresh();
                                BusyIndicator.hide();

                            }, function (oErr) {
                                var errorCode = uploadFailed + " " + oErr.error.message;
                                MessageBox.error(errorCode, {
                                    title: uploadErrorTitle,
                                    actions: MessageBox.Action.OK,
                                    emphasizedAction: MessageBox.Action.OK,
                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {
                                            that.Obj.fieldCancel();
                                        }
                                    }
                                });
                                batchModel.refresh();
                                BusyIndicator.hide();
                            });
                        },

                        // Code to navigate to the errorTable.view.xml
                        showErrorTable: function () {
                            that._controller.getExtensionAPI().routing.navigateToRoute("errorTable");
                        },

                        // Code to reset fields based on user cancellation
                        fieldCancel: function () {
                            that.btnAccess = this;
                            // Get FileUploader and clear the selected file
                            var oFileUploader;

                            if (oView.getDependents().length === 1) {
                                oFileUploader = that.btnAccess.getFileUploaderLocalRun();
                            } else {
                                oFileUploader = that.btnAccess.getFileUploaderLaunchpadRun();
                            }
                            oFileUploader.clear();

                            // Get buttons
                            if (oView.getDependents().length === 1) {
                                that.btnAccess.localRunBtn(false);
                            } else {
                                that.btnAccess.launchpadRunBtn(false);
                            }
                        }
                    }
                }).then(function (oDialog) {
                    // Code to add controls to opened dialog
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._uploadDialog.then(function (oDialog) {
                // Code to open the dialog
                oDialog.open();
            });

        
        }
    };
});
