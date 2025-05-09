sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'proformareportweb/test/integration/FirstJourney',
		'proformareportweb/test/integration/pages/S4H_ProformaReportList',
		'proformareportweb/test/integration/pages/S4H_ProformaReportObjectPage'
    ],
    function(JourneyRunner, opaJourney, S4H_ProformaReportList, S4H_ProformaReportObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('proformareportweb') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheS4H_ProformaReportList: S4H_ProformaReportList,
					onTheS4H_ProformaReportObjectPage: S4H_ProformaReportObjectPage
                }
            },
            opaJourney.run
        );
    }
);