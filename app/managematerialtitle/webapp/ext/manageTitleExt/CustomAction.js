sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/library",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
], function (MessageToast, coreLibrary, MessageBox, Fragment, BusyIndicator, JSONModel, Spreadsheet, exportLibrary, Filter, FilterOperator) {
    "use strict";

    return {
        /**
         * Opens the Add Title dialog
         */
        fnCreateTitle: function (oEvent) {
            var oView = this.getEditFlow().getView();  // Get the view context correctly
            var that = this;

            // Load the fragment only once
            if (!this._oDialogC) {
                var oFragment = Fragment.load({
                    id: oView.getId(),  // Ensure unique fragment ID within the view
                    name: "com.dlx.managematerialtitle.ext.manageTitleExt.CreateTitle",
                    controller: {
                        handleValueHelp : function (oEvent) {                            
                            this._sInputId = oEvent.getSource().getId();
                    
                            // create value help dialog
                            if (!this._pValueHelpDialog) {
                                this._pValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "com.dlx.managematerialtitle.ext.manageTitleExt.ValueHelpDialog",  
                                    controller: this
                                }).then(function(oValueHelpDialog){
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }
                    
                            // open value help dialog
                            this._pValueHelpDialog.then(function(oValueHelpDialog){
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
                            if (!this._qValueHelpDialog) {
                                this._qValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "com.dlx.managematerialtitle.ext.manageTitleExt.ValueHelpDialogLg",  
                                    controller: this
                                }).then(function(oValueHelpDialog){
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }
                    
                            // open value help dialog
                            this._qValueHelpDialog.then(function(oValueHelpDialog){
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
                            if (!this._rValueHelpDialog) {
                                this._rValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "com.dlx.managematerialtitle.ext.manageTitleExt.ValueHelpDialogRc",  
                                    controller: this
                                }).then(function(oValueHelpDialog){
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }
                    
                            // open value help dialog
                            this._rValueHelpDialog.then(function(oValueHelpDialog){
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
                        onCancelCreate: function () {
                            if (this._oDialogC) {
                                this._oDialogC.close();
                            }
                        }.bind(that),
                        onValidateOriginalTitle: function (oEvent) {
                            var oInput = oEvent.getSource(),
                                oModel = oView.getModel(),
                                sProductDescription = oInput.getValue(),
                                //sUrl = `${oModel.sServiceUrl}ProductDescription?$filter=ProductDescription eq '${sProductDescription}'`;
                                //sUrl = `${oModel.sServiceUrl}ProductBasicText?$filter=LongText eq '${sProductDescription}'`;
                                sUrl = `${oModel.sServiceUrl}Titles?$filter=OriginalTitleName eq '${sProductDescription}'`;

                            $.ajax({
                                url: sUrl,
                                type: "GET",
                                async: false,
                                contentType: "application/json",
                                success: function (data) {
                                    var resp = data.value;

                                    if (!resp || !resp.length) {
                                        oInput.setValueState("None");
                                    } else {                                        
                                        oInput.setValueState("Error");
                                        oView.getModel("formModel").setProperty("/OriginalTitleName", "");

                                        sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                                            MessageBox.error("Title Already Exists");
                                        });
                                    }
                                }.bind(this),
                                error: function (error) {
                                    console.log(error);
                                    oInput.setValueState("Error");
                                    sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                                        MessageBox.error("Error fetching material information.");
                                    });
                                }
                            });
                        }.bind(that),
                        onSaveCreate: function (event) {
                            var oContext = event.getSource().getBindingContext();
                            var oModel = oView.getModel();

                            var oData = oView.getModel("formModel").getData();

                            if (oData.ReleaseDate) {
                                oData.ReleaseDate = new Date(oData.ReleaseDate).toISOString().split("T")[0]; // "YYYY-MM-DD"
                            }
                            if (oData.RepertoryDate) {
                                oData.RepertoryDate = new Date(oData.RepertoryDate).toISOString().split("T")[0]; // "YYYY-MM-DD"
                            }


                            var truncatedTitle = oData.OriginalTitleName ? oData.OriginalTitleName.substring(0, 40) : "";

                            var oDataS4API = {                                                        
                                ProductGroup: oData.TitleCategory,
                                ProductType: "SERV", //TitleType
                                BaseUnit: "EA",
                                ProductManufacturerNumber: "",
                                to_ProductBasicText: [
                                    {
                                        
                                        Language: "EN", //LanguageCode
                                        LongText: oData.OriginalTitleName
                                    }
                                ],
                                to_Description: [  
                                    {
                                       
                                        Language: "EN",
                                        ProductDescription: truncatedTitle  //Cut to 40 char   
                                    }
                                ]
                            };



                            var updateCall = $.ajax({
                                url: `${oModel.sServiceUrl}createProduct`, // Call the action instead of the entity
                                type: "POST",
                                contentType: "application/json",
                                data: JSON.stringify({ input: oDataS4API }), // Pass data under `input`
                                success: function (response) {
                                    console.log("Product creation successful:", response.Product);
                                    oView.getModel().refresh();
                                    oData.MaterialMasterTitleID = response.Product
                                    this.postTitles(oData, response.Product)
                                }.bind(this),
                                error: function (xhr, status, error) {
                                    console.error("Product creation failed:", status, error, xhr.responseText);
                                }
                            });


                        }.bind(that),
                    }
                }).then(function (oDialog) {
                    that._oDialogC = oDialog;
                    var oFormModel = new sap.ui.model.json.JSONModel({
                        MaterialMasterTitleID: "",
                        LocalTitleId: "", // This should be ignored while Creating
                        RegionCode: "",
                        OriginalTitleName: "",
                        TitleType: "Parent",
                        TitleCategory: "Z007",
                        RegionalTitleName: "",
                        ShortTitle: "",
                        SecurityTitle: "",
                        LanguageCode: "EN",
                        ReleaseDate: null,
                        RepertoryDate: null,
                        Format: "2D",
                        ReleaseSize: "",
                        Ratings: "",
                        ReelCountEstimated: null,
                        AssetVaultTitleId: "",
                        ImdbId: "",
                        StudioTitleId: "",
                        StudioDistributor: "",
                        Ratings_Ass: [],
                        ExternalTitleIDs_Ass: [],
                        GofilexTitleId: "" 
                        //IDType: "",
                        //IDValue: ""
                    });

                    // Set the model to the view
                    oView.setModel(oFormModel, "formModel");
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                var oFormModel = new sap.ui.model.json.JSONModel({
                    MaterialMasterTitleID: "",
                    LocalTitleId: "", // This should be ignored while Creating
                    RegionCode: "",
                    OriginalTitleName: "",
                    TitleType: "Parent",
                    TitleCategory: "Z007",
                    RegionalTitleName: "",
                    ShortTitle: "",
                    SecurityTitle: "",
                    LanguageCode: "EN",
                    ReleaseDate: null,
                    RepertoryDate: null,
                    Format: "2D",
                    ReleaseSize: "",
                    Ratings: "",
                    ReelCountEstimated: null,
                    AssetVaultTitleId: "", 
                    ImdbId: "",
                    StudioTitleId: "",
                    StudioDistributor: "",
                    Ratings_Ass: [],
                    ExternalTitleIDs_Ass: [],
                    GofilexTitleId: "" 
                    //IDType: "",
                    //IDValue: ""
                });

                // Set the model to the view
                oView.setModel(oFormModel, "formModel");                
                this._oDialogC.open();
            }

            this.postTitles = function (oData, Product) {
                var oModel = oView.getModel();
                if (oData.Ratings) {
                    oData.Ratings_Ass = oData.Ratings.split(",").map(rating => ({
                        RatingCode: rating.trim()
                    }));
                }
                var updateCall = $.ajax({
                    url: `${oModel.sServiceUrl}Titles`,
                    type: "POST", // Use PATCH or PUT based on your OData service
                    contentType: "application/json",
                    data: JSON.stringify(oData),
                    success: function (response) {
                        console.log("Update successful:", response);
                        MessageBox.success(oView.getController().getResourceBundle().getText("Success", [Product]), {
                            title: oView.getController().getResourceBundle().getText("SuccessTitle"),
                            actions: MessageBox.Action.OK,
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.OK) {
                                    // funcReset(oView, that);
                                }
                            }
                        });
                        oView.getModel().refresh();
                        if (that._oDialogC) {
                            that._oDialogC.close();
                        }

                    },
                    error: function (xhr, status, error) {
                        console.error("Update failed:", status, error, xhr.responseText);
                    }
                });
            }
        },
        onUploadPress: function () {
            var oView = this.getEditFlow().getView();
            var that = this;
        
            if (!this._oUploadDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "com.dlx.managematerialtitle.ext.manageTitleExt.FileUpload",
                    controller: {
                        onFileChange: function (oEvent) {
                            this._selectedFile = oEvent.getParameter("files")[0];
                            this._selectedFileName = oEvent.getParameter("files")[0].name;
                            MessageToast.show("File selected: " + this._selectedFileName);
                        },
        
                        onConfirmUpload: function (data, filename) {
                            var oView = that.getEditFlow().getView();
                            var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                            var response;
        
                            oView.setBusy(true);
                            that.Obj = this;
        
                            var uploadSuccess = oResourceBundle.getText("uploadSuccess"),
                                uploadSuccessTitle = oResourceBundle.getText("uploadSuccessTitle"),
                                uploadSuccessCount = oResourceBundle.getText("uploadSuccessCount"),
                                uploadErrorTitle = oResourceBundle.getText("uploadErrorTitle"),
                                uploadError = oResourceBundle.getText("uploadError"),
                                uploadFailed = oResourceBundle.getText("uploadFailed");
        
                            var batchModel = oView.getModel();
                            var oContext = batchModel.bindContext("/MassUploadManageMaterialTitle(...)");
        
                            oContext.setParameter("fileData", data);
                            oContext.setParameter("fileName", filename);
                            oContext.setParameter("fieldNames", that.fieldNamesMaterialTitle);
        
                            oContext.execute().then(function () {
                                sap.ui.getCore().byId("dialog").close();
                                response = oContext.getBoundContext().getObject();
        
                                if (response?.message) {
                                    var oResponse = response.message;
                                    var aSuccess = oResponse.success,
                                        aError = oResponse.error,
                                        aWarning = oResponse.warning;
        
                                    if (aError?.length) {
                                        MessageBox.error('Click the below link for more details', {
                                            details: JSON.stringify(aError),
                                            title: 'Errors occurred',
                                            actions: MessageBox.Action.OK,
                                            emphasizedAction: MessageBox.Action.OK,
                                            onClose: function (oAction) {
                                                if (oAction === MessageBox.Action.OK) {
                                                    that.Obj.fieldCancel();
                                                }
                                            }
                                        });
                                    }
        
                                    if (aWarning?.length) {
                                        MessageBox.warning('Click the below link for more details', {
                                            details: JSON.stringify(aWarning),
                                            title: 'Warnings occurred',
                                            actions: MessageBox.Action.OK,
                                            emphasizedAction: MessageBox.Action.OK,
                                            onClose: function (oAction) {
                                                if (oAction === MessageBox.Action.OK) {
                                                    that.Obj.fieldCancel();
                                                }
                                            }
                                        });
                                    }
        
                                    if (aSuccess?.length) {
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
        
                                    batchModel.refresh();
                                    oView.setBusy(false);
                                }
                            }, function (oErr) {
                                var errorCode = uploadFailed + "\n" + (oErr.error?.message || oErr.message);
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
        
                        onCancelUpload: function () {
                            if (that._oUploadDialog) {
                                that._oUploadDialog.close();
                            }
                        }
                    }
                }).then(function (oDialog) {
                    that._oUploadDialog = oDialog;
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this._oUploadDialog.open();
            }
        }
         
    };
});