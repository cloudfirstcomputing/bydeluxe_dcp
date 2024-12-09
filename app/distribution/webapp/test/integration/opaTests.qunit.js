sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/dlx/distribution/test/integration/FirstJourney',
		'com/dlx/distribution/test/integration/pages/DistroSpecList',
		'com/dlx/distribution/test/integration/pages/DistroSpecObjectPage',
		'com/dlx/distribution/test/integration/pages/DistroSpec__PackageObjectPage'
    ],
    function(JourneyRunner, opaJourney, DistroSpecList, DistroSpecObjectPage, DistroSpec__PackageObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/dlx/distribution') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheDistroSpecList: DistroSpecList,
					onTheDistroSpecObjectPage: DistroSpecObjectPage,
					onTheDistroSpec__PackageObjectPage: DistroSpec__PackageObjectPage
                }
            },
            opaJourney.run
        );
    }
);