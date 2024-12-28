sap.ui.define([
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",

], function (BusyIndicator, MessageBox) {
    "use strict";

    return {
        execute: function (oContext, aSelectedContexts) {
            var oEditFlow = this.editFlow
            var oModel = oEditFlow.getView().getModel();
            oEditFlow.invokeAction("DistributionService.createDCPMaterial", {
                contexts: aSelectedContexts,
                invocationGrouping: true,
                requiresNavigation: false,
                skipParameterDialog: true
            }).then((val) => {
                oModel.refresh();
            });
        }

    };
});