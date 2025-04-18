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
        fndeleteTitle: function (oEvent) {
            var oView = this.getEditFlow().getView();  // Get the view context correctly
            var that = this;            
            var oModel = oView.getModel();
            var oContext = this._controller._getTable()._oTable.getSelectedItem().getBindingContext();
            
            var oFormModel = new sap.ui.model.json.JSONModel(oContext.getObject());
            var sTitleType = oFormModel.getData().TitleType;
            var oModel = oView.getModel();
            if (!sTitleType || sTitleType === "Parent") {
                MessageToast.show("Select a Local Title!");
                return;
            }
            if (!oContext) {
                MessageBox.error("No row selected for deletion.");
                return;
            }

            // Extract key values from the selected row
            var oData = JSON.parse(JSON.stringify(oContext.getObject()));
            oData.IsMarkedForDeletion = true;
            var sPath = oContext.getPath(); // OData entity path (e.g., "/Titles('123')")
            var result = sPath.substring(sPath.indexOf("(")); 
            var sRealPath = "/Titles"+result
            var sTitleId = oData.ID;
            var sMaterialMasterTitleID = oData.MaterialMasterTitleID;
            var sLocalTitleId = oData.LocalTitleId;
            var sRegionCode = oData.RegionCode;

            //Cleaning Up Region and other text
            delete oData.Region;
            delete oData.LangCodeText;
            delete oData.TitleCategoryText;
            delete oData.StudioText;

            MessageBox.confirm("Are you sure you want to delete this title?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        $.ajax({
                            //url: `${oModel.sServiceUrl}${sRealPath}(${sTitleId})`,  // Construct the DELETE request URL
                            url:`${oModel.sServiceUrl}/Titles(MaterialMasterTitleID=${sMaterialMasterTitleID},LocalTitleId='${sLocalTitleId}',ID='${sTitleId}',RegionCode='${sRegionCode}')`,
                            type: "PUT",
                            contentType: "application/json",
                            data: JSON.stringify(oData),
                            success: function () {
                                
                                MessageToast.show("Title deleted successfully.");
                                        oView.getModel().refresh();
                                oModel.refresh();  // Refresh model to update UI                                
                            }.bind(that),
                            error: function (xhr, status, error) {
                                console.error("Delete failed:", status, error, xhr.responseText);
                                MessageBox.error("Failed to delete title.");
                            }
                        });
                    }
                }.bind(this)
            });
           


        },

        


    };
});