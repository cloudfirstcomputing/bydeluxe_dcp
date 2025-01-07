sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/library",
    "sap/m/MessageBox"
], function(MessageToast, coreLibrary, MessageBox) {
    'use strict';
    var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
    return {
        handleProcess: function(oEvent) {

            let aData = [];
            let aSelectedItems = this.editFlow.getView().byId("dcpcontentweb::dcpcontentList--fe::table::dcpcontent::LineItem-innerTable").getSelectedItems();
            for (var i in aSelectedItems) {
                var oEntry = aSelectedItems[i].getBindingContext().getObject();
                if(!oEntry){
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
                else if(!oEntry?.BookingID){
                    MessageBox.error(`Retry after selecting Booking ID from table settings`, {
                        title: "Error",
                        contentWidth: "auto",
                        styleClass: sResponsivePaddingClasses
                    });
                    aData = [];
                    break;
                }
                else{
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
                        //    dialog.show(oActionContext.getObject().value);

                        MessageBox.success("Action has been completed successfully", {
                            title: "Success",
                            details: "Please check Sales Order and Reconciliation info for details",
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
