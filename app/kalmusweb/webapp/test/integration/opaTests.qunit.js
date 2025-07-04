sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'kalmusweb/test/integration/FirstJourney',
		'kalmusweb/test/integration/pages/KalmusTheaterStudioList',
		'kalmusweb/test/integration/pages/KalmusTheaterStudioObjectPage'
    ],
    function(JourneyRunner, opaJourney, KalmusTheaterStudioList, KalmusTheaterStudioObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('kalmusweb') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheKalmusTheaterStudioList: KalmusTheaterStudioList,
					onTheKalmusTheaterStudioObjectPage: KalmusTheaterStudioObjectPage
                }
            },
            opaJourney.run
        );
    }
);