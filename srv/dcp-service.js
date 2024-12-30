const cds = require("@sap/cds");
module.exports = class BookingOrderService extends cds.ApplicationService{
    async init(){
        const {dcpcontent, dcpkey, S4H_SOHeader} = this.entities;
        var s4h_so_Txn = await cds.connect.to("API_SALES_ORDER_SRV");
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
            var aEntriesInput = req.data?.dcpcontent;
        });
        this.on("reconcileContent", async (req, res)=>{

        });
        this.on("processKey", async (req, res)=>{

        });
        this.on("reconcileKey", async (req, res)=>{

        });      
        this.on("READ", S4H_SOHeader, async (req, res)=>{
            return s4h_so_Txn.get(`/SalesOrder`);
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