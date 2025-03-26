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
        const { dcpcontent, dcpkey, S4H_SOHeader, S4H_BuisnessPartner, DistroSpec_Local, AssetVault_Local, S4H_CustomerSalesArea, BookingSalesOrder, BookingStatus,
            S4_Plants, S4_ShippingConditions, S4H_SOHeader_V2, S4H_SalesOrderItem_V2, ShippingConditionTypeMapping, Maccs_Dchub, S4_Parameters, CplList_Local,
            TheatreOrderRequest, S4_ShippingType_VH, S4_ShippingPoint_VH, OrderRequest, OFEOrders, Products, ProductDescription, ProductBasicText, MaterialDocumentHeader, ProductionOrder,
            StudioFeed, BusinessPartner} = this.entities;
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

        var deluxe_adsrestapi = await cds.connect.to("deluxe-ads-rest-api");

        var sSoldToCustomer = '1000055', SalesOrganization = '1170', DistributionChannel = '20', Division = '20';
        let aConfig = (await s4h_param_Txn.run(SELECT.from(S4_Parameters)));
        var sSoldToCustomer = aConfig?.find((e) => e.VariableName === 'SoldTo_SPIRITWORLD')?.VariableValue,
            SalesOrganization = aConfig?.find((e) => e.VariableName === 'SalesOrg_SPIRITWORLD')?.VariableValue,
            DistributionChannel = aConfig?.find((e) => e.VariableName === 'DistChannel_SPIRITWORLD')?.VariableValue,
            Division = aConfig?.find((e) => { return e.VariableName === 'Division_SPIRITWORLD' })?.VariableValue;
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
                    element.Origin_OriginID = "S";
                    if (!element.hasOwnProperty('SourceSystem')) {
                        error.Message = bundle.getText(`reqField`, ['Source System'])
                    }
                    else if (!element.hasOwnProperty('BookingID')) {
                        error.Message = bundle.getText(`reqField`, ['Booking ID'])
                    }
                    else if (!element.hasOwnProperty('Studio')) {
                        error.Message = bundle.getText(`reqField`, ['Studio'])
                    }
                    else if (!element.hasOwnProperty('Title')) {
                        error.Message = bundle.getText(`reqField`, ['Title'])
                    }
                    else if (!element.hasOwnProperty('RequestedDelivDate')) {
                        error.Message = bundle.getText(`reqField`, ['RequestedDelivDate'])
                    }
                    else if (!element.hasOwnProperty('OrderType')) {
                        error.Message = bundle.getText(`reqField`, ['OrderType'])
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
        this.on('createStudioFeeds', async (req, res) => {
            var data = req.data?.StudioFeed;
            var aResponse = await createStudioFeeds(req, data)

            req.reply({
                code: 201,
                message: aResponse
            });

        });
        const createStudioFeeds = async (req, aData) => {
            let recordsToBeInserted = [], recordsToBeUpdated = [], finalResult = [], successEntries = [], updateSuccessEntries = [], failedEntries = [], hanatable = dcpcontent;
            hanatable = StudioFeed;
            var data = aData;
            for (var i in data) {
                data[i].Status_ID = "A";
                data[i].IsActive = "Y";
                data[i].Version = 1;
                // if(data[i].Origin_OriginID === "M"){
                //     hanatable = StudioFeed.drafts;
                // }
                if (data[i].BookingType === "U" || data[i].BookingType === "C") { //VERSION is updated only when BookingType is U or C
                    var entry_Active = await SELECT.one.from(hanatable).where({ BookingID: data[i].BookingID }).orderBy({ ref: ['createdAt'], sort: 'desc' });
                    if (entry_Active) {
                        data[i].Version = entry_Active.Version ? entry_Active.Version + 1 : 1;
                        recordsToBeUpdated.push(entry_Active);
                    }
                }
                recordsToBeInserted.push(data[i]); //INSERT is always required

                // await createSalesOrderUsingNormalizedRules(req, data[i]);

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
                if (updateResult) {
                    updateSuccessEntries.push(recordsToBeUpdated[i]);
                    updateSuccessEntries.push(updateResult);
                }
            }
            finalResult.push({ "Success": successEntries });
            finalResult.push({ "UpdateSuccess": updateSuccessEntries });
            finalResult.push({ "Error": failedEntries });
            finalResult.push({ "NoOfRecordsInserted": recordsToBeInserted.length - recordsToBeUpdated?.length });
            finalResult.push({ "NoOfRecordsUpdated": recordsToBeUpdated.length });
            return finalResult;
        };
        const createSalesOrderUsingNormalizedRules = async (req, oContentData) => {
            if (oContentData?.Origin_OriginID !== "F") {
                var distroSpecData = await SELECT.one.from(DistroSpec_Local, (dist) => {
                    dist.DistroSpecUUID,
                        dist.DistroSpecID,
                        // dist.ValidFrom,
                        // dist.ValidTo,
                        dist.Title_Product,
                        // dist.KeyStartTime,
                        // dist.KeyEndTime,
                        dist.to_StudioKey((studio) => {
                            studio.Studio_BusinessPartner,
                                studio.KeyStartTime,
                                studio.KeyEndTime,
                                studio.InitialKeyDuration,
                                studio.NextKeyDuration,
                                studio.OffsetEPD,
                                studio.AggregateKey,
                                studio.ProcessKDMS,
                                studio.ProcessScreeningKDMS,
                                studio.MaxKDMSDuration,
                                studio.StudioHoldOverRule,
                                studio.SalesTerritory_SalesDistrict
                        }),
                        dist.to_Package((pkg) => {
                            pkg.PackageUUID,
                                pkg.PackageName,
                                pkg.ValidFrom,
                                pkg.ValidTo,
                                pkg.ContentIndicator,
                                pkg.DeliveryMethod1_ShippingCondition,
                                pkg.DeliveryMethod2_ShippingCondition,
                                pkg.DeliveryMethod3_ShippingCondition,
                                pkg.DeliveryMethod4_ShippingCondition,
                                pkg.DeliveryMethod5_ShippingCondition,
                                pkg.DeliveryMethod6_ShippingCondition,
                                pkg.DeliveryMethod7_ShippingCondition,
                                pkg.DeliveryMethod8_ShippingCondition,
                                pkg.DeliveryMethod9_ShippingCondition,
                                pkg.DeliveryMethod10_ShippingCondition,
                                pkg.Priority,
                                pkg.to_DistRestriction((dist) => {
                                    dist.Theater_BusinessPartner,
                                        dist.Circuit_CustomerGroup,
                                        dist.DistributionFilterCountry_code,
                                        dist.DistributionFilterRegion_Country,
                                        dist.DistributionFilterCity,
                                        dist.DistributionFilterPostal
                                }),
                                pkg.to_DCPMaterial((dcpmat) => {
                                    dcpmat.DCPMaterialUUID,
                                        dcpmat.DCPMaterialNumber_Product
                                    // dcpmat.PrintFormat
                                });
                        })
                }).where({ DistroSpecUUID: to_DistroSpec_DistroSpecUUID });
            }
            else {
                var sCustomerRef = oContentData.CustomerReference;
                var { to_DistroSpec_DistroSpecUUID, to_StudioKey_StudioKeyUUID } = await SELECT.one.from('DistributionService.CustomerRef').where({ CustomerReference: sCustomerRef });

            }
        };
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
                aResponseStatus = [], hanaDBTable = dcpcontent;
            if (!aBookingIDs?.length) {
                req.reject(400, "Booking ID was not sent for processing");
                return;
            }
            hanaDBTable = sContentIndicator === "C" ? dcpcontent : dcpkey;
            var aContentData = await SELECT.from(hanaDBTable).where({ BookingID: { "IN": aBookingIDs }, IsActive: "Y" });
            if (!aContentData?.length) {
                sErrorMessage = "No active data available to process";
                req.reject(400, "No active data available to process");
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
            for (var i in aContentData) {
                var oContentData = aContentData[i];
                var aCTTCPL = [];

                oPayLoad.SoldToParty = sSoldToCustomer;
                oPayLoad.SalesOrganization = SalesOrganization;
                oPayLoad.DistributionChannel = DistributionChannel;
                oPayLoad.OrganizationDivision = Division;
                oPayLoad.PurchaseOrderByCustomer = oContentData.BookingID;
                oPayLoad.SalesOrderType = aConfig?.find((e) => { return e.VariableName === 'SOType_SPIRITWORLD' })?.VariableValue;
                var sCustomerRef = oContentData.UUID;
                var { to_DistroSpec_DistroSpecUUID, to_StudioKey_StudioKeyUUID } = await SELECT.one.from('DistributionService.CustomerRef').where({ CustomerReference: sCustomerRef });
                var distroSpecData = await SELECT.one.from(DistroSpec_Local, (dist) => {
                    dist.DistroSpecUUID,
                        dist.DistroSpecID,
                        // dist.ValidFrom,
                        // dist.ValidTo,
                        dist.Title_Product,
                        // dist.KeyStartTime,
                        // dist.KeyEndTime,
                        dist.to_StudioKey((studio) => {
                            studio.Studio_BusinessPartner,
                                studio.KeyStartTime,
                                studio.KeyEndTime,
                                studio.InitialKeyDuration,
                                studio.NextKeyDuration,
                                studio.OffsetEPD,
                                studio.AggregateKey,
                                studio.ProcessKDMS,
                                studio.ProcessScreeningKDMS,
                                studio.MaxKDMSDuration,
                                studio.StudioHoldOverRule,
                                studio.SalesTerritory_SalesDistrict,
                                studio.InferKeyContentOrder
                        }),
                        dist.to_Package((pkg) => {
                            pkg.PackageUUID,
                                pkg.PackageName,
                                pkg.ValidFrom,
                                pkg.ValidTo,
                                pkg.ContentIndicator,
                                // pkg.SecondaryTerritory,
                                // pkg.PrimaryTerritoryDeliveryMethod_ShippingCondition,
                                // pkg.SecondaryTerritoryDeliveryMethod_ShippingCondition,
                                // pkg.PrimaryDeliveryMethod_ShippingCondition,
                                // pkg.SecondaryDeliveryMethod_ShippingCondition,
                                // pkg.DepotID,
                                pkg.DeliveryMethod1_ShippingCondition,
                                pkg.DeliveryMethod2_ShippingCondition,
                                pkg.DeliveryMethod3_ShippingCondition,
                                pkg.DeliveryMethod4_ShippingCondition,
                                pkg.DeliveryMethod5_ShippingCondition,
                                pkg.DeliveryMethod6_ShippingCondition,
                                pkg.DeliveryMethod7_ShippingCondition,
                                pkg.DeliveryMethod8_ShippingCondition,
                                pkg.DeliveryMethod9_ShippingCondition,
                                pkg.DeliveryMethod10_ShippingCondition,
                                pkg.Priority,
                                pkg.to_DistRestriction((dist) => {
                                    dist.Theater_BusinessPartner,
                                        dist.Circuit_CustomerGroup,
                                        dist.DistributionFilterCountry_code,
                                        dist.DistributionFilterRegion_Country,
                                        dist.DistributionFilterCity,
                                        dist.DistributionFilterPostal
                                }),
                                pkg.to_DCPMaterial((dcpmat) => {
                                    dcpmat.DCPMaterialUUID,
                                        dcpmat.DCPMaterialNumber_Product
                                    // dcpmat.PrintFormat
                                });
                        })
                }).where({ DistroSpecUUID: to_DistroSpec_DistroSpecUUID });
                if (!distroSpecData || !Object.keys(distroSpecData).length) {
                    sErrorMessage = "DistroSpec not found";
                    updateQuery.push(UPDATE(hanaDBTable).set({ ErrorMessage: sErrorMessage }).where({ BookingID: oContentData.BookingID, IsActive: "Y" }));
                }
                else {
                    var sShipDate = oContentData.ShipDate;
                    if (sShipDate) {
                        oPayLoad.RequestedDeliveryDate = `/Date(${new Date(sShipDate).getTime()})/`;
                    }
                    else {
                        sErrorMessage = "Ship Date is not maintained";
                        updateQuery.push(UPDATE(hanaDBTable).set({ ErrorMessage: sErrorMessage }).where({ BookingID: oContentData.BookingID }));
                    }
                    oPayLoad.IncotermsClassification = "CPT";
                    oPayLoad.IncotermsLocation1 = "Destination";
                    var dPlayStartDate = new Date(oContentData.PlayStartDate.replace(/-/g, '/'));
                    var dPlayEndDate = new Date(oContentData.PlayEndDate.replace(/-/g, '/'));
                    // var dPlayStartDate = new Date(oContentData.PlayStartDate.replace(/-/g, '/'));
                    // var dPlayEndDate = new Date(oContentData.PlayEndDate.replace(/-/g, '/'));
                    // var sDistValidFrom = distroSpecData.ValidFrom;
                    // var sDistValidTo = distroSpecData.ValidTo;
                    // sDistValidFrom = new Date(sDistValidFrom.replace(/-/g, '/'));
                    // sDistValidTo = new Date(sDistValidTo.replace(/-/g, '/'));

                    // if (dPlayStartDate < sDistValidFrom || dPlayEndDate > sDistValidTo) {
                    //     sErrorMessage = `DistroSpec not in validity. Validity period is from ${distroSpecData.ValidFrom} to ${distroSpecData.ValidTo}`;
                    // }
                    // else 
                    {
                        var sTheaterID = oContentData.TheaterID, sShipTo = "";
                        // var aSoldToSalesData = await s4h_bp_Txn.get(`/A_CustomerSalesArea?$filter=Customer eq '${sSoldToCustomer}' and SalesOrganization eq  '${SalesOrganization}' and DistributionChannel eq '${DistributionChannel}' and Division eq '${Division}'&$expand=to_PartnerFunction`);
                        var sEntityID = oContentData.EntityID;
                        var sBPCustomerNumber = "", sPYCustomer = "";
                        oPayLoad.to_Partner = [];
                        if (sEntityID) {
                            if (sEntityID.toUpperCase() === "SPR") {
                                sBPCustomerNumber = "1000055";
                                sPYCustomer = "1000055";
                            }
                            else if (sEntityID.toUpperCase() === "SPRI") {
                                sBPCustomerNumber = "1000050";
                                sPYCustomer = "1000050";
                            }
                            else if (sEntityID.toUpperCase() === "SPC") {
                                sBPCustomerNumber = "1000011";
                                sPYCustomer = "1000011";
                            }

                            sShipTo = sBPCustomerNumber;
                            // oPayLoad.to_Partner.push({ "PartnerFunction": "WE", "Customer": sBPCustomerNumber });
                        }

                        var aSoldToSalesData = await s4h_bp_Txn.run(SELECT.from(S4H_CustomerSalesArea, (salesArea) => { salesArea.to_PartnerFunction((partFunc) => { }) }).where({ Customer: sSoldToCustomer, SalesOrganization: SalesOrganization, DistributionChannel: DistributionChannel, Division: Division }));
                        if (aSoldToSalesData?.length) { //IDENTIFYING SHIP-TO
                            var oSoldToSalesData = aSoldToSalesData[0];
                        }
                        else {
                            sErrorMessage = `Sales Data not maintained for Sold To Customer ${sSoldToCustomer}-${SalesOrganization}/${DistributionChannel}/${Division}`;
                        }
                        if (oSoldToSalesData?.to_PartnerFunction?.length > 0) {
                            var oPartnerFunction = oSoldToSalesData?.to_PartnerFunction.find((pf) => { return pf.PartnerFunction === "SH" && pf.CustomerPartnerDescription === sTheaterID });
                            if (oPartnerFunction && Object.keys(oPartnerFunction).length) {
                                sBPCustomerNumber = oPartnerFunction.BPCustomerNumber;
                                if (sBPCustomerNumber) {
                                    sShipTo = sBPCustomerNumber;
                                    oPayLoad.to_Partner.push({ "PartnerFunction": aConfig?.find((e) => { return e.VariableName === 'PartnerFunc_SPIRITWORLD' })?.VariableValue, "Customer": sBPCustomerNumber });
                                }
                                else {
                                    sShipTo = "";
                                    sErrorMessage = "Ship-To not found";
                                }
                            }
                            else {
                                sErrorMessage = "Partner function details not found for SH: CustomerPartnerDescription" + sTheaterID;
                            }
                        }
                        else {
                            sErrorMessage = "Partner function not available";
                        }
                        var aShiptoDelMethodsFromS4 = [];
                        if (sShipTo) {
                            var aShipToSalesData = await s4h_bp_Txn.run(SELECT.from(S4H_CustomerSalesArea, (salesArea) => { salesArea.to_PartnerFunction((partFunc) => { }) }).where({ Customer: sShipTo, SalesOrganization: SalesOrganization, DistributionChannel: DistributionChannel, Division: Division }));
                            if (aShipToSalesData?.length) { //IDENTIFYING SHIP-TO
                                var oShipToSalesData = aShipToSalesData[0];
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
                            }
                            else {
                                sErrorMessage = `Sales Data not maintained for Ship To Customer ${sShipTo}-${SalesOrganization}/${DistributionChannel}/${Division}`;
                            }
                        }
                        if (distroSpecData?.to_Package?.length) {
                            var sCustomerGroupFromS4 = oSoldToSalesData?.CustomerGroup;
                            var aPackages = distroSpecData.to_Package;
                            aPackages.sort(function (a, b) {
                                return a.Priority < b.Priority;
                            }); //SORT PACKAGES BASED ON PRIOIRTY       
                            var aPackageFiltered = aPackages;
                            var aPackageFiltered = aPackages.filter((item) => {
                                if (item.ValidFrom && item.ValidTo) {
                                    var dPackageValidFrom = new Date(item.ValidFrom.replace(/-/g, '/'));
                                    var dPackageValidTo = new Date(item.ValidTo.replace(/-/g, '/'));
                                    // var sPrimaryShipCondn = item.PrimaryDeliveryMethod_ShippingCondition;
                                    // var sSecondaryShipCondn = item.SecondaryDeliveryMethod_ShippingCondition;
                                    if (dPlayStartDate < dPackageValidFrom || dPlayEndDate > dPackageValidTo) {
                                        return false;
                                    }
                                    // else 
                                    // if (item.ContentIndicator !== sContentIndicator) {
                                    //     return false;
                                    // }
                                    else {
                                        return true;
                                    }
                                    // else if(sCustomerGroupFromS4 === sPrimaryShipCondn || sCustomerGroupFromS4 === sSecondaryShipCondn){
                                    //     return true;
                                    // }
                                }
                                else {//THE PACKAGE IS CONSIDERED EVEN IF NO VALIDITY PERIOD IS MAINTAINED
                                    if (sCustomerGroupFromS4 === item.DeliveryMethod1_ShippingCondition || sCustomerGroupFromS4 === item.DeliveryMethod2_ShippingCondition ||
                                        sCustomerGroupFromS4 === item.DeliveryMethod3_ShippingCondition || sCustomerGroupFromS4 === item.DeliveryMethod4_ShippingCondition ||
                                        sCustomerGroupFromS4 === item.DeliveryMethod5_ShippingCondition || sCustomerGroupFromS4 === item.DeliveryMethod6_ShippingCondition ||
                                        sCustomerGroupFromS4 === item.DeliveryMethod7_ShippingCondition || sCustomerGroupFromS4 === item.DeliveryMethod8_ShippingCondition ||
                                        sCustomerGroupFromS4 === item.DeliveryMethod9_ShippingCondition || sCustomerGroupFromS4 === item.DeliveryMethod10_ShippingCondition
                                    ) {
                                        return true;
                                    }
                                    else {
                                        return false
                                    }
                                }
                            });

                            if (aPackageFiltered?.length) {
                                var oBPPackage = aPackageFiltered.find((oPkg) => {

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

                                    // oPkg?.DeliveryMethod1_ShippingCondition === oShipToSalesData?.YY1_DeliveryMethod1_csa ||
                                    //     oPkg?.DeliveryMethod2_ShippingCondition === oShipToSalesData?.YY1_DeliveryMethod2_csa ||
                                    //     oPkg?.DeliveryMethod3_ShippingCondition === oShipToSalesData?.YY1_DeliveryMethod3_csa ||
                                    //     oPkg?.DeliveryMethod4_ShippingCondition === oShipToSalesData?.YY1_DeliveryMethod4_csa ||
                                    //     oPkg?.DeliveryMethod5_ShippingCondition === oShipToSalesData?.YY1_DeliveryMethod5_csa ||
                                    //     oPkg?.DeliveryMethod6_ShippingCondition === oShipToSalesData?.YY1_DeliveryMethod6_csa ||
                                    //     oPkg?.DeliveryMethod7_ShippingCondition === oShipToSalesData?.YY1_DeliveryMethod7_csa ||
                                    //     oPkg?.DeliveryMethod8_ShippingCondition === oShipToSalesData?.YY1_DeliveryMethod8_csa ||
                                    //     oPkg?.DeliveryMethod9_ShippingCondition === oShipToSalesData?.YY1_DeliveryMethod9_csa ||
                                    //     oPkg?.DeliveryMethod10_ShippingCondition === oShipToSalesData?.YY1_DeliveryMethod10_csa 
                                });
                                if (oBPPackage) {
                                    aPackageFiltered = [oBPPackage];
                                    // if (oBPPackage.PrimaryDeliveryMethod_ShippingCondition === "05" ||
                                    //     oBPPackage.PrimaryDeliveryMethod_ShippingCondition === "06" ||
                                    //     oBPPackage.PrimaryDeliveryMethod_ShippingCondition === "10" ||
                                    //     oBPPackage.SecondaryDeliveryMethod_ShippingCondition === "05" ||
                                    //     oBPPackage.SecondaryDeliveryMethod_ShippingCondition === "06" ||
                                    //     oBPPackage.SecondaryDeliveryMethod_ShippingCondition === "10" &&
                                    //     !oShipToSalesData?.YY1_DCDCFlag_csa
                                    // ) {
                                    //     sErrorMessage = `DCDC Capability not found.`;
                                    // }
                                }
                                else {
                                    sErrorMessage = `Theater Capability not found. Ship-To:${sShipTo}`;
                                }
                                var oStudioKeyData = distroSpecData.to_StudioKey?.find((stud) => { return stud.Studio_BusinessPartner === "1000011" });
                                for (var i in aPackageFiltered) {
                                    var oFilteredPackage = aPackageFiltered[i];
                                    // var sPrDelMethod = oFilteredPackage.PrimaryDeliveryMethod_ShippingCondition;
                                    // var sSecDelMethod = oFilteredPackage.SecondaryDeliveryMethod_ShippingCondition;
                                    // var sDeliveryMethod = sPrDelMethod ? sPrDelMethod : sSecDelMethod;
                                    var sDeliveryMethod = oFilteredPackage.DeliveryMethod1_ShippingCondition ? oFilteredPackage.DeliveryMethod1_ShippingCondition :
                                        oFilteredPackage.DeliveryMethod2_ShippingCondition ? oFilteredPackage.DeliveryMethod2_ShippingCondition :
                                            oFilteredPackage.DeliveryMethod3_ShippingCondition ? oFilteredPackage.DeliveryMethod3_ShippingCondition : oFilteredPackage.DeliveryMethod4_ShippingCondition ?
                                                oFilteredPackage.DeliveryMethod4_ShippingCondition : oFilteredPackage.DeliveryMethod5_ShippingCondition ? oFilteredPackage.DeliveryMethod5_ShippingCondition :
                                                    oFilteredPackage.DeliveryMethod6_ShippingCondition ? oFilteredPackage.DeliveryMethod6_ShippingCondition : oFilteredPackage.DeliveryMethod7_ShippingCondition ?
                                                        oFilteredPackage.DeliveryMethod7_ShippingCondition : oFilteredPackage.DeliveryMethod8_ShippingCondition ? oFilteredPackage.DeliveryMethod8_ShippingCondition :
                                                            oFilteredPackage.DeliveryMethod9_ShippingCondition ? oFilteredPackage.DeliveryMethod9_ShippingCondition : oFilteredPackage.DeliveryMethod10_ShippingCondition;
                                    var sShippingType = "";
                                    if (sDeliveryMethod) {
                                        oPayLoad.ShippingCondition = sDeliveryMethod;
                                        var oShippingTypeMapping = await SELECT.one.from(ShippingConditionTypeMapping).where({ ShippingCondition: sDeliveryMethod });
                                        sShippingType = oShippingTypeMapping.ShippingType;
                                    }
                                    oPayLoad.to_Item = [];
                                    if (
                                        (sContentIndicator === "C" && oStudioKeyData?.InferKeyContentOrder) ||
                                        (sContentIndicator === "K")
                                    ) {
                                        var sStartDate = sContentIndicator === "K" ? oContentData.StartDate : oContentData.PlayStartDate;
                                        var sStartTime = sContentIndicator === "K" ? oContentData.StartTime : distroSpecData.KeyStartTime;
                                        var sEndDate = sContentIndicator === "K" ? oContentData.EndDate : oContentData.PlayEndDate;
                                        var sEndTime = sContentIndicator === "K" ? oContentData.EndTime : distroSpecData.KeyEndTime;
                                        var dStartDate = sStartTime ? new Date(`${sStartDate}T${sStartTime}`) : new Date(sStartDate);
                                        var dEndDate = sEndTime ? new Date(`${sEndDate}T${sEndTime}`) : new Date(sEndDate);
                                        var iDifferenceInHours = (dEndDate - dStartDate) / (60 * 60 * 1000);
                                        if (iDifferenceInHours > 24) {
                                            var oEntry = {
                                                "Material": aConfig?.find((e) => { return e.VariableName === 'Material_GT24' })?.VariableValue,
                                                "RequestedQuantity": '1',
                                                "RequestedQuantityISOUnit": "EA",
                                                // "DeliveryPriority": `${oFilteredPackage?.Priority}`,
                                                "DeliveryPriority": `1`,
                                                "PricingReferenceMaterial": distroSpecData?.Title_Product,
                                                // "ShippingType": sShippingType
                                                "ShippingType": "07"
                                            };
                                        }
                                        else {
                                            oEntry = {
                                                "Material": aConfig?.find((e) => { return e.VariableName === 'Material_LT24' })?.VariableValue,
                                                "RequestedQuantity": '1',
                                                "RequestedQuantityISOUnit": "EA",
                                                // "DeliveryPriority": `${oFilteredPackage?.Priority}`,
                                                "DeliveryPriority": `1`,
                                                "PricingReferenceMaterial": distroSpecData?.Title_Product,
                                                // "ShippingType": sShippingType
                                                "ShippingType": "07"
                                            };
                                        }
                                        oPayLoad.to_Item.push(oEntry);
                                    }
                                    if (oFilteredPackage?.to_DCPMaterial) {
                                        for (var j in oFilteredPackage.to_DCPMaterial) {
                                            var oMatRecord = oFilteredPackage.to_DCPMaterial[j];
                                            var oEntry = {
                                                "Material": oMatRecord.DCPMaterialNumber_Product,
                                                "RequestedQuantity": '1',
                                                "RequestedQuantityISOUnit": "EA",
                                                // "DeliveryPriority": `${oFilteredPackage?.Priority}`,
                                                "DeliveryPriority": `1`,
                                                "PricingReferenceMaterial": distroSpecData?.Title_Product,
                                                // "ShippingType": sShippingType
                                                "ShippingType": sContentIndicator === "C" ? sShippingType : "07"
                                            };
                                            var assetvault = await SELECT.one.from(AssetVault_Local)
                                                .columns(["*", { "ref": ["_Items"], "expand": ["*"] }])
                                                .where({
                                                    DCP: oMatRecord.DCPMaterialNumber_Product
                                                })
                                            if (assetvault?._Items?.length > 0) {
                                                var sLinkedCTT = assetvault._Items.map(u => u.LinkedCTT).join(`\n`);
                                                var sCPLUUID = assetvault._Items.map(u => u.LinkedCPLUUID).join(`\n`);
                                                aCTTCPL.push({ "Product": oMatRecord.DCPMaterialNumber_Product, "LinkedCTT": sLinkedCTT, "CPLUUID": sCPLUUID })
                                            }
                                            oPayLoad.to_Item.push(oEntry);
                                        }

                                        var aDCPs = oFilteredPackage?.to_DCPMaterial.map((item) => { return item.DCPMaterialNumber_Product });
                                    }
                                    else {
                                        sErrorMessage = "DCP Material not available";
                                    }
                                    var aDistRestrictions = oFilteredPackage?.to_DistRestriction;
                                    if (aDistRestrictions && aDistRestrictions.length) {
                                        // var oDistRestriction = aDistRestrictions.find((dist) => {
                                        //     return dist.Theater_BusinessPartner === sShipTo && dist.Circuit_CustomerGroup === sCustomerGroupFromS4 &&
                                        //         ((oBusinessPartnerAddrfromS4?.Country && dist.DistributionFilterCountry_code) ? oBusinessPartnerAddrfromS4.Country === dist.DistributionFilterCountry_code : true) &&
                                        //         ((oBusinessPartnerAddrfromS4?.Region && dist.DistributionFilterRegion_Country) ? oBusinessPartnerAddrfromS4.Region === dist.DistributionFilterRegion_Country : true) &&
                                        //         ((oBusinessPartnerAddrfromS4?.CityCode && dist.DistributionFilterCity) ? oBusinessPartnerAddrfromS4.CityCode === dist.DistributionFilterCity : true) &&
                                        //         ((oBusinessPartnerAddrfromS4?.PostalCode && dist.DistributionFilterPostal) ? oBusinessPartnerAddrfromS4.PostalCode === dist.DistributionFilterPostal : true)
                                        // });
                                        // if (!oDistRestriction) {
                                        //     sErrorMessage = `No relevant Package IDs identified for restrictions. 
                                        //     CustomerGroupFromS4:${sCustomerGroupFromS4}|
                                        //     PartnerAddress(Country/Region/CityCode/PostalCode from S4: ${oBusinessPartnerAddrfromS4.Country}/${oBusinessPartnerAddrfromS4.Region}/${oBusinessPartnerAddrfromS4.CityCode}/${oBusinessPartnerAddrfromS4.PostalCode})`;
                                        // }
                                    }
                                    if (i == "0") { //Picking up only the 1st package
                                        break;
                                    }
                                }
                            }
                            else {
                                sErrorMessage = "No suitable Package found in DistroSpec";
                            }
                        }
                        else {
                            sErrorMessage = "Package not maintained in DistroSpec";
                        }
                    }
                }
                var bPostingSuccess = false, sSalesOrder = "";
                if (sErrorMessage) {
                    updateQuery.push(UPDATE(hanaDBTable).set({ ErrorMessage: sErrorMessage, Status_ID: "D" }).where({ BookingID: oContentData.BookingID, IsActive: "Y" }));
                    aResponseStatus.push({
                        "message": `| Booking ID: ${oContentData.BookingID}: ${sErrorMessage} |`,
                        "status": "E"
                    });
                }
                else {
                    var postResult = await s4h_sohv2_Txn.send({
                        method: 'POST',
                        path: '/A_SalesOrder',
                        data: oPayLoad
                    }).catch((err) => {
                        updateQuery.push(UPDATE(hanaDBTable).set({ ErrorMessage: err.message }).where({ BookingID: oContentData.BookingID, IsActive: "Y" }));
                        aResponseStatus.push({
                            "message": `| Booking ID: ${oContentData.BookingID}: ${err.message} |`,
                            "status": "E"
                        });
                    }).then((result) => {
                        if (result) {
                            bPostingSuccess = true;
                            sSalesOrder = result?.SalesOrder;
                            updateQuery.push(UPDATE(hanaDBTable).set({ SalesOrder: result?.SalesOrder, Status_ID: "C", ErrorMessage: "" }).where({ BookingID: oContentData.BookingID, IsActive: "Y" }));
                            aResponseStatus.push({
                                "message": `| Booking ID: ${oContentData.BookingID}, Sales Order: ${result?.SalesOrder} is created |`,
                                "status": "S"
                            });
                        }
                    });
                }
                if (updateQuery.length) {
                    var updateResult = await Promise.all(updateQuery);
                    if (bPostingSuccess) {
                        // var aSalesOrderData = await s4h_sohv2_Txn.run(SELECT.from(S4H_SOHeader_V2, (header) => {
                        //     header`.*`,
                        //         header.to_Item((item) => { }),
                        //         header.to_Partner((partner) => { })
                        // }).where({ SalesOrder: sSalesOrder }));  
                        var aSalesOrderData = await s4h_sohv2_Txn.run(SELECT.from(S4H_SOHeader_V2).columns(['*', { "ref": ["to_Item"], "expand": ["*"] }]).where({ SalesOrder: sSalesOrder }));
                        // var aSalesOrderData = await s4h_sohv2_Txn.get(`/A_SalesOrder?$filter=SalesOrder eq '${sSalesOrder}'&$expand=to_Item,to_Partner`);


                        if (aSalesOrderData?.length) {
                            var oSalesOrder = aSalesOrderData[0]; //IT IS ALWAYS 1 RECORD
                            var oRecordsToBePosted = oContentData;
                            oRecordsToBePosted.DistroSpecID = distroSpecData.DistroSpecID;
                            // oRecordsToBePosted.DistroSpecPackageID = aPackageFiltered[0].PackageUUID;
                            // oRecordsToBePosted.DistroSpecPackageName = aPackageFiltered[0].PackageName;
                            var aSalesOrderItems = oSalesOrder.to_Item;
                            oSalesOrder._Item = [];
                            for (var item in aSalesOrderItems) {
                                oSalesOrder._Item.push({}); //to_Item from to be mapped with _Item of lcoal CDS
                                var oSalesOrderItem = aSalesOrderItems[item];
                                oSalesOrder._Item[item]["Product"] = oSalesOrderItem.Material;
                                var oAssetvault = await SELECT.one.from(AssetVault_Local).where({ DCP: oSalesOrderItem.Material });
                                var sGoFilexTitleID = oAssetvault?.GoFilexTitleID_NORAM;
                                oSalesOrder._Item[item].LongText = sGoFilexTitleID;
                                oSalesOrder._Item[item].ProductGroup = oSalesOrderItem.MaterialGroup;
                                oSalesOrder._Item[item].Plant = oSalesOrderItem.ProductionPlant;
                                oSalesOrder._Item[item].DistroSpecPackageID = aPackageFiltered[0].PackageUUID;
                                oSalesOrder._Item[item].DistroSpecPackageName = aPackageFiltered[0].PackageName;
                                if (oPayLoad?.ShippingCondition && oPayLoad?.ShippingCondition === '02' && sGoFilexTitleID) {
                                    await updateItemTextForSalesOrder(req, "Z004", sGoFilexTitleID, aResponseStatus, oSalesOrderItem, oContentData);
                                }
                                var oCTTCPL = aCTTCPL?.find((entry) => { return entry.Product === oSalesOrderItem.Material });
                                if (oCTTCPL) {
                                    oSalesOrder._Item[item].CTT = oCTTCPL.LinkedCTT;
                                    oSalesOrder._Item[item].CPLUUID = oCTTCPL.CPLUUID;
                                    await updateItemTextForSalesOrder(req, "Z005", oCTTCPL.CPLUUID, aResponseStatus, oSalesOrderItem, oContentData);
                                    if (sContentIndicator === "K") {
                                        await updateItemTextForSalesOrder(req, "0001", oCTTCPL.LinkedCTT, aResponseStatus, oSalesOrderItem, oContentData);
                                    }
                                }
                                // var aProjectIDs = await SELECT.columns(['ProjectID']).from(CplList_Local).where({ DCP: { "IN": aDCPs } });
                                // for (var p in aProjectIDs) {
                                //     var sProjectID = aProjectIDs[p].ProjectID;
                                //     await updateItemTextForSalesOrder(req, "Z006", sProjectID, aResponseStatus, oSalesOrderItem, oContentData);
                                // }
                                var oCplList = await SELECT.one.from(CplList_Local).where({ DCP: oSalesOrderItem.Material });
                                if (oCplList) {
                                    await updateItemTextForSalesOrder(req, "Z006", `${oCplList?.ProjectID}`, aResponseStatus, oSalesOrderItem, oContentData);
                                }
                                await updateItemTextForSalesOrder(req, "Z008", `${distroSpecData.DistroSpecID}`, aResponseStatus, oSalesOrderItem, oContentData);
                                await updateItemTextForSalesOrder(req, "Z009", aPackageFiltered?.[0].PackageUUID, aResponseStatus, oSalesOrderItem, oContentData);
                                await updateItemTextForSalesOrder(req, "Z010", aPackageFiltered?.[0].PackageName, aResponseStatus, oSalesOrderItem, oContentData);
                                Object.assign(oSalesOrder._Item[item], oSalesOrderItem); //Assigining updated field name values back

                                oSalesOrder._Item[item].ShippingType_ID = oSalesOrderItem.ShippingType;

                                oSalesOrder._Item[item]["KeyStartTime"] = oStudioKeyData.KeyStartTime;
                                oSalesOrder._Item[item]["KeyEndTime"] = oStudioKeyData.KeyEndTime;
                                oSalesOrder._Item[item]["InitialKeyDuration"] = oStudioKeyData.InitialKeyDuration;
                                oSalesOrder._Item[item]["NextKeyDuration"] = oStudioKeyData.NextKeyDuration;
                                oSalesOrder._Item[item]["OffsetEPD"] = oStudioKeyData.OffsetEPD;
                                oSalesOrder._Item[item]["InferKeyContentOrder"] = oStudioKeyData.InferKeyContentOrder;
                                oSalesOrder._Item[item]["AggregateKey"] = oStudioKeyData.AggregateKey;
                                oSalesOrder._Item[item]["ProcessKDMS"] = oStudioKeyData.ProcessKDMS;
                                oSalesOrder._Item[item]["ProcessScreeningKDMS"] = oStudioKeyData.ProcessScreeningKDMS;
                                oSalesOrder._Item[item]["MaxKDMSDuration"] = oStudioKeyData.MaxKDMSDuration;
                                oSalesOrder._Item[item]["StudioHoldOverRule"] = oStudioKeyData.StudioHoldOverRule;
                                oSalesOrder._Item[item]["SalesTerritory"] = oStudioKeyData.SalesTerritory_SalesDistrict;

                                oSalesOrder._Item[item]["StartDate"] = sStartDate;
                                oSalesOrder._Item[item]["StartTime"] = sStartTime;
                                oSalesOrder._Item[item]["EndDate"] = sEndDate;
                                oSalesOrder._Item[item]["EndTime"] = sEndTime;

                                delete oSalesOrder._Item[item].ShippingType;
                            } //ITERATING ITEM END
                            oRecordsToBePosted._Partner = [];
                            for (var part in oSalesOrder.to_Partner) {
                                Object.assign(oRecordsToBePosted._Partner, oSalesOrder.to_Partner);
                            }
                            Object.assign(oRecordsToBePosted, oContentData);
                            Object.assign(oRecordsToBePosted, oSalesOrder);
                            if (oSalesOrder.RequestedDeliveryDate) {
                                var iTime = parseInt(oSalesOrder.RequestedDeliveryDate.substring(6, oSalesOrder.RequestedDeliveryDate.length - 2));
                                var sDate = new Date(iTime).toISOString().split("T")[0];
                                oRecordsToBePosted.RequestedDeliveryDate = sDate;
                            }
                            await INSERT.into(BookingSalesOrder).entries(oRecordsToBePosted);
                            aResponseStatus.push({
                                "message": `| For Booking ID: ${oContentData.BookingID} - Sales Order: ${oSalesOrder?.SalesOrder}, Booking entry created |`,
                                "status": "S"
                            });
                        }
                    }
                }
            }// End of for loop
            req.reply({
                code: 201,
                message: JSON.stringify(aResponseStatus)
            });
        };
        this.on(['READ'], S4_Parameters, async (req) => {
            return s4h_param_Txn.run(req.query);
        });
        this.on("remediateContentSalesOrder", async (req, res) => {
            await remediateSalesOrder(req, "C");
        });
        this.on("remediateKeySalesOrder", async (req, res) => {
            await remediateSalesOrder(req, "K");
        });
        const remediateSalesOrder = async (req, sContentIndicator) => {
            var oInput = req.data?.oInput;
            // var sBookingID = req.data?.bookingID, sSalesOrder = req.data?.salesOrder, sPlant = req.data?.plant,
            //     sShipType = req.data?.shipTypeSelected, sShipPoint = req.data?.shipPointSelected, oContentData, sMaterialGroup,
            //     sShippingCondition = req.data?.shippingCondition, sDeliveryDate = req.data?.deliveryDate, aResponseStatus = [], hanaDBTable;
            var sBookingID = oInput?.bookingID, sSalesOrder = oInput?.salesOrder, sPlant = oInput?.plant,
                sShipType = oInput?.shipTypeSelected, sShipPoint = oInput?.shipPointSelected, oContentData, sMaterialGroup,
                sShippingCondition = oInput?.shippingCondition, sDeliveryDate = oInput?.deliveryDate, aResponseStatus = [], hanaDBTable;

            hanaDBTable = sContentIndicator === "C" ? dcpcontent : dcpkey;
            sMaterialGroup = sContentIndicator === "C" ? "Z003" : "Z004";
            if (sBookingID) {
                oContentData = await SELECT.one.from(hanaDBTable).where({ BookingID: sBookingID, IsActive: "Y" });
            }
            else if (sSalesOrder) {
                oContentData = SELECT.one.from(hanaDBTable).where({ SalesOrder: sSalesOrder, IsActive: "Y" });
            }
            else {
                req.reject(501, "Booking ID / Sales order not available for processing");
            }
            if (!oContentData) {
                req.reject(501, "Selected entry not available");
            }
            else if (!oContentData.SalesOrder) {
                req.reject(501, "Please Select an entry where Sales Order is available for remediation");
            }
            else if (oContentData.ReferenceSDDocument) {
                req.reject(501, "Remediation is already done for the selection");
            }
            var oSalesorderItem_PayLoad = {};
            var aSalesOrderItem = await s4h_sohv2_Txn.run(SELECT.from(S4H_SalesOrderItem_V2).columns(["*"]).where({ SalesOrder: sSalesOrder, MaterialGroup: sMaterialGroup }));
            if (!aSalesOrderItem?.length) {
                aResponseStatus.push({
                    "message": `| No items available for remediation in Sales Order: ${sSalesOrder} |`,
                    "status": "E"
                });
            }
            else {
                for (var i in aSalesOrderItem) {
                    var oSalesOrderItem = aSalesOrderItem[i];
                    oSalesorderItem_PayLoad["Material"] = oSalesOrderItem.Material;
                    oSalesorderItem_PayLoad["RequestedQuantity"] = `${oSalesOrderItem.RequestedQuantity}`;
                    oSalesorderItem_PayLoad["RequestedQuantityISOUnit"] = oSalesOrderItem.RequestedQuantityISOUnit;
                    oSalesorderItem_PayLoad["ProductionPlant"] = sPlant;
                    // oSalesorderItem_PayLoad["ShippingPoint"] = oSalesOrderItem.ShippingPoint;
                    // oSalesorderItem_PayLoad["ShippingType"] = oSalesOrderItem.ShippingType;

                    oSalesorderItem_PayLoad["ShippingType"] = sShipType ? sShipType : oSalesOrderItem.ShippingType;
                    oSalesorderItem_PayLoad["ShippingPoint"] = sShipPoint ? sShipPoint : oSalesOrderItem.ShippingPoint;
                    oSalesorderItem_PayLoad["ItemBillingBlockReason"] = "03";
                    oSalesorderItem_PayLoad["PricingReferenceMaterial"] = oSalesOrderItem.PricingReferenceMaterial;
                    oSalesorderItem_PayLoad["DeliveryPriority"] = "04";
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
                            await UPDATE(hanaDBTable).set({ ReferenceSDDocument: `${result?.SalesOrderItem}` }).where({ BookingID: oContentData.BookingID })
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
        };

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

        const updateItemTextForSalesOrder = async (req, sType, sText, aResponseStatus, oSalesOrderItem, oContentData) => {
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
                aResponseStatus.push({
                    "message": `| For Booking ID: ${oContentData.BookingID}-Sales Order: ${oSalesOrderItem?.SalesOrder}, ${sType} Item text creation failed with the error: ${err.message} `,
                    "status": "W"
                });
            }).then((result) => {
                if (result) {
                    aResponseStatus.push({
                        "message": `| For Booking ID: ${oContentData.BookingID}-Sales Order: ${oSalesOrderItem?.SalesOrder}, ${sType} Item Text is created |`,
                        "status": "S"
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
                const input = req.data.input; // Extract input data from request

                // Make a POST call to the external API              
                const response = await s4h_products_Crt.run(UPDATE(Products).set({ IsMarkedForDeletion: true }).where({ Product: input.Product }))

                return "Succesfully Deleted";
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

                    var aTrailerItems = aItems?.filter((item) => {
                        return item?.LinkedCTT?.toUpperCase().includes('TRL');
                    });
                    await aTrailerItems?.forEach(element => {
                        Content.push({ "ContentText": `${element.LinkedCTT} Duration:${element.RunTime} Start Of Credits:${element.StartOfCredits} Crawl:${element.StartOfCrawl}` });
                    });
                    TrailerCount = aTrailerItems?.length;

                    VersionDescription = oAssetVault?.VersionDescription;
                    Title = oAssetVault?.Title;
                    TotalSize = oAssetVault?.AssetMapFileSize;

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
                        var oBupa = await buspatx.run(SELECT.one.columns(['BusinessPartnerFullName']).from(BusinessPartner).where({ BusinessPartner: sBupa }));
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
                var sMaterialDocument = req?.data?.Material;

                const formData = {
                    Form:
                    {
                        "GRHeaderNode": {
                            "GoodsReceiptHeadlinePrint": sMaterialDocument,
                            "Language": "EN",
                            "Product": sMaterialDocument,
                            "MaterialDocument": sMaterialDocument,
                            "MaterialDocumentHeaderText": "",
                            "MaterialDocumentItem": sMaterialDocument,
                            "MaterialDocumentYear": sMaterialDocument,
                            "PrinterIsCapableBarCodes": sMaterialDocument,
                            "ReferenceDocument": "",
                            "GRMI": {
                                "GRMatItemNode": [
                                    {
                                        "AccountAssignmentCategory": sMaterialDocument,
                                        "AccountingDocumentCreationDate": sMaterialDocument,
                                        "BaseUnit": "EA",
                                        "Batch": "BSH",
                                        "CostCenter": sMaterialDocument,
                                        "CountryOfOrigin": sMaterialDocument,
                                        "CountryOfOriginName": sMaterialDocument,
                                        "DebitCreditCode": sMaterialDocument,
                                        "DeliveryQuantityUnit": sMaterialDocument,
                                        "DocumentItemText": sMaterialDocument,
                                        "EntryUnit": "EA",
                                        "Equipment": sMaterialDocument,
                                        "FixedAsset": "",
                                        "GoodsMovementRefDocType": "",
                                        "GoodsMovementType": "",
                                        "GoodsReceiptAcctAssgmt": "",
                                        "GoodsReceiptAcctAssgmtText": "",
                                        "GoodsReceiptPostingDate": "",
                                        "GoodsReceiptQtyInOrderUnit": 1020.0,
                                        "InternationalArticleNumber": "",
                                        "InternationalArticleNumberCat": "",
                                        "InventorySpecialStockType": "",
                                        "InventoryStockType": "",
                                        "ItemVolumeUnit": "",
                                        "Language": "",
                                        "MaintOrderOperationCounter": "",
                                        "MaintOrderRoutingNumber": "",
                                        "ManufactureDate": "02-02-2025",
                                        "ManufactureMaterial": sMaterialDocument,
                                        "ManufacturingOrder": "",
                                        "MasterFixedAsset": "",
                                        "Material": sMaterialDocument,
                                        "MaterialDocument": sMaterialDocument,
                                        "MaterialDocumentItem": sMaterialDocument,
                                        "MaterialDocumentYear": "",
                                        "MaterialGrossWeight": 13.0,
                                        "MaterialName": sMaterialDocument,
                                        "MaterialNetWeight": 12.0,
                                        "MaterialSizeOrderDimensionDesc": "",
                                        "MaterialVolume": 0.0,
                                        "MaterialWeightUnit": "",
                                        "NumberOfLabelsToBePrinted": "2",
                                        "NumberOfSlipsToBePrinted": "1",
                                        "OrderPriceUnit": "EA",
                                        "OrderQuantityUnit": "1500",
                                        "Plant": "AT21"
                                    }
                                ]
                            }
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

        return super.init();
    }

}