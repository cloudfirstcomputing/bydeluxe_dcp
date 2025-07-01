sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'deluxe/masteringsales/test/integration/FirstJourney',
		'deluxe/masteringsales/test/integration/pages/MasteringHubMainList',
		'deluxe/masteringsales/test/integration/pages/MasteringHubMainObjectPage'
    ],
    function(JourneyRunner, opaJourney, MasteringHubMainList, MasteringHubMainObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('deluxe/masteringsales') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheMasteringHubMainList: MasteringHubMainList,
					onTheMasteringHubMainObjectPage: MasteringHubMainObjectPage
                }
            },
            opaJourney.run
        );
    }
);