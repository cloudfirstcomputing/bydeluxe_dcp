sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        handleProcess: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        handleReconcile: function() {
            MessageToast.show("Custom handler invoked.");
        }
    };
});
