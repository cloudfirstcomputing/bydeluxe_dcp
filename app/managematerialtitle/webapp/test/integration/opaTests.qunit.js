sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/dlx/managematerialtitle/test/integration/FirstJourney',
		'com/dlx/managematerialtitle/test/integration/pages/TitleVList',
		'com/dlx/managematerialtitle/test/integration/pages/TitleVObjectPage'
    ],
    function(JourneyRunner, opaJourney, TitleVList, TitleVObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/dlx/managematerialtitle') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheTitleVList: TitleVList,
					onTheTitleVObjectPage: TitleVObjectPage
                }
            },
            opaJourney.run
        );
    }
);