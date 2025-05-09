sap.ui.define([
    "sap/ui/test/opaQunit"
], function (opaTest) {
    "use strict";

    var Journey = {
        run: function() {
            QUnit.module("First journey");

            opaTest("Start application", function (Given, When, Then) {
                Given.iStartMyApp();

                Then.onTheS4H_ProformaReportList.iSeeThisPage();

            });


            opaTest("Navigate to ObjectPage", function (Given, When, Then) {
                // Note: this test will fail if the ListReport page doesn't show any data
                
                When.onTheS4H_ProformaReportList.onFilterBar().iExecuteSearch();
                
                Then.onTheS4H_ProformaReportList.onTable().iCheckRows();

                When.onTheS4H_ProformaReportList.onTable().iPressRow(0);
                Then.onTheS4H_ProformaReportObjectPage.iSeeThisPage();

            });

            opaTest("Teardown", function (Given, When, Then) { 
                // Cleanup
                Given.iTearDownMyApp();
            });
        }
    }

    return Journey;
});