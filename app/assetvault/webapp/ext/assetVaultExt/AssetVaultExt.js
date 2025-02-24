sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/PDFViewer"
], function (MessageToast, PDFViewer) {
    'use strict';

    return {
        onPreviewForm: function (oEvent) {
            var sSource = "/odata/v4/asset-vault/MediaFiles('')/content";
			window.open(sSource);
        }
    };
});
