sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/dlx/dcnstatus/test/integration/FirstJourney',
		'com/dlx/dcnstatus/test/integration/pages/StatusConversionList',
		'com/dlx/dcnstatus/test/integration/pages/StatusConversionObjectPage'
    ],
    function(JourneyRunner, opaJourney, StatusConversionList, StatusConversionObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/dlx/dcnstatus') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheStatusConversionList: StatusConversionList,
					onTheStatusConversionObjectPage: StatusConversionObjectPage
                }
            },
            opaJourney.run
        );
    }
);