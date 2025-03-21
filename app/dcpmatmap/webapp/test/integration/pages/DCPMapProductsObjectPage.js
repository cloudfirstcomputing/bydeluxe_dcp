sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'com.dlx.dcpmatmap',
            componentId: 'DCPMapProductsObjectPage',
            contextPath: '/DCPMapProducts'
        },
        CustomPageDefinitions
    );
});