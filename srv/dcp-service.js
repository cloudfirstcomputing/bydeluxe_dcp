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
            var aBookingIDs = req.data?.bookingIDs, sErrorMessage, updateQuery = [];
            var aContentData = await SELECT.from(dcpcontent).where({ BookingID: { "IN": aBookingIDs } });
            if (!aContentData?.length) {
                sErrorMessage = "No data available to process";
                req.reject(400, "No data available to process");
                return;
            }
            var aCustomerRef = aContentData.map((item) => {
                return item.UUID;
            });//GETTING UUIDs TO SEARCH IN DISTROSPEC
            var distroSpecData = await SELECT.one.from(DistroSpec_Local, (dist) => {
                dist.DistroSpecUUID,
                    dist.DistroSpecID,
                    dist.Studio,
                    dist.ValidFrom,
                    dist.ValidTo,
                    dist.to_Package((pkg) => {
                        pkg.PackageName,
                            pkg.DistributionFilterCountry,
                            pkg.Theater,
                            pkg.PrimaryTerritory,
                            pkg.SecondaryTerritory,
                            pkg.PrimaryTerritoryDeliveryMethod,
                            pkg.SecondaryTerritoryDeliveryMethod,
                            pkg.DepotID,
                            pkg.Priority,
                            pkg.to_DCPMaterial((dcpmat) => {
                                dcpmat.DCPMaterialUUID,
                                    dcpmat.DCPMaterialNumber,
                                    dcpmat.PrintFormat
                            })
                    })
            }).where({ CustomerReference: { "IN": aCustomerRef } });
            if (distroSpecData && Object.keys(distroSpecData).length) {
                for (var i in aContentData) {
                    var oContentData = aContentData[i];
                    var sShipDate = oContentData.ShipDate;
                    if (sShipDate) {
                        var dShipDate = new Date(sShipDate.replace(/-/g, '/'));
                        var validFrom = distroSpecData.ValidFrom, validTo = distroSpecData.ValidTo;
                        validFrom = new Date(validFrom.replace(/-/g, '/'));
                        validTo = new Date(validTo.replace(/-/g, '/'));

                        if (dShipDate < validFrom || dShipDate > validTo) {
                            sErrorMessage = "DistroSpec not in validity";
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
                    let oSalesData = await SELECT.from(S4H_CustomerSalesArea);
                    if (distroSpecData?.to_Package?.length) {
                        if (oSalesData?.to_PartnerFunction?.length > 0) {
                            var oPartnerFunction = oSalesData?.to_PartnerFunction.find((item) => { return item.PartnerFunction === "SH" && item.CustomerPartnerDescription === sTheaterID });
                            if (oPartnerFunction) {
                                var sBPCustomerNumber = oPartnerFunction.BPCustomerNumber;
                                if (sBPCustomerNumber) {
                                    var oPackage = distroSpecData.to_Package.find((item) => { return item.Theater === sBPCustomerNumber });
                                }
                                else {
                                    // req.reject(400, `Bill-To not found`);
                                    sErrorMessage = "Bill-To not found";
                                }
                            }
                            else {
                                // req.reject(400, `Ship-To not found`);
                                sErrorMessage = "Ship-To not found";
                            }
                        }
                        else {
                            // req.reject(400, "Partner function not available");
                            sErrorMessage = "Partner function not available";
                        }
                    }
                    // oPayLoad.ShippingCondition
                    // oPayLoad.DeliveryPriority = distroSpecData
                    if (sErrorMessage) {
                        // aContentData[i].ErrorMessage = sErrorMessage;
                        updateQuery.push(UPDATE(dcpcontent).set({ErrorMessage: sErrorMessage}).where({BookingID: oContentData.BookingID}));
                    }
                    else {
                        oPayLoad.SoldToParty = Customer;
                        oPayLoad.SalesOrganization = SalesOrganization;
                        oPayLoad.DistributionChannel = DistributionChannel;
                        oPayLoad.OrganizationDivision = Division;
                        let postResult = await s4h_so_Txn.send({
                            method: 'POST',
                            path: '/SalesOrder',
                            data: oPayLoad
                        });
                        // aContentData[i].SalesOrder = postResult?.SalesOrder;
                        // req.notify(JSON.stringify(postResult));
                        updateQuery.push(UPDATE(dcpcontent).set({SalesOrder: postResult?.SalesOrder}).where({BookingID: oContentData.BookingID}));
                    }
                    
                }

            }
            else {
                req.reject(400, "No matching DistroSpec found");
            }


        });
        this.on("reconcileContent", async (req, res) => {

        });
        this.on("processKey", async (req, res) => {
            await SELECT.one.from()
        });
        this.on("reconcileKey", async (req, res) => {

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
            var query = `/A_CustomerSalesArea?$filter=Customer eq ${Customer} and SalesOrganization eq  ${SalesOrganization} and DistributionChannel eq ${DistributionChannel} and Division eq ${Division}&$expand=to_PartnerFunction`;
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