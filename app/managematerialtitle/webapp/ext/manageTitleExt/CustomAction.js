sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        fnCreateTitle: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        }
    };
});