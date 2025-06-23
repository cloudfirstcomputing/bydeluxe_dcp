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
        handleMassUpload: function(oEvent) {
            
            var oView = this.getEditFlow().getView(), that = this;

            // Code to get i18n resource bundle
            var oResourceBundle = oView.getModel("i18n").getResourceBundle();
            let aSelectedItems = this.editFlow.getView().byId("normalizedorder::StudioFeedList--fe::table::StudioFeed::LineItem-innerTable").getSelectedItems();
            if(aSelectedItems?.length){
                MessageBox.error(`Clear selection of entries before upload`, {
                    title: "Error",
                    contentWidth: "auto",
                    styleClass: sResponsivePaddingClasses
                });
                return;
            }
            // Code to get Excelsheet fields
            that.uploadFile = [{
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt1"),
                "type": EdmType.Number
            },  {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt3"),
                "type": EdmType.String
            },  {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt5"),
                "type": EdmType.String
            },{
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt6"),
                "type": EdmType.Number
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt9"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt11"),
                "type": EdmType.Number
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt13"),
                "type": EdmType.String
            }, {
                "width": "11rem",
                "bindedCol": oResourceBundle.getText("uploadFileColTxt14"),
                "type": EdmType.String
            },{
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
                "bindedCol": oResourceBundle.getText("uploadFileColTxt33"),
                "type": EdmType.String
            }, {
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
                "bindedCol": oResourceBundle.getText("uploadFileColTxt39"),
                "type": EdmType.String
            }];

            that.fieldNamesCAPM = [{
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt1"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt1")
            }, , {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt3"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt3")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt5"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt5")
            },{
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt6"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt6")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt9"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt9")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt11"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt11")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt13"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt13")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt14"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt14")
            }, {
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
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt33"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt33")
            }, {
                technicalName: oResourceBundle.getText("uploadFileColTechnicalTxt39"),
                excelColumn: oResourceBundle.getText("uploadFileColTxt39")
            }];

            // Code to open fragment dialog
            if (!this._uploadDialog) {
                this._uploadDialog = Fragment.load({
                    name: "normalizedorder.ext.fragments.UploadStudioFeed",
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

                            oFileUploader = sap.ui.getCore().byId('FileUploadFileUploaderSF');

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
                            oView.setBusy(true);
                            that.Obj = this;
                            var response;

                            var uploadSuccess = oResourceBundle.getText("uploadSuccess"),
                                uploadSuccessTitle = oResourceBundle.getText("uploadSuccessTitle"),
                                uploadSuccessCount = oResourceBundle.getText("uploadSuccessCount"),
                                uploadErrorTitle = oResourceBundle.getText("uploadErrorTitle"),
                                uploadError = oResourceBundle.getText("uploadError"),
                                uploadFailed = oResourceBundle.getText("uploadFailed");

                            var batchModel = oView.getModel();
                            var oContext = batchModel.bindContext("/MassUploadStudioFeed(...)");
                            oContext.setParameter("fileData", data);
                            oContext.setParameter("fileName", filename);
                            oContext.setParameter("fieldNames", that.fieldNamesCAPM);

                            oContext.execute().then(function () {
                                sap.ui.getCore().byId("dialog").close();
                                response = oContext.getBoundContext().getObject();
                                if(response?.message){
                                    var oResponse = response.message;
                                   var aSuccess = oResponse.success,  aError = oResponse.error,  aWarning = oResponse.warning, aNonPersistentError = oResponse.nonpersistenterror;
                                    if(aError?.length){
                                        MessageBox.error('Click the below link for more details', {
                                            details: JSON.stringify(aError),
                                            title: 'Errors occured',
                                            actions: MessageBox.Action.OK,
                                            emphasizedAction: MessageBox.Action.OK,
                                            onClose: function (oAction) {
                                                if (oAction === MessageBox.Action.OK) {
                                                    that.Obj.fieldCancel();
                                                }
                                            }
                                        });
                                    }
                                    if(aWarning?.length){
                                        MessageBox.warning('Click the below link for more details', {
                                            details: JSON.stringify(aWarning),
                                            title: 'Warnings occured',
                                            actions: MessageBox.Action.OK,
                                            emphasizedAction: MessageBox.Action.OK,
                                            onClose: function (oAction) {
                                                if (oAction === MessageBox.Action.OK) {
                                                    that.Obj.fieldCancel();
                                                }
                                            }
                                        });
                                    }
                                    if(aSuccess?.length ){
                                        MessageBox.success('Click the below link for more details', {
                                            details: JSON.stringify(aSuccess),
                                            title: 'Following operations have been executed successfully',
                                            actions: MessageBox.Action.OK,
                                            emphasizedAction: MessageBox.Action.OK,
                                            onClose: function (oAction) {
                                                if (oAction === MessageBox.Action.OK) {
                                                    that.Obj.fieldCancel();
                                                }
                                            }
                                        });                                        
                                    }
                                    if(aNonPersistentError?.length){
                                        MessageBox.error('Click the below link for more details', {
                                            details: JSON.stringify(aNonPersistentError),
                                            title: 'Errors occured',
                                            actions: MessageBox.Action.OK,
                                            emphasizedAction: MessageBox.Action.OK,
                                            onClose: function (oAction) {
                                                if (oAction === MessageBox.Action.OK) {
                                                    that.Obj.fieldCancel();
                                                }
                                            }
                                        });

                                    }
                                    
                                batchModel.refresh();
                                oView.setBusy(false);
                                }  

                            }, function (oErr) {
                                var errorCode = uploadFailed + "\n" + (oErr?.cause?oErr.cause?.message:oErr?.message);
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
                                oView.setBusy(false);
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
                            var oFileUploader = sap.ui.getCore().byId('FileUploadFileUploaderSF');
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

        
        },
        handleRemediate: function (oEvent) {
            var that = this;
            var oView = this.getEditFlow().getView();
            var oResourceBundle = oView.getModel("i18n").getResourceBundle();
            var ref = this;
            let aSelectedItems = this.editFlow.getView().byId("normalizedorder::StudioFeedList--fe::table::StudioFeed::LineItem-innerTable").getSelectedItems();
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
            oView.setModel(new JSONModel(oEntry), "viewModel");
            // if (!oEntry?.SalesOrder) {
            //     MessageBox.error("Invalid Selection", {
            //         title: "Error",
            //         details: "Sales Order not available for the selected entry",
            //         contentWidth: "auto",
            //         styleClass: sResponsivePaddingClasses
            //     });
            //     return;
            // }
            // else if (oEntry?.Remediation) {
            //     MessageBox.error("Invalid Selection", {
            //         title: "Error",
            //         details: "Remediation is already done for the selection",
            //         contentWidth: "auto",
            //         styleClass: sResponsivePaddingClasses
            //     });
            //     return;
            // }
            // else 
            {
                MessageBox.confirm(oResourceBundle.getText("confirmSORemediation"), {
                    title: oResourceBundle.getText("confirmSORemediationTitle"),
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            BusyIndicator.show();
                            var oModel = this.getModel();
                            var oViewModel = this.getEditFlow().getView().getModel("viewModel");
                            var oActionODataContextBinding = oModel.bindContext("/remediateSalesOrder(...)");
                            // oActionODataContextBinding.setParameter("bookingID", oViewModel?.getProperty("/BookingID"));
                            // oActionODataContextBinding.setParameter("salesOrder", oViewModel?.getProperty("/SalesOrder"));
                            oActionODataContextBinding.setParameter("ID", oViewModel?.getProperty("/ID"));
                            // oActionODataContextBinding.setParameter("oInput", {
                            //     "bookingID": oViewModel?.getProperty("/BookingID"),
                            //     "salesOrder": oViewModel?.getProperty("/SalesOrder")
                            // });
                            BusyIndicator.show();
                            oActionODataContextBinding.execute().then(
                                function (param) {
                                    BusyIndicator.hide();
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
                                    BusyIndicator.hide();
                                }
                            ).catch(
                                (err, param2) => {
                                    MessageBox.error("Error occured", {
                                        title: "Error",
                                        details: err,
                                        contentWidth: "auto",
                                        styleClass: sResponsivePaddingClasses
                                    });
                                    BusyIndicator.hide();
                                }
                            );
                        }
                    }.bind(this)
                });
            }

        },
        handleReconcile: function () {
            let aData = [];
            let aSelectedItems = this.editFlow.getView().byId("normalizedorder::StudioFeedList--fe::table::StudioFeed::LineItem-innerTable").getSelectedItems();
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
                else if (oEntry?.SalesOrder && oEntry.Status_ID !== 'D') {
                    MessageBox.error(`Reconciliation can be done only for failed entries`, {
                        title: "Error",
                        contentWidth: "auto",
                        styleClass: sResponsivePaddingClasses
                    });
                    aData = [];
                    break;
                }
                else {
                    aData.push(oEntry.ID);
                }
            }
            if (aData?.length) {
                var oModel = this.getModel();
                var oActionODataContextBinding = oModel.bindContext("/reconcileStudioFeed(...)");
                oActionODataContextBinding.setParameter("aBookingID", aData);
                BusyIndicator.show();
                oActionODataContextBinding.execute().then(
                    function (param) {
                        var oActionContext = oActionODataContextBinding.getBoundContext();

                        if (oActionContext.getObject()?.value?.message) {
                            let oMessages = oActionContext.getObject()?.value?.message;
                            
                            let aErrors = oMessages.error;
                            let aWarnings = oMessages.warning;
                            let aSuccess = oMessages.success;

                            if (aErrors?.length) {
                                MessageBox.error("Action failed", {
                                    title: "Error",
                                    details: JSON.stringify((aErrors.map((entry) => { return entry.message }))),
                                    contentWidth: "auto",
                                    styleClass: sResponsivePaddingClasses
                                });
                            }
                            if (aWarnings?.length) {
                                MessageBox.warning("Action has been completed with warning", {
                                    title: "Warning",
                                    details: JSON.stringify((aWarnings.map((entry) => { return entry.message }))),
                                    contentWidth: "auto",
                                    styleClass: sResponsivePaddingClasses
                                });
                            }
                            if (aSuccess?.length) {
                                MessageBox.success("Action has been completed successfully", {
                                    title: "Success",
                                    details: JSON.stringify((aSuccess.map((entry) => { return entry.message }))),
                                    contentWidth: "auto",
                                    styleClass: sResponsivePaddingClasses
                                });
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
        }
        
    };
});
