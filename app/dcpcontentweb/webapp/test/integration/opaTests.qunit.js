sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'dcpcontentweb/test/integration/FirstJourney',
		'dcpcontentweb/test/integration/pages/dcpcontentList',
		'dcpcontentweb/test/integration/pages/dcpcontentObjectPage'
    ],
    function(JourneyRunner, opaJourney, dcpcontentList, dcpcontentObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('dcpcontentweb') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThedcpcontentList: dcpcontentList,
					onThedcpcontentObjectPage: dcpcontentObjectPage
                }
            },
            opaJourney.run
        );
    }
);