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
	'sap/ui/model/FilterOperator'
], function (MessageToast, coreLibrary, MessageBox, Fragment, BusyIndicator, JSONModel, Spreadsheet, exportLibrary,Filter,FilterOperator) {
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
                        handleValueHelp : function (oEvent) {                            
                            this._sInputId = oEvent.getSource().getId();
                    
                            // create value help dialog
                            if (!this._sValueHelpDialog) {
                                this._sValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "com.dlx.managematerialtitle.ext.extActionLocalC.ValueHelpDialog",  
                                    controller: this
                                }).then(function(oValueHelpDialog){
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }
                    
                            // open value help dialog
                            this._sValueHelpDialog.then(function(oValueHelpDialog){
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
                            if (!this._tValueHelpDialog) {
                                this._tValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "com.dlx.managematerialtitle.ext.extActionLocalC.ValueHelpDialogLg",  
                                    controller: this
                                }).then(function(oValueHelpDialog){
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }
                    
                            // open value help dialog
                            this._tValueHelpDialog.then(function(oValueHelpDialog){
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
                            if (!this._uValueHelpDialog) {
                                this._uValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "com.dlx.managematerialtitle.ext.extActionLocalC.ValueHelpDialogRc",  
                                    controller: this
                                }).then(function(oValueHelpDialog){
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }
                    
                            // open value help dialog
                            this._uValueHelpDialog.then(function(oValueHelpDialog){
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
                        onCancel: function () {
                            if (this._oDialogL) {
                                this._oDialogL.close();
                            }
                        }.bind(that),
                        onSaveLineItem: function (event) {
                            var oContext = event.getSource().getBindingContext();
                            var oModel = oView.getModel();

                            var oData = JSON.parse(JSON.stringify(oView.getModel("formModel").getData()));        

                            delete oData.Region;
                            delete oData.LangCodeText;
                            delete oData.TitleCategoryText;
                            delete oData.StudioText;        

                            if (oData.ReleaseDate) {
                                oData.ReleaseDate = new Date(oData.ReleaseDate).toISOString().split("T")[0];
                            }
                            if (oData.RepertoryDate) {
                                oData.RepertoryDate = new Date(oData.RepertoryDate).toISOString().split("T")[0];
                            }
                            oData.TitleType = "Local"; // Setting Title Type to Local
                            oData.MaterialMasterTitleID = oData.MaterialMasterTitleID.toString(); //Conversion
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
                    var oModel = oView.getModel();
                    if (!sTitleType || sTitleType === "Local") {
                        MessageToast.show("Select a Parent Item to Create Local Title!");
                        return;
                    }
                    //Check If local ID is existing
                    var updateCall = $.ajax({
                        url: `${oModel.sServiceUrl}Titles?$filter=MaterialMasterTitleID eq ${oFormModel.oData.MaterialMasterTitleID}`,
                        type: "GET",
                        contentType: "application/json",
                        success: function (data) {
                            let existingIds = data.value
                                .map(item => item.LocalTitleId)
                                .filter(id => id) // Remove empty values
                                .map(id => parseInt(id.split('-')[1], 10)); // Convert to number  // Split and extract the numeric part
                                
                    
                            let newLocalId;
                            let parentTitleId = oFormModel.oData.MaterialMasterTitleID;
                            if (existingIds.length > 0) {
                                // Get the highest LocalTitleId and increment by 1
                                let maxId = Math.max(...existingIds);
                                newLocalId = `${parentTitleId}-${String(maxId + 1).padStart(4, "0")}`;
                            } else {
                                // If no LocalTitleId exists, set to "01"
                                newLocalId = `${parentTitleId}-0001`    ;
                            }
                    
                            console.log("New LocalTitleId:", newLocalId);
                            oFormModel.oData.LocalTitleId = newLocalId;
                            oView.setModel(oFormModel, "formModel");
                            oView.addDependent(oDialog);
                            oDialog.open(); //First time opening
                            // Use newLocalId to update or create a new entry
                        },
                        error: function (xhr, status, error) {
                            console.error("Fetch failed:", status, error, xhr.responseText);
                        }
                    });
                    //IF local ID is existing increment by +1
                    //If no Local ID its 01

                    // Set the model to the view
                    
                });
            } else {
                var oContext = that._controller._getTable()._oTable.getSelectedItem().getBindingContext();
                var oFormModel = new sap.ui.model.json.JSONModel(oContext.getObject());
                var sTitleType = oFormModel.getData().TitleType;
                var oModel = oView.getModel();
                if (!sTitleType || sTitleType === "Local") {
                    MessageToast.show("Select a Parent Item to Create Local Title!");
                    return;
                }
                var updateCall = $.ajax({
                    url: `${oModel.sServiceUrl}Titles?$filter=MaterialMasterTitleID eq ${oFormModel.oData.MaterialMasterTitleID}`,
                    type: "GET",
                    contentType: "application/json",
                    success: function (data) {
                        let existingIds = data.value
                            .map(item => item.LocalTitleId)
                            .filter(id => id) // Remove empty values
                            .map(id => parseInt(id.split('-')[1], 10)); // Convert to number
                
                        let newLocalId;
                        let parentTitleId = oFormModel.oData.MaterialMasterTitleID;
                        if (existingIds.length > 0) {
                            // Get the highest LocalTitleId and increment by 1
                            let maxId = Math.max(...existingIds);
                            newLocalId = `${parentTitleId}-${String(maxId + 1).padStart(4, "0")}`;
                        } else {
                            // If no LocalTitleId exists, set to "01"
                            newLocalId = `${parentTitleId}-0001`;
                        }
                
                        console.log("New LocalTitleId:", newLocalId);
                        oFormModel.oData.LocalTitleId = newLocalId;
                        oView.setModel(oFormModel, "formModel");
                        oView.addDependent(that._oDialogL);
                        that._oDialogL.open(); //Second time opening
                        // Use newLocalId to update or create a new entry
                    },
                    error: function (xhr, status, error) {
                        console.error("Fetch failed:", status, error, xhr.responseText);
                    }
                });
            }
        },


    };
});