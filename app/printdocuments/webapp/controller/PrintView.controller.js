sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/m/PDFViewer"
], function (Controller, MessageToast, Fragment,PDFViewer) {
    "use strict";

    return Controller.extend("com.dlx.printdocu.printdocuments.controller.PrintView", {
        onInit() {
            
        },
        onPreviewForm: function (oEvent) {
            var oModel = this.getView().getModel(); // Assuming the default model
            var sServiceUrl = oModel.sServiceUrl;
            var sPdfUrl = sServiceUrl + "downloadFormADS()";
            // var opdfViewer = new PDFViewer();
			// this.getView().addDependent(opdfViewer);
            // var sSource = sServiceUrl + "downloadFormADS()";
			// opdfViewer.setSource(sSource);
			// opdfViewer.setTitle( "My PDF");
			// opdfViewer.open();
            // this.openPdfViewer(sSource);
            var that = this;
            var updateCall = $.ajax({
                url: sPdfUrl,
                type: "GET",
                headers: {
                    "Accept": "application/pdf"
                },
                success: function (data) {
                    that.onOpenPDF(data);
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching PDF:", status, error);
                    sap.m.MessageToast.show("Failed to load the form.");
                }
            });

            

            // // Get the OData Model attached to the view or component
            // var oModel = this.getView().getModel(); // Assuming the default model

            // // Get the service URL from the OData model
            // var sServiceUrl = oModel.sServiceUrl;

            // // Construct the full PDF URL
            // var sPdfUrl = sServiceUrl + "downloadFormADS()";

            // window.open(sPdfUrl);
        },
        openPdfViewer: function (sPdfUrl) {
            if (!this._pdfViewerDialog) {
                this._pdfViewerDialog = sap.ui.xmlfragment("com.dlx.printdocu.printdocuments.view.pdfView", this);
                this.getView().addDependent(this._pdfViewerDialog);
            }
        
            var oPdfViewer = sap.ui.getCore().byId("pdfViewer");
            oPdfViewer.setSource(sPdfUrl);
            oPdfViewer.setTitle("PDF Preview");
        
            this._pdfViewerDialog.open();
        },
        onClosePdfDialog: function () {
            if (this._pdfViewerDialog) {
                this._pdfViewerDialog.close();
            }
        },
        onOpenPDF: function (data) {
            var base64String = data.value;
            var byteCharacters = atob(base64String);
            var byteNumbers = new Array(byteCharacters.length);
            
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], { type: "application/pdf" });
            var blobURL = URL.createObjectURL(blob);
            
            // Open the PDF in a new tab
            window.open(blobURL);
           // this.openPdfViewer(blobURL);
        },
        onDateChange: function () {
            var oView = this.getView();
            var oStartDatePicker = oView.byId("startDate");
            var oEndDatePicker = oView.byId("endDate");
            var oDocKeyInput = oView.byId("documentKey");

            var oStartDate = oStartDatePicker.getDateValue();
            if (oStartDate) {
                var oEndDate = new Date(oStartDate);
                oEndDate.setDate(oEndDate.getDate() + 7); // Add 7 days

                oEndDatePicker.setDateValue(oEndDate);
                //oDocKeyInput.setEnabled(false);
            }
        },
        onSearch1: function () {
            var that = this;
            var oModel = this.getView().getModel(); // Assuming the default model
            var sServiceUrl = oModel.sServiceUrl;
           
            
            var updateCall = $.ajax({
                url: sServiceUrl+"/A_MaterialDocumentHeader",
                type: "GET",
                headers: {
                    "Accept": "application/json"
                },
                success: function (data) {
                    if (data && data.d && data.d.results) {
                        var oJSONModel = new sap.ui.model.json.JSONModel();
                        oJSONModel.setData({ documents: data.d.results });
                        that.getView().setModel(oJSONModel, "docModel");
                    } else {
                        sap.m.MessageToast.show("No material documents found.");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching material documents:", status, error);
                    sap.m.MessageToast.show("Failed to retrieve material documents.");
                }
            });
        },
        onSearch: function () {
            var that = this;
        
            // Dummy data for testing
            var aDummyData = [
                { docNumber: "1000001", docType: "GR", docDate: "2025-03-05" },
                { docNumber: "1000002", docType: "GI", docDate: "2025-03-06" },
                { docNumber: "1000003", docType: "STO", docDate: "2025-03-07" },
                { docNumber: "1000004", docType: "TR", docDate: "2025-03-08" },
                { docNumber: "1000005", docType: "INV", docDate: "2025-03-09" },
                { docNumber: "1000006", docType: "GR", docDate: "2025-03-10" },
                { docNumber: "1000007", docType: "GI", docDate: "2025-03-11" },
                { docNumber: "1000008", docType: "STO", docDate: "2025-03-12" },
                { docNumber: "1000009", docType: "TR", docDate: "2025-03-13" },
                { docNumber: "1000010", docType: "INV", docDate: "2025-03-14" }
            ];
        
            // Create and set JSON model
            var oJSONModel = new sap.ui.model.json.JSONModel();
            oJSONModel.setData({ documents: aDummyData });
            that.getView().setModel(oJSONModel, "docModel");
        
            sap.m.MessageToast.show("Dummy data loaded successfully.");
        }
    });
});