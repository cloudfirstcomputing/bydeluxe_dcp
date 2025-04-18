sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/m/PDFViewer",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator"
], function (Controller, MessageToast, Fragment, PDFViewer, Filter, FilterOperator, BusyIndicator) {
    "use strict";

    return Controller.extend("com.dlx.printdocu.printdocuments.controller.PrintView", {
        onInit() {
            var oViewModel = new sap.ui.model.json.JSONModel({
                visibleTable1: true,
                visibleTable2: false,
                visibleTable3: false
            });
            this.getView().setModel(oViewModel, "viewModel");

        },
        onAfterRendering: function () {
            this.bindTheDocMaterial();
        },
        bindTheDocMaterial: function () {
            var oModel = this.getView().getModel(),aFilters=[]; // Assuming the default model
            var that = this,sServiceUrl = oModel.sServiceUrl;
            $.ajax({
                url: sServiceUrl+"S4_Plants?$filter=CompanyCode eq '3011'",
                type: "GET",
                success: function (data) {
                    var aData = data.value;
                    for (var index in aData) {
                        aFilters.push(new Filter("Plant", FilterOperator.EQ, aData[index].Plant))
                    }
                    that.oFilter = new Filter({
                        filters: aFilters,
                        and: false
                    });
                    that.byId("docTable").getBinding("items").filter([that.oFilter],"Application");
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching PDF:", status, error);
                    // sap.m.MessageToast.show("Failed to load the form.");
                }
            });

        },
        onSelectChange: function (oEvent) {
            var sSelectedKey = oEvent.getSource().getSelectedKey();
            var oViewModel = this.getView().getModel("viewModel");

            if (sSelectedKey === "1") {
                oViewModel.setProperty("/visibleTable1", true);
                oViewModel.setProperty("/visibleTable2", false);
                oViewModel.setProperty("/visibleTable3", false);
            }
            else if (sSelectedKey === "6") {
                oViewModel.setProperty("/visibleTable1", false);
                oViewModel.setProperty("/visibleTable2", false);
                oViewModel.setProperty("/visibleTable3", true);
            }
            else {
                oViewModel.setProperty("/visibleTable1", false);
                oViewModel.setProperty("/visibleTable2", true);
                oViewModel.setProperty("/visibleTable3", false);
            }
        },
        onPreviewForm: function (oEvent) {
            var oModel = this.getView().getModel(); // Assuming the default model
            var sServiceUrl = oModel.sServiceUrl;
            var sPdfUrl = sServiceUrl + "downloadFormADS()";
            var oPrintModel = this.getView().getModel("printModel");
            if (this.byId("selectFormName").getSelectedKey() === '1') {
                var oSelecteditem;
                [oSelecteditem] = this.byId("docTable").getSelectedItems();
                var sForm = "YY1_MMIM_GR_LABEL_EN";

                var oMaterialDoc = oSelecteditem.getBindingContext().getObject();
                var oData = {
                    form: sForm,
                    Material: {
                        MaterialDocumentYear: oMaterialDoc.MaterialDocumentYear,
                        MaterialDocument: oMaterialDoc.MaterialDocument,
                        MaterialDocumentItem: oMaterialDoc.MaterialDocumentItem
                    }
                }
                var sSource = sServiceUrl + `formGR_LABEL`
                var that = this;
                var updateCall = $.ajax({
                    url: sSource,
                    type: "POST",
                    data: JSON.stringify(oData),
                    headers: {
                        "Accept": "application/pdf",
                        "Content-Type": "application/json"
                    },
                    success: function (data) {
                        that.onOpenPDF(data);
                    },
                    error: function (xhr, status, error) {
                        console.error("Error fetching PDF:", status, error);
                        sap.m.MessageToast.show("Failed to load the form.");
                    }
                });
            }
            else if (this.byId("selectFormName").getSelectedKey() === '6') {
                var oSelecteditem;
                [oSelecteditem] = this.byId("docTable3").getSelectedItems();
                var sForm = "PRINTINVOICEFORM";

                var oBillingDoc = oSelecteditem.getBindingContext().getObject();
                var oBill = {
                    BillingDocument: oBillingDoc.BillingDocument,
                    BillingDocumentCategory: oBillingDoc.BillingDocumentCategory,
                    BillingDocumentDate: oBillingDoc.BillingDocumentDate,
                    BillingDocumentType: oBillingDoc.BillingDocumentType
                }
                var oData = {
                    form: sForm,
                    Billing: oBill
                }
                var sSource = sServiceUrl + `invoiceForm_LABEL`
                var that = this;
                var updateCall = $.ajax({
                    url: sSource,
                    type: "POST",
                    data: JSON.stringify(oData),
                    headers: {
                        "Accept": "application/pdf",
                        "Content-Type": "application/json"
                    },
                    success: function (data) {
                        that.onOpenPDF(data);
                    },
                    error: function (xhr, status, error) {
                        console.error("Error fetching PDF:", status, error);
                        sap.m.MessageToast.show("Failed to load the form.");
                    }
                });
            }
            else {
                // var opdfViewer = new PDFViewer();
                // this.getView().addDependent(opdfViewer);
                var oSelecteditem;
                // opdfViewer.setSource(sSource);
                // opdfViewer.setTitle( "My PDF");
                // opdfViewer.open();
                // this.openPdfViewer(sSource);
                [oSelecteditem] = this.byId("docTable2").getSelectedItems();

                var sForm = this.byId("selectFormName").getSelectedKey() == '5' ? 'HDDLabel' : this.byId("selectFormName").getSelectedKey() == '2' ? "DCDCLabel" : this.byId("selectFormName").getSelectedKey() == '3' ? "DeluxeLabel" : "MasterLabel";

                var sProdId = oSelecteditem.getBindingContext().getObject().Product;
                var oData = {
                    form: sForm,
                    Product: sProdId
                }
                var sSource = sServiceUrl + `downloadFormADS`
                var that = this;
                BusyIndicator.show();
                var updateCall = $.ajax({
                    url: sSource,
                    type: "POST",
                    data: JSON.stringify(oData),
                    headers: {
                        "Accept": "application/pdf",
                        "Content-Type": "application/json"
                    },
                    success: function (data) {
                        BusyIndicator.hide();
                        that.onOpenPDF(data);
                    },
                    error: function (xhr, status, error) {
                        BusyIndicator.hide();
                        console.error("Error fetching PDF:", status, error);
                        sap.m.MessageToast.show("Failed to load the form.");
                    }
                });
            }
            // // Get the OData Model attached to the view or component
            // var oModel = this.getView().getModel(); // Assuming the default model

            // // Get the service URL from the OData model
            // var sServiceUrl = oModel.sServiceUrl;

            // // Construct the full PDF URL
            // var sPdfUrl = sServiceUrl + "downloadFormADS()";

            // window.open(sPdfUrl);



            // // Get the OData Model attached to the view or component
            // var oModel = this.getView().getModel(); // Assuming the default model

            // // Get the service URL from the OData model
            // var sServiceUrl = oModel.sServiceUrl;

            // // Construct the full PDF URL
            // var sPdfUrl = sServiceUrl + "downloadFormADS()";

            // window.open(sPdfUrl);

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
                oEndDatePicker.setDateValue("null");
                oEndDatePicker.setEnabled(true);
                oDocKeyInput.setEnabled(false);
            }
            else {
                oDocKeyInput.setEnabled(true);
            }
        },
        onSearch1: function () {
            var that = this;
            var oModel = this.getView().getModel(); // Assuming the default model
            var sServiceUrl = oModel.sServiceUrl, sSuffix = "", aFilters = [];

            if (this.byId("selectFormName").getSelectedKey() === '5') {
                var sKey = this.byId("documentKey").getValue();
                if (sKey) {
                    aFilters.push(new Filter("Product", FilterOperator.EQ, sKey))
                    // this.byId("docTable2").getBinding("items").filter(oFilter, FilterOperator.EQ, sKey);
                }
                // else{
                //     this.byId("docTable2").getBinding("items").filter(null, null, null);
                // }
            }
            else if (this.byId("selectFormName").getSelectedKey() === '1') {
                var sKey = this.byId("documentKey").getValue();
                if (sKey) {
                    aFilters.push(new Filter("MaterialDocument", FilterOperator.EQ, sKey))
                    // this.byId("docTable2").getBinding("items").filter(oFilter, FilterOperator.EQ, sKey);
                }
            }
            else {
                // sSuffix = "MaterialDocumentHeader"
                var sKey = this.byId("documentKey").getValue();
                if (sKey) {
                    // let oFilter = new Filter("Product", FilterOperator.EQ, sKey);
                    aFilters.push(new Filter("Product", FilterOperator.EQ, sKey))
                    // this.byId("docTable2").getBinding("items").filter(oFilter, FilterOperator.EQ, sKey);
                }
                // else{
                //     this.byId("docTable2").getBinding("items").filter(null, null, null);
                // }
            }

            function formatDateForFilter(dateObj) {
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            
            var dStartDate = this.byId("startDate").getDateValue();
            var dEndDate = this.byId("endDate").getDateValue();
            
            var formattedStartDate = formatDateForFilter(dStartDate);
            var formattedEndDate = formatDateForFilter(dEndDate);

           

            // // Optional: Remove time part to avoid time zone shift
            // dStartDate.setHours(0, 0, 0, 0);
            // dEndDate.setHours(23, 59, 59, 999);


            if (dStartDate && dStartDate != '') {
                // var sFormatedStart = new Date(formattedStartDate).toISOString().split("T")[0];
                // var sFormatedEnd = new Date(formattedEndDate).toISOString().split("T")[0];
                if (this.byId("selectFormName").getSelectedKey() === '1'){
                    aFilters.push(new Filter("to_MaterialDocumentHeader/PostingDate", FilterOperator.BT, formattedStartDate, formattedEndDate))
                }else{
                    aFilters.push(new Filter("CreationDate", FilterOperator.BT, formattedStartDate, formattedEndDate))
                }
                

            }

            if (this.byId("selectFormName").getSelectedKey() === '1') {
                aFilters.push(that.oFilter);
                this.byId("docTable").getBinding("items").filter(aFilters);
            }
            else {
                this.byId("docTable2").getBinding("items").filter(aFilters);
            }

            if (this.byId("selectFormName").getSelectedKey() === '6') {
                this.byId("docTable3").getBinding("items").filter(aFilters);
            }
            else {
                this.byId("docTable2").getBinding("items").filter(aFilters);
            }
            // else{
            //     this.byId("docTable2").getBinding("items").filter(null, null, null);
            // }

            // var updateCall = $.ajax({
            //     url: sServiceUrl+sSuffix,
            //     type: "GET",
            //     headers: {
            //         "Accept": "application/json"
            //     },
            //     success: function (data) {
            //         if (data && data.value && data.value.length!=0) {
            //             var oJSONModel = new sap.ui.model.json.JSONModel();
            //             oJSONModel.setData({ ProductionOrder: data.value });
            //             that.getView().setModel(oJSONModel, "docModel");
            //         } else {
            //             sap.m.MessageToast.show("No material documents found.");
            //         }
            //     },
            //     error: function (xhr, status, error) {
            //         console.error("Error fetching material documents:", status, error);
            //         sap.m.MessageToast.show("Failed to retrieve material documents.");
            //     }
            // });
        },

        onSearch: function () {
            var that = this;

        },

        fetchDatafromAPI: function () {

        }

    });
});