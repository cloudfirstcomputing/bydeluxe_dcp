sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        Display: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        }
    };
});
