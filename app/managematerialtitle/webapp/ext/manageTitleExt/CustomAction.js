sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/library",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageView",
    "sap/m/MessageItem",
    "sap/m/Button",
    "sap/m/Bar",
    "sap/m/Title",
    "sap/m/Popover",
    "sap/ui/core/IconPool",
    "sap/m/Link"
], function (
    MessageToast,
    coreLibrary,
    MessageBox,
    Fragment,
    BusyIndicator,
    JSONModel,
    Spreadsheet,
    exportLibrary,
    Filter,
    FilterOperator,
    MessageView,
    MessageItem,
    Button,
    Bar,
    Title,
    Popover,
    IconPool,
    Link
) {
    "use strict";
    const mapStatus = (status) => {
        switch (status.toLowerCase()) {
            case 'error': return 'Error';
            case 'warning': return 'Warning';
            case 'success': return 'Success';
            default: return null;
        }
    };

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
                        handleValueHelp: function (oEvent) {
                            this._sInputId = oEvent.getSource().getId();

                            // create value help dialog
                            if (!this._pValueHelpDialog) {
                                this._pValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "com.dlx.managematerialtitle.ext.manageTitleExt.ValueHelpDialog",
                                    controller: this
                                }).then(function (oValueHelpDialog) {
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }

                            // open value help dialog
                            this._pValueHelpDialog.then(function (oValueHelpDialog) {
                                oValueHelpDialog.open();
                            });
                        },

                        _handleValueHelpSearch: function (oEvent) {
                            var sValue = oEvent.getParameter("value");
                            var oFilter = new Filter(
                                "BusinessPartnerFullName",
                                FilterOperator.Contains, sValue
                            );
                            oEvent.getSource().getBinding("items").filter([oFilter]);
                        },

                        _handleValueHelpClose: function (oEvent) {
                            var oSelectedItem = oEvent.getParameter("selectedItem");
                            if (oSelectedItem) {
                                var productInput = oView.byId(this._sInputId);
                                productInput.setValue(oSelectedItem.getTitle());
                            }
                            oEvent.getSource().getBinding("items").filter([]);
                        },
                        handleValueHelplg: function (oEvent) {
                            this._sInputId = oEvent.getSource().getId();

                            // create value help dialog
                            if (!this._qValueHelpDialog) {
                                this._qValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "com.dlx.managematerialtitle.ext.manageTitleExt.ValueHelpDialogLg",
                                    controller: this
                                }).then(function (oValueHelpDialog) {
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }

                            // open value help dialog
                            this._qValueHelpDialog.then(function (oValueHelpDialog) {
                                oValueHelpDialog.open();
                            });
                        },

                        _handleValueHelpSearchlg: function (oEvent) {
                            var sValue = oEvent.getParameter("value");
                            var oFilter = new Filter(
                                "name",
                                FilterOperator.Contains, sValue
                            );
                            oEvent.getSource().getBinding("items").filter([oFilter]);
                        },

                        _handleValueHelpCloselg: function (oEvent) {
                            var oSelectedItem = oEvent.getParameter("selectedItem");
                            if (oSelectedItem) {
                                var productInput = oView.byId(this._sInputId);
                                productInput.setValue(oSelectedItem.getTitle());
                            }
                            oEvent.getSource().getBinding("items").filter([]);
                        },
                        handleValueHelprc: function (oEvent) {
                            this._sInputId = oEvent.getSource().getId();

                            // create value help dialog
                            if (!this._rValueHelpDialog) {
                                this._rValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "com.dlx.managematerialtitle.ext.manageTitleExt.ValueHelpDialogRc",
                                    controller: this
                                }).then(function (oValueHelpDialog) {
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }

                            // open value help dialog
                            this._rValueHelpDialog.then(function (oValueHelpDialog) {
                                oValueHelpDialog.open();
                            });
                        },

                        _handleValueHelpSearchlg: function (oEvent) {
                            var sValue = oEvent.getParameter("value");
                            var oFilter = new Filter(
                                "name",
                                FilterOperator.Contains, sValue
                            );
                            oEvent.getSource().getBinding("items").filter([oFilter]);
                        },

                        _handleValueHelpCloselg: function (oEvent) {
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
                                sProductDescription = oInput.getValue().replace("'", "''"),
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
                                ProductType: "ZTLS", //TitleType
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
                        ReleaseSize: "Wide",
                        Ratings: "",
                        ReelCountEstimated: null,
                        AssetVaultTitleId: "",
                        ImdbId: "",
                        StudioTitleId: "",
                        StudioDistributor: "",
                        Ratings_Ass: [],
                        ExternalTitleIDs_Ass: [],
                        GofilexTitleId: "",
                        UseSecureName: "Yes"
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
                    ReleaseSize: "Wide",
                    Ratings: "",
                    ReelCountEstimated: null,
                    AssetVaultTitleId: "",
                    ImdbId: "",
                    StudioTitleId: "",
                    StudioDistributor: "",
                    Ratings_Ass: [],
                    ExternalTitleIDs_Ass: [],
                    GofilexTitleId: "",
                    UseSecureName: "Yes"
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
            const oView = this.getEditFlow().getView();
            const that = this; 

            if (!this._oUploadDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "com.dlx.managematerialtitle.ext.manageTitleExt.FileUpload",
                    controller: {
                        onFileChange: function (oEvent) {
                            that._selectedFile = oEvent.getParameter("files")[0];
                            that._selectedFileName = that._selectedFile.name;
                            MessageToast.show("File selected: " + that._selectedFileName);
                        },

                        onConfirmUpload: function () {
                            const file = that._selectedFile;
                            const fileName = that._selectedFileName;
                            const fieldNames = that.fieldNamesMaterialTitle;
                            const oModel = oView.getModel();

                            if (!file) {
                                MessageToast.show("Please select a file first.");
                                return;
                            }

                            const reader = new FileReader();

                            reader.onload = function (e) {
                                const base64Data = e.target.result.split(',')[1];
                                oView.setBusy(true);

                                $.ajax({
                                    url: `${oModel.sServiceUrl}MassUploadManageMaterialTitle`,
                                    type: "POST",
                                    contentType: "application/json",
                                    data: JSON.stringify({
                                        fileData: base64Data,
                                        fileName: fileName,
                                        fieldNames: fieldNames
                                    }),
                                    success: function (response) {
                                        that._oUploadDialog?.close();
                                        oView.setBusy(false);
                                      
                                        if (response && response.message) {
                                          const { success = [], error = [], warning = [] } = response.message;
                                      
                                          const successCount = success.length;
                                          const errorCount = error.length;
                                          const warningCount = warning.length;
                                      
                                          const formatEntry = (entry, status, counter = 1) => ({
                                            type: status, // must be one of "Error", "Warning", "Success"
                                            title: entry.RowData?.OriginalTitleName || entry.TitleID || "N/A",
                                            description: entry.Message || "No message",
                                            subtitle: entry.Error || "",
                                            counter: counter
                                          });
                                      
                                          const summaryList = [];
                                          success.forEach(item => summaryList.push(formatEntry(item, "Success", successCount)));
                                          error.forEach(item => summaryList.push(formatEntry(item, "Error", errorCount)));
                                          warning.forEach(item => summaryList.push(formatEntry(item, "Warning", warningCount)));
                                      
                                          const oSummaryModel = new sap.ui.model.json.JSONModel(summaryList);
                                      
                                          if (!that._oUploadSummaryDialog) {
                                            Fragment.load({
                                              id: oView.getId(),
                                              name: "com.dlx.managematerialtitle.ext.manageTitleExt.UploadSummaryDialog",
                                              controller: {
                                                onCancelSummary: function() {
                                                  that._oUploadSummaryDialog?.close();
                                                }
                                              }
                                            }).then(function(oDialog) {
                                              that._oUploadSummaryDialog = oDialog;
                                              oView.addDependent(oDialog);
                                              oDialog.setModel(oSummaryModel);    // Set model here
                                              oDialog.open();
                                            });
                                          } else {
                                            that._oUploadSummaryDialog.setModel(oSummaryModel); // Refresh model
                                            that._oUploadSummaryDialog.open();
                                          }
                                      
                                          if (error.length) {
                                            sap.m.MessageBox.error("Some entries failed to upload.");
                                          }
                                          if (success.length) {
                                            sap.m.MessageToast.show("Upload successful.");
                                          }
                                        }
                                      
                                        oModel.refresh();
                                      },

                                    error: function (xhr, status, error) {
                                        console.error("Mass upload failed:", status, error, xhr.responseText);
                                        oView.setBusy(false);
                                        MessageBox.error("Upload failed.");
                                    }
                                });
                            };

                            reader.readAsDataURL(file);
                        },

                        onCancelUpload: function () {
                            that._oUploadDialog?.close(); // ✅ fixed
                        },
                        onDownloadTemplate: function () {
                            // Step 1: Define columns (headers)
                            const aCols = [
                                { label: "Material Master Title ID", property: "MaterialMasterTitleID", type: "string" },
                                { label: "Local Title Id", property: "LocalTitleId", type: "string" },
                                { label: "Original Title Name", property: "OriginalTitleName", type: "string" },
                                { label: "Title Type", property: "TitleType", type: "string" },
                                { label: "Title Category", property: "TitleCategory", type: "string" },
                                { label: "Deleted", property: "Deleted", type: "string" },
                                { label: "Regional Title Name", property: "RegionalTitleName", type: "string" },
                                { label: "Short Title", property: "ShortTitle", type: "string" },
                                { label: "Security Title", property: "SecurityTitle", type: "string" },
                                { label: "Region Code", property: "RegionCode", type: "string" },
                                { label: "Language Code", property: "LanguageCode", type: "string" },
                                { label: "Release Date", property: "ReleaseDate", type: "date" },
                                { label: "Repertory Date", property: "RepertoryDate", type: "date" },
                                { label: "Format", property: "Format", type: "string" },
                                { label: "Release Size", property: "ReleaseSize", type: "string" },
                                { label: "Ratings", property: "Ratings", type: "string" },
                                { label: "Reel Count (Estimated)", property: "ReelCountEstimated", type: "number" },
                                { label: "Asset Vault Title Id", property: "AssetVaultTitleId", type: "string" },
                                { label: "IMDB ID", property: "ImdbId", type: "string" },
                                { label: "Studio Title Id", property: "StudioTitleId", type: "string" },
                                { label: "Studio/Distributor", property: "StudioDistributor", type: "string" },
                                { label: "Gofilex Title Id", property: "GofilexTitleId", type: "string" },
                                { label: "ID", property: "Id", type: "string" },
                                { label: "Use Secure Name", property: "UseSecureName", type: "string" }
                            ];
                            const adata = [
                                {}
                            ];

                            // Step 3: Create Spreadsheet
                            const oSettings = {
                                workbook: {
                                    columns: aCols,

                                },
                                dataSource: adata,
                                fileName: "ExportedData.xlsx",
                                worker: false // set to true for large files
                            };

                            new Spreadsheet(oSettings).build().finally(() => {
                                sap.m.MessageToast.show("Excel exported successfully!");
                            });
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
        },

    };
});