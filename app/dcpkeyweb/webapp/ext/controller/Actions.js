sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/library",
    "sap/m/MessageBox"
], function(MessageToast, coreLibrary, MessageBox) {
    'use strict';
    var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
    return {
        handleProcess: function(oEvent) {
            var aData = [];
            var oListReport = this.editFlow.getView().byId("dcpkeyweb::dcpkeyList--fe::table::dcpkey::LineItem-innerTable");
            var aSelectedItems = oListReport.getSelectedItems();
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
                else if(oEntry.ErrorMessage){
                    MessageBox.error(`Selection contains entries to be reconciled`, {
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
                var oActionODataContextBinding = oModel.bindContext("/postKeyToSAP(...)");
                oActionODataContextBinding.setParameter("bookingIDs", aData);
                oActionODataContextBinding.execute().then(
                    function (param) {
                        var oActionContext = oActionODataContextBinding.getBoundContext();
                        
                        MessageBox.success("Action has been completed successfully", {
                            title: "Success",
                            details: "Please check Sales Order and Reconciliation info for details",
                            contentWidth: "auto",
                            styleClass: sResponsivePaddingClasses
                        });
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
        handleReconcile: function() {
            var aData = [];
            var oListReport = this.editFlow.getView().byId("dcpkeyweb::dcpkeyList--fe::table::dcpkey::LineItem-innerTable");
            var aSelectedItems = oListReport.getSelectedItems();
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
                else if (oEntry?.SalesOrder || !oEntry.ErrorMessage) {
                    MessageBox.error(`Reconciliation can be done only for entries with Reconciliation Info`, {
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
                var oActionODataContextBinding = oModel.bindContext("/postKeyToSAP(...)");
                oActionODataContextBinding.setParameter("bookingIDs", aData);
                oActionODataContextBinding.execute().then(
                    function (param) {
                        var oActionContext = oActionODataContextBinding.getBoundContext();
 
                        MessageBox.success("Action has been completed successfully", {
                            title: "Success",
                            details: "Please check Sales Order and Reconciliation info for details",
                            contentWidth: "auto",
                            styleClass: sResponsivePaddingClasses
                        });
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
