sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/m/PDFViewer",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator"
], function (Controller, MessageToast, Fragment,PDFViewer, Filter, FilterOperator, BusyIndicator) {
    "use strict";

    return Controller.extend("com.dlx.printdocu.printdocuments.controller.PrintView", {
        onInit() {
            var oViewModel = new sap.ui.model.json.JSONModel({
                visibleTable1: true,
                visibleTable2: false
            });
            this.getView().setModel(oViewModel, "viewModel");
            
        },
        onSelectChange: function (oEvent) {
            var sSelectedKey = oEvent.getSource().getSelectedKey();
            var oViewModel = this.getView().getModel("viewModel");
        
            if (sSelectedKey === "1") {
                oViewModel.setProperty("/visibleTable1", true);
                oViewModel.setProperty("/visibleTable2", false);
            } else {
                oViewModel.setProperty("/visibleTable1", false);
                oViewModel.setProperty("/visibleTable2", true);
            }
        },
        onPreviewForm: function (oEvent) {
            var oModel = this.getView().getModel(); // Assuming the default model
            var sServiceUrl = oModel.sServiceUrl;
            var sPdfUrl = sServiceUrl + "downloadFormADS()";
            var oPrintModel = this.getView().getModel("printModel");
            // if(this.byId("selectFormName").getSelectedKey() === '5'){
            //     var aSelecteditems = this.byId("docTable2").getSelectedItems();
            //     for(var i in aSelecteditems){
            //         var oSelectedItem = aSelecteditems[i];
            //         var sProdId = oSelectedItem.getBindingContext().getObject().Product;
            //         if(sProdId){
            //             sPdfUrl = `${oPrintModel.getServiceUrl()}getKrakenHDDLabel(DCPBarcode='${sProdId}')`;
            //         }
            //         var that = this;
            //         BusyIndicator.show();
            //         var updateCall = $.ajax({
            //             url: sPdfUrl,
            //             type: "GET",
            //             headers: {
            //                 "Accept": "application/pdf"
            //             },
            //             success: function (data) {
            //                 that.onOpenPDF(data);
            //                 BusyIndicator.hide();
            //             },
            //             error: function (xhr, status, error) {
            //                 console.error("Error fetching PDF:", status, error);
            //                 BusyIndicator.hide();
            //                 sap.m.MessageToast.show("Failed to load the form.");
            //             }
            //         });
            //     }
            // }
            if (this.byId("selectFormName").getSelectedKey() === '1'){
                var oSelecteditem;
                    [oSelecteditem] = this.byId("docTable").getSelectedItems();
                    var sForm = "YY1_MMIM_GR_LABEL_EN" ;
                  
                    var sMaterial = oSelecteditem.getBindingContext().getObject().MaterialDocument;
                    var oData = {
                        form:sForm,
                        Material:sMaterial
                    }
                      var sSource = sServiceUrl + `formGR_LABEL`
                    var that = this;
                    var updateCall = $.ajax({
                        url: sSource,
                        type: "POST",
                        data : JSON.stringify(oData),
                        headers: {
                            "Accept": "application/pdf",
                            "Content-Type" :"application/json"
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
            else
            {
                // var opdfViewer = new PDFViewer();
                    // this.getView().addDependent(opdfViewer);
                    var oSelecteditem;
                    // opdfViewer.setSource(sSource);
                    // opdfViewer.setTitle( "My PDF");
                    // opdfViewer.open();
                    // this.openPdfViewer(sSource);
                    [oSelecteditem] = this.byId("docTable2").getSelectedItems();

                    var sForm = this.byId("selectFormName").getSelectedKey() =='5'? 'HDDLabel':this.byId("selectFormName").getSelectedKey() =='3' ? "DCDCLabel" : this.byId("selectFormName").getSelectedKey() =='4' ? "DeluxeLabel": "MasterLabel" ;
                  
                    var sProdId = oSelecteditem.getBindingContext().getObject().Product;
                    var oData = {
                        form:sForm,
                        Product:sProdId
                    }
                      var sSource = sServiceUrl + `downloadFormADS`
                    var that = this;
                    BusyIndicator.show();
                    var updateCall = $.ajax({
                        url: sSource,
                        type: "POST",
                        data : JSON.stringify(oData),
                        headers: {
                            "Accept": "application/pdf",
                            "Content-Type" :"application/json"
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
            var sServiceUrl = oModel.sServiceUrl, sSuffix = "",aFilters =[];
           
            if(this.byId("selectFormName").getSelectedKey() === '5'){
                var sKey = this.byId("documentKey").getValue();
                if(sKey){
                    aFilters.push(new Filter("Product", FilterOperator.EQ, sKey))
                    // this.byId("docTable2").getBinding("items").filter(oFilter, FilterOperator.EQ, sKey);
                }
                // else{
                //     this.byId("docTable2").getBinding("items").filter(null, null, null);
                // }
            }
            else{
                // sSuffix = "MaterialDocumentHeader"
                var sKey = this.byId("documentKey").getValue();
                if(sKey){
                    // let oFilter = new Filter("Product", FilterOperator.EQ, sKey);
                    aFilters.push(new Filter("Product", FilterOperator.EQ, sKey))
                    // this.byId("docTable2").getBinding("items").filter(oFilter, FilterOperator.EQ, sKey);
                }
                // else{
                //     this.byId("docTable2").getBinding("items").filter(null, null, null);
                // }
            }

            var dStartDate = this.byId("startDate").getValue();
            var dEndDate = this.byId("endDate").getValue();
    

            if(dStartDate && dStartDate!= '' ){
                var sFormatedStart = new Date(dStartDate).toISOString().split("T")[0];
                var sFormatedEnd = new Date(dEndDate).toISOString().split("T")[0];
                aFilters.push(new Filter("CreationDate", FilterOperator.BT, sFormatedStart,sFormatedEnd))
                
            }

            this.byId("docTable2").getBinding("items").filter(aFilters);
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
        
            // Dummy data for testing
            // var aDummyData = [
            //     { docNumber: "1000001", docTy: "GR", docDate: "2025-03-05" },
            //     { docNumber: "1000002", docType: "GI", docDate: "2025-03-06" },
            //     { docNumber: "1000003", docType: "STO", docDate: "2025-03-07" },
            //     { docNumber: "1000004", docType: "TR", docDate: "2025-03-08" },
            //     { docNumber: "1000005", docType: "INV", docDate: "2025-03-09" },
            //     { docNumber: "1000006", docType: "GR", docDate: "2025-03-10" },
            //     { docNumber: "1000007", docType: "GI", docDate: "2025-03-11" },
            //     { docNumber: "1000008", docType: "STO", docDate: "2025-03-12" },
            //     { docNumber: "1000009", docType: "TR", docDate: "2025-03-13" },
            //     { docNumber: "1000010", docType: "INV", docDate: "2025-03-14" }
            // ];
        
            // // Create and set JSON model
            // var oJSONModel = new sap.ui.model.json.JSONModel();
            // oJSONModel.setData({ documents: aDummyData });
            // that.getView().setModel(oJSONModel, "docModel");
        
            // sap.m.MessageToast.show("Dummy data loaded successfully.");
        },

        fetchDatafromAPI:function(){

        }

    });
});