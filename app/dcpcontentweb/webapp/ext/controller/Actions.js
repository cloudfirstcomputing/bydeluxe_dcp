sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/library",
    "sap/m/MessageBox"
], function(MessageToast, coreLibrary, MessageBox) {
    'use strict';

    return {
        handleProcess: function(oEvent) {

            // MessageToast.show("Custom handler invoked.");
            let aData = [];
            let aSelectedItems = this.editFlow.getView().byId("dcpcontentweb::dcpcontentList--fe::table::dcpcontent::LineItem-innerTable").getSelectedItems();
            for (var i in aSelectedItems) {
                var oEntry = aSelectedItems[i].getBindingContext().getObject();
                if (oEntry?.SalesOrder) {
                    MessageBox.error(`Posting is already done for ${oEntry.ApplicationID} - ${oEntry.BookingID}. Sales Order is: ${oEntry.SalesOrder}`, {
                        title: "Error",
                        contentWidth: "auto",
                        styleClass: sResponsivePaddingClasses
                    });
                    aData = [];
                    break;
                }
                else {
                    aData.push(oEntry);
                }
            }
            if (aData?.length) {
                var oModel = this.getModel();
                var oActionODataContextBinding = oModel.bindContext("/processContent(...)");
                oActionODataContextBinding.setParameter("dcpcontent", aData);
                oActionODataContextBinding.execute().then(
                    function (param) {
                        var oActionContext = oActionODataContextBinding.getBoundContext();
                        console.table(oActionContext.getObject().value);
                        //    dialog.show(oActionContext.getObject().value);

                        MessageBox.success("SAP posting has been successful", {
                            title: "Success",
                            details: this.getModel().getMessagesByPath("")?.[0].getMessage(),
                            contentWidth: "auto",
                            styleClass: sResponsivePaddingClasses
                        });
                        // var oListReport = sap.ui.getCore().byId('replifyweb::HeaderDataList--fe::table::HeaderData::LineItem-innerTable');
                        // oListReport.removeSelections(true);
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
        handleREconcile: function() {
            MessageToast.show("Custom handler invoked.");
        }
    };
});
