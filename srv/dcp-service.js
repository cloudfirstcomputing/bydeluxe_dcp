const cds = require("@sap/cds");
module.exports = class BookingOrderService extends cds.ApplicationService {
    async init() {
        const { dcpcontent, dcpkey, S4H_SOHeader, S4H_BuisnessPartner, DistroSpec_Local, S4H_CustomerSalesArea } = this.entities;
        var s4h_so_Txn = await cds.connect.to("API_SALES_ORDER_SRV");
        var s4h_bp_Txn = await cds.connect.to("API_BUSINESS_PARTNER");
        var Customer = '1000011', SalesOrganization = '1170', DistributionChannel = '20', Division = '20';
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
                        data[i].Status = "A";
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
                        data[i].Status = "A";
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
            var aBookingIDs = req.data?.bookingIDs, sErrorMessage, updateQuery = [], oPayLoad = {};
            if(!aBookingIDs?.length){
                req.reject(400, "Booking ID was not sent for processing");
                return;
            }
            var aContentData = await SELECT.from(dcpcontent).where({ BookingID: { "IN": aBookingIDs } });
            if (!aContentData?.length) {
                sErrorMessage = "No data available to process";
                req.reject(400, "No data available to process");
                return;
            }
            // var aCustomerRef = aContentData.map((item) => {
            //     return item.UUID;
            // });//GETTING UUIDs TO SEARCH IN DISTROSPEC
            // var aCustomerRef = aContentData.map((item) => {
            //     return {"UUID":item.UUID, "BookingID":item.BookingID};
            // });            

            for (var i in aContentData) {
                var oContentData = aContentData[i];

                oPayLoad.SoldToParty = Customer;
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
                                // pkg.DistributionFilterCountry,
                                // pkg.Theater_BusinessPartner,
                                // pkg.PrimaryTerritory,
                                // pkg.SecondaryTerritory,
                                // pkg.PrimaryTerritoryDeliveryMethod_ShippingCondition,
                                // pkg.SecondaryTerritoryDeliveryMethod_ShippingCondition,
                                pkg.PrimaryDeliveryMethod_ShippingCondition,
                                pkg.SecondaryDeliveryMethod_ShippingCondition,
                                // pkg.DepotID,
                                pkg.Priority_DeliveryPriority,
                                pkg.to_DistRestriction((dist) => {
                                    dist.DistributionFilterCountry
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
                    var updateResult = await Promise.all(updateQuery);
                    continue;
                }
                var sShipDate = oContentData.ShipDate;
                if (sShipDate) {
                    var dShipDate = new Date(sShipDate.replace(/-/g, '/'));
                    var validFrom = distroSpecData.ValidFrom, validTo = distroSpecData.ValidTo;
                    validFrom = new Date(validFrom.replace(/-/g, '/'));
                    validTo = new Date(validTo.replace(/-/g, '/'));

                    if (dShipDate < validFrom || dShipDate > validTo) {
                        sErrorMessage = `DistroSpec not in validity. Validity period is from ${distroSpecData.ValidFrom} to ${distroSpecData.ValidTo}`;
                        // req.reject(400, "DistroSpec not in validity");
                    }
                    else {
                        oPayLoad.RequestedDeliveryDate = sShipDate;
                    }
                }
                else {
                    sErrorMessage = "Ship Date is not maintained";
                    // req.reject(400, "Ship Date is not maintained");
                }
                var sTheaterID = oContentData.TheaterID;
                // let oSalesData = await s4h_bp_Txn.run(SELECT.from(S4H_CustomerSalesArea));
                var aSalesData = await s4h_bp_Txn.get(`/A_CustomerSalesArea?$filter=Customer eq '${Customer}' and SalesOrganization eq  '${SalesOrganization}' and DistributionChannel eq '${DistributionChannel}' and Division eq '${Division}'&$expand=to_PartnerFunction`);
                if (distroSpecData?.to_Package?.length) {
                    if (aSalesData.length) {
                        var oSalesData = aSalesData[0];
                    }
                    if (oSalesData?.to_PartnerFunction?.length > 0) {
                        var oPartnerFunction = oSalesData?.to_PartnerFunction.find((item) => { return item.PartnerFunction === "SH" && item.CustomerPartnerDescription === sTheaterID });
                        if (oPartnerFunction && Object.keys(oPartnerFunction).length) {
                            var sBPCustomerNumber = oPartnerFunction.BPCustomerNumber;
                            if (sBPCustomerNumber) {
                                oPayLoad._Partner = [{ "PartnerFunction": "WE", "Customer": sBPCustomerNumber }];
                                // var oPackage = distroSpecData.to_Package.find((item) => { return item.Theater_BusinessPartner === sBPCustomerNumber });
                                // if (oPackage && Object.keys(oPackage).length) {
                                //     if (oContentData.Territory) {
                                //         if (oContentData.Territory === oPackage.PrimaryTerritory) {
                                //             var sDeliveryMethod = oPackage.PrimaryTerritoryDeliveryMethod_ShippingCondition;
                                //         }
                                //         else if (oContentData.Territory === oPackage.SecondaryTerritory) {
                                //             sDeliveryMethod = oPackage.SecondaryTerritoryDeliveryMethod_ShippingCondition;
                                //         }
                                //         if (sDeliveryMethod) {
                                //             oPayLoad.ShippingCondition = sDeliveryMethod;
                                //         }
                                //     }
                                //     if (oPackage?.to_DCPMaterial && oPackage?.to_DCPMaterial) {
                                //         oPayLoad._Item = [];
                                //         for (var j in oPackage.to_DCPMaterial) {
                                //             var oMatRecord = oPackage.to_DCPMaterial[j];
                                //             var oEntry = {
                                //                 "Product": oMatRecord.DCPMaterialNumber_Product,
                                //                 "RequestedQuantity": 1,
                                //                 "RequestedQuantityISOUnit": "EA",
                                //                 "DeliveryPriority": oPackage?.Priority_DeliveryPriority
                                //             };
                                //             oPayLoad._Item.push(oEntry);
                                //         }
                                //     }
                                //     else {
                                //         sErrorMessage = "DCP Material not available";
                                //     }
                                // }
                                // else {
                                //     sErrorMessage = `Package not available for BP Customer: ${sBPCustomerNumber}`;
                                // }
                                var aPackages = distroSpecData.to_Package;
                                if (aPackages?.length) {
                                    let oPackage = {};
                                    for (var k in aPackages) {
                                        oPackage = aPackages[k].to_DistRestriction.find((oDist) => { return oDist.DistributionFilterCountry_code === oContentData.Territory });
                                        if (oPackage && Object.keys(oPackage)) {
                                            oPackage = aPackages[k];
                                            break;
                                        }
                                    }
                                    if (!oPackage || !Object.keys(oPackage)) {
                                        sErrorMessage = `Package not available for BP Customer: ${sBPCustomerNumber}`;
                                    }
                                    else {
                                        var sPrDelMethod = oPackage.PrimaryDeliveryMethod_ShippingCondition;
                                        var sSecDelMethod = oPackage.SecondaryDeliveryMethod_ShippingCondition;
                                        var sDeliveryMethod = sPrDelMethod ? sPrDelMethod : sSecDelMethod;
                                        if (sDeliveryMethod) {
                                            oPayLoad.ShippingCondition = sDeliveryMethod;
                                        }
                                        if (oPackage?.to_DCPMaterial && oPackage?.to_DCPMaterial) {
                                            oPayLoad._Item = [];
                                            for (var j in oPackage.to_DCPMaterial) {
                                                var oMatRecord = oPackage.to_DCPMaterial[j];
                                                var oEntry = {
                                                    "Product": oMatRecord.DCPMaterialNumber_Product,
                                                    "RequestedQuantity": 1,
                                                    "RequestedQuantityISOUnit": "EA",
                                                    "DeliveryPriority": oPackage?.Priority_DeliveryPriority
                                                };
                                                oPayLoad._Item.push(oEntry);
                                            }
                                        }
                                        else {
                                            sErrorMessage = "DCP Material not available";
                                        }
                                    }
                                }
                                else {
                                    sErrorMessage = "Package not maintained in DistrSpec";
                                }
                            }
                            else {
                                sErrorMessage = "Bill-To not found";
                            }
                        }
                        else {
                            sErrorMessage = "Ship-To not found";
                        }
                    }
                    else {
                        // req.reject(400, "Partner function not available");
                        sErrorMessage = "Partner function not available";
                    }
                }
                // oPayLoad.ShippingCondition
                if (sErrorMessage) {
                    // aContentData[i].ErrorMessage = sErrorMessage;
                    updateQuery.push(UPDATE(dcpcontent).set({ ErrorMessage: sErrorMessage }).where({ BookingID: oContentData.BookingID }));
                }
                else {
                    var postResult = await s4h_so_Txn.send({
                        method: 'POST',
                        path: '/SalesOrder',
                        data: oPayLoad
                    }).catch((err) => {
                        updateQuery.push(UPDATE(dcpcontent).set({ ErrorMessage: err.message }).where({ BookingID: oContentData.BookingID }));
                    }).then((result) => {
                        if (result)
                            updateQuery.push(UPDATE(dcpcontent).set({ SalesOrder: result?.SalesOrder, ErrorMessage: "" }).where({ BookingID: oContentData.BookingID }));
                    });
                }
                if (updateQuery.length) {
                    var updateResult = await Promise.all(updateQuery);
                }
            }
        });
        // this.on("reconcileContent", async (req, res) => {

        // });
        this.on("postKeyToSAP", async (req, res) => {          
            var aBookingIDs = req.data?.bookingIDs, sErrorMessage, updateQuery = [], oPayLoad = {};
            if(!aBookingIDs?.length){
                req.reject(400, "Booking ID was not sent for processing");
                return;
            }
            var aContentData = await SELECT.from(dcpkey).where({ BookingID: { "IN": aBookingIDs } });
            if (!aContentData?.length) {
                sErrorMessage = "No data available to process";
                req.reject(400, "No data available to process");
                return;
            }           

            for (var i in aContentData) {
                var oContentData = aContentData[i];

                oPayLoad.SoldToParty = Customer;
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
                                pkg.PrimaryDeliveryMethod_ShippingCondition,
                                pkg.SecondaryDeliveryMethod_ShippingCondition,
                                pkg.Priority_DeliveryPriority,
                                pkg.to_DistRestriction((dist) => {
                                    dist.DistributionFilterCountry
                                }),
                                pkg.to_DCPMaterial((dcpmat) => {
                                    dcpmat.DCPMaterialUUID,
                                        dcpmat.DCPMaterialNumber_Product
                                });
                        })
                }).where({ CustomerReference: sCustomerRef });

                if (!distroSpecData || !Object.keys(distroSpecData).length) {
                    sErrorMessage = "DistroSpec not found";
                    updateQuery.push(UPDATE(dcpkey).set({ ErrorMessage: sErrorMessage }).where({ BookingID: oContentData.BookingID }));
                    var updateResult = await Promise.all(updateQuery);
                    continue;
                }
                var sShipDate = oContentData.ShipDate;
                if (sShipDate) {
                    var dShipDate = new Date(sShipDate.replace(/-/g, '/'));
                    var validFrom = distroSpecData.ValidFrom, validTo = distroSpecData.ValidTo;
                    validFrom = new Date(validFrom.replace(/-/g, '/'));
                    validTo = new Date(validTo.replace(/-/g, '/'));

                    if (dShipDate < validFrom || dShipDate > validTo) {
                        sErrorMessage = `DistroSpec not in validity. Validity period is from ${distroSpecData.ValidFrom} to ${distroSpecData.ValidTo}`;
                        // req.reject(400, "DistroSpec not in validity");
                    }
                    else {
                        oPayLoad.RequestedDeliveryDate = sShipDate;
                    }
                }
                else {
                    sErrorMessage = "Ship Date is not maintained";
                    // req.reject(400, "Ship Date is not maintained");
                }
                var sTheaterID = oContentData.TheaterID;
                // let oSalesData = await s4h_bp_Txn.run(SELECT.from(S4H_CustomerSalesArea));
                var aSalesData = await s4h_bp_Txn.get(`/A_CustomerSalesArea?$filter=Customer eq '${Customer}' and SalesOrganization eq  '${SalesOrganization}' and DistributionChannel eq '${DistributionChannel}' and Division eq '${Division}'&$expand=to_PartnerFunction`);
                if (distroSpecData?.to_Package?.length) {
                    if (aSalesData.length) {
                        var oSalesData = aSalesData[0];
                    }
                    if (oSalesData?.to_PartnerFunction?.length > 0) {
                        var oPartnerFunction = oSalesData?.to_PartnerFunction.find((item) => { return item.PartnerFunction === "SH" && item.CustomerPartnerDescription === sTheaterID });
                        if (oPartnerFunction && Object.keys(oPartnerFunction).length) {
                            var sBPCustomerNumber = oPartnerFunction.BPCustomerNumber;
                            if (sBPCustomerNumber) {
                                oPayLoad._Partner = [{ "PartnerFunction": "WE", "Customer": sBPCustomerNumber }];
                                var aPackages = distroSpecData.to_Package;
                                if (aPackages?.length) {
                                    let oPackage = {};
                                    for (var k in aPackages) {
                                        oPackage = aPackages[k].to_DistRestriction.find((oDist) => { return oDist.DistributionFilterCountry_code === oContentData.Territory });
                                        if (oPackage && Object.keys(oPackage)) {
                                            oPackage = aPackages[k];
                                            break;
                                        }
                                    }
                                    if (!oPackage || !Object.keys(oPackage)) {
                                        sErrorMessage = `Package not available for BP Customer: ${sBPCustomerNumber}`;
                                    }
                                    else {
                                        var sPrDelMethod = oPackage.PrimaryDeliveryMethod_ShippingCondition;
                                        var sSecDelMethod = oPackage.SecondaryDeliveryMethod_ShippingCondition;
                                        var sDeliveryMethod = sPrDelMethod ? sPrDelMethod : sSecDelMethod;
                                        if (sDeliveryMethod) {
                                            oPayLoad.ShippingCondition = sDeliveryMethod;
                                        }
                                        if (oPackage?.to_DCPMaterial && oPackage?.to_DCPMaterial) {
                                            oPayLoad._Item = [];
                                            for (var j in oPackage.to_DCPMaterial) {
                                                var oMatRecord = oPackage.to_DCPMaterial[j];
                                                var oEntry = {
                                                    "Product": oMatRecord.DCPMaterialNumber_Product,
                                                    "RequestedQuantity": 1,
                                                    "RequestedQuantityISOUnit": "EA",
                                                    "DeliveryPriority": oPackage?.Priority_DeliveryPriority
                                                };
                                                oPayLoad._Item.push(oEntry);
                                            }
                                        }
                                        else {
                                            sErrorMessage = "DCP Material not available";
                                        }
                                    }
                                }
                                else {
                                    sErrorMessage = "Package not maintained in DistrSpec";
                                }
                            }
                            else {
                                sErrorMessage = "Bill-To not found";
                            }
                        }
                        else {
                            sErrorMessage = "Ship-To not found";
                        }
                    }
                    else {
                        sErrorMessage = "Partner function not available";
                    }
                }
                if (sErrorMessage) {
                    // aContentData[i].ErrorMessage = sErrorMessage;
                    updateQuery.push(UPDATE(dcpkey).set({ ErrorMessage: sErrorMessage }).where({ BookingID: oContentData.BookingID }));
                }
                else {
                    var postResult = await s4h_so_Txn.send({
                        method: 'POST',
                        path: '/SalesOrder',
                        data: oPayLoad
                    }).catch((err) => {
                        updateQuery.push(UPDATE(dcpkey).set({ ErrorMessage: err.message }).where({ BookingID: oContentData.BookingID }));
                    }).then((result) => {
                        if (result)
                            updateQuery.push(UPDATE(dcpkey).set({ SalesOrder: result?.SalesOrder, ErrorMessage: "" }).where({ BookingID: oContentData.BookingID }));
                    });
                }
                if (updateQuery.length) {
                    var updateResult = await Promise.all(updateQuery);
                }
            }
        });
        // this.on("reconcileKey", async (req, res) => {

        // });
        this.on("READ", S4H_SOHeader, async (req, res) => {
            // await s4h_so_Txn.run(SELECT.one.from(S4H_SOHeader));

            // let distroSpecData = await SELECT.one.from(DistroSpec_Local);
            return s4h_so_Txn.get(req.query);
        });
        this.on("READ", S4H_BuisnessPartner, async (req, res) => {
            await s4h_so_Txn.run(SELECT.one.from(S4H_SOHeader));
        });
        this.on("READ", S4H_CustomerSalesArea, async (req, res) => {
            var query = `/A_CustomerSalesArea?$filter=Customer eq '${Customer}' and SalesOrganization eq  '${SalesOrganization}' and DistributionChannel eq '${DistributionChannel}' and Division eq '${Division}'&$expand=to_PartnerFunction`;
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
            //     }).where({"Customer": "1000011", 
            //     "SalesOrganization": "1170",
            //     "DistributionChannel": "20",
            //     "Division": "20"}));
            //     // console.log("Test");
            //     return aSalesArea;
        })
        // this.before('SAVE', dcpcontent, async (req, next) => {
        //     // var { materialCode, serialNumber, plant, storageBin, comments } = req.data;
        //     req.data.Status = "A";
        // });        
        // this.on('SAVE', dcpcontent, async (req, next) => {
        //     // var { materialCode, serialNumber, plant, storageBin, comments } = req.data;
        //     // req.data.Status = "A";
        //     await next();
        // });
        return super.init();
    }

}