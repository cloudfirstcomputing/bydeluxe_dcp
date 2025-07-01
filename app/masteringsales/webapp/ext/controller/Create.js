sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        Create: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        }
    };
});
