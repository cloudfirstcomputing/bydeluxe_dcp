const cds = require("@sap/cds");
module.exports = class BookingOrderService extends cds.ApplicationService{
    async init(){
        const {dcpcontent, dcpkey, S4H_SOHeader, S4H_BuisnessPartner, DistroSpec_Local} = this.entities;
        var s4h_so_Txn = await cds.connect.to("API_SALES_ORDER_SRV");
        var s4h_bp_Txn = await cds.connect.to("API_BUSINESS_PARTNER");
        this.on("createContent", async (req, res) => {
            let data = req?.data?.Records;
            let recordsToBePosted = [], finalResult = [], successEntries = [], failedEntries = [];
            for (var i in data) {
                try {
                    let entry_Active = await SELECT.one.from(dcpcontent).where({ BookingID: data[i].BookingID});
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
                    let entry_Active = await SELECT.one.from(dcpkey).where({ BookingID: data[i].BookingID});
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
        this.on("processContent", async (req, res)=>{
            var aBookingIDs = req.data?.bookingIDs;
            var aEntriesInput = await SELECT.from(dcpcontent).where({BookingID: {"IN": aBookingIDs}});
            var aCustomerRef = aEntriesInput.map((item)=>{
                return item.UUID;
            });
            var distroSpecData = await SELECT.one.from(DistroSpec_Local, (dist)=>{
                dist.DistroSpecUUID,
                dist.DistroSpecID,
                dist.Studio,
                dist.ValidFrom,
                dist.ValidTo,
                dist.to_Package((pkg)=>{
                    pkg.PackageName,
                    pkg.DistributionFilterCountry,
                    pkg.Theater,
                    pkg.PrimaryTerritory,
                    pkg.SecondaryTerritory,
                    pkg.DepotID,
                    pkg.Priority,
                    pkg.to_DCPMaterial((dcpmat)=>{
                        dcpmat.DCPMaterialUUID,
                        dcpmat.DCPMaterialNumber,
                        dcpmat.PrintFormat
                    })
                })
            }).where({CustomerReference: {"IN": aCustomerRef}});   
            
                    
        });
        this.on("reconcileContent", async (req, res)=>{

        });
        this.on("processKey", async (req, res)=>{
            await SELECT.one.from()
        });
        this.on("reconcileKey", async (req, res)=>{

        });      
        this.on("READ", S4H_SOHeader, async (req, res)=>{
            // await s4h_so_Txn.run(SELECT.one.from(S4H_SOHeader));

            // let distroSpecData = await SELECT.one.from(DistroSpec_Local);
            return s4h_so_Txn.get(`/SalesOrder`);
        });      
        this.on("READ", S4H_BuisnessPartner, async (req, res)=>{
            // await s4h_so_Txn.run(SELECT.one.from(S4H_SOHeader));
            return s4h_bp_Txn.get(`/A_BusinessPartner`);
        });    
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