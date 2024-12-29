sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'dcpkeyweb/test/integration/FirstJourney',
		'dcpkeyweb/test/integration/pages/dcpkeyList',
		'dcpkeyweb/test/integration/pages/dcpkeyObjectPage'
    ],
    function(JourneyRunner, opaJourney, dcpkeyList, dcpkeyObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('dcpkeyweb') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThedcpkeyList: dcpkeyList,
					onThedcpkeyObjectPage: dcpkeyObjectPage
                }
            },
            opaJourney.run
        );
    }
);