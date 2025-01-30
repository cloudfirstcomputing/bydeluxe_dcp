const cds = require("@sap/cds");
module.exports = class BookingOrderService extends cds.ApplicationService {
    async init() {
        const { dcpcontent, dcpkey, S4H_SOHeader, S4H_BuisnessPartner, DistroSpec_Local, AssetVault_Local, S4H_CustomerSalesArea, BookingSalesOrder, BookingStatus, S4_Plants, S4_ShippingConditions, S4H_SOHeader_V2 } = this.entities;
        var s4h_so_Txn = await cds.connect.to("API_SALES_ORDER_SRV");
        var s4h_bp_Txn = await cds.connect.to("API_BUSINESS_PARTNER");
        var s4h_planttx = await cds.connect.to("API_PLANT_SRV");
        var s4h_shipConditions_Txn = await cds.connect.to("ZAPI_SHIPPINGCONDITION");
        var s4h_sohv2_Txn = await cds.connect.to("API_SALES_ORDER_V2_SRV");
        var sSoldToCustomer = '1000055', SalesOrganization = '1170', DistributionChannel = '20', Division = '20';
        // var sSoldToCustomer = '1000011', SalesOrganization = '1170', DistributionChannel = '20', Division = '20';
        this.on("createContent", async (req, res) => {
            let data = req?.data?.Records;
            let recordsToBePosted = [], finalResult = [], successEntries = [], failedEntries = [];
            for (var i in data) {
                try {
                    let entry_Active = await SELECT.one.from(dcpcontent).where({ BookingID: data[i].BookingID });
                    if (entry_Active) {
                        data[i].Message = `Booking ID ${data[i].BookingID} already exists`;
                        failedEntries.push(data[i]);
                    }
                    else {
                        // data[i].ApplicationID = "1000011";
                        data[i].Status_ID = "A";
                        recordsToBePosted.push(data[i]);
                    }
                }
                catch (e) {
                    data[i].Message = e.message;
                    failedEntries.push(data[i]);
                }
            }
            if (recordsToBePosted.length) {
                let postResult = await INSERT.into(dcpcontent).entries(recordsToBePosted);
                successEntries.push(recordsToBePosted);
                successEntries.push(postResult);
            }
            finalResult.push({ "Success": successEntries });
            finalResult.push({ "Error": failedEntries });
            return finalResult;
        });
        this.on("createKey", async (req, res) => {
            let data = req?.data?.Records;
            let recordsToBePosted = [], finalResult = [], successEntries = [], failedEntries = [];
            for (var i in data) {
                try {
                    let entry_Active = await SELECT.one.from(dcpkey).where({ BookingID: data[i].BookingID });
                    if (entry_Active) {
                        data[i].Message = `Booking ID ${data[i].BookingID} already exists`;
                        failedEntries.push(data[i]);
                    }
                    else {
                        data[i].Status_ID = "A";
                        recordsToBePosted.push(data[i]);
                    }
                }
                catch (e) {
                    data[i].Message = e.message;
                    failedEntries.push(data[i]);
                }
            }
            if (recordsToBePosted.length) {
                let postResult = await INSERT.into(dcpkey).entries(recordsToBePosted);
                successEntries.push(recordsToBePosted);
                successEntries.push(postResult);
            }
            finalResult.push({ "Success": successEntries });
            finalResult.push({ "Error": failedEntries });
            return finalResult;
        });
        this.on("processContent", async (req, res) => {
            await createSalesOrder(req, "C");
        });
        this.on("postKeyToSAP", async (req, res) => {
            await createSalesOrder(req, "K");
        });
        const createSalesOrder = async (req, sContentIndicator) => {
            var aBookingIDs = req.data?.bookingIDs, sErrorMessage, updateQuery = [], oPayLoad = {}, sContentIndicator = "C",
                aResponseStatus = [];
            if (!aBookingIDs?.length) {
                req.reject(400, "Booking ID was not sent for processing");
                return;
            }
            var aContentData = await SELECT.from(dcpcontent).where({ BookingID: { "IN": aBookingIDs } });
            if (!aContentData?.length) {
                sErrorMessage = "No data available to process";
                req.reject(400, "No data available to process");
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
                oPayLoad.SalesOrderType = "TA";

                var sCustomerRef = oContentData.UUID;
                var distroSpecData = await SELECT.one.from(DistroSpec_Local, (dist) => {
                    dist.DistroSpecUUID,
                        dist.DistroSpecID,
                        dist.Studio,
                        dist.ValidFrom,
                        dist.ValidTo,
                        dist.to_Package((pkg) => {
                            pkg.PackageUUID,
                                pkg.PackageName,
                                pkg.ValidFrom,
                                pkg.ValidTo,
                                pkg.ContentIndicator,
                                // pkg.SecondaryTerritory,
                                // pkg.PrimaryTerritoryDeliveryMethod_ShippingCondition,
                                // pkg.SecondaryTerritoryDeliveryMethod_ShippingCondition,
                                pkg.PrimaryDeliveryMethod_ShippingCondition,
                                pkg.SecondaryDeliveryMethod_ShippingCondition,
                                // pkg.DepotID,
                                pkg.Priority_DeliveryPriority,
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
                }).where({ CustomerReference: sCustomerRef });

                if (!distroSpecData || !Object.keys(distroSpecData).length) {
                    sErrorMessage = "DistroSpec not found";
                    updateQuery.push(UPDATE(dcpcontent).set({ ErrorMessage: sErrorMessage }).where({ BookingID: oContentData.BookingID }));
                }
                else {
                    var sShipDate = oContentData.ShipDate;
                    if (sShipDate) {
                        oPayLoad.RequestedDeliveryDate = sShipDate;
                    }
                    else {
                        sErrorMessage = "Ship Date is not maintained";
                        updateQuery.push(UPDATE(dcpcontent).set({ ErrorMessage: sErrorMessage }).where({ BookingID: oContentData.BookingID }));
                    }
                    var dPlayStartDate = new Date(oContentData.PlayStartDate.replace(/-/g, '/'));
                    var dPlayEndDate = new Date(oContentData.PlayEndDate.replace(/-/g, '/'));
                    var sDistValidFrom = distroSpecData.ValidFrom;
                    var sDistValidTo = distroSpecData.ValidTo;
                    sDistValidFrom = new Date(sDistValidFrom.replace(/-/g, '/'));
                    sDistValidTo = new Date(sDistValidTo.replace(/-/g, '/'));

                    if (dPlayStartDate < sDistValidFrom || dPlayEndDate > sDistValidTo) {
                        sErrorMessage = `DistroSpec not in validity. Validity period is from ${distroSpecData.ValidFrom} to ${distroSpecData.ValidTo}`;
                    }
                    else {
                        var sTheaterID = oContentData.TheaterID, sShipTo = "";
                        // var aSalesData = await s4h_bp_Txn.get(`/A_CustomerSalesArea?$filter=Customer eq '${sSoldToCustomer}' and SalesOrganization eq  '${SalesOrganization}' and DistributionChannel eq '${DistributionChannel}' and Division eq '${Division}'&$expand=to_PartnerFunction`);
                        var sEntityID = oContentData.EntityID;
                        var sBPCustomerNumber = "";
                        oPayLoad._Partner = [];
                        var aSalesData = await s4h_bp_Txn.run(SELECT.from(S4H_CustomerSalesArea, (salesArea) => { salesArea.to_PartnerFunction((partFunc) => { }) }).where({ Customer: sSoldToCustomer, SalesOrganization: SalesOrganization, DistributionChannel: DistributionChannel, Division: Division }));
                        if (aSalesData?.length) { //IDENTIFYING SHIP-TO
                            var oSalesData = aSalesData[0];
                        }
                        else {
                            sErrorMessage = `Sales Data not maintained for Customer ${sSoldToCustomer}-${SalesOrganization}/${DistributionChannel}/${Division}`;
                        }                        
                        if (sEntityID) {
                            if (sEntityID.toUpperCase() === "SPR")
                                sBPCustomerNumber = "1000055";
                            else if (sEntityID.toUpperCase() === "SPRI")
                                sBPCustomerNumber = "1000050";
                            else if (sEntityID.toUpperCase() === "SPC")
                                sBPCustomerNumber = "1000011";

                            sShipTo = sBPCustomerNumber;
                            oPayLoad._Partner.push({ "PartnerFunction": "WE", "Customer": sBPCustomerNumber });                            
                        }
                        else {
                            if (oSalesData?.to_PartnerFunction?.length > 0) {
                                var oPartnerFunction = oSalesData?.to_PartnerFunction.find((pf) => { return pf.PartnerFunction === "SH" && pf.CustomerPartnerDescription === sTheaterID });
                                if (oPartnerFunction && Object.keys(oPartnerFunction).length) {
                                    sBPCustomerNumber = oPartnerFunction.BPCustomerNumber;
                                    if (sBPCustomerNumber) {
                                        sShipTo = sBPCustomerNumber;
                                        oPayLoad._Partner.push({ "PartnerFunction": "WE", "Customer": sBPCustomerNumber });
                                    }
                                    else {
                                        sShipTo = "";
                                        sErrorMessage = "Ship-To not found";
                                    }
                                }
                                else {
                                    sErrorMessage = "Partner function details not found";
                                }
                            }
                            else {
                                sErrorMessage = "Partner function not available";
                            }
                        }
                        if (distroSpecData?.to_Package?.length) {
                            var sCustomerGroupFromS4 = oSalesData?.CustomerGroup;
                            var aPackages = distroSpecData.to_Package;
                            aPackages.sort(function (a, b) {
                                return a.Priority_DeliveryPriority.localeCompare(b.Priority_DeliveryPriority);
                            }); //SORT PACKAGES BASED ON PRIOIRTY                        
                            var aPackageFiltered = aPackages.filter((item) => {
                                if (item.ValidFrom && item.ValidTo) {
                                    var dPackageValidFrom = new Date(item.ValidFrom.replace(/-/g, '/'));
                                    var dPackageValidTo = new Date(item.ValidTo.replace(/-/g, '/'));
                                    var sPrimaryShipCondn = item.PrimaryDeliveryMethod_ShippingCondition;
                                    var sSecondaryShipCondn = item.SecondaryDeliveryMethod_ShippingCondition;
                                    if (dPlayStartDate < dPackageValidFrom || dPlayEndDate > dPackageValidTo) {
                                        return false;
                                    }
                                    else if (item.ContentIndicator !== sContentIndicator) {
                                        return false;
                                    }
                                    else {
                                        return true;
                                    }
                                    // else if(sCustomerGroupFromS4 === sPrimaryShipCondn || sCustomerGroupFromS4 === sSecondaryShipCondn){
                                    //     return true;
                                    // }
                                }
                                else {//THE PACKAGE IS CONSIDERED EVEN IF NO VALIDITY PERIOD IS MAINTAINED
                                    if (sCustomerGroupFromS4 === sPrimaryShipCondn || sCustomerGroupFromS4 === sSecondaryShipCondn) {
                                        return true;
                                    }
                                    else {
                                        return false
                                    }
                                }
                            });
                            if (aPackageFiltered?.length) {
                                var aBPFromS4 = await s4h_bp_Txn.run(SELECT.from(S4H_BuisnessPartner, (bp) => {
                                    bp.to_BusinessPartnerAddress((bpAddr) => { }),
                                        bp.to_Customer((bpCustomer) => { })
                                }).where({ BusinessPartner: sSoldToCustomer }));
                                var oBusinessPartnerAddrfromS4 = "";
                                if (aBPFromS4?.length) {
                                    var oBPFromS4 = aBPFromS4[0];
                                    if (oBPFromS4.to_BusinessPartnerAddress?.length) {
                                        oBusinessPartnerAddrfromS4 = oBPFromS4.to_BusinessPartnerAddress[0];
                                    }
                                }
                                for (var i in aPackageFiltered) {
                                    var oFilteredPackage = aPackageFiltered[i];
                                    var sPrDelMethod = oFilteredPackage.PrimaryDeliveryMethod_ShippingCondition;
                                    var sSecDelMethod = oFilteredPackage.SecondaryDeliveryMethod_ShippingCondition;
                                    var sDeliveryMethod = sPrDelMethod ? sPrDelMethod : sSecDelMethod;
                                    if (sDeliveryMethod) {
                                        oPayLoad.ShippingCondition = sDeliveryMethod;
                                    }
                                    if (oFilteredPackage?.to_DCPMaterial) {
                                        oPayLoad._Item = [];
                                        for (var j in oFilteredPackage.to_DCPMaterial) {
                                            var oMatRecord = oFilteredPackage.to_DCPMaterial[j];
                                            var oEntry = {
                                                "Product": oMatRecord.DCPMaterialNumber_Product,
                                                "RequestedQuantity": 1,
                                                "RequestedQuantityISOUnit": "EA",
                                                "DeliveryPriority": oFilteredPackage?.Priority_DeliveryPriority
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
                                            oPayLoad._Item.push(oEntry);
                                        }
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
                    // aContentData[i].ErrorMessage = sErrorMessage;
                    updateQuery.push(UPDATE(dcpcontent).set({ ErrorMessage: sErrorMessage, Status_ID: "D" }).where({ BookingID: oContentData.BookingID }));
                    aResponseStatus.push({
                        "message": `| Booking ID: ${oContentData.BookingID}: ${sErrorMessage} |`,
                        "status": "E"
                    });
                }                
                else {
                    var postResult = await s4h_so_Txn.send({
                        method: 'POST',
                        path: '/SalesOrder',
                        data: oPayLoad
                    }).catch((err) => {
                        updateQuery.push(UPDATE(dcpcontent).set({ ErrorMessage: err.message }).where({ BookingID: oContentData.BookingID }));
                        aResponseStatus.push({
                            "message": `| Booking ID: ${oContentData.BookingID}: ${err.message} |`,
                            "status": "E"
                        });
                    }).then((result) => {
                        if (result) {
                            bPostingSuccess = true;
                            sSalesOrder = result?.SalesOrder;
                            updateQuery.push(UPDATE(dcpcontent).set({ SalesOrder: result?.SalesOrder, Status_ID: "C", ErrorMessage: "" }).where({ BookingID: oContentData.BookingID }));
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
                        var aSalesOrderData = await s4h_so_Txn.run(SELECT.from(S4H_SOHeader, (header) => {
                            header`.*`,
                                header._Item((item) => { }),
                                header._Partner((partner) => { }),
                                header._Text((text) => { })
                        }).where({ SalesOrder: sSalesOrder }));

                        if (aSalesOrderData?.length) {
                            var oSalesOrder = aSalesOrderData[0]; //IT IS ALWAYS 1 RECORD
                            var oRecordsToBePosted = oContentData;
                            oRecordsToBePosted.DistroSpecID = distroSpecData.DistroSpecID;
                            oRecordsToBePosted.DistroSpecPackageID = aPackageFiltered[0].PackageUUID;
                            oRecordsToBePosted.DistroSpecPackageName = aPackageFiltered[0].PackageName;
                            var aSalesOrderItems = oSalesOrder._Item;
                            for (var item in aSalesOrderItems) {
                                var oSalesOrderItem = aSalesOrderItems[item];
                                var oAssetvault = await SELECT.one.from(AssetVault_Local).where({ DCP: oSalesOrderItem.Product });
                                var sGoFilexTitleID = oAssetvault?.GoFilexTitleID_NORAM;
                                oSalesOrder._Item[item].LongText = sGoFilexTitleID;
                                if (oPayLoad?.ShippingCondition && oPayLoad?.ShippingCondition === '02' && sGoFilexTitleID) {
                                    await updateItemTextForSalesOrder(req, "Z004", sGoFilexTitleID, aResponseStatus, oSalesOrderItem, oContentData);
                                }
                                var oCTTCPL = aCTTCPL?.find((entry) => { return entry.Product === oSalesOrderItem.Product });
                                if (oCTTCPL) {
                                    oSalesOrder._Item[item].CTT = oCTTCPL.LinkedCTT;
                                    oSalesOrder._Item[item].CPLUUID = oCTTCPL.CPLUUID;
                                    await updateItemTextForSalesOrder(req, "Z005", oCTTCPL.CPLUUID, aResponseStatus, oSalesOrderItem, oContentData);
                                    if (sContentIndicator === "K") {
                                        await updateItemTextForSalesOrder(req, "0001", oCTTCPL.LinkedCTT, aResponseStatus, oSalesOrderItem, oContentData);
                                    }
                                }
                            } //ITERATING ITEM END
                            Object.assign(oRecordsToBePosted, oContentData);
                            Object.assign(oRecordsToBePosted, oSalesOrder);
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
        this.on("createSalesOrderFromReference", async (req) => {
            var sBookingID = req.data?.bookingID, sSalesOrder = req.data?.salesOrder, sPlant = req.data?.plant, oContentData, 
            sShippingCondition = req.data?.shippingCondition, sDeliveryDate = req.data?.deliveryDate, aResponseStatus = [];
            if(sBookingID){
                oContentData = await SELECT.one.from(dcpcontent).where({BookingID: sBookingID});
            }
            else if(sSalesOrder){
                oContentData = SELECT.one.from(dcpcontent).where({SalesOrder: sSalesOrder});
            }
            else{
                req.reject(501, "Booking ID / Sales order not available for processing");
            }
            if(!oContentData){
                req.reject(501, "Selected entry not available");
            }
            else if(!oContentData.SalesOrder){
                req.reject(501, "Please Select an entry where Sales Order is available for remediation");
            }
            else if(oContentData.ReferenceSDDocument){
                req.reject(501, "Remediation is already done for the selection");
            }
            var oHeaderProperties = ["SoldToParty",
                "SalesOrganization",
                "DistributionChannel",
                "OrganizationDivision",
                "PurchaseOrderByCustomer",
                "SalesOrderType"],
                oPartnerProperties = ["PartnerFunction", "Customer"],
                oItemProperties = ["RequestedQuantity", "RequestedQuantityISOUnit", "DeliveryPriority"];
            var oSalesOrderPayload = {
                "to_Item": [],
                "to_Partner": []
            };
            var aSalesOrderData = await s4h_so_Txn.run(SELECT.from(S4H_SOHeader, (header) => {
                header`.*`,
                    header._Item((item) => { }),
                    header._Partner((partner) => { })
            }).where({ SalesOrder: sSalesOrder }));
            if (aSalesOrderData.length) {
                var oSalesOrder = aSalesOrderData[0];
                for (var i in oHeaderProperties) {
                    oSalesOrderPayload[oHeaderProperties[i]] = oSalesOrder[oHeaderProperties[i]]
                }
                oSalesOrderPayload["ShippingCondition"] = sShippingCondition;
                oSalesOrderPayload["ReferenceSDDocument"] = sSalesOrder;
                oSalesOrderPayload["RequestedDeliveryDate"] = `/Date(${new Date(sDeliveryDate).getTime()})/`;
                // oSalesOrderPayload["PricingReferenceMaterial"] = sSalesOrder;
                var aSOItems = oSalesOrder._Item;
                for (var i in aSOItems) {
                    var oPayloadItem = {};
                    for (var j in oItemProperties) {
                        oPayloadItem[oItemProperties[j]] = aSOItems[i][oItemProperties[j]];
                    }
                    // oPayloadItem["ProductionPlant"] = sPlant;
                    oPayloadItem["ProductionPlant"] = sPlant;
                    oPayloadItem["Material"] = aSOItems[i]["Product"];
                    oPayloadItem["RequestedQuantity"] = `${aSOItems[i]["RequestedQuantity"]}`;
                    oSalesOrderPayload.to_Item.push(oPayloadItem);
                }
                var aSOPartners = oSalesOrder._Partner;
                for (var i in aSOPartners) {
                    var oPayloadPartner = {};
                    for (var j in oPartnerProperties) {
                        oPayloadPartner[oPartnerProperties[j]] = aSOPartners[i][oPartnerProperties[j]];
                    }
                    oSalesOrderPayload.to_Partner.push(oPayloadPartner);
                }

                await s4h_sohv2_Txn.send({
                    method: 'POST',
                    path: '/A_SalesOrder',
                    data: oSalesOrderPayload
                }).catch((err) => {

                    aResponseStatus.push({
                        "message": `| With Reference Sales Order: ${sSalesOrder}: ${err.message} |`,
                        "status": "E"
                    });
                }).then(async (result) => {
                    if (result) {
                        await UPDATE(dcpcontent).set({ ReferenceSDDocument: result?.SalesOrder }).where({ BookingID: oContentData.BookingID })
                        aResponseStatus.push({
                            "message": `| With reference to Sales Order: ${sSalesOrder}, Sales Order: ${result?.SalesOrder} is created |`,
                            "status": "S"
                        });
                    }
                });
            }
            else {
                aResponseStatus.push({
                    "message": `| Sales Order: ${sSalesOrder} not available |`,
                    "status": "E"
                });
            }
            req.reply({
                code: 201,
                message: JSON.stringify(aResponseStatus)
            });
        });

        this.on(['READ'], S4_Plants, req => {
            return s4h_planttx.run(req.query);
        });
        this.on(['READ'], S4_ShippingConditions, req => {
            return s4h_shipConditions_Txn.run(req.query);
        });
        this.on(['READ'], S4H_SOHeader_V2, req => {
            return s4h_sohv2_Txn.run(req.query);
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
        return super.init();
    }

}