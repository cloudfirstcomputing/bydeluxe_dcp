sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        handleMassUpload: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        handleReconcile: function() {
            MessageToast.show("Custom handler invoked.");
        },
        handleRemediate: function() {
            MessageToast.show("Custom handler invoked.");
        }
    };
});
