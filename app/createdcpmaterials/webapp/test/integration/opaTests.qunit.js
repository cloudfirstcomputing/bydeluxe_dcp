sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/dlx/createdcpmaterials/test/integration/FirstJourney',
		'com/dlx/createdcpmaterials/test/integration/pages/DCPMaterialConfigList',
		'com/dlx/createdcpmaterials/test/integration/pages/DCPMaterialConfigObjectPage'
    ],
    function(JourneyRunner, opaJourney, DCPMaterialConfigList, DCPMaterialConfigObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/dlx/createdcpmaterials') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheDCPMaterialConfigList: DCPMaterialConfigList,
					onTheDCPMaterialConfigObjectPage: DCPMaterialConfigObjectPage
                }
            },
            opaJourney.run
        );
    }
);