sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'proformareportweb',
            componentId: 'S4H_ProformaReportObjectPage',
            contextPath: '/S4H_ProformaReport'
        },
        CustomPageDefinitions
    );
});