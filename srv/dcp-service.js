const cds = require("@sap/cds");
module.exports = class BookingOrderService extends cds.ApplicationService {
    async init() {
        const { dcpcontent, dcpkey, S4H_SOHeader, S4H_BuisnessPartner, DistroSpec_Local, AssetVault_Local, S4H_CustomerSalesArea, BookingSalesOrder, BookingStatus, S4_Plants, S4_ShippingConditions, S4H_SOHeader_V2, S4H_SalesOrderItem_V2, ShippingConditionTypeMapping } = this.entities;
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
        this.on("createMaccs", async (req, res) => {
        });
        this.on("createComscoreHollywood", async (req, res) => {
        });
        this.on("CreateDisneyOFE", async (req, res) => {
        });
        this.on("processContent", async (req, res) => {
            await createSalesOrder(req, "C");
        });
        this.on("postKeyToSAP", async (req, res) => {
            await createSalesOrder(req, "K");
        });

        const createSalesOrder = async (req, sContentIndicator) => {
            var aBookingIDs = req.data?.bookingIDs, sErrorMessage, updateQuery = [], oPayLoad = {},
                aResponseStatus = [], hanaDBTable = dcpcontent;
            if (!aBookingIDs?.length) {
                req.reject(400, "Booking ID was not sent for processing");
                return;
            }
            hanaDBTable = sContentIndicator === "C" ? dcpcontent : dcpkey;
            var aContentData = await SELECT.from(hanaDBTable).where({ BookingID: { "IN": aBookingIDs } });

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
                        dist.Title_Product,
                        dist.KeyStartTime,
                        dist.KeyEndTime,
                        dist.InitialKeyDuration,
                        dist.NextKeyDuration,
                        dist.OffsetEPD,
                        dist.AggregateKey,
                        dist.ProcessKDMS,
                        dist.ProcessScreeningKDMS,
                        dist.MaxKDMSDuration,
                        dist.StudioHoldOverRule,
                        dist.SalesTerritory_SalesDistrict,
                        dist.InferKeyContentOrder,
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
                    updateQuery.push(UPDATE(hanaDBTable).set({ ErrorMessage: sErrorMessage }).where({ BookingID: oContentData.BookingID }));
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
                        oPayLoad.to_Partner = [];
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
                            oPayLoad.to_Partner.push({ "PartnerFunction": "WE", "Customer": sBPCustomerNumber });
                        }
                        else {
                            if (oSalesData?.to_PartnerFunction?.length > 0) {
                                var oPartnerFunction = oSalesData?.to_PartnerFunction.find((pf) => { return pf.PartnerFunction === "SH" && pf.CustomerPartnerDescription === sTheaterID });
                                if (oPartnerFunction && Object.keys(oPartnerFunction).length) {
                                    sBPCustomerNumber = oPartnerFunction.BPCustomerNumber;
                                    if (sBPCustomerNumber) {
                                        sShipTo = sBPCustomerNumber;
                                        oPayLoad.to_Partner.push({ "PartnerFunction": "WE", "Customer": sBPCustomerNumber });
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
                                // var aBPFromS4 = await s4h_bp_Txn.run(SELECT.from(S4H_BuisnessPartner, (bp) => {
                                //     bp.to_BusinessPartnerAddress((bpAddr) => { }),
                                //         bp.to_Customer((bpCustomer) => { })
                                // }).where({ BusinessPartner: sSoldToCustomer }));
                                // var oBusinessPartnerAddrfromS4 = "";
                                // if (aBPFromS4?.length) {
                                //     var oBPFromS4 = aBPFromS4[0];
                                //     if (oBPFromS4.to_BusinessPartnerAddress?.length) {
                                //         oBusinessPartnerAddrfromS4 = oBPFromS4.to_BusinessPartnerAddress[0];
                                //     }
                                // }
                                var oBPPackage = aPackageFiltered.find((oPkg) => {
                                    return oPkg?.PrimaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod1_csa ||
                                        oPkg?.PrimaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod2_csa ||
                                        oPkg?.PrimaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod3_csa ||
                                        oPkg?.PrimaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod4_csa ||
                                        oPkg?.PrimaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod5_csa ||
                                        oPkg?.PrimaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod6_csa ||
                                        oPkg?.PrimaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod7_csa ||
                                        oPkg?.PrimaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod8_csa ||
                                        oPkg?.PrimaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod9_csa ||
                                        oPkg?.PrimaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod10_csa ||
                                        oPkg?.SecondaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod1_csa ||
                                        oPkg?.SecondaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod2_csa ||
                                        oPkg?.SecondaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod3_csa ||
                                        oPkg?.SecondaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod4_csa ||
                                        oPkg?.SecondaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod5_csa ||
                                        oPkg?.SecondaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod6_csa ||
                                        oPkg?.SecondaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod7_csa ||
                                        oPkg?.SecondaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod8_csa ||
                                        oPkg?.SecondaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod9_csa ||
                                        oPkg?.SecondaryDeliveryMethod_ShippingCondition === oSalesData?.YY1_DeliveryMethod10_csa

                                });
                                if (oBPPackage) {
                                    aPackageFiltered = [oBPPackage];
                                    if (oBPPackage.PrimaryDeliveryMethod_ShippingCondition === "05" ||
                                        oBPPackage.PrimaryDeliveryMethod_ShippingCondition === "06" ||
                                        oBPPackage.PrimaryDeliveryMethod_ShippingCondition === "10" ||
                                        oBPPackage.SecondaryDeliveryMethod_ShippingCondition === "05" ||
                                        oBPPackage.SecondaryDeliveryMethod_ShippingCondition === "06" ||
                                        oBPPackage.SecondaryDeliveryMethod_ShippingCondition === "10"
                                    ) {
                                        if (!oSalesData?.YY1_DCDCFlag_csa) {
                                            // sErrorMessage = `DCDC Capability not found. Primary Del.Method from Distrospec Package: ${PrimaryDeliveryMethod_ShippingCondition}, Secondary Del.Method from Distrospec Package: ${SecondaryDeliveryMethod_ShippingCondition}`;
                                            sErrorMessage = `DCDC Capability not found.`;
                                        }
                                    }
                                }
                                else {
                                    // sErrorMessage = `Theater Capability not found. Primary Del.Method from Distrospec Package: ${PrimaryDeliveryMethod_ShippingCondition}, Secondary Del.Method from Distrospec Package: ${SecondaryDeliveryMethod_ShippingCondition}`;
                                    sErrorMessage = `Theater Capability not found.`;
                                }
                                for (var i in aPackageFiltered) {
                                    var oFilteredPackage = aPackageFiltered[i];
                                    var sPrDelMethod = oFilteredPackage.PrimaryDeliveryMethod_ShippingCondition;
                                    var sSecDelMethod = oFilteredPackage.SecondaryDeliveryMethod_ShippingCondition;
                                    var sDeliveryMethod = sPrDelMethod ? sPrDelMethod : sSecDelMethod;
                                    var sShippingType = "";
                                    if (sDeliveryMethod) {
                                        oPayLoad.ShippingCondition = sDeliveryMethod;
                                        var oShippingTypeMapping = await SELECT.one.from(ShippingConditionTypeMapping).where({ShippingCondition: sDeliveryMethod});
                                        sShippingType = oShippingTypeMapping.ShippingType;
                                    }
                                    oPayLoad.to_Item = [];
                                    if (
                                        // (sContentIndicator === "C" && distroSpecData.InferKeyContentOrder) ||
                                        (sContentIndicator === "K")
                                    ) {
                                        var sStartDate = oContentData.StartDate;
                                        var sStartTime = oContentData.StartTime;
                                        var sEndDate = oContentData.EndDate;
                                        var sEndTime = oContentData.EndTime;
                                        var dStartDate = sStartTime ? new Date(`${sStartDate}T${sStartTime}`) : new Date(sStartDate);
                                        var dEndDate = sEndTime ? new Date(`${sEndDate}T${sEndTime}`) : new Date(sEndDate);
                                        var iDifferenceInHours = (dEndDate - dStartDate) / (60 * 60 * 1000);
                                        if (iDifferenceInHours > 24) {
                                            var oEntry = {
                                                "Material": "2292",
                                                "RequestedQuantity": '1',
                                                "RequestedQuantityISOUnit": "EA",
                                                "DeliveryPriority": oFilteredPackage?.Priority_DeliveryPriority
                                            };
                                        }
                                        else {
                                            oEntry = {
                                                "Material": "2570",
                                                "RequestedQuantity": '1',
                                                "RequestedQuantityISOUnit": "EA",
                                                "DeliveryPriority": oFilteredPackage?.Priority_DeliveryPriority
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
                                                "DeliveryPriority": oFilteredPackage?.Priority_DeliveryPriority,
                                                "PricingReferenceMaterial": distroSpecData?.Title_Product,
                                                "ShippingType":sShippingType
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
                    updateQuery.push(UPDATE(hanaDBTable).set({ ErrorMessage: sErrorMessage, Status_ID: "D" }).where({ BookingID: oContentData.BookingID }));
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
                        updateQuery.push(UPDATE(hanaDBTable).set({ ErrorMessage: err.message }).where({ BookingID: oContentData.BookingID }));
                        aResponseStatus.push({
                            "message": `| Booking ID: ${oContentData.BookingID}: ${err.message} |`,
                            "status": "E"
                        });
                    }).then((result) => {
                        if (result) {
                            bPostingSuccess = true;
                            sSalesOrder = result?.SalesOrder;
                            updateQuery.push(UPDATE(hanaDBTable).set({ SalesOrder: result?.SalesOrder, Status_ID: "C", ErrorMessage: "" }).where({ BookingID: oContentData.BookingID }));
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
                        var aSalesOrderData = await s4h_sohv2_Txn.run(SELECT.from(S4H_SOHeader_V2).columns(['*', {"ref":["to_Item"], "expand": ["*"]}]).where({SalesOrder: sSalesOrder}));
                        // var aSalesOrderData = await s4h_sohv2_Txn.get(`/A_SalesOrder?$filter=SalesOrder eq '${sSalesOrder}'&$expand=to_Item,to_Partner`);


                        if (aSalesOrderData?.length) {
                            var oSalesOrder = aSalesOrderData[0]; //IT IS ALWAYS 1 RECORD
                            var oRecordsToBePosted = oContentData;
                            oRecordsToBePosted.DistroSpecID = distroSpecData.DistroSpecID;
                            oRecordsToBePosted.DistroSpecPackageID = aPackageFiltered[0].PackageUUID;
                            oRecordsToBePosted.DistroSpecPackageName = aPackageFiltered[0].PackageName;
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
                                Object.assign(oSalesOrder._Item[item], oSalesOrderItem); //Assigining updated field name values back

                                oSalesOrder._Item[item].ShippingType_ID = oSalesOrderItem.ShippingType;

                                oSalesOrder._Item[item]["KeyStartTime"] = distroSpecData.KeyStartTime;
                                oSalesOrder._Item[item]["KeyEndTime"] = distroSpecData.KeyEndTime;
                                oSalesOrder._Item[item]["InitialKeyDuration"] = distroSpecData.InitialKeyDuration;
                                oSalesOrder._Item[item]["NextKeyDuration"] = distroSpecData.NextKeyDuration;
                                oSalesOrder._Item[item]["OffsetEPD"] = distroSpecData.OffsetEPD;
                                oSalesOrder._Item[item]["InferKeyContentOrder"] = distroSpecData.InferKeyContentOrder;
                                oSalesOrder._Item[item]["AggregateKey"] = distroSpecData.AggregateKey;
                                oSalesOrder._Item[item]["ProcessKDMS"] = distroSpecData.ProcessKDMS;
                                oSalesOrder._Item[item]["ProcessScreeningKDMS"] = distroSpecData.ProcessScreeningKDMS;
                                oSalesOrder._Item[item]["MaxKDMSDuration"] = distroSpecData.MaxKDMSDuration;
                                oSalesOrder._Item[item]["StudioHoldOverRule"] = distroSpecData.StudioHoldOverRule;
                                oSalesOrder._Item[item]["SalesTerritory"] = distroSpecData.SalesTerritory_SalesDistrict;

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

        this.on("remediateContentSalesOrder", async (req, res) => {
            await remediateSalesOrder(req, "C");
        });
        this.on("remediateKeySalesOrder", async (req, res) => {
            await remediateSalesOrder(req, "K");
        });
        const remediateSalesOrder = async (req, sContentIndicator) => {
            var sBookingID = req.data?.bookingID, sSalesOrder = req.data?.salesOrder, sPlant = req.data?.plant, oContentData,
                sShippingCondition = req.data?.shippingCondition, sDeliveryDate = req.data?.deliveryDate, aResponseStatus = [], hanaDBTable;
            hanaDBTable = sContentIndicator === "C" ? dcpcontent : dcpkey;
            if (sBookingID) {
                oContentData = await SELECT.one.from(hanaDBTable).where({ BookingID: sBookingID });
            }
            else if (sSalesOrder) {
                oContentData = SELECT.one.from(hanaDBTable).where({ SalesOrder: sSalesOrder });
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
            var oSalesOrderItem = await s4h_sohv2_Txn.run(SELECT.one.from(S4H_SalesOrderItem_V2).columns(["*"]).where({ SalesOrder: sSalesOrder }));
            if (oSalesOrderItem) {
                oSalesorderItem_PayLoad["Material"] = oSalesOrderItem.Material;
                oSalesorderItem_PayLoad["RequestedQuantity"] = `${oSalesOrderItem.RequestedQuantity}`;
                oSalesorderItem_PayLoad["RequestedQuantityISOUnit"] = oSalesOrderItem.RequestedQuantityISOUnit;
                oSalesorderItem_PayLoad["ProductionPlant"] = oSalesOrderItem.ProductionPlant;
                oSalesorderItem_PayLoad["ShippingPoint"] = oSalesOrderItem.ShippingPoint;
                oSalesorderItem_PayLoad["ItemBillingBlockReason"] = oSalesOrderItem.ItemBillingBlockReason;
            }
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
            req.reply({
                code: 201,
                message: JSON.stringify(aResponseStatus)
            });
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

        this.on(['READ'], S4_Plants, req => {
            return s4h_planttx.run(req.query);
        });
        this.on(['READ'], S4_ShippingConditions, req => {
            return s4h_shipConditions_Txn.run(req.query);
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
        return super.init();
    }

}