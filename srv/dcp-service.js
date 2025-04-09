const cds = require("@sap/cds");
const XLSX = require("xlsx")
const { TextBundle } = require('@sap/textbundle');
// const { postMaterialDoc } = require('../../barcodescanner/srv/utils/handler');
const bundle = new TextBundle('_i18n/i18n', 'en_EN')
const { or, and } = require('@sap-cloud-sdk/odata-v2');

const { v4: uuidv4 } = require('uuid'); // Import UUID package
const xmljs = require("xml-js");
module.exports = class BookingOrderService extends cds.ApplicationService {
    async init() {
        const { dcpcontent, dcpkey, S4H_SOHeader, S4H_BuisnessPartner, DistroSpec_Local, AssetVault_Local, S4H_CustomerSalesArea, BookingSalesOrder, BookingStatus, DCPMaterialMapping,
            S4_Plants, S4_ShippingConditions, S4H_SOHeader_V2, S4H_SalesOrderItem_V2, ShippingConditionTypeMapping, Maccs_Dchub, S4_Parameters, CplList_Local, S4H_BusinessPartnerAddress,
            TheatreOrderRequest, S4_ShippingType_VH, S4_ShippingPoint_VH, OrderRequest, OFEOrders, Products, ProductDescription, ProductBasicText, MaterialDocumentHeader, MaterialDocumentItem, ProductionOrder,
            StudioFeed, S4_SalesParameter, BookingSalesorderItem, S4H_BusinessPartnerapi, S4_ProductGroupText } = this.entities;
        var s4h_so_Txn = await cds.connect.to("API_SALES_ORDER_SRV");
        var s4h_bp_Txn = await cds.connect.to("API_BUSINESS_PARTNER");
        var s4h_planttx = await cds.connect.to("API_PLANT_SRV");
        var s4h_shipConditions_Txn = await cds.connect.to("ZAPI_SHIPPINGCONDITION");
        var s4h_sohv2_Txn = await cds.connect.to("API_SALES_ORDER_V2_SRV");
        var s4h_shtypev2_vh_Txn = await cds.connect.to("YY1_I_SHIPPINGTYPE_CDS_0001");
        var s4h_shpointv2_vh_Txn = await cds.connect.to("YY1_I_SHIPPINGPOINT_CDS_0001");
        var s4h_param_Txn = await cds.connect.to("YY1_PARAMETER_CDS_0001");
        var s4h_products_Crt = await cds.connect.to("API_PRODUCT_SRV");
        var s4h_material_read = await cds.connect.to("API_MATERIAL_DOCUMENT_SRV");
        var s4h_production_order = await cds.connect.to("API_PRODUCTION_ORDER_2_SRV");
        var distrospec_Txn = await cds.connect.to("Distrospec_SRV");
        var s4h_salesparam_Txn = await cds.connect.to("YY1_SALESPARAMETERS_CDS_0001");
        var s4h_bp_vh = await cds.connect.to("API_BUSINESS_PARTNER");

        var s4h_prodGroup = await cds.connect.to("API_PRODUCTGROUP_SRV");
        var deluxe_adsrestapi = await cds.connect.to("deluxe-ads-rest-api");
        var srv_BillingDocument = await cds.connect.to("sap_s4_CE_BILLINGDOCUMENT_0001_v1");
        

        var sSoldToCustomer = '1000055', SalesOrganization = '1170', DistributionChannel = '20', Division = '20', BillTo = "", sErrorMessage = "";
        let aConfig = (await s4h_param_Txn.run(SELECT.from(S4_Parameters)));
        var oSalesParameterConfig, oResponseStatus = { "error": [], "success": [], "warning": [] };
        // var sSoldToCustomer = aConfig?.find((e) => e.VariableName === 'SoldTo_SPIRITWORLD')?.VariableValue,
        //     SalesOrganization = aConfig?.find((e) => e.VariableName === 'SalesOrg_SPIRITWORLD')?.VariableValue,
        //     DistributionChannel = aConfig?.find((e) => e.VariableName === 'DistChannel_SPIRITWORLD')?.VariableValue,
        //     Division = aConfig?.find((e) => { return e.VariableName === 'Division_SPIRITWORLD' })?.VariableValue;
        this.before("SAVE", StudioFeed.drafts, async (req) => {
            var oFeed = req.data;
            oFeed.Version = 1;
            oFeed.Origin_OriginID = "M";
            oFeed.Status_ID = "A";
        });
        // this.on("SAVE", StudioFeed.drafts ,async(req, next)=>{
        //     var oFeed = req.data;
        //     oFeed.Version = 1;
        //     oFeed.Origin_OriginID = "M";
        //     oFeed.Status_ID = "A";
        //     await createStudioFeeds(req, [oFeed]);
        // });
        this.on("CREATE", StudioFeed, async (req, next) => {
            var oFeed = req.data;
            var aResponse = await createStudioFeeds(req, [oFeed]);

            req.reply({
                code: 201,
                message: aResponse
            });
        });
        this.on('MassUploadStudioFeed', async (req, res) => {
            try {
                let excelData = {}
                let uploadedData = []
                let errorData = []
                let aBookingFeeds = [];

                let workbook = XLSX.read(req.data.fileData, {
                    type: 'binary'
                })
                sErrorMessage = ""; //Resetting error message
                workbook.SheetNames.forEach(sheetName => {
                    excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
                })
                if (req.data.fieldNames.length === 0) req.reject(400, 'reqfieldNames')
                if (excelData.length === 0) req.reject(400, 'emptySheet')
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
                    element.Origin_OriginID = "S";

                    var sValidationError = "";
                    if (!element.SourceSystem) {
                        sValidationError = "Source System is mandatory\n";
                    }
                    if (!element.BookingID) {
                        sValidationError = sValidationError + "BookingID is mandatory.\n";
                    }
                    if (!element.Studio) {
                        sValidationError = sValidationError + "Studio is mandatory.\n";
                    }
                    if (!element.Title) {
                        sValidationError = sValidationError + "Title is mandatory.\n";
                    }
                    if (!element.RequestedDelivDate) {
                        sValidationError = sValidationError + "RequestedDelivDate is mandatory.\n";
                    }
                    if (!element.OrderType) {
                        sValidationError = sValidationError + "OrderType is mandatory.\n";
                    }
                    if (!element.PlayStartDate) {
                        sValidationError = sValidationError + "Play Start Date is mandatory.\n";
                    }
                    if (!element.PlayEndDate) {
                        sValidationError = sValidationError + "Play End Date is mandatory.\n";
                    }
                    if (!element.TheaterID) {
                        sValidationError = sValidationError + "Theater ID is mandatory.\n";
                    }
                    if (sValidationError) {
                        return req.reject(400, sValidationError);
                    }
                    else {
                        aBookingFeeds.push(element)
                    }
                    if (!error.Message) {
                        // _fillData(uploadedData, element)
                    }
                }
                if (aBookingFeeds) {
                    var aResults = await createStudioFeeds(req, aBookingFeeds);
                    req.reply({
                        code: 201,
                        message: aResults
                    });
                }
            } catch (error) {
                return req.reject(400, error)
            }
        });
        this.on('reconcileStudioFeed', async (req, res) => {
            var aBookingID = req.data?.aBookingID;
            var aFeeds = await SELECT.from(StudioFeed).where({ BookingID: { "IN": aBookingID }, IsActive: 'Y' });
            aFeeds = aFeeds?.map((feed) => {
                feed.BookingType = 'C';
                return feed
            });
            var aResponse = await createStudioFeeds(req, aFeeds, true);
            req.reply({
                code: 201,
                message: aResponse
            });
        });
        this.on('createStudioFeeds', async (req, res) => {
            try {
                var data = req.data?.StudioFeed;
                var aResponse = await createStudioFeeds(req, data)

                req.reply({
                    code: 201,
                    message: aResponse
                });

            }
            catch (e) {
                req.reject(400, e);
            }
        });
        this.on('remediateSalesOrder', async (req, res) => { //RULE 11
            var oInput = req.data;
            var sBookingID = oInput?.bookingID, sSalesOrder = oInput?.salesOrder,
                oContentData, sMaterialGroup, aResponseStatus = [], hanaDBTable = StudioFeed;

            if (sBookingID) {
                oContentData = await SELECT.one.from(hanaDBTable).where({ BookingID: sBookingID, SalesOrder: sSalesOrder, IsActive: "Y" });
            }
            else if (sSalesOrder) {
                oContentData = SELECT.one.from(hanaDBTable).where({ SalesOrder: sSalesOrder, IsActive: "Y" });
            }
            else {
                req.reject(501, "Booking ID / Sales order not available for processing");
                return;
            }
            if (!oContentData) {
                req.reject(501, "Selected entry not available");
                return;
            }
            else if (!oContentData.SalesOrder) {
                req.reject(501, "Please Select an entry where Sales Order is available for remediation");
                return;
            }
            else if (!oContentData.DeliveryMethod) {
                req.reject(501, "Initial Delivery method was not captured for this entry, hence cannot be remediated");
                return;
            }
            else if (!oContentData.RemediationCounter) {
                req.reject(501, "Remediation counterfor this entry, hence cannot be remediated");
                return;
            }
            var aRemediatedDeliveryMethods = oContentData.DeliveryMethod?.split(","), iRemediationCounter = oContentData.RemediationCounter;

            var oSalesorderItem_PayLoad = {};
            var aSalesOrderItem = await s4h_sohv2_Txn.run(SELECT.from(S4H_SalesOrderItem_V2).columns(["*"]).where({ SalesOrder: sSalesOrder }));
            if (!aSalesOrderItem?.length) {
                aResponseStatus.push({
                    "message": `| No items available for remediation in Sales Order: ${sSalesOrder} |`,
                    "status": "E"
                });
            }
            var aNonKeyItems = aSalesOrderItem?.filter((s4Item) => {
                return (s4Item.MaterialGroup !== 'Z003' && s4Item.ItemBillingBlockReason !== '03' && s4Item.DeliveryPriority !== '04');
            });
            if (!aNonKeyItems?.length) { //RULE 11.1 => Remediation not possible for Key (Prod Group Z003)
                req.reject(501, `Remediation cannot be done for Sales Order: ${sSalesOrder} as all items are key entries`);
                return;
            }
            else {
                var aDeliverySeqFromDistHeader = [];
                var distroSpecData = await getDistroSpecData(req, oContentData, aDeliverySeqFromDistHeader);
                aDeliverySeqFromDistHeader = aDeliverySeqFromDistHeader?.filter((sDelSeq) => {
                    return sDelSeq !== ''
                }); //Removing blank entries
                var aContentPackages = distroSpecData?.to_Package, oContentPackages;
                aContentPackages = await performPrioritySortAndValidityCheck(aContentPackages, oContentData, distroSpecData);
                // var aContentPackageDistRestrictions;
                if (!aContentPackages?.length) {
                    req.reject(400,
                        `DistroSpec ${distroSpecData?.DistroSpecID} not in validity range for Content Order ${sBookingID}`);
                    return;
                }
                if (aDeliverySeqFromDistHeader?.length <= iRemediationCounter) {
                    req.reject(400,
                        `Remediation is not possible any more as all ${iRemediationCounter} Delivery methods are utilized for remediation`);
                    return;
                }
                for (var i in aRemediatedDeliveryMethods) { //Removing the Delivery methods which are already remediated
                    aDeliverySeqFromDistHeader = aDeliverySeqFromDistHeader.filter((seq) => {
                        return seq !== aRemediatedDeliveryMethods[i];
                    }
                    );
                }
                for (var i in aNonKeyItems) {
                    var oSalesOrderItem = aNonKeyItems[i];
                    oSalesorderItem_PayLoad["Material"] = oSalesOrderItem.Material;
                    // var oBTPItem = await SELECT.one.from(BookingSalesorderItem).where({SalesOrder: oSalesOrderItem.SalesOrder, Product: oSalesOrderItem.Material}); 
                    //     // SalesOrderItem: oSalesOrderItem.SalesOrderItem});

                    var aContentPackageDistRestrictions, oFilteredContentPackage, sDeliveryMethod;
                    for (var j in aDeliverySeqFromDistHeader) {
                        var sDelSeq = aDeliverySeqFromDistHeader[j];
                        if (sDelSeq === '03' || sDelSeq === '10') { //RULE 11.2
                            req.reject(400,
                                `Remediation is completed for the selected entry as the delivery sequence has reached till shipping condition: ${sDelSeq}`);
                            return;
                        }
                        else if (sDelSeq) {
                            oContentPackages = aContentPackages.find((pkg) => {
                                return (
                                    pkg.DeliveryMethod1_ShippingCondition === sDelSeq || pkg.DeliveryMethod2_ShippingCondition === sDelSeq ||
                                    pkg.DeliveryMethod3_ShippingCondition === sDelSeq || pkg.DeliveryMethod4_ShippingCondition === sDelSeq ||
                                    pkg.DeliveryMethod5_ShippingCondition === sDelSeq || pkg.DeliveryMethod6_ShippingCondition === sDelSeq ||
                                    pkg.DeliveryMethod7_ShippingCondition === sDelSeq || pkg.DeliveryMethod8_ShippingCondition === sDelSeq ||
                                    pkg.DeliveryMethod9_ShippingCondition === sDelSeq || pkg.DeliveryMethod10_ShippingCondition === sDelSeq)
                            });
                            if (oContentPackages) {
                                oFilteredContentPackage = oContentPackages;
                                aContentPackageDistRestrictions = oFilteredContentPackage?.to_DistRestriction;
                                sDeliveryMethod = sDelSeq;
                                break;
                            }
                        }
                    }
                    if (!oFilteredContentPackage) {
                        req.reject(400, `No suitable package found for remediation`);
                        return;
                    }
                    oSalesorderItem_PayLoad["RequestedQuantity"] = `${oSalesOrderItem.RequestedQuantity}`;
                    oSalesorderItem_PayLoad["RequestedQuantityISOUnit"] = oSalesOrderItem.RequestedQuantityISOUnit;
                    oSalesorderItem_PayLoad["ProductionPlant"] = oSalesOrderItem.ProductionPlant;
                    oSalesorderItem_PayLoad["ItemBillingBlockReason"] = "03";
                    oSalesorderItem_PayLoad["PricingReferenceMaterial"] = oSalesOrderItem.PricingReferenceMaterial;
                    oSalesorderItem_PayLoad["DeliveryPriority"] = "04";

                    // oSalesorderItem_PayLoad["RequestedDeliveryDate"] = `/Date(${new Date().getTime()})/`;

                    oSalesorderItem_PayLoad['to_ScheduleLine'] = [{
                        "SalesOrder": sSalesOrder,
                        "SalesOrderItem": oSalesOrderItem?.SalesOrderItem,
                        "RequestedDeliveryDate": `/Date(${new Date().getTime()})/`
                    }];
                    var oShippingTypeMapping = await SELECT.one.from(ShippingConditionTypeMapping).where({ ShippingCondition: sDeliveryMethod });
                    var sShippingType = oShippingTypeMapping.ShippingType;
                    if (!sShippingType) {
                        req.reject(400, `No Shipping Type found for Shipping Condition ${sDeliveryMethod}`);
                        return;
                    }
                    oSalesorderItem_PayLoad["ShippingType"] = sShippingType;
                    await s4h_sohv2_Txn.send({
                        method: 'POST',
                        path: `/A_SalesOrder('${sSalesOrder}')/to_Item`,
                        data: oSalesorderItem_PayLoad
                    }).catch((err) => {
                        aResponseStatus.push({
                            "message": `| Remediation failed for Sales Order: ${sSalesOrder}: ${err.message} |`,
                            "status": "E"
                        });
                    }).then(async (result) => {
                        if (result) {
                            oContentData.DeliveryMethod = oContentData.DeliveryMethod + ", " + sDeliveryMethod;
                            oContentData.RemediationCounter = iRemediationCounter + 1;
                            oContentData.Remediation = oContentData.Remediation ? (oContentData.Remediation + ', ' + result?.SalesOrderItem) : result?.SalesOrderItem;
                            let updateRes = await UPDATE(hanaDBTable).set({ Remediation: `${oContentData.Remediation}`, DeliveryMethod: oContentData.DeliveryMethod, RemediationCounter: oContentData.RemediationCounter }).where({ BookingID: oContentData.BookingID, IsActive: 'Y' })

                            var oBTPItem = await SELECT.one.from(BookingSalesorderItem).where({ SalesOrder: sSalesOrder, SalesOrderItem: oSalesOrderItem?.SalesOrderItem })
                            let oNewBTPItem = {};
                            if (oBTPItem) {
                                oNewBTPItem = oBTPItem;
                            }
                            oNewBTPItem.SalesOrder = result?.SalesOrder;
                            oNewBTPItem.SalesOrderItem = result?.SalesOrderItem;
                            oNewBTPItem.Product = result?.Material;
                            oNewBTPItem.ShippingPoint = result?.ShippingPoint;
                            oNewBTPItem.ProductGroup = result?.MaterialGroup;
                            oNewBTPItem.ShippingType_ID = result?.ShippingType;

                            let insertResult = await INSERT.into(BookingSalesorderItem).entries(oNewBTPItem);
                            aResponseStatus.push({
                                "message": `| Sales Order: ${sSalesOrder} remediation successful. Item: ${result?.SalesOrderItem} is created |`,
                                "status": "S"
                            });
                        }
                    });
                }
            }
            req.reply({
                code: 201,
                message: JSON.stringify(aResponseStatus)
            });
        });
        const createStudioFeeds = async (req, aData, bReconcile) => {
            var recordsToBeInserted = [], recordsToBeUpdated = [], successEntries = [], updateSuccessEntries = [], hanatable = StudioFeed;
            var data = aData;
            sErrorMessage = ""; //Resetting error message
            oResponseStatus = { "error": [], "success": [], "warning": [] }; //Setting fresh response for the incoming request
            for (var i = 0; i < data.length; i++) {
                data[i].Status_ID = "A";
                data[i].IsActive = "Y";
                data[i].Version = 1;
                let sEntityID = data[i].EntityID, sBupa = data[i].Studio;
                oSalesParameterConfig = await s4h_salesparam_Txn.run(SELECT.one.from(S4_SalesParameter).where({ EntityID: sEntityID, StudioBP: sBupa }));
                sSoldToCustomer = oSalesParameterConfig?.SoldTo, SalesOrganization = oSalesParameterConfig?.SalesOrganization,
                    DistributionChannel = oSalesParameterConfig?.DistributionChannel, Division = oSalesParameterConfig?.Division, BillTo = oSalesParameterConfig?.BillTo;

                if (!oSalesParameterConfig) {
                    data[i].ErrorMessage = `For the record ${(i + 1)}, Sales Parameter configuration not mantained for EntityID:${sEntityID} Studio: ${sBupa}`;
                    data[i].Status_ID = "D";
                    oResponseStatus.error.push({
                        "message": `| ${data[i].ErrorMessage} |`,
                        "errorMessage": data[i].ErrorMessage
                    });
                }
                else if (!sSoldToCustomer) {
                    data[i].ErrorMessage = `For the record ${(i + 1)}, SoldToCustomer not maintained`;
                    data[i].Status_ID = "D";

                    oResponseStatus.error.push({
                        "message": `| ${data[i].ErrorMessage} |`,
                        "errorMessage": data[i].ErrorMessage
                    });
                }
                else if (!SalesOrganization) {
                    data[i].ErrorMessage = `For the record ${(i + 1)}, SalesOrganization not maintained`;
                    data[i].Status_ID = "D";

                    oResponseStatus.error.push({
                        "message": `| ${data[i].ErrorMessage} |`,
                        "errorMessage": data[i].ErrorMessage
                    });
                }
                else if (!DistributionChannel) {
                    data[i].ErrorMessage = `For the record ${(i + 1)}, DistributionChannel not maintained`;
                    data[i].Status_ID = "D";

                    oResponseStatus.error.push({
                        "message": `| ${data[i].ErrorMessage} |`,
                        "errorMessage": data[i].ErrorMessage
                    });
                }
                else if (!Division) {
                    data[i].ErrorMessage = `For the record ${(i + 1)}, Division not maintained`;
                    data[i].Status_ID = "D";

                    oResponseStatus.error.push({
                        "message": `| ${data[i].ErrorMessage} |`,
                        "errorMessage": data[i].ErrorMessage
                    });
                }
                else {
                    var oLocalResponse = await createS4SalesOrderWithItemsUsingNormalizedRules(req, data[i]);
                    if (oLocalResponse?.success?.length && !oLocalResponse?.error?.length) {
                        data[i] = await updateBTPSOItemsAndS4Texts(req, data[i], oLocalResponse);
                    }
                    if (oLocalResponse?.success?.length) {
                        // oResponseStatus?.success?.push(...oLocalResponse?.success);
                        data[i].SalesOrder = oLocalResponse?.SalesOrder;
                        data[i].DeliveryMethod = oLocalResponse?.DeliveryMethod;
                        data[i].RemediationCounter = 1;
                        data[i].Status_ID = "C";
                    }
                    if (oLocalResponse?.error?.length) {
                        // oResponseStatus?.error?.push(...oLocalResponse?.error);
                        data[i].ErrorMessage = oLocalResponse?.error?.[0].errorMessage;
                        data[i].Status_ID = "D";
                    }
                    // if(oLocalResponse?.warning?.length){
                    //     oResponseStatus?.warning?.push(...oLocalResponse?.warning);
                    // }
                    oLocalResponse = {};
                }
                if (bReconcile) {
                    var sID = data[i].ID;
                    await UPDATE(hanatable).set({ ErrorMessage: data[i].ErrorMessage, SalesOrder: data[i].SalesOrder }).where({
                        ID: sID
                    });
                }
                else {
                    if (data[i].BookingType === "U" || data[i].BookingType === "C") { //VERSION is updated only when BookingType is U or C
                        var entry_Active = await SELECT.one.from(hanatable).where({ BookingID: data[i].BookingID }).orderBy({ ref: ['createdAt'], sort: 'desc' });
                        if (entry_Active) {
                            data[i].Version = entry_Active.Version ? entry_Active.Version + 1 : 1;
                            recordsToBeUpdated.push(entry_Active);
                        }
                    }
                    recordsToBeInserted.push(data[i]); //INSERT is always required
                }
            }
            if (!bReconcile) {
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
                    if (updateResult) {
                        updateSuccessEntries.push(recordsToBeUpdated[i]);
                        updateSuccessEntries.push(updateResult);
                    }
                }
            }
            return oResponseStatus;
        };
        const createS4SalesOrderWithItemsUsingNormalizedRules = async (req, oContentData) => {
            var oPayLoad = {}, sContentIndicator, hanaDBTable = StudioFeed,
                sContentIndicator = oContentData?.OrderType, aDeliverySeqFromDistHeader = [];

            var distroSpecData = await getDistroSpecData(req, oContentData, aDeliverySeqFromDistHeader);
            var aContentPackageDistRestrictions;
            oResponseStatus = { "error": [], "success": [], "warning": [] };//Resetting oResponseStatus

            oResponseStatus.distroSpecData = distroSpecData;
            oPayLoad.SalesOrderType = aConfig?.find((e) => { return e.VariableName === 'SOType_SPIRITWORLD' })?.VariableValue;
            if (sErrorMessage) {
                await UPDATE(hanaDBTable).set({ ErrorMessage: sErrorMessage }).where({ BookingID: oContentData.BookingID, IsActive: "Y" });
            }
            else {
                aDeliverySeqFromDistHeader = aDeliverySeqFromDistHeader?.filter((sDelSeq) => {
                    return sDelSeq !== ''
                }); //Removing blank entries

                oPayLoad.SoldToParty = sSoldToCustomer;
                oPayLoad.SalesOrganization = SalesOrganization;
                oPayLoad.DistributionChannel = DistributionChannel;
                oPayLoad.OrganizationDivision = Division;
                oPayLoad.PurchaseOrderByCustomer = oContentData.BookingID;
                oPayLoad.IncotermsClassification = "CPT";
                oPayLoad.IncotermsLocation1 = "Destination";
                oPayLoad.CustomerPurchaseOrderType = oContentData?.Origin_OriginID; //RULE 10.1
                var aContentPackages = distroSpecData?.to_Package, oContentPackages, oKeyPackage;

                var sTheaterID = oContentData.TheaterID, sShipTo = "";
                var sBPCustomerNumber = "", sPYCustomer = "", sCustomerGroupFromS4 = "";
                oPayLoad.to_Partner = [];
                if (sTheaterID) { //FIDNING SHIP-TO
                    var oSoldToSalesData = await s4h_bp_Txn.run(SELECT.one.from(S4H_CustomerSalesArea, (salesArea) => { salesArea.to_PartnerFunction((partFunc) => { }) }).where({ Customer: sSoldToCustomer, SalesOrganization: SalesOrganization, DistributionChannel: DistributionChannel, Division: Division }));
                    if (!oSoldToSalesData) {
                        sErrorMessage = `Sales Data not maintained for Sold To Customer ${sSoldToCustomer}-${SalesOrganization}/${DistributionChannel}/${Division}`;
                    }
                    if (oSoldToSalesData?.to_PartnerFunction?.length > 0) {
                        var oPartnerFunction = oSoldToSalesData?.to_PartnerFunction.find((pf) => { return pf.PartnerFunction === "SH" && pf.CustomerPartnerDescription === sTheaterID });
                        if (oPartnerFunction && Object.keys(oPartnerFunction).length) {
                            sBPCustomerNumber = oPartnerFunction.BPCustomerNumber;
                            if (sBPCustomerNumber) {
                                sShipTo = sBPCustomerNumber;
                                oPayLoad.to_Partner.push({ "PartnerFunction": 'WE', "Customer": sBPCustomerNumber }); //This is the Ship To in S4
                            }
                        }
                        else {
                            sErrorMessage = "Partner function details not found for SH: CustomerPartnerDescription: " + sTheaterID;
                        }
                    }
                    else {
                        sErrorMessage = "Partner function not available";
                    }
                }
                else {
                    sErrorMessage = `Theater ID is not supplied in the payload`;
                }
                if (sShipTo) {
                    var oShipToSalesData = await s4h_bp_Txn.run(SELECT.one.from(S4H_CustomerSalesArea, (salesArea) => { salesArea.to_PartnerFunction((partFunc) => { }) }).where({ Customer: sShipTo, SalesOrganization: SalesOrganization, DistributionChannel: DistributionChannel, Division: Division }));
                    sCustomerGroupFromS4 = oShipToSalesData?.CustomerGroup;
                }
                else {
                    sErrorMessage = "Ship-To not found";
                }
                if (!sErrorMessage) {
                    if (sContentIndicator === 'C') {
                        aContentPackages = await performPrioritySortAndValidityCheck(aContentPackages, oContentData, distroSpecData); //Contains list of valid content pakcages
                        if (!aContentPackages?.length) {
                            sErrorMessage = `DistroSpec ${distroSpecData?.DistroSpecID} not in validity range for Content Order`;
                        }
                        else { //RULE 2.3 => Lookup package ID Delivery method
                            // These rules are applicable only for content           
                            for (var j in aDeliverySeqFromDistHeader) {
                                var sDelSeq = aDeliverySeqFromDistHeader[j];
                                if (sDelSeq) {
                                    oContentPackages = aContentPackages.find((pkg) => {
                                        return (
                                            pkg.DeliveryMethod1_ShippingCondition === sDelSeq || pkg.DeliveryMethod2_ShippingCondition === sDelSeq ||
                                            pkg.DeliveryMethod3_ShippingCondition === sDelSeq || pkg.DeliveryMethod4_ShippingCondition === sDelSeq ||
                                            pkg.DeliveryMethod5_ShippingCondition === sDelSeq || pkg.DeliveryMethod6_ShippingCondition === sDelSeq ||
                                            pkg.DeliveryMethod7_ShippingCondition === sDelSeq || pkg.DeliveryMethod8_ShippingCondition === sDelSeq ||
                                            pkg.DeliveryMethod9_ShippingCondition === sDelSeq || pkg.DeliveryMethod10_ShippingCondition === sDelSeq)
                                    });
                                    if (oContentPackages) { //Delivery sequence is found in the delivery method maintained                                  
                                        var oFilteredContentPackage = oContentPackages;
                                        aContentPackageDistRestrictions = oFilteredContentPackage?.to_DistRestriction
                                        break;
                                    }
                                }
                            }
                            if (oFilteredContentPackage) {
                                var aDeliveryMethodsFromPackage = [];
                                aDeliveryMethodsFromPackage.push(oFilteredContentPackage.DeliveryMethod1_ShippingCondition ? oFilteredContentPackage.DeliveryMethod1_ShippingCondition : "");
                                aDeliveryMethodsFromPackage.push(oFilteredContentPackage.DeliveryMethod2_ShippingCondition ? oFilteredContentPackage.DeliveryMethod2_ShippingCondition : "");
                                aDeliveryMethodsFromPackage.push(oFilteredContentPackage.DeliveryMethod3_ShippingCondition ? oFilteredContentPackage.DeliveryMethod3_ShippingCondition : "");
                                aDeliveryMethodsFromPackage.push(oFilteredContentPackage.DeliveryMethod4_ShippingCondition ? oFilteredContentPackage.DeliveryMethod4_ShippingCondition : "");
                                aDeliveryMethodsFromPackage.push(oFilteredContentPackage.DeliveryMethod5_ShippingCondition ? oFilteredContentPackage.DeliveryMethod5_ShippingCondition : "");
                                aDeliveryMethodsFromPackage.push(oFilteredContentPackage.DeliveryMethod6_ShippingCondition ? oFilteredContentPackage.DeliveryMethod6_ShippingCondition : "");
                                aDeliveryMethodsFromPackage.push(oFilteredContentPackage.DeliveryMethod7_ShippingCondition ? oFilteredContentPackage.DeliveryMethod7_ShippingCondition : "");
                                aDeliveryMethodsFromPackage.push(oFilteredContentPackage.DeliveryMethod8_ShippingCondition ? oFilteredContentPackage.DeliveryMethod8_ShippingCondition : "");
                                aDeliveryMethodsFromPackage.push(oFilteredContentPackage.DeliveryMethod9_ShippingCondition ? oFilteredContentPackage.DeliveryMethod9_ShippingCondition : "");
                                aDeliveryMethodsFromPackage.push(oFilteredContentPackage.DeliveryMethod10_ShippingCondition ? oFilteredContentPackage.DeliveryMethod10_ShippingCondition : "");

                                var aShiptoDelMethodsFromS4 = [], DCDCFlag, TrailMix;
                                if (oShipToSalesData) { //4.2 =>DCDC check for Del Method
                                    DCDCFlag = oShipToSalesData?.YY1_DCDCFlag_csa;
                                    var dcdcDelMethodFound = aDeliveryMethodsFromPackage.find((delMeth) => {
                                        return (delMeth === '05' || delMeth === '06' || delMeth === '10')
                                    });
                                    if (dcdcDelMethodFound && !DCDCFlag) {
                                        sErrorMessage = `DCDC Capability Not found`;
                                    }
                                    // var ODistRest = aContentPackageDistRestrictions?.find((rest)=>{
                                    //     rest.TrailMixSub !== null
                                    // }); 
                                    // TrailMix = oShipToSalesData?.YY1_TrailMixSubscrib_csa;
                                    // // if(!sErrorMessage){
                                    // //     if(ODistRest?.TrailMixSub !== TrailMix){ //4.5=> TrailMixSubscrib check
                                    // //         sErrorMessage = ` TrailMix Subscription ${TrailMixSub} not matching with Restriction maintained`;
                                    // //     }
                                    // // }
                                    oShipToSalesData?.YY1_DeliveryMethod1_csa ? aShiptoDelMethodsFromS4.push(oShipToSalesData?.YY1_DeliveryMethod1_csa) : '';
                                    oShipToSalesData?.YY1_DeliveryMethod2_csa ? aShiptoDelMethodsFromS4.push(oShipToSalesData?.YY1_DeliveryMethod2_csa) : '';
                                    oShipToSalesData?.YY1_DeliveryMethod3_csa ? aShiptoDelMethodsFromS4.push(oShipToSalesData?.YY1_DeliveryMethod3_csa) : '';
                                    oShipToSalesData?.YY1_DeliveryMethod4_csa ? aShiptoDelMethodsFromS4.push(oShipToSalesData?.YY1_DeliveryMethod4_csa) : '';
                                    oShipToSalesData?.YY1_DeliveryMethod5_csa ? aShiptoDelMethodsFromS4.push(oShipToSalesData?.YY1_DeliveryMethod5_csa) : '';
                                    oShipToSalesData?.YY1_DeliveryMethod6_csa ? aShiptoDelMethodsFromS4.push(oShipToSalesData?.YY1_DeliveryMethod6_csa) : '';
                                    oShipToSalesData?.YY1_DeliveryMethod7_csa ? aShiptoDelMethodsFromS4.push(oShipToSalesData?.YY1_DeliveryMethod7_csa) : '';
                                    oShipToSalesData?.YY1_DeliveryMethod8_csa ? aShiptoDelMethodsFromS4.push(oShipToSalesData?.YY1_DeliveryMethod8_csa) : '';
                                    oShipToSalesData?.YY1_DeliveryMethod9_csa ? aShiptoDelMethodsFromS4.push(oShipToSalesData?.YY1_DeliveryMethod9_csa) : '';
                                    oShipToSalesData?.YY1_DeliveryMethod10_csa ? aShiptoDelMethodsFromS4.push(oShipToSalesData?.YY1_DeliveryMethod10_csa) : '';

                                    var oPBC, pbcPresent = false; //For RULE 4.4 => Playback capability Check
                                    for (var d in aContentPackageDistRestrictions) {
                                        var aPBC = [];
                                        aPBC.push(aContentPackageDistRestrictions[d].PlayBackCapability1);
                                        aPBC.push(aContentPackageDistRestrictions[d].PlayBackCapability2);
                                        aPBC.push(aContentPackageDistRestrictions[d].PlayBackCapability3);
                                        aPBC.push(aContentPackageDistRestrictions[d].PlayBackCapability4);
                                        aPBC.push(aContentPackageDistRestrictions[d].PlayBackCapability5);
                                        aPBC.push(aContentPackageDistRestrictions[d].PlayBackCapability6);
                                        aPBC.push(aContentPackageDistRestrictions[d].PlayBackCapability7);
                                        aPBC.push(aContentPackageDistRestrictions[d].PlayBackCapability8);
                                        aPBC.push(aContentPackageDistRestrictions[d].PlayBackCapability9);
                                        aPBC.push(aContentPackageDistRestrictions[d].PlayBackCapability10);
                                        aPBC.splice(null);//Removing blank entries
                                        aPBC.splice('');//Removing blank entries
                                        oPBC = aPBC?.find((pbc) => {
                                            if (pbc) {
                                                pbcPresent = true;
                                                return (pbc === oShipToSalesData?.YY1_SpecialAttribute1_csa || pbc === oShipToSalesData?.YY1_SpecialAttribute2_csa ||
                                                    pbc === oShipToSalesData?.YY1_SpecialAttribute3_csa || pbc === oShipToSalesData?.YY1_SpecialAttribute4_csa ||
                                                    pbc === oShipToSalesData?.YY1_SpecialAttribute5_csa || pbc === oShipToSalesData?.YY1_SpecialAttribute6_csa ||
                                                    pbc === oShipToSalesData?.YY1_SpecialAttribute7_csa || pbc === oShipToSalesData?.YY1_SpecialAttribute8_csa ||
                                                    pbc === oShipToSalesData?.YY1_SpecialAttribute9_csa || pbc === oShipToSalesData?.YY1_SpecialAttribute10_csa
                                                );
                                            }
                                        });
                                        if (oPBC) {
                                            break;
                                        }
                                    }
                                    if (pbcPresent && !oPBC) { //RULE 4.4 => Playback capability Check
                                        sErrorMessage = `No Playback Capability match found`;
                                    }
                                }
                                else {
                                    sErrorMessage = `Sales Data not maintained for Ship To Customer ${sShipTo}-${SalesOrganization}/${DistributionChannel}/${Division}`;
                                }
                            }
                            else {
                                sErrorMessage = `No Package matches found for the delivery method`;
                            }
                            if (!sErrorMessage) {
                                var oBPPackage = [oFilteredContentPackage].find((oPkg) => {
                                    return aShiptoDelMethodsFromS4.find((item) => item === oPkg?.DeliveryMethod1_ShippingCondition) ||
                                        aShiptoDelMethodsFromS4.find((item) => item === oPkg?.DeliveryMethod2_ShippingCondition) ||
                                        aShiptoDelMethodsFromS4.find((item) => item === oPkg?.DeliveryMethod3_ShippingCondition) ||
                                        aShiptoDelMethodsFromS4.find((item) => item === oPkg?.DeliveryMethod4_ShippingCondition) ||
                                        aShiptoDelMethodsFromS4.find((item) => item === oPkg?.DeliveryMethod5_ShippingCondition) ||
                                        aShiptoDelMethodsFromS4.find((item) => item === oPkg?.DeliveryMethod6_ShippingCondition) ||
                                        aShiptoDelMethodsFromS4.find((item) => item === oPkg?.DeliveryMethod7_ShippingCondition) ||
                                        aShiptoDelMethodsFromS4.find((item) => item === oPkg?.DeliveryMethod8_ShippingCondition) ||
                                        aShiptoDelMethodsFromS4.find((item) => item === oPkg?.DeliveryMethod9_ShippingCondition) ||
                                        aShiptoDelMethodsFromS4.find((item) => item === oPkg?.DeliveryMethod10_ShippingCondition);
                                });
                                if (!oBPPackage) { //RULE 4.1 => Delivery Capability check with ShipTo
                                    sErrorMessage = `Theater Capability not found. Ship-To:${sShipTo}`;
                                }
                                oFilteredContentPackage = oBPPackage;
                            }
                        }
                    }
                    if (sContentIndicator === 'K' || oFilteredContentPackage?.IncludeKey) { //FOR KEY
                        var aKeyPackage = distroSpecData?.to_KeyPackage;
                        aKeyPackage = await performPrioritySortAndValidityCheck(aKeyPackage, oContentData, distroSpecData);//Contains list of valid Key pakcages
                        if (!aKeyPackage?.length) {
                            sErrorMessage = `DistroSpec ${distroSpecData?.DistroSpecID} not in validity range for Key Order`;
                        }
                        else {
                            oKeyPackage = aKeyPackage[0];
                            oResponseStatus.KeyPackage = oKeyPackage;
                        }
                    }
                    //RULE 2.2 and 3.2 => Package Restrictions (Common for both Content and Key)   - START          
                    var aCircuits = aContentPackageDistRestrictions?.filter((rest) => {
                        return rest.Circuit_CustomerGroup?.length > 0;
                    });
                    var aCountry = aContentPackageDistRestrictions?.filter((rest) => {
                        return rest.DistributionFilterCountry_code?.length > 0;
                    });
                    var aRegion = aContentPackageDistRestrictions?.filter((rest) => {
                        return rest.DistributionFilterRegion_Countr?.length > 0;
                    });
                    var aCity = aContentPackageDistRestrictions?.filter((rest) => {
                        return rest.DistributionFilterCity?.length > 0;
                    });
                    var aPostalCode = aContentPackageDistRestrictions?.filter((rest) => {
                        return rest.DistributionFilterPostal?.length > 0;
                    });
                    var aLanguage = aContentPackageDistRestrictions?.filter((rest) => {
                        return rest.DistributionFilterLanguage_code?.length > 0;
                    });
                    if (aContentPackageDistRestrictions && aContentPackageDistRestrictions.length) {
                        var oDist = aContentPackageDistRestrictions.find((dist) => {
                            return dist.Theater_BusinessPartner || dist.Circuit_CustomerGroup || dist.DistributionFilterLanguage_code ||
                                dist.DistributionFilterCountry_code || dist.DistributionFilterRegion_Country || dist.DistributionFilterCity ||
                                dist.DistributionFilterPostal
                        });
                        if (oDist) {
                            var oBusinessPartnerAddrfromS4 = await SELECT.from(S4H_BusinessPartnerAddress).where({ BusinessPartner: sBuPa }); //GETTING ADDRESS DATA FROM S4
                            var oDistRestriction = aContentPackageDistRestrictions.find((dist) => {
                                return (dist.Theater_BusinessPartner === sShipTo && dist.Circuit_CustomerGroup === sCustomerGroupFromS4 &&
                                    ((oBusinessPartnerAddrfromS4?.Language && dist.DistributionFilterLanguage_code) ? oBusinessPartnerAddrfromS4.Language === dist.DistributionFilterLanguage_code : true) &&
                                    ((oBusinessPartnerAddrfromS4?.Country && dist.DistributionFilterCountry_code) ? oBusinessPartnerAddrfromS4.Country === dist.DistributionFilterCountry_code : true) &&
                                    ((oBusinessPartnerAddrfromS4?.Region && dist.DistributionFilterRegion_Country) ? oBusinessPartnerAddrfromS4.Region === dist.DistributionFilterRegion_Country : true) &&
                                    ((oBusinessPartnerAddrfromS4?.CityCode && dist.DistributionFilterCity) ? oBusinessPartnerAddrfromS4.CityCode === dist.DistributionFilterCity : true) &&
                                    ((oBusinessPartnerAddrfromS4?.PostalCode && dist.DistributionFilterPostal) ? oBusinessPartnerAddrfromS4.PostalCode === dist.DistributionFilterPostal : true)
                                );
                            });
                            if (!oDistRestriction) {
                                sErrorMessage = `No relevant Package IDs identified for restrictions. 
                                CustomerGroupFromS4:${sCustomerGroupFromS4}|
                                PartnerAddress(Lang/Country/Region/CityCode/PostalCode from S4: ${oBusinessPartnerAddrfromS4.Language}/${oBusinessPartnerAddrfromS4.Country}/${oBusinessPartnerAddrfromS4.Region}/${oBusinessPartnerAddrfromS4.CityCode}/${oBusinessPartnerAddrfromS4.PostalCode})`;
                            }
                        }
                    }
                    //RULE 2.2 and 3.2 => Package Restrictions (Common for both Content and Key)   - END
                    if (!sErrorMessage) {
                        oResponseStatus.package = oFilteredContentPackage;

                        var sDeliveryMethod, sShippingType;
                        if (sContentIndicator === 'C') { //RULE 2.2 => Getting Delivery Method for Content 
                            sDeliveryMethod = oFilteredContentPackage.DeliveryMethod1_ShippingCondition ? oFilteredContentPackage.DeliveryMethod1_ShippingCondition :
                                oFilteredContentPackage.DeliveryMethod2_ShippingCondition ? oFilteredContentPackage.DeliveryMethod2_ShippingCondition :
                                    oFilteredContentPackage.DeliveryMethod3_ShippingCondition ? oFilteredContentPackage.DeliveryMethod3_ShippingCondition : oFilteredContentPackage.DeliveryMethod4_ShippingCondition ?
                                        oFilteredContentPackage.DeliveryMethod4_ShippingCondition : oFilteredContentPackage.DeliveryMethod5_ShippingCondition ? oFilteredContentPackage.DeliveryMethod5_ShippingCondition :
                                            oFilteredContentPackage.DeliveryMethod6_ShippingCondition ? oFilteredContentPackage.DeliveryMethod6_ShippingCondition : oFilteredContentPackage.DeliveryMethod7_ShippingCondition ?
                                                oFilteredContentPackage.DeliveryMethod7_ShippingCondition : oFilteredContentPackage.DeliveryMethod8_ShippingCondition ? oFilteredContentPackage.DeliveryMethod8_ShippingCondition :
                                                    oFilteredContentPackage.DeliveryMethod9_ShippingCondition ? oFilteredContentPackage.DeliveryMethod9_ShippingCondition : oFilteredContentPackage.DeliveryMethod10_ShippingCondition;

                            //RULE 7.1 => Shipping Type for Content
                            if (sDeliveryMethod) {
                                oPayLoad.ShippingCondition = sDeliveryMethod;
                                oResponseStatus.DeliveryMethod = sDeliveryMethod;
                                var oShippingTypeMapping = await SELECT.one.from(ShippingConditionTypeMapping).where({ ShippingCondition: sDeliveryMethod });
                                sShippingType = oShippingTypeMapping.ShippingType;

                                if (!sShippingType) {
                                    sErrorMessage = `Shipping Type not maintained for Delivery Method: ${sDeliveryMethod}`;
                                }
                            }
                            else {
                                sErrorMessage = `Delivery Method could not be determined for Content`;
                            }
                        }
                        else {
                            sDeliveryMethod = "04"; //Rule 3.3 => Delivery Method for Key is Fixed
                            sShippingType = '07'; //RULE 7.2 => Shipping Type for KEY
                        }
                        if (!sErrorMessage) {
                            var sStartDate = oContentData.PlayStartDate;
                            var sStartTime = oContentData.PlayStartTime;
                            var sEndDate = oContentData.PlayEndDate;
                            var sEndTime = oContentData.PlayEndTime;
                            var dStartDate = sStartTime ? new Date(`${sStartDate}T${sStartTime}`) : new Date(sStartDate);
                            var dEndDate = sEndTime ? new Date(`${sEndDate}T${sEndTime}`) : new Date(sEndDate);
                            var iDifferenceInHours = (dEndDate - dStartDate) / (60 * 60 * 1000);
                            var ReleaseDate = distroSpecData?.ReleaseDate;
                            var RepertoryDate = distroSpecData?.RepertoryDate;

                            oPayLoad.to_Item = [];
                            var sLongText;
                            if ((oFilteredContentPackage || oKeyPackage?.IncludeContent) &&
                                sShippingType == '03' || sShippingType === '06' || sShippingType === '12') {  // RULE 5.1 and 6.3 => Applicable only for Content and Key with Include Content  
                                if (oFilteredContentPackage?.to_DCPMaterial) {
                                    for (var j in oFilteredContentPackage.to_DCPMaterial) {
                                        var oMatRecord = oFilteredContentPackage.to_DCPMaterial[j];
                                        if (sDeliveryMethod === '02') { //RULE 5.2 => LongText for GoFilex TitleID NORAM to pass in Items
                                            var oAssetvault = await SELECT.one.from(AssetVault_Local).where({ DCP: oMatRecord.DCPMaterialNumber_Product });
                                            var sGoFilexTitleID = oAssetvault?.GoFilexTitleID_NORAM;
                                            sLongText = sGoFilexTitleID;
                                        }
                                        var oEntry = {
                                            "Material": oMatRecord.DCPMaterialNumber_Product,
                                            "RequestedQuantity": '1',
                                            "RequestedQuantityISOUnit": "EA",
                                            // "DeliveryPriority": `${oFilteredContentPackage?.Priority}`,
                                            "DeliveryPriority": `1`,
                                            "PricingReferenceMaterial": distroSpecData?.Title_Product,
                                            "ShippingType": sShippingType,
                                            "LongText": sLongText
                                        };
                                        oPayLoad.to_Item.push(oEntry);
                                    }
                                    // var aDCPs = oFilteredContentPackage?.to_DCPMaterial.map((item) => { return item.DCPMaterialNumber_Product });
                                }
                                else {
                                    sErrorMessage = "DCP Material not available";
                                }
                            }
                            else { // RULE 5.1, 6.1 => Common for Content and Key
                                var sMode;
                                if (iDifferenceInHours > 24) {
                                    sMode = 'Release';
                                }
                                else {
                                    sMode = 'PreRelease';
                                }
                                if (oFilteredContentPackage) { //Applicable only for Content
                                    var oDCPMapping = await SELECT.one.from(DCPMaterialMapping).where({ ShippingType: sShippingType, Variable: sMode });
                                    oPayLoad.to_Item.push({
                                        "Material": oDCPMapping?.Material,
                                        "AdditionalMaterialGroup1": oDCPMapping?.MaterialGroup,
                                        "RequestedQuantity": '1',
                                        "RequestedQuantityISOUnit": "EA",
                                        // "DeliveryPriority": `${oFilteredContentPackage?.Priority}`,
                                        "DeliveryPriority": `1`,
                                        "PricingReferenceMaterial": distroSpecData?.Title_Product,
                                        "ShippingType": sShippingType
                                    });
                                }
                                if (oKeyPackage) { //This indicates IncludeKey is checked
                                    // sDeliveryMethod = "04"; //Rule 3.3 => Delivery Method for Key is Fixed
                                    // sShippingType = '07'; //RULE 7.2 => Shipping Type for KEY
                                    oDCPMapping = await SELECT.one.from(DCPMaterialMapping).where({ ShippingType: '07', Variable: sMode }); //RULE 7.2 => Shipping Type for KEY
                                    oPayLoad.to_Item.push({
                                        "Material": oDCPMapping?.Material,
                                        "AdditionalMaterialGroup1": oDCPMapping?.MaterialGroup,
                                        "RequestedQuantity": '1',
                                        "RequestedQuantityISOUnit": "EA",
                                        // "DeliveryPriority": `${oFilteredContentPackage?.Priority}`,
                                        "DeliveryPriority": `1`,
                                        "PricingReferenceMaterial": distroSpecData?.Title_Product,
                                        "ShippingType": '07'
                                    });
                                }

                                if (ReleaseDate && dStartDate > ReleaseDate) {
                                    sMode = 'PostBreak';
                                    oDCPMapping = await SELECT.one.from(DCPMaterialMapping).where({ ShippingType: sShippingType, Variable: sMode });
                                    oPayLoad.to_Item.push({
                                        "Material": oDCPMapping?.Material,
                                        "AdditionalMaterialGroup1": oDCPMapping?.MaterialGroup,
                                        "RequestedQuantity": '1',
                                        "RequestedQuantityISOUnit": "EA",
                                        // "DeliveryPriority": `${oFilteredContentPackage?.Priority}`,
                                        "DeliveryPriority": `1`,
                                        "PricingReferenceMaterial": distroSpecData?.Title_Product,
                                        "ShippingType": sShippingType
                                    });
                                }
                                if (RepertoryDate) {
                                    sMode = 'Repertory';
                                    oDCPMapping = await SELECT.one.from(DCPMaterialMapping).where({ ShippingType: sShippingType, Variable: sMode });
                                    oPayLoad.to_Item.push({
                                        "Material": oDCPMapping?.Material,
                                        "AdditionalMaterialGroup1": oDCPMapping?.MaterialGroup,
                                        "RequestedQuantity": '1',
                                        "RequestedQuantityISOUnit": "EA",
                                        // "DeliveryPriority": `${oFilteredContentPackage?.Priority}`,
                                        "DeliveryPriority": `1`,
                                        "PricingReferenceMaterial": distroSpecData?.Title_Product,
                                        "ShippingType": sShippingType
                                    });
                                }
                            }
                        }
                    }
                }
            }
            var sSalesOrder = "";
            if (sErrorMessage) {
                oResponseStatus.error.push({
                    "message": `| Booking ID: ${oContentData.BookingID}: ${sErrorMessage} |`,
                    "errorMessage": sErrorMessage
                })
            }
            else {
                var postResult = await s4h_sohv2_Txn.send({
                    method: 'POST',
                    path: '/A_SalesOrder',
                    data: oPayLoad
                }).catch((err) => {
                    oResponseStatus.error.push({
                        "message": `| Booking ID: ${oContentData.BookingID}: ${err.message} |`,
                        "errorMessage": err.message
                    })
                }).then((result) => {
                    if (result) {
                        sSalesOrder = result?.SalesOrder;
                        oResponseStatus.success.push({
                            "message": `| Booking ID: ${oContentData.BookingID}, Sales Order: ${result?.SalesOrder} is created |`,
                            "SalesOrder": sSalesOrder
                        });
                        oResponseStatus.SalesOrder = sSalesOrder;
                    }
                });
            }
            oResponseStatus.payLoad = oPayLoad;
            oResponseStatus.FilteredPackage = oFilteredContentPackage;
            return oResponseStatus;
        };
        const getDistroSpecData = async (req, oContentData, aDeliverySeqFromDistHeader) => {
            let distroSpecData;
            var oDistroQuery = SELECT.from(DistroSpec_Local, (dist) => {
                dist('*'),
                    dist.to_StudioKey((studio) => { studio('*') }),
                    dist.to_Package((pkg) => {
                        pkg('*'),
                            pkg.to_DistRestriction((dist) => { dist('*') }),
                            pkg.to_DCPMaterial((dcpmat) => {
                                dcpmat('*'),
                                    dcpmat.to_DCPDetail((dcpdet) => { dcpdet('*') })
                            })
                    }),
                    dist.to_KeyPackage((keyPkg) => {
                        keyPkg('*'),
                            keyPkg.to_DistRestriction((dist) => { dist('*') }),
                            keyPkg.to_CPLDetail((cpl) => { cpl('*') })
                    })
            });
            var sTitle = oContentData.Title;
            var sBuPa = oContentData.Studio;
            if (oContentData?.Origin_OriginID !== "F") {
                var oProductDescFromS4 = await s4h_products_Crt.run(SELECT.one.from(ProductDescription).where({ ProductDescription: sTitle, Language: 'EN' }));
                var Product = oProductDescFromS4?.Product;
                if (Product) {
                    oDistroQuery.SELECT.where = [{ ref: ["Title_Product"] }, "=", { val: Product }];
                    var aDistroSpecData = await oDistroQuery;
                    if (sBuPa) {
                        distroSpecData = aDistroSpecData?.find((dist) => {
                            return dist.to_StudioKey?.find((stud) => {
                                return stud.Studio_BusinessPartner === sBuPa;
                            });
                        });
                    }
                    else {
                        sErrorMessage = `Studio not present in the payload`;
                    }
                }
                else {
                    sErrorMessage = `Product not found for the title: ${sTitle}`;
                }
            }
            else {
                var sCustomerRef = oContentData.CustomerReference;
                if (sCustomerRef) {
                    var oCustomerRef = await SELECT.one.from('DistributionService.CustomerRef').where({ CustomerReference: sCustomerRef });
                    var to_DistroSpec_DistroSpecUUID = oCustomerRef?.to_DistroSpec_DistroSpecUUID,
                        to_StudioKey_StudioKeyUUID = oCustomerRef?.to_StudioKey_StudioKeyUUID;
                    if (oCustomerRef && to_DistroSpec_DistroSpecUUID && to_StudioKey_StudioKeyUUID) {

                        oDistroQuery.SELECT.where = [{ ref: ["DistroSpecUUID"] }, "=", { val: to_DistroSpec_DistroSpecUUID }];
                        aDistroSpecData = await oDistroQuery;
                        distroSpecData = aDistroSpecData?.find((dist) => {
                            return dist.to_StudioKey?.find((stud) => {
                                return stud.StudioKeyUUID === to_StudioKey_StudioKeyUUID;
                            });
                        });
                    }
                    else {
                        sErrorMessage = `DistroSpec with Customer reference ${sCustomerRef} not found`;
                    }
                }
                else {
                    sErrorMessage = "Customer reference is not available in the payload";
                }
            }
            if (!sErrorMessage) {
                aDeliverySeqFromDistHeader.push(distroSpecData?.DeliverySequence1_ShippingCondition ? distroSpecData?.DeliverySequence1_ShippingCondition : "");
                aDeliverySeqFromDistHeader.push(distroSpecData?.DeliverySequence2_ShippingCondition ? distroSpecData?.DeliverySequence2_ShippingCondition : "");
                aDeliverySeqFromDistHeader.push(distroSpecData?.DeliverySequence3_ShippingCondition ? distroSpecData?.DeliverySequence3_ShippingCondition : "");
                aDeliverySeqFromDistHeader.push(distroSpecData?.DeliverySequence4_ShippingCondition ? distroSpecData?.DeliverySequence4_ShippingCondition : "");
                aDeliverySeqFromDistHeader.push(distroSpecData?.DeliverySequence5_ShippingCondition ? distroSpecData?.DeliverySequence5_ShippingCondition : "");
                aDeliverySeqFromDistHeader.push(distroSpecData?.DeliverySequence6_ShippingCondition ? distroSpecData?.DeliverySequence6_ShippingCondition : "");
                aDeliverySeqFromDistHeader.push(distroSpecData?.DeliverySequence7_ShippingCondition ? distroSpecData?.DeliverySequence7_ShippingCondition : "");
                aDeliverySeqFromDistHeader.push(distroSpecData?.DeliverySequence8_ShippingCondition ? distroSpecData?.DeliverySequence8_ShippingCondition : "");
                aDeliverySeqFromDistHeader.push(distroSpecData?.DeliverySequence9_ShippingCondition ? distroSpecData?.DeliverySequence9_ShippingCondition : "");
                aDeliverySeqFromDistHeader.push(distroSpecData?.DeliverySequence10_ShippingCondition ? distroSpecData?.DeliverySequence10_ShippingCondition : "");
            }
            return distroSpecData;
        }
        const updateBTPSOItemsAndS4Texts = async (req, oContentData, oResponseStatus) => {
            var sSalesOrder = oResponseStatus?.SalesOrder, sContentIndicator = oContentData?.OrderType;
            var distroSpecData = oResponseStatus?.distroSpecData, aCTTCPL = [], oContentPackage = oResponseStatus?.package,
                oPayLoad = oResponseStatus?.payLoad, oKeyPackage = oResponseStatus?.KeyPackage;
            var oSalesOrder = await s4h_sohv2_Txn.run(SELECT.one.from(S4H_SOHeader_V2).columns(['*', { "ref": ["to_Item"], "expand": ["*"] }, { "ref": ["to_Partner"], "expand": ["*"] }]).where({ SalesOrder: sSalesOrder }));

            // var oRecordsToBePosted = oContentData;
            var oStudioKeyData = distroSpecData?.to_StudioKey?.[0];
            // oRecordsToBePosted.DistroSpecID = distroSpecData?.DistroSpecID;
            var aSalesOrderItems = oSalesOrder.to_Item;
            oContentData["to_Item"] = [];
            var sStudio = oStudioKeyData?.Studio_BusinessPartner;
            for (var i in aSalesOrderItems) {
                var oSalesOrderItem = aSalesOrderItems[i];
                var sShippingType = oSalesOrderItem?.ShippingType;

                // var oBTPItem = await SELECT.one.from(BookingSalesorderItem).where({SalesOrder: sSalesOrder, SalesOrderItem: oSalesOrderItem.SalesOrderItem});
                // if(oBTPItem){ //Skip if Item already exists in Normalized SO Item
                //     continue;
                // }
                oContentData.to_Item.push({}); //to_Item from to be mapped with _Item of local CDS
                oContentData.to_Item[i]["Product"] = oSalesOrderItem.Material;
                var oAssetvault = await SELECT.one.from(AssetVault_Local).columns(["*", { "ref": ["_Items"], "expand": ["*"] }]).
                    where({ DCP: oSalesOrderItem.Material });

                var sGoFilexTitleID = oAssetvault?.GoFilexTitleID_NORAM;
                oContentData.to_Item[i].LongText = sGoFilexTitleID;
                oContentData.to_Item[i].ProductGroup = oSalesOrderItem.MaterialGroup;
                oContentData.to_Item[i].Plant = oSalesOrderItem.ProductionPlant;
                if (oPayLoad?.ShippingCondition === '02' && sGoFilexTitleID) { //RULE 5.2 
                    await updateItemTextForSalesOrder(req, "Z004", sGoFilexTitleID, oResponseStatus, oSalesOrderItem, oContentData);
                }
                // if (oAssetvault?._Items?.length > 0) {
                //     var sLinkedCTT = oAssetvault._Items.map(u => u.LinkedCTT).join(`\n`);
                //     var sCPLUUID = oAssetvault._Items.map(u => u.LinkedCPLUUID).join(`,`);
                //     aCTTCPL.push({ "Product": oSalesOrderItem.Material, "LinkedCTT": sLinkedCTT, "CPLUUID": sCPLUUID })
                // }
                // var oCTTCPL = aCTTCPL?.find((entry) => { return entry.Product === oSalesOrderItem.Material });
                // if (oCTTCPL) {
                //     oContentData.to_Item[i].CTT = oCTTCPL.LinkedCTT;
                //     oContentData.to_Item[i].CPLUUID = oCTTCPL.CPLUUID;
                //     await updateItemTextForSalesOrder(req, "Z005", oCTTCPL?.CPLUUID, oResponseStatus, oSalesOrderItem, oContentData);
                //     if (sContentIndicator === "K") {
                //         await updateItemTextForSalesOrder(req, "0001", oCTTCPL?.LinkedCTT, oResponseStatus, oSalesOrderItem, oContentData);
                //     }
                // }
                // var oCplList = await SELECT.one.from(CplList_Local).where({ DCP: oSalesOrderItem.Material });
                // if (oCplList) {
                //     await updateItemTextForSalesOrder(req, "Z006", `${oCplList?.ProjectID}`, oResponseStatus, oSalesOrderItem, oContentData);
                // }
                var aKeyPkgCPL = oKeyPackage?.to_CPLDetail, aKeyPkgCTT = [], sKeyPkgCTTs, aKeyPkgCPLUUID = [], sKeyPkgCPLUUIDs; //For Key package CTT and CPLUUID
                var aContentPkgCPL = oContentPackage?.to_DCPMaterial,
                    aContentPkgCTT = [], sContentPkgCTTs, aContentPkgCPLUUID = [], sContentPkgCPLUUIDs; //For Content package CTT and CPLUUID

                var sPackageUUID, sPackageName;
                if (sShippingType === '07') { //Key Order Item
                    sPackageUUID = oKeyPackage?.PackageUUID;
                    sPackageName = oKeyPackage?.PackageName;
                    oContentData.to_Item[i].DistroSpecPackageID = oKeyPackage?.PackageUUID;
                    oContentData.to_Item[i].DistroSpecPackageName = oKeyPackage?.PackageName;
                    for (var c in aKeyPkgCPL) {
                        if (aKeyPkgCPL[c]?.CPLUUID) {
                            aKeyPkgCPLUUID.push(aKeyPkgCPL[c]?.CPLUUID);
                            const assetvault = await SELECT.one.from(CplList_Local).where({ LinkedCPLUUID: aKeyPkgCPL[c]?.CPLUUID })
                            aKeyPkgCTT.push(assetvault?.LinkedCTT)
                        }
                    }
                    if (aKeyPkgCTT?.length) { //RULE 9.1
                        sKeyPkgCTTs = aKeyPkgCTT?.map((u) => { return u ? u : false }).join(`,`);
                        oContentData.to_Item[i].CTT = sKeyPkgCTTs;
                        await updateItemTextForSalesOrder(req, "Z003", sKeyPkgCTTs, oResponseStatus, oSalesOrderItem, oContentData);
                    }
                    if (aKeyPkgCPLUUID?.length) { //RULE 9.2
                        sKeyPkgCPLUUIDs = aKeyPkgCPLUUID?.map((u) => { return u ? u : false }).join(`,`);
                        oContentData.to_Item[i].CPLUUID = sKeyPkgCPLUUIDs;
                        await updateItemTextForSalesOrder(req, "Z005", sKeyPkgCPLUUIDs, oResponseStatus, oSalesOrderItem, oContentData);
                    }
                }
                else { //Content Order item
                    sPackageUUID = oContentPackage?.PackageUUID;
                    sPackageName = oContentPackage?.PackageName;
                    oContentData.to_Item[i].DistroSpecPackageID = oContentPackage?.PackageUUID;
                    oContentData.to_Item[i].DistroSpecPackageName = oContentPackage?.PackageName;
                    if (oAssetvault?.KrakenTitleID) { //RULE 9.3
                        await updateItemTextForSalesOrder(req, "Z006", sContentPkgCTTs, oResponseStatus, oSalesOrderItem, oContentData); //RULE 9.3
                    }
                    var aFinalCPLs = [], aFinalCTTs = [];
                    for (var c in aContentPkgCPL) {
                        var aDCPDet = aContentPkgCPL[c];
                        var aLinkedCPLUUIDs = aContentPkgCPL[c]?.to_DCPDetail?.map((item) => { return item.LinkedCPLUUID });
                        var aCTTs = aContentPkgCPL[c]?.to_DCPDetail?.map((item) => { return item.LinkedCTT });

                        if (aLinkedCPLUUIDs?.length) {
                            aFinalCPLs = aFinalCPLs?.length ? [...aFinalCPLs, ...aLinkedCPLUUIDs] : [...aLinkedCPLUUIDs];
                        }
                        if (aCTTs?.length) {
                            aFinalCTTs = aFinalCTTs?.length ? [...aFinalCTTs, ...aLinkedCPLUUIDs] : [...aLinkedCPLUUIDs];
                        }
                        // if(aContentPkgCPL[c]?.LinkedCTT){
                        //     aContentPkgCTT.push(aContentPkgCPL[c]?.LinkedCTT);
                        // }
                    }
                    if (aFinalCTTs?.length) { //RULE 9.1
                        sContentPkgCTTs = aFinalCTTs?.map((u) => { return u ? u : false }).join(`,`);
                        oContentData.to_Item[i].CTT = sContentPkgCTTs;
                        await updateItemTextForSalesOrder(req, "Z003", sContentPkgCTTs, oResponseStatus, oSalesOrderItem, oContentData);
                    }
                    if (aFinalCPLs?.length) { //RULE 9.2
                        sContentPkgCPLUUIDs = aFinalCPLs?.map((u) => { return u ? u : false }).join(`,`);
                        oContentData.to_Item[i].CPLUUID = sContentPkgCPLUUIDs;
                        await updateItemTextForSalesOrder(req, "Z005", sContentPkgCPLUUIDs, oResponseStatus, oSalesOrderItem, oContentData);
                    }
                }
                if (distroSpecData) { //RULE 9.4, 9.7
                    await updateItemTextForSalesOrder(req, "Z008", `${distroSpecData?.DistroSpecID}`, oResponseStatus, oSalesOrderItem, oContentData);
                    await updateItemTextForSalesOrder(req, "Z011", distroSpecData?.Title_Product, oResponseStatus, oSalesOrderItem, oContentData);
                }
                await updateItemTextForSalesOrder(req, "Z009", sPackageUUID, oResponseStatus, oSalesOrderItem, oContentData); //RULE 9.5
                await updateItemTextForSalesOrder(req, "Z010", sPackageName, oResponseStatus, oSalesOrderItem, oContentData); //RULE 9.6
                if (sStudio) { //RULE 9.8              
                    var oBupa = await s4h_bp_Txn.run(SELECT.one.columns(['BusinessPartnerFullName']).from(S4H_BuisnessPartner).where({ BusinessPartner: sStudio }));
                    var StudioName = oBupa?.BusinessPartnerFullName;
                    if (StudioName) { //RULE 9.8
                        await updateItemTextForSalesOrder(req, "Z012", StudioName, oResponseStatus, oSalesOrderItem, oContentData);
                    }
                }
                if (oSalesOrderItem?.AdditionalMaterialGroup1 && sPackageName) { //RULE 9.9
                    var oProdGroup = await s4h_prodGroup.run(SELECT.one.from(S4_ProductGroupText).where({ MaterialGroup: oSalesOrderItem?.AdditionalMaterialGroup1, Language: 'EN' }));
                    if (oProdGroup) {
                        await updateItemTextForSalesOrder(req, "Z002", `${sPackageName} ${oProdGroup?.MaterialGroupName}`, oResponseStatus, oSalesOrderItem, oContentData);
                    }
                }
                Object.assign(oContentData.to_Item[i], oSalesOrderItem); //Assigining updated field name values back

                oContentData.to_Item[i].ShippingType_ID = oSalesOrderItem.ShippingType;

                oContentData.to_Item[i]["KeyStartTime"] = oStudioKeyData?.KeyStartTime;
                oContentData.to_Item[i]["KeyEndTime"] = oStudioKeyData?.KeyEndTime;
                oContentData.to_Item[i]["InitialKeyDuration"] = oStudioKeyData?.InitialKeyDuration;
                oContentData.to_Item[i]["NextKeyDuration"] = oStudioKeyData?.NextKeyDuration;
                oContentData.to_Item[i]["OffsetEPD"] = oStudioKeyData?.OffsetEPD;
                oContentData.to_Item[i]["InferKeyContentOrder"] = oStudioKeyData?.InferKeyContentOrder;
                oContentData.to_Item[i]["AggregateKey"] = oStudioKeyData?.AggregateKey;
                oContentData.to_Item[i]["ProcessKDMS"] = oStudioKeyData?.ProcessKDMS;
                oContentData.to_Item[i]["ProcessScreeningKDMS"] = oStudioKeyData?.ProcessScreeningKDMS;
                oContentData.to_Item[i]["MaxKDMSDuration"] = oStudioKeyData?.MaxKDMSDuration;
                oContentData.to_Item[i]["StudioHoldOverRule"] = oStudioKeyData?.StudioHoldOverRule;
                oContentData.to_Item[i]["SalesTerritory"] = oStudioKeyData?.SalesTerritory_SalesDistrict;

                delete oContentData.to_Item[i]?.ShippingType;
            } //ITERATING ITEM END
            // oContentData._Partner = [];
            // for (var part in oSalesOrder.to_Partner) {
            //     Object.assign(oContentData.to_Partner, oSalesOrder.to_Partner);
            // }
            oContentData.to_Partner = oSalesOrder.to_Partner
            // Object.assign(oRecordsToBePosted, oContentData);
            if (oSalesOrder.RequestedDeliveryDate) {
                var iTime = parseInt(oSalesOrder.RequestedDeliveryDate.substring(6, oSalesOrder.RequestedDeliveryDate.length - 2));
                var sDate = new Date(iTime).toISOString().split("T")[0];
                oContentData.RequestedDeliveryDate = sDate;
            }
            // await INSERT.into(BookingSalesOrder).entries(oRecordsToBePosted);
            // aResponseStatus.push({
            //     "message": `| For Booking ID: ${oContentData.BookingID} - Sales Order: ${oSalesOrder?.SalesOrder}, Booking entry created |`,
            //     "status": "S"
            // });
            return oContentData;
        };
        const performPrioritySortAndValidityCheck = async (aPackages, oContentData, distroSpecData) => {
            aPackages?.sort(function (a, b) {
                return a.Priority - b.Priority;
            });
            var dPlayStartDate = new Date(oContentData.PlayStartDate.replace(/-/g, '/'));
            var dPlayEndDate = new Date(oContentData.PlayEndDate.replace(/-/g, '/'));
            var aPackage = aPackages.filter((pkg) => {
                var sDistValidFrom = pkg.ValidFrom;
                var sDistValidTo = pkg.ValidTo;
                sDistValidFrom = new Date(sDistValidFrom.replace(/-/g, '/'));
                sDistValidTo = new Date(sDistValidTo.replace(/-/g, '/'));
                return dPlayStartDate >= sDistValidFrom && dPlayEndDate <= sDistValidTo;
            });
            return aPackage;
        };
        this.on(['READ'], S4H_BusinessPartnerAddress, async (req) => {
            return s4h_bp_Txn.run(req.query);
        });
        this.on(['READ'], S4_SalesParameter, async (req) => {
            return s4h_salesparam_Txn.run(req.query);
        });
        this.on(['READ'], DCPMaterialMapping, async (req) => {
            return distrospec_Txn.run(req.query);
        });
        this.on(['READ'], S4_ProductGroupText, async (req) => {
            return s4h_prodGroup.run(req.query);
        });
        this.on("createMaccs", async (req, res) => {
            var uuid = uuidv4(), aInsertData = []; // Generate a unique ID
            try {
                var aRequests = req.data.Request;
                for (var index in aRequests) {
                    var aSelected = await SELECT.one.from(Maccs_Dchub).where({
                        cinemaId: aRequests[index].cinemaId,
                        customerRef: aRequests[index].customerRef,
                        quantity: aRequests[index].quantity
                    })
                    if (aSelected) {
                        var aRequestUpdated = await UPDATE(Maccs_Dchub).set(aRequests[index]).where({
                            cinemaId: aRequests.cinemaId,
                            customerRef: aRequests.customerRef,
                            quantity: aRequests.quantity
                        });
                    } else {
                        aInsertData.push(aRequests[index]);
                    }

                }
                var aRequestUpdated = await INSERT.into(Maccs_Dchub).entries(aInsertData);

                return aRequestUpdated;
            }
            catch (e) {
                req.error(502, uuid + "  " + e)
            }
        });
        this.on("createComscoreHollywood", async (req, res) => {
            var uuid = uuidv4(); // Generate a unique ID
            var aRequests = req.data.Request;
            try {

                var aSelected = await SELECT.from(TheatreOrderRequest).where({
                    StudioID: aRequests.StudioID,
                    GenerateDate: aRequests.GenerateDate,
                    Version: aRequests.Version,
                    ServerName: aRequests.ServerName,
                    DataBaseName: aRequests.DataBaseName
                })
                console.log(aSelected)
                if (aSelected.length != 0) {

                    var aUpdate = JSON.parse(JSON.stringify(aRequests));
                    delete aUpdate.Theatre_Ass;
                    delete aUpdate.Content_Ass;
                    delete aUpdate.MediaOrder_Ass;

                    var aRequestUpdated = await UPDATE(TheatreOrderRequest).set(aUpdate).where({
                        StudioID: aRequests.StudioID,
                        GenerateDate: aRequests.GenerateDate,
                        Version: aRequests.Version,
                        ServerName: aRequests.ServerName,
                        DataBaseName: aRequests.DataBaseName
                    });

                    console.log("Update")
                } else {
                    var aRequestUpdated = await INSERT.into(TheatreOrderRequest).entries(aRequests);
                    console.log("Inset")
                }
                return aRequestUpdated;
            }
            catch (e) {
                req.error(502, uuid + "  " + e)
            }

        });
        this.on("createDisneyOFE", async (req, res) => {
            var uuid = uuidv4(); // Generate a unique ID
            var aRequests = req.data.Request;
            try {
                var aSelected = await SELECT.from(OrderRequest).where({
                    OrderID: aRequests.OrderID,
                    ContentOrderID: aRequests.ContentOrderID
                })
                if (aSelected.length != 0) {

                    var aUpdate = JSON.parse(JSON.stringify(aRequests));
                    delete aUpdate.DeliveryAddress
                    delete aUpdate.PhysicalAddress
                    delete aUpdate.Package
                    delete aUpdate.Vendor

                    var aRequestUpdated = await UPDATE(OrderRequest).set(aUpdate).where({
                        OrderID: aRequests.OrderID,
                        ContentOrderID: aRequests.ContentOrderID
                    });
                } else {
                    var aRequestUpdated = await INSERT.into(OrderRequest).entries(aRequests);
                }
                return aRequestUpdated;
            }
            catch (e) {
                req.error(502, uuid + "  " + e)
            }
        });
        this.on("createDisneyOFEKey", async (req, res) => {
            var uuid = uuidv4(); // Generate a unique ID
            var aRequests = req.data.Request;
            try {
                var aSelected = await SELECT.one.from(OFEOrders).where({
                    orderId: aRequests.orderId,
                    studioId: aRequests.studioId,
                    generatedDate: aRequests.generatedDate
                })
                if (aSelected) {
                    var aUpdate = JSON.parse(JSON.stringify(aRequests));
                    delete aUpdate.keyOrders;
                    var aRequestUpdated = await UPDATE(OFEOrders).set(aUpdate).where({
                        orderId: aRequests.orderId,
                        studioId: aRequests.studioId,
                        generatedDate: aRequests.generatedDate
                    });
                } else {
                    var aRequestUpdated = await INSERT.into(OFEOrders).entries(aRequests);
                }
                return aRequestUpdated;
            }
            catch (e) {
                req.error(502, uuid + "  " + e)
            }
        });
        const createSalesOrder = async (req, sContentIndicator) => {
            var aBookingIDs = req.data?.bookingIDs, sErrorMessage, updateQuery = [], oPayLoad = {},
                aResponseStatus = [], hanaDBTable = StudioFeed;
            if (!aBookingIDs?.length) {
                req.reject(400, "Booking ID was not sent for processing");
                return;
            }
            else if (!aConfig) {
                req.reject(400,
                    `Parameter table not configured. Maintain the Following entries:
                        Material_GT24
                        Material_LT24
                        SoldTo_SPIRITWORLD
                        SalesOrg_SPIRITWORLD
                        DistChannel_SPIRITWORLD
                        Division_SPIRITWORLD
                        SOType_SPIRITWORLD
                        PartnerFunc_SPIRITWORLD`);
                return;
            }

        };
        this.on(['READ'], S4_Parameters, async (req) => {
            return s4h_param_Txn.run(req.query);
        });

        this.on(['READ'], S4_Plants, req => {
            return s4h_planttx.run(req.query);
        });
        this.on(['READ'], S4_ShippingConditions, req => {
            return s4h_shipConditions_Txn.run(req.query);
        });
        this.on(['READ'], S4_ShippingType_VH, req => {
            return s4h_shtypev2_vh_Txn.run(req.query);
        });
        this.on(['READ'], S4_ShippingPoint_VH, req => {
            return s4h_shpointv2_vh_Txn.run(req.query);
        });
        this.on(['READ'], ProductionOrder, req => {
            return s4h_production_order.run(req.query);
        });

        const updateItemTextForSalesOrder = async (req, sType, sText, oResponseStatus, oSalesOrderItem, oContentData) => {
            var oItemText =
            {
                "SalesOrder": oSalesOrderItem.SalesOrder,
                "SalesOrderItem": oSalesOrderItem.SalesOrderItem,
                "Language": "EN",
                "LongTextID": sType,
                "LongText": sText
            };
            await s4h_so_Txn.send({
                method: 'POST',
                path: `/SalesOrderItem/${oSalesOrderItem.SalesOrder}/${oSalesOrderItem.SalesOrderItem}/_ItemText`,
                data: oItemText
            }).catch((err) => {
                oResponseStatus.warning.push({
                    "message": `| For Booking ID: ${oContentData.BookingID}-Sales Order: ${oSalesOrderItem?.SalesOrder}-${oSalesOrderItem?.SalesOrderItem}, ${sType} Item text creation failed with the error: ${err.message} `,
                    "errorMessage": err.message
                });
            }).then((result) => {
                if (result) {
                    oResponseStatus.success.push({
                        "message": `| For Booking ID: ${oContentData.BookingID}-Sales Order: ${oSalesOrderItem?.SalesOrder}-${oSalesOrderItem?.SalesOrderItem}, ${sType} Item Text is created |`
                    });
                }
            });
        }
        this.on("test", async (req, res) => {

        });
        this.on("READ", S4H_SOHeader, async (req, res) => {
            // await s4h_so_Txn.run(SELECT.one.from(S4H_SOHeader));

            // let distroSpecData = await SELECT.one.from(DistroSpec_Local);
            return s4h_so_Txn.get(req.query);
        });
        this.on(['READ'], S4H_SOHeader_V2, req => {
            return s4h_sohv2_Txn.run(req.query);
        });
        this.on("READ", S4H_SalesOrderItem_V2, req => {
            return s4h_sohv2_Txn.get(req.query);
        });
        this.on("READ", S4H_BuisnessPartner, async (req, res) => {
            await s4h_so_Txn.run(SELECT.one.from(S4H_SOHeader));
        });
        this.on("READ", S4H_CustomerSalesArea, async (req, res) => {
            var query = `/A_CustomerSalesArea?$filter=Customer eq '${sSoldToCustomer}' and SalesOrganization eq  '${SalesOrganization}' and DistributionChannel eq '${DistributionChannel}' and Division eq '${Division}'&$expand=to_PartnerFunction`;
            return s4h_bp_Txn.get(query);
            // var aSalesArea = await s4h_bp_Txn.run(
            //     SELECT.from(S4H_CustomerSalesArea, async (custSalesArea)=>{
            //         custSalesArea.Customer,
            //         custSalesArea.SalesOrganization,
            //         custSalesArea.DistributionChannel,
            //         custSalesArea.Division,
            //         custSalesArea.to_PartnerFunction
            //         // , async (partnerFunc)=>{
            //         //     // partnerFunc.BPCustomerNumber,
            //         //     // partnerFunc.CustomerPartnerDescription,
            //         //     // partnerFunc.PartnerFunction
            //         //     partnerFunc('*')
            //         // }
            //     }).where({"sSoldToCustomer": "1000011", 
            //     "SalesOrganization": "1170",
            //     "DistributionChannel": "20",
            //     "Division": "20"}));
            //     // console.log("Test");
            //     return aSalesArea;
        });

        this.on(['READ'], Products, async req => {
            return s4h_products_Crt.run(req.query);
        });

        this.on(['READ'], ProductDescription, async req => {
            return s4h_products_Crt.run(req.query);
        });
        this.on(['READ'], ProductBasicText, async req => {
            return s4h_products_Crt.run(req.query);
        });

        this.on(['READ'], MaterialDocumentHeader, async req => { //s4h_bp_vh
            return s4h_material_read.run(req.query);
        });
        this.on(['READ'], MaterialDocumentItem, async req => { //s4h_bp_vh
            return s4h_material_read.run(req.query);
        });
        this.on(['READ'], S4H_BusinessPartnerapi, async req => { //s4h_bp_vh
            return s4h_bp_vh.run(req.query);
        });
        // this.before('CREATE', 'Titles', async (req) => {
        //     const lastEntry = await SELECT.one.from('Titles').orderBy('LocalTitleId desc');

        //     let newId = 'LT-0001'; // Default if no previous records
        //     if (lastEntry && lastEntry.LocalTitleId) {
        //         let lastNumber = parseInt(lastEntry.LocalTitleId.replace('LT-', ''), 10);
        //         newId = `LT-${String(lastNumber + 1).padStart(4, '0')}`;
        //     }

        //     req.data.LocalTitleId = newId;
        // });   

        this.on("createProduct", async (req) => {
            try {
                const input = req.data.input; // Extract input data from request

                // Make a POST call to the external API              
                const response = await s4h_products_Crt.run(INSERT.into(Products).entries(input))

                return response;
            } catch (error) {
                req.error(500, `Product creation failed: ${error.message}`);
            }
        });

        this.on("deleteProduct", async (req) => {
            try {
                const input = req.data.input.toString(); // Extract input data from request

                // Make a POST call to the external API              
                const response = await s4h_products_Crt.run(UPDATE(Products).set({ IsMarkedForDeletion: true }).where({ Product: input }))

                //return "Succesfully Deleted";
            } catch (error) {
                req.error(500, `Product creation failed: ${error.message}`);
            }
        });

        this.on("editProduct", async (req) => {
            try {
                const input = req.data.input; // Extract input data from request

                // Make a POST call to the external API              
                //const response = await s4h_products_Crt.run(UPDATE(ProductBasicText).set({ LongText: input.to_ProductBasicText[0].LongText }).where({ Product: input.Product, Language: 'EN' }));
                const response1 = await s4h_products_Crt.run(UPDATE(ProductDescription).set({ ProductDescription: input.to_Description[0].ProductDescription }).where({ Product: input.Product, Language: 'EN' }));
                const response = await s4h_products_Crt.run(UPDATE(ProductBasicText).set({ LongText: input.to_ProductBasicText[0].LongText }).where({ Product: input.Product, Language: 'EN' }));
                // var sData =
                // {
                //     "LongText": "Testing"
                // }
                // var jData = JSON.stringify(sData);
                // const headers = {
                //     "Content-Type": 'application/json',
                //     "Accept": '*/*',
                // };
                // var oEdit = await s4h_products_Crt.send({
                //     method: "PATCH",
                //     path: "/A_ProductBasicText(Product='5962',Language='EN')", ///A_ProductBasicText(Product='{Product}',Language='{Language}')
                //     data : sData,
                //     headers:headers                        
                // });
                return "Succesfully Edited";
            } catch (error) {
                req.error(500, `Product creation failed: ${error.message}`);
            }
        });

        this.on("downloadFormADS", async (req, res) => {
            // try {
            //     var form_name = req.data.form;
            //     var query = `/v1/forms/${form_name}`;
            //     var oFormObject = await deluxe_adsrestapi.get(query);
            //     var sXMLTemplate = oFormObject.templates[0].xdpTemplate;
            //     var sProduct = req.data.Product;

            //     var oAssetVault = await SELECT.one.from('DistributionService.DistributionDcp', (dist)=>{
            //         dist.Title,
            //         dist.VersionDescription,
            //         dist.KrakenTitleID,
            //         dist.AssetMapFileSize,
            //         dist.AssetMapID
            //         dist.AssetMapIDDescription
            //         dist.AudioFormats
            //         dist.CreatedinSAP
            //         dist.DCP,
            //         dist.ProjectID,
            //         dist._Items((items)=>{
            //             items.LinkedCTT,
            //             items.StartOfCrawl,
            //             items.LinkedCPLUUID,
            //             items.RunTime,
            //             items.StartOfCredits,
            //             items.DcpProjectID
            //         })
            //     }).where({DCP: sProduct});

            //     const jsonData = {
            //           "AssetMapFileSize": oAssetVault.AssetMapFileSize,
            //           "AssetMapID": oAssetVault.AssetMapID,
            //           "AssetMapIDDescription": oAssetVault.AssetMapIDDescription,
            //           "AudioFormats": oAssetVault.AudioFormats,
            //           "CreatedinSAP": true,
            //           "DCP": oAssetVault.DCP,
            //           "ProjectID": oAssetVault.ProjectID,
            //           "VersionDescription": oAssetVault.VersionDescription,
            //           "DcpProjectID": oAssetVault._Items[0].DcpProjectID,
            //           "LinkedCPLUUID": oAssetVault._Items[0].LinkedCPLUUID,
            //           "LinkedCTT": oAssetVault._Items[0].LinkedCTT,
            //           "RunTime": oAssetVault._Items[0].RunTime,
            //           "StartOfCrawl": oAssetVault._Items[0].StartOfCrawl,
            //           "StartOfCredits": oAssetVault._Items[0].StartOfCredits,
            //       }


            //     // Wrap everything in a single root element to ensure well-formed XML
            //     const wrappedJson = { Form58: jsonData };

            //     // Convert JSON to XML (Ensure single root)
            //     const xmlData = xmljs.js2xml(wrappedJson, { compact: true, spaces: 4 });

            //     // Encode XML to Base64
            //     const base64EncodedXml = Buffer.from(xmlData, "utf-8").toString("base64");

            //     const headers = {
            //         "Content-Type": 'application/json',
            //         "accept": 'application/json',
            //     };

            //     // Print PDF code logic
            //     var sDownloadPDFurl = "/v1/adsRender/pdf?TraceLevel=0"

            //     const data = {
            //         "xdpTemplate": sXMLTemplate,
            //         "xmlData": base64EncodedXml,
            //         "formType": "print",
            //         "formLocale": "en_US",
            //         "taggedPdf": 1,
            //         "embedFont": 0,
            //         "changeNotAllowed": false,
            //         "printNotAllowed": false
            //     };

            //     var oPrintForm = await deluxe_adsrestapi.send({
            //         method: "POST",
            //         path: sDownloadPDFurl,
            //         data,
            //         headers
            //     });

            //     return oPrintForm.fileContent;
            // }
            // catch (e) {
            //     req.error(502, e)
            // }

            try {
                var form_name = req.data.form;
                var query = `/v1/forms/${form_name}`;
                var oFormObject = await deluxe_adsrestapi.get(query);
                var sXMLTemplate = oFormObject.templates[0].xdpTemplate;

                // var DCPBarcode = req?.data?.DCPBarcode;
                var DCPBarcode = req?.data?.Product;
                var Title, Studio, VersionDescription, TotalSize, RatingCount, FeatureCount, TrailerCount, Content = [];
                if (DCPBarcode) {
                    var oAssetVault = await SELECT.one.from('DistributionService.DistributionDcp', (dist) => {
                        dist.Title,
                            dist.VersionDescription,
                            dist.KrakenTitleID,
                            dist.AssetMapFileSize,
                            dist._Items((items) => {
                                items.LinkedCTT,
                                    items.StartOfCrawl,
                                    items.LinkedCPLUUID,
                                    items.RunTime,
                                    items.StartOfCredits
                            })
                    }).where({ DCP: DCPBarcode });

                    var aItems = oAssetVault?._Items;
                    var aFeatureItems = aItems?.filter((item) => {
                        return item?.LinkedCTT?.toUpperCase().includes('FTR');
                    });

                    //FOLLOWING DELIMITATION OF DURATION IS REQUIRED TO SHOW IT PROPERLY IN PDF. DON'T ADD OR DELETE MORE SPACE THERE
                    await aFeatureItems?.forEach(element => {
                        Content.push({
                            "ContentText": `${element.LinkedCTT}
Duration:${element.RunTime ? element.RunTime : '-'} Start Of Credits:${element.StartOfCredits ? element.StartOfCredits : '-'} Crawl:${element.StartOfCrawl ? element.StartOfCrawl : '-'}`
                        });
                    });
                    FeatureCount = aFeatureItems?.length;

                    var aRatingItems = aItems?.filter((item) => {
                        return item?.LinkedCTT?.toUpperCase().includes('RTG');
                    });
                    await aRatingItems?.forEach(element => {
                        Content.push({
                            "ContentText": `${element.LinkedCTT}
Duration:${element.RunTime ? element.RunTime : '-'} Start Of Credits:${element.StartOfCredits ? element.StartOfCredits : '-'} Crawl:${element.StartOfCrawl ? element.StartOfCrawl : '-'}`
                        });
                    });
                    RatingCount = aRatingItems?.length;

                    var aTrailerItems = aItems?.filter((item) => {
                        return item?.LinkedCTT?.toUpperCase().includes('TRL');
                    });
                    await aTrailerItems?.forEach(element => {
                        Content.push({
                            "ContentText": `${element.LinkedCTT}
Duration:${element.RunTime ? element.RunTime : '-'} Start Of Credits:${element.StartOfCredits ? element.StartOfCredits : '-'} Crawl:${element.StartOfCrawl ? element.StartOfCrawl : '-'}`
                        });
                    });
                    TrailerCount = aTrailerItems?.length;

                    VersionDescription = oAssetVault?.VersionDescription;
                    var Product = oAssetVault?.Title;
                    if (Product) {
                        var oProdLongText = await s4h_products_Crt.run(SELECT.one.from(ProductBasicText).where({ Product: Product, Language: 'EN' }));
                        Title = oProdLongText?.LongText;
                    }
                    var convertedBytes = await convertBytes(oAssetVault?.AssetMapFileSize);
                    TotalSize = convertedBytes;

                    var distroSpecData = await SELECT.one.from('DistributionService.DistroSpec', (dist) => {
                        dist.DistroSpecUUID,
                            dist.DistroSpecID,
                            dist.Title_Product,
                            dist.Name,
                            dist.to_StudioKey((studio) => {
                                studio.Studio_BusinessPartner
                            })
                    }).where({ Title_Product: DCPBarcode });
                    var sBupa = distroSpecData?.to_StudioKey?.[0]?.Studio_BusinessPartner;

                    if (sBupa) {
                        var oBupa = await s4h_bp_Txn.run(SELECT.one.columns(['BusinessPartnerFullName']).from(S4H_BuisnessPartner).where({ BusinessPartner: sBupa }));
                        Studio = oBupa?.BusinessPartnerFullName;
                    }
                }
                const formData = {
                    Form: {
                        HDDLabelNode: {
                            Title: Title,
                            DCPBarcode: DCPBarcode,
                            VersionDescription: VersionDescription,
                            Studio: Studio,
                            TotalSize: TotalSize,
                            TrainingCount: TrailerCount,
                            FeatureCount: FeatureCount,
                            RatingCount: RatingCount,
                            Content: { "ContentNode": Content }
                        }
                    }
                };

                // Convert JSON to XML (Ensure single root)
                const xmlData = xmljs.js2xml(formData, { compact: true, spaces: 4 });

                // Encode XML to Base64
                const base64EncodedXml = Buffer.from(xmlData, "utf-8").toString("base64");

                const headers = {
                    "Content-Type": 'application/json',
                    "accept": 'application/json',
                };

                // Print PDF code logic
                var sDownloadPDFurl = "/v1/adsRender/pdf?TraceLevel=0"

                const data = {
                    "xdpTemplate": sXMLTemplate,
                    "xmlData": base64EncodedXml,
                    "formType": "print",
                    "formLocale": "en_US",
                    "taggedPdf": 1,
                    "embedFont": 0,
                    "changeNotAllowed": false,
                    "printNotAllowed": false
                };

                var oPrintForm = await deluxe_adsrestapi.send({
                    method: "POST",
                    path: sDownloadPDFurl,
                    data,
                    headers
                });

                return oPrintForm.fileContent;
            }
            catch (e) {
                req.error(502, e)
            }
        });

        this.on("formGR_LABEL", async (req, res) => {

            try {
                var form_name = req.data.form;
                var query = `/v1/forms/${form_name}`;
                var oFormObject = await deluxe_adsrestapi.get(query);
                var sXMLTemplate = oFormObject.templates[0].xdpTemplate;
                var oMaterialDocument = req?.data?.Material;

                // Fetch the selected Material Document with expanded MaterialDocumentItems
                const materialDocument = await s4h_material_read.run(
                    SELECT.from(MaterialDocumentHeader, (header) => {
                        header.PostingDate,
                        header.to_MaterialDocumentItem();
                    }).where({ MaterialDocument: oMaterialDocument.MaterialDocument, MaterialDocumentYear: oMaterialDocument.MaterialDocumentYear })
                );

                // If no document found, return empty response
                if (!materialDocument.length) {
                    console.log("No material document found for", sMaterialDocument);
                    return;
                }

                // Extract unique materials from the selected document
                const materialSet = new Set();
                materialDocument[0].to_MaterialDocumentItem.forEach((item) => {
                    materialSet.add(item.Material);
                });

                const materialsArray = Array.from(materialSet);

                // Fetch product details for the extracted materials, including extra fields
                const productData = await s4h_products_Crt.run(
                    SELECT.from(Products, (product) => {
                        product.ProductManufacturerNumber,
                            product.YY1_CustomerDes_PRD,
                            product.YY1_matcust_PRD,
                            product.Product,
                            product.to_Description();
                    })
                        .where({ Product: materialsArray })
                );

                // Create a mapping of materials to their product details
                const productMap = {};
                productData.forEach((product) => {
                    productMap[product.Product] = {
                        ProductDescription: product.ProductDescription,
                        ProductManufacturerNumber: product.ProductManufacturerNumber,
                        YY1_CustomerDes_PRD: product.YY1_CustomerDes_PRD,
                        YY1_matcust_PRD: product.YY1_matcust_PRD
                    };
                });

                // Construct GRMatItemNode array with mapped product details
                const GRMatItemNode = materialDocument[0].to_MaterialDocumentItem.reduce((accum, item) => {
                    if (item.MaterialDocumentItem == oMaterialDocument.MaterialDocumentItem) {
                        accum.push({
                            AccountAssignmentCategory: oMaterialDocument.MaterialDocument,
                            AccountingDocumentCreationDate: oMaterialDocument.MaterialDocument,
                            BaseUnit: "EA",
                            Batch: "BSH",
                            CostCenter: oMaterialDocument.MaterialDocument,
                            CountryOfOrigin: oMaterialDocument.MaterialDocument,
                            CountryOfOriginName: oMaterialDocument.MaterialDocument,
                            DebitCreditCode: oMaterialDocument.MaterialDocument,
                            DeliveryQuantityUnit: oMaterialDocument.MaterialDocument,
                            DocumentItemText: productMap[item.Material]?.ProductDescription || "Unknown Material",
                            EntryUnit: "EA",
                            Equipment: oMaterialDocument.MaterialDocument,
                            FixedAsset: "",
                            GoodsMovementRefDocType: "",
                            GoodsMovementType: "",
                            GoodsReceiptAcctAssgmt: "",
                            GoodsReceiptAcctAssgmtText: "",
                            GoodsReceiptPostingDate: materialDocument[0].PostingDate,
                            GoodsReceiptQtyInOrderUnit: 1020.0,
                            InternationalArticleNumber: "",
                            InternationalArticleNumberCat: "",
                            InventorySpecialStockType: "",
                            InventoryStockType: "",
                            ItemVolumeUnit: "",
                            Language: "",
                            MaintOrderOperationCounter: "",
                            MaintOrderRoutingNumber: "",
                            ManufactureDate: "02-02-2025",
                            ManufactureMaterial: item.Material,
                            ManufacturingOrder: "",
                            MasterFixedAsset: "",
                            Material: item.Material,
                            MaterialDocument: item.MaterialDocument,
                            MaterialDocumentItem: item.MaterialDocumentItem,
                            MaterialDocumentYear: item.MaterialDocumentYear,
                            MaterialGrossWeight: 13.0,
                            MaterialName: productMap[item.Material]?.ProductDescription || "Unknown Material",
                            MaterialNetWeight: 12.0,
                            MaterialSizeOrderDimensionDesc: "",
                            MaterialVolume: 0.0,
                            MaterialWeightUnit: "",
                            NumberOfLabelsToBePrinted: "2",
                            NumberOfSlipsToBePrinted: "1",
                            OrderPriceUnit: "EA",
                            OrderQuantityUnit: "1500",
                            Plant: "AT21",
                            // ProductDescription: productMap[item.Material]?.ProductDescription || "",
                            // ProductManufacturerNumber: productMap[item.Material]?.ProductManufacturerNumber || "",
                            // YY1_CustomerDes_PRD: productMap[item.Material]?.YY1_CustomerDes_PRD || "",
                            // YY1_matcust_PRD: productMap[item.Material]?.YY1_matcust_PRD || ""
                        })
                    }
                    return accum
                }, []);

                // Construct final formData object
                const formData = {
                    Form: {
                        GRHeaderNode: {
                            GoodsReceiptHeadlinePrint: oMaterialDocument.MaterialDocument,
                            Language: "EN",
                            Client :productData[0]?.YY1_CustomerDes_PRD,
                            Product: oMaterialDocument.MaterialDocument,
                            MaterialDocument: oMaterialDocument.MaterialDocument,
                            MaterialDocumentHeaderText: productData[0]?.YY1_CustomerDes_PRD,
                            MaterialDocumentItem: oMaterialDocument.MaterialDocument,
                            MaterialDocumentYear: oMaterialDocument.MaterialDocument,
                            PrinterIsCapableBarCodes: productData[0]?.ProductManufacturerNumber == '' ? productData[0]?.to_Description[0].ProductDescription : productData[0]?.ProductManufacturerNumber, // Barcode text
                            ReferenceDocument: productData[0]?.YY1_CustomerDes_PRD,
                            GRMI: {
                                GRMatItemNode
                            }
                        }
                    }
                };

                console.log(JSON.stringify(formData, null, 2));

                // const formData = {
                //     Form:
                //     {
                //         "GRHeaderNode": {
                //             "GoodsReceiptHeadlinePrint": sMaterialDocument,
                //             "Language": "EN",
                //             "Product": sMaterialDocument,
                //             "MaterialDocument": sMaterialDocument,
                //             "MaterialDocumentHeaderText": "",
                //             "MaterialDocumentItem": sMaterialDocument,
                //             "MaterialDocumentYear": sMaterialDocument,
                //             "PrinterIsCapableBarCodes": sMaterialDocument, //this is the barcode text
                //             "ReferenceDocument": "",
                //             "GRMI": {
                //                 "GRMatItemNode": [
                //                     {
                //                         "AccountAssignmentCategory": sMaterialDocument,
                //                         "AccountingDocumentCreationDate": sMaterialDocument,
                //                         "BaseUnit": "EA",
                //                         "Batch": "BSH",
                //                         "CostCenter": sMaterialDocument,
                //                         "CountryOfOrigin": sMaterialDocument,
                //                         "CountryOfOriginName": sMaterialDocument,
                //                         "DebitCreditCode": sMaterialDocument,
                //                         "DeliveryQuantityUnit": sMaterialDocument,
                //                         "DocumentItemText": sMaterialDocument,
                //                         "EntryUnit": "EA",
                //                         "Equipment": sMaterialDocument,
                //                         "FixedAsset": "",
                //                         "GoodsMovementRefDocType": "",
                //                         "GoodsMovementType": "",
                //                         "GoodsReceiptAcctAssgmt": "",
                //                         "GoodsReceiptAcctAssgmtText": "",
                //                         "GoodsReceiptPostingDate": "",
                //                         "GoodsReceiptQtyInOrderUnit": 1020.0,
                //                         "InternationalArticleNumber": "",
                //                         "InternationalArticleNumberCat": "",
                //                         "InventorySpecialStockType": "",
                //                         "InventoryStockType": "",
                //                         "ItemVolumeUnit": "",
                //                         "Language": "",
                //                         "MaintOrderOperationCounter": "",
                //                         "MaintOrderRoutingNumber": "",
                //                         "ManufactureDate": "02-02-2025",
                //                         "ManufactureMaterial": sMaterialDocument,
                //                         "ManufacturingOrder": "",
                //                         "MasterFixedAsset": "",
                //                         "Material": sMaterialDocument,
                //                         "MaterialDocument": sMaterialDocument,
                //                         "MaterialDocumentItem": sMaterialDocument,
                //                         "MaterialDocumentYear": "",
                //                         "MaterialGrossWeight": 13.0,
                //                         "MaterialName": sMaterialDocument,
                //                         "MaterialNetWeight": 12.0,
                //                         "MaterialSizeOrderDimensionDesc": "",
                //                         "MaterialVolume": 0.0,
                //                         "MaterialWeightUnit": "",
                //                         "NumberOfLabelsToBePrinted": "2",
                //                         "NumberOfSlipsToBePrinted": "1",
                //                         "OrderPriceUnit": "EA",
                //                         "OrderQuantityUnit": "1500",
                //                         "Plant": "AT21"
                //                     }
                //                 ]
                //             }
                //         }
                //     }
                // };

                // Convert JSON to XML (Ensure single root)
                const xmlData = xmljs.js2xml(formData, { compact: true, spaces: 4 });

                // Encode XML to Base64
                const base64EncodedXml = Buffer.from(xmlData, "utf-8").toString("base64");

                const headers = {
                    "Content-Type": 'application/json',
                    "accept": 'application/json',
                };

                // Print PDF code logic
                var sDownloadPDFurl = "/v1/adsRender/pdf?TraceLevel=0"

                const data = {
                    "xdpTemplate": sXMLTemplate,
                    "xmlData": base64EncodedXml,
                    "formType": "print",
                    "formLocale": "en_US",
                    "taggedPdf": 1,
                    "embedFont": 0,
                    "changeNotAllowed": false,
                    "printNotAllowed": false
                };

                var oPrintForm = await deluxe_adsrestapi.send({
                    method: "POST",
                    path: sDownloadPDFurl,
                    data,
                    headers
                });

                return oPrintForm.fileContent;
            }
            catch (e) {
                req.error(502, e)
            }
        });

        this.on("createContent", async (req, res) => {
            var aResult = await createBookingFeed(req, "C");
            return aResult;
        });
        this.on("createKey", async (req, res) => {
            var aResult = await createBookingFeed(req, "K");
            return aResult;
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

        async function convertBytes(bytes) {
          
            if (isNaN(bytes) || bytes < 0) {
              return 'Invalid Value';
            }
          
            if (bytes === 0) {
              return "0 Bytes";
            }
          
            var k = 1024;
            var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            var value = bytes / Math.pow(k, i);
            var result = value.toFixed(2) + " " + sizes[i];
          
            return result;
          }
        return super.init();
    }

}