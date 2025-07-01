sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        MassUpload: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        }
    };
});
