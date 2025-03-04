sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/PDFViewer"
], function (MessageToast, PDFViewer) {
    'use strict';

    return {
        onPreviewForm: function (oEvent) {

            // Get the OData Model attached to the view or component
            var oModel = this._view.getModel(); // Assuming the default model

            // Get the service URL from the OData model
            var sServiceUrl = oModel.sServiceUrl;

            // Construct the full PDF URL
            var sPdfUrl = sServiceUrl + "/MediaFiles('')/content";
            window.open(sPdfUrl);
        }
    };
});
