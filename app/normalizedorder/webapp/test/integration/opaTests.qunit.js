sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'normalizedorder/test/integration/FirstJourney',
		'normalizedorder/test/integration/pages/StudioFeedList',
		'normalizedorder/test/integration/pages/StudioFeedObjectPage'
    ],
    function(JourneyRunner, opaJourney, StudioFeedList, StudioFeedObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('normalizedorder') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheStudioFeedList: StudioFeedList,
					onTheStudioFeedObjectPage: StudioFeedObjectPage
                }
            },
            opaJourney.run
        );
    }
);