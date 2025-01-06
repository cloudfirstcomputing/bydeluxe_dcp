sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/dlx/assetvault/test/integration/FirstJourney',
		'com/dlx/assetvault/test/integration/pages/AssetVaultList',
		'com/dlx/assetvault/test/integration/pages/AssetVaultObjectPage'
    ],
    function(JourneyRunner, opaJourney, AssetVaultList, AssetVaultObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/dlx/assetvault') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheAssetVaultList: AssetVaultList,
					onTheAssetVaultObjectPage: AssetVaultObjectPage
                }
            },
            opaJourney.run
        );
    }
);