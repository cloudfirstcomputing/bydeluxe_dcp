sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'booksalesorderweb/test/integration/FirstJourney',
		'booksalesorderweb/test/integration/pages/BookingSalesOrderList',
		'booksalesorderweb/test/integration/pages/BookingSalesOrderObjectPage',
		'booksalesorderweb/test/integration/pages/BookingSalesorderItemObjectPage'
    ],
    function(JourneyRunner, opaJourney, BookingSalesOrderList, BookingSalesOrderObjectPage, BookingSalesorderItemObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('booksalesorderweb') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBookingSalesOrderList: BookingSalesOrderList,
					onTheBookingSalesOrderObjectPage: BookingSalesOrderObjectPage,
					onTheBookingSalesorderItemObjectPage: BookingSalesorderItemObjectPage
                }
            },
            opaJourney.run
        );
    }
);