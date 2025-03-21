sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/dlx/dcpmatmap/test/integration/FirstJourney',
		'com/dlx/dcpmatmap/test/integration/pages/DCPMapProductsList',
		'com/dlx/dcpmatmap/test/integration/pages/DCPMapProductsObjectPage'
    ],
    function(JourneyRunner, opaJourney, DCPMapProductsList, DCPMapProductsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/dlx/dcpmatmap') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheDCPMapProductsList: DCPMapProductsList,
					onTheDCPMapProductsObjectPage: DCPMapProductsObjectPage
                }
            },
            opaJourney.run
        );
    }
);