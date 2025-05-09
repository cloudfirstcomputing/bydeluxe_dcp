sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'proformareportweb',
            componentId: 'S4H_ProformaReportList',
            contextPath: '/S4H_ProformaReport'
        },
        CustomPageDefinitions
    );
});