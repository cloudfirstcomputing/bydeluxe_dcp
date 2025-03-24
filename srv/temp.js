
this.on("createContent", async (req, res) => {
    var aResult = await createBookingFeed(req, "C");
    return aResult;
});
this.on("createKey", async (req, res) => {
    var aResult = await createBookingFeed(req, "K");
    return aResult;
});

this.on("processContent", async (req, res) => {
    await createSalesOrder(req, "C");
});
this.on("postKeyToSAP", async (req, res) => {
    await createSalesOrder(req, "K");
});
this.on('MassUploadBookingFeed', async (req) => {
    let excelData = {}
    let uploadedData = []
    let errorData = []
    let aBookingFeeds = [];

    let workbook = XLSX.read(req.data.fileData, {
        type: 'binary'
    })

    workbook.SheetNames.forEach(sheetName => {
        excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
    })
    if (req.data.fieldNames.length === 0) req.reject(400, 'reqfieldNames')
    if (excelData.length === 0) req.reject(400, 'emptySheet')
    try {
        for (let index = 0; index < excelData.length; index++) {
            let object = excelData[index]
            let row = object.__rowNum__ + 1
            let element = {}
            let error = {}
            error.RowNumber = row.toString()
            // error.ID = id
            for (const property in object) {
                const fieldName = req.data.fieldNames.find(item => {
                    return item.excelColumn === property
                })
                if (!fieldName) req.reject(400, 'invalidSheet')
                if (fieldName.technicalName) {
                    element[fieldName.technicalName] = object[property]
                }
            }
            if (!element.hasOwnProperty('ApplicationID')) {
                error.Message = bundle.getText(`reqField`, ['Application ID'])
                // _fillData(errorData, error)
            }
            else if (!element.hasOwnProperty('BookingID')) {
                error.Message = bundle.getText(`reqField`, ['Booking ID'])
                // _fillData(errorData, error)
            }
            else if (!element.hasOwnProperty('Key_Content')) {
                error.Message = bundle.getText(`reqField`, ['Key_Content'])
                // _fillData(errorData, error)
            } else {
                aBookingFeeds.push(element)
            }
            if (!error.Message) {
                // _fillData(uploadedData, element)
            }
        }
        if (aBookingFeeds) {
            var aResults = await createBookingFeed(req, "C", aBookingFeeds);
            req.reply({
                code: 201,
                message: JSON.stringify(aResults)
            });
        }
    } catch (error) {
        return req.reject(400, error)
    }
});
const createBookingFeed = async (req, sContentIndicator, aData) => {
    if (aData) {
        var data = aData;
    }
    else {
        data = req?.data?.Records;
    }

    let recordsToBeInserted = [], recordsToBeUpdated = [], finalResult = [], successEntries = [], updateSuccessEntries = [], failedEntries = [], hanatable = dcpcontent;
    hanatable = sContentIndicator === "C" ? dcpcontent : dcpkey;

    for (var i in data) {
        data[i].Status_ID = "A";
        data[i].IsActive = "Y";
        data[i].Version = 1;

        var entry_Active = await SELECT.one.from(hanatable).where({ BookingID: data[i].BookingID }).orderBy({ ref: ['createdAt'], sort: 'desc' });
        if (entry_Active) {
            data[i].Version = entry_Active.Version ? entry_Active.Version + 1 : 1;
            recordsToBeUpdated.push(entry_Active);
        }
        recordsToBeInserted.push(data[i]);
    }
    if (recordsToBeInserted.length) {
        let insertResult = await INSERT.into(hanatable).entries(recordsToBeInserted);
        successEntries.push(recordsToBeInserted);
        successEntries.push(insertResult);
    }
    for (var i in recordsToBeUpdated) {
        let updateResult = await UPDATE(hanatable).set({ IsActive: "N" }).where({
            BookingID: recordsToBeUpdated[i].BookingID,
            createdAt: recordsToBeUpdated[i].createdAt
        });
        updateSuccessEntries.push(recordsToBeUpdated[i]);
        updateSuccessEntries.push(updateResult);
    }
    finalResult.push({ "Success": successEntries });
    finalResult.push({ "UpdateSuccess": updateSuccessEntries });
    finalResult.push({ "Error": failedEntries });
    return finalResult;
};

        // const remediateSalesOrder = async (req, sContentIndicator) => {
        //     var sBookingID = req.data?.bookingID, sSalesOrder = req.data?.salesOrder, sPlant = req.data?.plant, oContentData,
        //         sShippingCondition = req.data?.shippingCondition, sDeliveryDate = req.data?.deliveryDate, aResponseStatus = [], hanaDBTable;
        //     hanaDBTable = sContentIndicator === "C"? dcpcontent: dcpkey;
        //     if (sBookingID) {
        //         oContentData = await SELECT.one.from(hanaDBTable).where({ BookingID: sBookingID });
        //     }
        //     else if (sSalesOrder) {
        //         oContentData = SELECT.one.from(hanaDBTable).where({ SalesOrder: sSalesOrder });
        //     }
        //     else {
        //         req.reject(501, "Booking ID / Sales order not available for processing");
        //     }
        //     if (!oContentData) {
        //         req.reject(501, "Selected entry not available");
        //     }
        //     else if (!oContentData.SalesOrder) {
        //         req.reject(501, "Please Select an entry where Sales Order is available for remediation");
        //     }
        //     else if (oContentData.ReferenceSDDocument) {
        //         req.reject(501, "Remediation is already done for the selection");
        //     }
        //     var oHeaderProperties = ["SoldToParty",
        //         "SalesOrganization",
        //         "DistributionChannel",
        //         "OrganizationDivision",
        //         "PurchaseOrderByCustomer",
        //         "SalesOrderType"],
        //         oPartnerProperties = ["PartnerFunction", "Customer"],
        //         oItemProperties = ["RequestedQuantity", "RequestedQuantityISOUnit", "DeliveryPriority"];
        //     var oSalesOrderPayload = {
        //         "to_Item": [],
        //         "to_Partner": []
        //     };
        //     var aSalesOrderData = await s4h_so_Txn.run(SELECT.from(S4H_SOHeader, (header) => {
        //         header`.*`,
        //             header._Item((item) => { }),
        //             header._Partner((partner) => { })
        //     }).where({ SalesOrder: sSalesOrder }));
        //     if (aSalesOrderData.length) {
        //         var oSalesOrder = aSalesOrderData[0];
        //         for (var i in oHeaderProperties) {
        //             oSalesOrderPayload[oHeaderProperties[i]] = oSalesOrder[oHeaderProperties[i]]
        //         }
        //         oSalesOrderPayload["ShippingCondition"] = sShippingCondition;
        //         oSalesOrderPayload["ReferenceSDDocument"] = sSalesOrder;
        //         oSalesOrderPayload["RequestedDeliveryDate"] = `/Date(${new Date(sDeliveryDate).getTime()})/`;
        //         // oSalesOrderPayload["PricingReferenceMaterial"] = sSalesOrder;
        //         var aSOItems = oSalesOrder._Item;
        //         for (var i in aSOItems) {
        //             var oPayloadItem = {};
        //             for (var j in oItemProperties) {
        //                 oPayloadItem[oItemProperties[j]] = aSOItems[i][oItemProperties[j]];
        //             }
        //             // oPayloadItem["ProductionPlant"] = sPlant;
        //             oPayloadItem["ProductionPlant"] = sPlant;
        //             oPayloadItem["Material"] = aSOItems[i]["Product"];
        //             oPayloadItem["RequestedQuantity"] = `${aSOItems[i]["RequestedQuantity"]}`;
        //             oSalesOrderPayload.to_Item.push(oPayloadItem);
        //         }
        //         var aSOPartners = oSalesOrder._Partner;
        //         for (var i in aSOPartners) {
        //             var oPayloadPartner = {};
        //             for (var j in oPartnerProperties) {
        //                 oPayloadPartner[oPartnerProperties[j]] = aSOPartners[i][oPartnerProperties[j]];
        //             }
        //             oSalesOrderPayload.to_Partner.push(oPayloadPartner);
        //         }

        //         await s4h_sohv2_Txn.send({
        //             method: 'POST',
        //             path: '/A_SalesOrder',
        //             data: oSalesOrderPayload
        //         }).catch((err) => {

        //             aResponseStatus.push({
        //                 "message": `| With Reference Sales Order: ${sSalesOrder}: ${err.message} |`,
        //                 "status": "E"
        //             });
        //         }).then(async (result) => {
        //             if (result) {
        //                 await UPDATE(hanaDBTable).set({ ReferenceSDDocument: result?.SalesOrder }).where({ BookingID: oContentData.BookingID })
        //                 aResponseStatus.push({
        //                     "message": `| With reference to Sales Order: ${sSalesOrder}, Sales Order: ${result?.SalesOrder} is created |`,
        //                     "status": "S"
        //                 });
        //             }
        //         });
        //     }
        //     else {
        //         aResponseStatus.push({
        //             "message": `| Sales Order: ${sSalesOrder} not available |`,
        //             "status": "E"
        //         });
        //     }
        //     req.reply({
        //         code: 201,
        //         message: JSON.stringify(aResponseStatus)
        //     });
        // };