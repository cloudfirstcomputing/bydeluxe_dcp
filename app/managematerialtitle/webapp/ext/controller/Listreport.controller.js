sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('com.dlx.managematerialtitle.ext.controller.Listreport', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf com.dlx.managematerialtitle.ext.controller.Listreport
             */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			handleValueHelp : function (oEvent) {
				var oView = this.getView();
				this._sInputId = oEvent.getSource().getId();
		
				// create value help dialog
				if (!this._pValueHelpDialog) {
					this._pValueHelpDialog = Fragment.load({
						id: oView.getId(),
						name: "com.dlx.managematerialtitle.ext.manageTitleExt.ValueHelpDialog",  
						controller: this
					}).then(function(oValueHelpDialog){
						oView.addDependent(oValueHelpDialog);
						return oValueHelpDialog;
					});
				}
		
				// open value help dialog
				this._pValueHelpDialog.then(function(oValueHelpDialog){
					oValueHelpDialog.open();
				});
			},
		
			_handleValueHelpSearch : function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter(
					"BusinessPartnerFullName",
					FilterOperator.Contains, sValue
				);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
		
			_handleValueHelpClose : function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					var productInput = this.byId(this._sInputId);
					productInput.setValue(oSelectedItem.getTitle());
				}
				oEvent.getSource().getBinding("items").filter([]);
			}
		}
	});
});
