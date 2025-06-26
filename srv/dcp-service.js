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
        const { dcpcontent, dcpkey, S4H_SOHeader, S4H_BuisnessPartner, DistroSpec_Local, AssetVault_Local, S4H_CustomerSalesArea, S4H_ProformaReport, BookingStatus, DCPMaterialMapping, S4H_ProductGroup1,
            S4_Plants, S4_ShippingConditions, S4H_SOHeader_V2, S4H_SalesOrderItem_V2, ShippingConditionTypeMapping, Maccs_Dchub, S4_Parameters, CplList, S4H_BusinessPartnerAddress, Languages, S4H_ProformaDeliveryDoc, TitleCustVH,
            TheatreOrderRequest, S4_ShippingType_VH, S4_ShippingPoint_VH, OrderRequest, OFEOrders, Products, ProductDescription, ProductBasicText, MaterialDocumentHeader, MaterialDocumentItem, MaterialDocumentItem_Print, MaterialDocumentHeader_Prnt, ProductionOrder,
            StudioFeed, S4_SalesParameter, BookingSalesorderItem, S4H_BusinessPartnerapi, S4_ProductGroupText, BillingDocument, BillingDocumentItem, BillingDocumentItemPrcgElmnt, BillingDocumentPartner, S4H_Country,
            CountryText, TitleV, BillingDocumentItemText, Batch, Company, AddressPostal, HouseBank, Bank, BankAddress, AddressPhoneNumber, AddressEmailAddress, AddlCompanyCodeInformation, CoCodeCountryVATReg, BookingSalesorderPartner,
            PaymentTermsText, JournalEntryItem, PricingConditionTypeText, SalesOrderHeaderPartner, SalesOrderItemPartners, CustSalesPartnerFunc, S4H_SalesOrderItemText, StudioVH, SalesDocumentHeaderPartner, S4H_BPCustomer } = this.entities;
        var s4h_so_Txn = await cds.connect.to("API_SALES_ORDER_SRV");
        var s4h_bp_Txn = await cds.connect.to("API_BUSINESS_PARTNER");
        var s4h_planttx = await cds.connect.to("API_PLANT_SRV");
        var s4h_shipConditions_Txn = await cds.connect.to("ZAPI_SHIPPINGCONDITION");
        var s4h_sohv2_Txn = await cds.connect.to("API_SALES_ORDER_V2_SRV");
        var s4h_shtypev2_vh_Txn = await cds.connect.to("YY1_I_SHIPPINGTYPE_CDS_0001");
        var s4h_shpointv2_vh_Txn = await cds.connect.to("YY1_I_SHIPPINGPOINT_CDS_0001");
        var s4h_param_Txn = await cds.connect.to("YY1_PARAMETER_CDS");
        var s4h_products_Crt = await cds.connect.to("API_PRODUCT_SRV");
        var s4h_material_read = await cds.connect.to("API_MATERIAL_DOCUMENT_SRV");
        var s4h_production_order = await cds.connect.to("API_PRODUCTION_ORDER_2_SRV");
        var distrospec_Txn = await cds.connect.to("Distrospec_SRV");
        var s4h_salesparam_Txn = await cds.connect.to("YY1_SALESPARAMETERS_CDS_0001");
        var s4h_bp_vh = await cds.connect.to("API_BUSINESS_PARTNER");
        var s4h_country = await cds.connect.to("API_COUNTRY_SRV");
        var s4h_Company = await cds.connect.to("API_COMPANYCODE_SRV");
        var prdgrp1tx = await cds.connect.to("YY1_ADDITIONALMATERIALGRP1_CDS");
        var invformAPI = await cds.connect.to("ZCL_INVFORM");
        var bankAPI = await cds.connect.to("CE_BANK_0003");
        var proformaAPI = await cds.connect.to("YY1_PROFORMAREPORTAPI1_CDS_0001");
        var proformaDelDocAPI = await cds.connect.to("YY1_PROFORMADELIVDOCUMENT_CDS_0001");
        const prdtx = await cds.connect.to("ZCL_PRODUCT_VH");
        const bpapi = await cds.connect.to("ZAPI_BUSINESSPARTNERS");
        const bpsoapi = await cds.connect.to("YY1_I_SALESDOCUMENTPARTNER_CDS");

        var s4h_prodGroup = await cds.connect.to("API_PRODUCTGROUP_SRV");
        var deluxe_adsrestapi = await cds.connect.to("deluxe-ads-rest-api");
        var srv_BillingDocument = await cds.connect.to("API_BILLING_DOCUMENT_SRV");


        var sSoldToCustomer = '1000055', SalesOrganization = '1170', DistributionChannel = '20', Division = '20', CompanyCode = '1170', BillTo = "", sErrorMessage = "";
        // let aConfig = (await s4h_param_Txn.run(SELECT.from(S4_Parameters)));
        var oSalesParameterConfig, oResponseStatus = { "error": [], "success": [], "warning": [], "nonpersistenterror":[] };
        // var sSoldToCustomer = aConfig?.find((e) => e.VariableName === 'SoldTo_SPIRITWORLD')?.VariableValue,
        //     SalesOrganization = aConfig?.find((e) => e.VariableName === 'SalesOrg_SPIRITWORLD')?.VariableValue,
        //     DistributionChannel = aConfig?.find((e) => e.VariableName === 'DistChannel_SPIRITWORLD')?.VariableValue,
        //     Division = aConfig?.find((e) => { return e.VariableName === 'Division_SPIRITWORLD' })?.VariableValue;

        const { Titles } = this.entities;

        // Define the mass upload action
        this.on("MassUploadManageMaterialTitle", async (req) => {
            const uploadedFile = req.data.fileData;
            const workbook = XLSX.read(Buffer.from(uploadedFile, 'base64'), { type: "buffer" });
        
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            let result = { success: [], error: [], warning: [] };
        
            for (const row of sheetData) {
                try {
                    const normalizedRow = {};
                    Object.keys(row).forEach(k => normalizedRow[k.trim().toLowerCase()] = row[k]);
        
                    const fieldMap = {
                        "original title name": "OriginalTitleName",
                        "title type": "TitleType",
                        "title category": "TitleCategory",
                        "region code": "RegionCode",
                        "release date": "ReleaseDate",
                        "imdb id": "ImdbId",
                        "regional title name": "RegionalTitleName",
                        "short title": "ShortTitle",
                        "security title": "SecurityTitle",
                        "language code": "LanguageCode",
                        "repertory date": "RepertoryDate",
                        "format": "Format",
                        "release size": "ReleaseSize",
                        "ratings": "Ratings",
                        "reel count (estimated)": "ReelCountEstimated",
                        "asset vault title id": "AssetVaultTitleId",
                        "gofilex title id": "GofilexTitleId",
                        "studio title id": "StudioTitleId",
                        "studio/distributor": "StudioDistributor",
                        "use secure name": "UseSecureName",
                        "material master title id": "MaterialMasterTitleID"
                    };
        
                    const mappedRow = {};
                    for (const [excelKey, targetKey] of Object.entries(fieldMap)) {
                        let value = normalizedRow[excelKey];
                        mappedRow[targetKey] = (value === undefined || value === null) ? "" : value.toString().trim();
                    }
        
                    const requiredFields = ["OriginalTitleName", "TitleCategory", "TitleType"];
                    const missingFields = requiredFields.filter(field => !mappedRow[field]);
                    if (missingFields.length) {
                        throw new Error(`Missing required field(s): ${missingFields.join(", ")}`);
                    }
        
                    if (mappedRow.TitleType === "Local") {
                        // Local must have a MaterialMasterTitleID
                        if (!mappedRow.MaterialMasterTitleID) {
                            result.error.push({
                                TitleID: "",
                                Message: "Material Master Title ID is required for Local Title",
                                Error: "Missing MaterialMasterTitleID",
                                RowData: mappedRow
                            });
                            continue;
                        }
        
                        // Check if Parent title exists for this MaterialMasterTitleID
                        const parentTitle = await SELECT.one.from(Titles).where({
                            MaterialMasterTitleID: mappedRow.MaterialMasterTitleID,
                            TitleType: 'Parent'
                        });
        
                        if (!parentTitle) {
                            result.error.push({
                                TitleID: "",
                                Message: `Parent title not found for MaterialMasterTitleID ${mappedRow.MaterialMasterTitleID}`,
                                Error: "Parent title missing",
                                RowData: mappedRow
                            });
                            continue;
                        }
        
                        // Check if Local title with same OriginalTitleName already exists
                        const existingLocal = await SELECT.one.from(Titles).where({
                            OriginalTitleName: mappedRow.OriginalTitleName,
                            TitleType: 'Local'
                        });
        
                        if (existingLocal) {
                            result.error.push({
                                TitleID: "",
                                Message: `Original Title Name '${mappedRow.OriginalTitleName}' already exists as a Local title.`,
                                Error: "Duplicate Original Title Name (Local)",
                                RowData: mappedRow
                            });
                            continue;
                        }
        
                        // Generate new LocalTitleId (incremental)
                        const existingLocalTitles = await SELECT.from(Titles).where({
                            MaterialMasterTitleID: mappedRow.MaterialMasterTitleID
                        });
        
                        const maxId = Math.max(
                            0,
                            ...existingLocalTitles
                                .map(t => t.LocalTitleId?.split('-')[1])
                                .filter(n => n)
                                .map(n => parseInt(n))
                                .filter(n => !isNaN(n))
                        );
        
                        const newLocalId = `${mappedRow.MaterialMasterTitleID}-${String(maxId + 1).padStart(4, "0")}`;
        
                        // Create Local Title
                        const titlePayload = {
                            ID: uuidv4(),
                            MaterialMasterTitleID: mappedRow.MaterialMasterTitleID,
                            LocalTitleId: newLocalId,
                            OriginalTitleName: mappedRow.OriginalTitleName,
                            TitleType: "Local",
                            TitleCategory: mappedRow.TitleCategory || "",
                            RegionCode: mappedRow.RegionCode || "",
                            RegionalTitleName: mappedRow.RegionalTitleName || "",
                            ShortTitle: mappedRow.ShortTitle || "",
                            SecurityTitle: mappedRow.SecurityTitle || "",
                            LanguageCode: mappedRow.LanguageCode || "",
                            ReleaseDate: mappedRow.ReleaseDate ? new Date(mappedRow.ReleaseDate) : null,
                            RepertoryDate: mappedRow.RepertoryDate ? new Date(mappedRow.RepertoryDate) : null,
                            Format: mappedRow.Format || "",
                            ReleaseSize: mappedRow.ReleaseSize || "",
                            Ratings: mappedRow.Ratings || "",
                            ReelCountEstimated: mappedRow.ReelCountEstimated || null,
                            AssetVaultTitleId: mappedRow.AssetVaultTitleId || "",
                            ImdbId: mappedRow.ImdbId || "",
                            StudioTitleId: mappedRow.StudioTitleId || "",
                            StudioDistributor: mappedRow.StudioDistributor || "",
                            GofilexTitleId: mappedRow.GofilexTitleId || "",
                        };
        
                        await cds.transaction(req).run(INSERT.into(Titles).entries(titlePayload));
        
                        result.success.push({
                            TitleID: newLocalId,
                            Message: `Local title created with ID ${newLocalId}`,
                            Error: "",
                            RowData: mappedRow
                        });
                        continue;
                    }
        
                    // Handle Parent (new product creation)
                    const existingParent = await SELECT.one.from(Titles).where({
                        OriginalTitleName: mappedRow.OriginalTitleName
                    });
        
                    if (existingParent) {
                        result.warning.push({
                            TitleID: "",
                            Message: `Skipped duplicate Parent title '${mappedRow.OriginalTitleName}'`,
                            Error: "Duplicate found",
                            RowData: mappedRow
                        });
                        continue;
                    }
        
                    const productPayload = {
                        ProductGroup: mappedRow.TitleCategory,
                        ProductType: "ZTLS",
                        BaseUnit: "EA",
                        ProductManufacturerNumber: "",
                        to_ProductBasicText: [
                            { Language: "EN", LongText: mappedRow.OriginalTitleName }
                        ],
                        to_Description: [
                            { Language: "EN", ProductDescription: mappedRow.OriginalTitleName }
                        ]
                    };
        
                    const createProductResponse = await s4h_products_Crt.run(INSERT.into(Products).entries(productPayload));
                    const createdProductID = createProductResponse?.Product;
        
                    if (!createdProductID) {
                        throw new Error("Product creation failed.");
                    }
        
                    const titlePayload = {
                        ID: uuidv4(),
                        MaterialMasterTitleID: createdProductID,
                        LocalTitleId: "",
                        OriginalTitleName: mappedRow.OriginalTitleName,
                        TitleType: "Parent",
                        TitleCategory: mappedRow.TitleCategory || "",
                        RegionCode: mappedRow.RegionCode || "",
                        RegionalTitleName: mappedRow.RegionalTitleName || "",
                        ShortTitle: mappedRow.ShortTitle || "",
                        SecurityTitle: mappedRow.SecurityTitle || "",
                        LanguageCode: mappedRow.LanguageCode || "",
                        ReleaseDate: mappedRow.ReleaseDate ? new Date(mappedRow.ReleaseDate) : null,
                        RepertoryDate: mappedRow.RepertoryDate ? new Date(mappedRow.RepertoryDate) : null,
                        Format: mappedRow.Format || "",
                        ReleaseSize: mappedRow.ReleaseSize || "",
                        Ratings: mappedRow.Ratings || "",
                        ReelCountEstimated: mappedRow.ReelCountEstimated || null,
                        AssetVaultTitleId: mappedRow.AssetVaultTitleId || "",
                        ImdbId: mappedRow.ImdbId || "",
                        StudioTitleId: mappedRow.StudioTitleId || "",
                        StudioDistributor: mappedRow.StudioDistributor || "",
                        GofilexTitleId: mappedRow.GofilexTitleId || "",
                        Ratings_Ass: [],
                        ExternalTitleIDs_Ass: []
                    };
        
                    await cds.transaction(req).run(INSERT.into(Titles).entries(titlePayload));
        
                    result.success.push({
                        TitleID: createdProductID,
                        Message: `Parent title created with ID ${createdProductID}`,
                        Error: "",
                        RowData: mappedRow
                    });
        
                } catch (err) {
                    console.error("Error processing row:", err.message);
                    result.error.push({
                        TitleID: "",
                        Message: "Failed to process row",
                        Error: err.message,
                        RowData: row
                    });
                }
            }
        
            return { message: result };
        });        

        this.on('READ', S4H_ProductGroup1, async (req) => {
            return prdgrp1tx.run(SELECT.from(S4H_ProductGroup1).where({ Language: req.locale.toUpperCase() }))
        });
        
        // this.on("SAVE", StudioFeed.drafts ,async(req, next)=>{
        //     var oFeed = req.data;
        //     oFeed.Version = 1;
        //     oFeed.Origin_OriginID = "M";
        //     oFeed.Status_ID = "A";
        //     await createStudioFeeds(req, [oFeed]);
        // });
        this.before("SAVE", StudioFeed.drafts, async (req) => {
            var oFeed = req.data;
            if(!oFeed.Version)
                oFeed.Version = 1;
            if(!oFeed.Origin_OriginID)
                oFeed.Origin_OriginID = "M";
            if(!oFeed.BookingType_ID)
                oFeed.BookingType_ID='NO'
            oFeed.Status_ID = "A";
        });
        this.on("CREATE", StudioFeed, async (req, next) => {
            var oFeed = req.data;
            var oResponse = await createStudioFeeds(req, [oFeed]);
            if(oResponse.nonpersistenterror){
                req.error({
                    code: 400,
                    message: JSON.stringify(oResponse.nonpersistenterror)
                });

            }
            else{
                req.reply({
                    code: 201,
                    message: oResponse
                });

            }
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
                for (let index = 0; index < excelData.length; index++) {//Iterating each rows in excel
                    let object = excelData[index]
                    let row = object.__rowNum__ + 1
                    let element = {}
                    let error = {}
                    error.RowNumber = row.toString()
                    // error.ID = id
                    for (const property in object) { //Iterating each columns in excel
                        if(property === 'Theater ID*' || property === 'TCN ID*'){
                            var fieldName = req.data.fieldNames.find(item => {
                                return item?.excelColumn === 'Theater ID*'
                            });
                            if(!fieldName){
                                fieldName = req.data.fieldNames.find(item => {
                                    return item?.excelColumn === 'TCN ID*'
                                }); 
                            }
                        }
                        else{
                            fieldName = req.data.fieldNames.find(item => {
                                return item?.excelColumn === property
                            })

                        }
                        // if (!fieldName) req.reject(400, 'invalidSheet')
                        if (fieldName?.technicalName) {
                            element[fieldName.technicalName] = typeof (object[property]) === 'string' ? object[property] : `${object[property]}`
                        }
                    }
                    element.Origin_OriginID = "S";//Spreasheet upload

                    var sValidationError = "";
                    // if (!element.SourceSystem) {
                    //     sValidationError = "Source System is mandatory\n";
                    // }
                    if (!element.BookingID) {
                        sValidationError = sValidationError + "BookingID is mandatory.\n";
                    }
                    if (!element.Studio_BusinessPartner) {
                        sValidationError = sValidationError + "Studio is mandatory.\n";
                    }
                    if (!element.OrderType_code) {
                        sValidationError = sValidationError + "OrderType is mandatory.\n";
                    }
                    if (!element.PlayStartDate) {
                        sValidationError = sValidationError + "Play Start Date is mandatory.\n";
                    }
                    else{
                        let isValidDate = await checkDateFormat(element.PlayStartDate);
                        if(!isValidDate){
                            sValidationError = sValidationError + "Play Start Date should be in YYYY-MM-DD format.\n";
                        }
                    }
                    if (!element.PlayEndDate) {
                        sValidationError = sValidationError + "Play End Date is mandatory.\n";
                    }
                    else{
                        let isValidDate = await checkDateFormat(element.PlayEndDate);
                        if(!isValidDate){
                            sValidationError = sValidationError + "Play End Date should be in YYYY-MM-DD format.\n";
                        }
                    }
                    if (!element.CustomerReference) {
                        sValidationError = sValidationError + "Distrospec ID is mandatory.\n";
                    }
                    if (!element.RequestedDelivDate) {
                        sValidationError = sValidationError + "RequestedDelivDate is mandatory.\n";
                    }
                    else{
                        let isValidDate = await checkDateFormat(element.RequestedDelivDate);
                        if(!isValidDate){
                            sValidationError = sValidationError + "Requested Delivery Date should be in YYYY-MM-DD format.\n";
                        }
                    }
                    if (!element.BookingType_ID) {
                        sValidationError = sValidationError + "BookingType is mandatory.\n";
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
            var aIDs = req.data?.aBookingID;
            var aFeeds = await SELECT.from(StudioFeed).where({ ID: { "IN": aIDs }});
            // aFeeds = aFeeds?.map((feed) => {
            //     feed.BookingType_ID = 'C';
            //     return feed
            // });
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
            var sID = oInput?.ID, sBookingID, sSalesOrder, oFeedDBData, aResponseStatus = [], hanaDBTable = StudioFeed;

            if (sID) {
                oFeedDBData = await SELECT.one.from(hanaDBTable).where({ ID: sID });
            }

            if (!oFeedDBData) {
                req.reject(501, "Selected entry not available");
                return;
            }
            if (!oFeedDBData.SalesOrder) {
                aResponseStatus.push({
                    "message": `Please Select an entry where Sales Order is available for remediation`,
                    "status": "E"
                });
                
                req.reply({
                    code: 201,
                    message: JSON.stringify(aResponseStatus)
                });
                return;
            }
            sSalesOrder = oFeedDBData?.SalesOrder;
            var aRemediatedDeliveryMethods = oFeedDBData.DeliveryMethod?.split(", "), iRemediationCounter = oFeedDBData.RemediationCounter;

            var oSalesorderItem_PayLoad = {};
            var aSalesOrderItem = await s4h_sohv2_Txn.run(SELECT.from(S4H_SalesOrderItem_V2).columns(["*"]).where({ SalesOrder: sSalesOrder }));
            if (!aSalesOrderItem?.length) {
                aResponseStatus.push({
                    "message": `| No items available for remediation in Sales Order: ${sSalesOrder} |`,
                    "status": "E"
                });
            }
            var aNonKeyItems = aSalesOrderItem?.filter((s4Item) => {
                return (s4Item.MaterialGroup !== 'Z004' && (s4Item.ItemBillingBlockReason === '' || s4Item.ItemBillingBlockReason !== '03') && s4Item.DeliveryPriority !== '04');
            });
            if (!aNonKeyItems?.length) { //RULE 11.1 => Remediation not possible for Key (Prod Group Z003)
                req.error(400, `Remediation cannot be done for Sales Order: ${sSalesOrder} as all items are key entries`);
                return;
            }
            else if (!oFeedDBData.DeliveryMethod) {
                req.reject(501, "Initial Delivery method was not captured for this entry, hence cannot be remediated");
                return;
            }
            else if (!oFeedDBData.RemediationCounter) {
                req.reject(501, "Remediation counterfor this entry, hence cannot be remediated");
                return;
            }
            else {
                var aDeliverySeqFromDistHeader = [];
                var distroSpecData = await getDistroSpecData(req, oFeedDBData, aDeliverySeqFromDistHeader);
                aDeliverySeqFromDistHeader = aDeliverySeqFromDistHeader?.filter((sDelSeq) => {
                    return sDelSeq !== ''
                }); //Removing blank entries
                var oContentPackages;
                var oPackages = await performPrioritySort_OrderType_ValidityCheck(oFeedDBData, distroSpecData);
                var aContentPackages = oPackages?.ContentPackage, aKeyPackages = oPackages?.KeyPackage;
                if (!aContentPackages?.length) {
                    req.reject(400,
                        `No matching Content Or Key Package available for DistroSpec ${distroSpecData?.DistroSpecID}`);
                    return;
                }
                if (aDeliverySeqFromDistHeader?.length <= iRemediationCounter) {
                    req.reject(400,
                        `Remediation is not possible any more as all ${iRemediationCounter} Delivery methods are utilized for remediation`);
                    return;
                }

                // if (aRemediatedDeliveryMethods?.filter((remDel) => {
                //     return (remDel === '03' || sDelSeq === '10') //RULE 11.2
                // })?.length) {
                //     req.reject(400,
                //         `Remediation is completed for the selected entry`);
                //     return;
                // }
                var sStartDate = oFeedDBData?.PlayStartDate;
                var sStartTime = oFeedDBData?.PlayStartTime;
                var sEndDate = oFeedDBData?.PlayEndDate;
                var sEndTime = oFeedDBData?.PlayEndTime;
                var dStartDate = sStartTime ? new Date(`${sStartDate}T${sStartTime}`) : new Date(`${sStartDate}T00:00:00`);
                var dEndDate = sEndTime ? new Date(`${sEndDate}T${sEndTime}`) : new Date(`${sEndDate}T00:00:00`);
                var iDifferenceInHours = (dEndDate - dStartDate) / (60 * 60 * 1000);
                var sReleaseDate = distroSpecData?.ReleaseDate;
                var ReleaseDate = sReleaseDate ? new Date(`${sReleaseDate}T00:00:00`) : undefined;
                var sRepertoryDate = distroSpecData?.RepertoryDate;
                var RepertoryDate = sRepertoryDate ? new Date(`${sRepertoryDate}T00:00:00`) : undefined;
                for (var i in aRemediatedDeliveryMethods) { //Removing the Delivery methods which are already remediated
                    aDeliverySeqFromDistHeader = aDeliverySeqFromDistHeader.filter((seq) => {
                        return seq !== aRemediatedDeliveryMethods[i];
                    }
                    );
                }
                var aContentPackageDistRestrictions, oFilteredContentPackage, sDeliveryMethod;
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
                        if (oContentPackages) {
                            oFilteredContentPackage = oContentPackages;
                            aContentPackageDistRestrictions = oFilteredContentPackage?.to_DistRestriction;
                            sDeliveryMethod = sDelSeq;
                            break;
                        }
                    }
                }
                if (!oFilteredContentPackage) {
                    req.reject(400, `No suitable package with Delivery Method ${sDelSeq} found for remediation`);
                    return;
                }
                var oShippingTypeMapping = await SELECT.one.from(ShippingConditionTypeMapping).where({ ShippingCondition: sDeliveryMethod });
                var sShippingType = oShippingTypeMapping.ShippingType;
                if (!sShippingType) {
                    req.reject(400, `No Shipping Type found for Shipping Condition ${sDeliveryMethod}`);
                    return;
                }
                // var oDCPMapping = await getVariableBasedDCPMapping(ReleaseDate, dStartDate, RepertoryDate, sShippingType);
                let oVarMapping = await getVariableBasedDCPMapping(ReleaseDate, dStartDate, RepertoryDate, sShippingType, CompanyCode);
                let oDCPMapping = oVarMapping?.mapping;
                if (sDeliveryMethod === '03' && (sShippingType == '03' || sShippingType === '06' || sShippingType === '12')) {
                    /*As per what is discussed with Pranav, DCP is considered only if Shipping Condition = 03 (HDD). 
                    Pick up Add.MatGroup from BTP Mapping table and set it in the AdditionalMaterialGroup1 of this DCP Item in S4
                    */
                    // for (var i in aNonKeyItems) {
                    //     var oSalesOrderItem = aNonKeyItems[i];
                    //     oSalesorderItem_PayLoad["Material"] = oSalesOrderItem.Material;
                    //     oSalesorderItem_PayLoad["RequestedQuantity"] = `${oSalesOrderItem.RequestedQuantity}`;
                    //     oSalesorderItem_PayLoad["RequestedQuantityISOUnit"] = oSalesOrderItem.RequestedQuantityISOUnit;
                    //     oSalesorderItem_PayLoad["ProductionPlant"] = oSalesOrderItem.ProductionPlant;
                    //     oSalesorderItem_PayLoad["ItemBillingBlockReason"] = "03";
                    //     oSalesorderItem_PayLoad["PricingReferenceMaterial"] = oSalesOrderItem.PricingReferenceMaterial;
                    //     oSalesorderItem_PayLoad["DeliveryPriority"] = "04";
                    //     oSalesorderItem_PayLoad["AdditionalMaterialGroup1"] = oDCPMapping?.MaterialGroup;

                    //     // oSalesorderItem_PayLoad["RequestedDeliveryDate"] = `/Date(${new Date().getTime()})/`;

                    //     oSalesorderItem_PayLoad['to_ScheduleLine'] = [{
                    //         "SalesOrder": sSalesOrder,
                    //         "SalesOrderItem": oSalesOrderItem?.SalesOrderItem,
                    //         "RequestedDeliveryDate": `/Date(${new Date().getTime()})/`
                    //     }];

                    //     oSalesorderItem_PayLoad["ShippingType"] = sShippingType;
                    //     await s4h_sohv2_Txn.send({
                    //         method: 'POST',
                    //         path: `/A_SalesOrder('${sSalesOrder}')/to_Item`,
                    //         data: oSalesorderItem_PayLoad
                    //     }).catch((err) => {
                    //         aResponseStatus.push({
                    //             "message": `| Remediation failed for Sales Order: ${sSalesOrder}: ${err.message} |`,
                    //             "status": "E"
                    //         });
                    //     }).then(async (result) => {
                    //         if (result) {
                    //             oFeedDBData.DeliveryMethod = oFeedDBData.DeliveryMethod + ", " + sDeliveryMethod;
                    //             oFeedDBData.RemediationCounter = iRemediationCounter + 1;
                    //             oFeedDBData.Remediation = oFeedDBData.Remediation ? (oFeedDBData.Remediation + ', ' + result?.SalesOrderItem) : result?.SalesOrderItem;
                    //             let updateRes = await UPDATE(hanaDBTable).set({ Remediation: `${oFeedDBData.Remediation}`, DeliveryMethod: oFeedDBData.DeliveryMethod, RemediationCounter: oFeedDBData.RemediationCounter }).where({ ID: sID })

                    //             var oBTPItem = await SELECT.one.from(BookingSalesorderItem).where({ SalesOrder: sSalesOrder, SalesOrderItem: oSalesOrderItem?.SalesOrderItem })
                    //             let oNewBTPItem = {};
                    //             if (oBTPItem) {
                    //                 oNewBTPItem = oBTPItem;
                    //             }
                    //             oNewBTPItem.SalesOrder = result?.SalesOrder;
                    //             oNewBTPItem.SalesOrderItem = result?.SalesOrderItem;
                    //             oNewBTPItem.Product = result?.Material;
                    //             oNewBTPItem.ShippingPoint = result?.ShippingPoint;
                    //             oNewBTPItem.ProductGroup = result?.MaterialGroup;
                    //             oNewBTPItem.ShippingType_ID = result?.ShippingType;

                    //             let insertResult = await INSERT.into(BookingSalesorderItem).entries(oNewBTPItem);
                    //             aResponseStatus.push({
                    //                 "message": `| Sales Order: ${sSalesOrder} remediation successful. Item: ${result?.SalesOrderItem} is created |`,
                    //                 "status": "S"
                    //             });
                    //         }
                    //     });
                    // }
                    let oSalesOrderItem_Distro = oFilteredContentPackage?.to_DCPMaterial;
                    for (let i in oSalesOrderItem_Distro) {
                        let sMat = oSalesOrderItem_Distro[i].DCPMaterialNumber_Product;
                        let oSalesOrderItem = aNonKeyItems?.find((item) => {
                            return item.Material === sMat;
                        });
                        oSalesorderItem_PayLoad = {
                            "Material": sMat,
                            "PricingReferenceMaterial": distroSpecData?.Title_Product,
                            "RequestedQuantity": '1',
                            "RequestedQuantityISOUnit": 'EA',
                            "ShippingType": sShippingType,
                            "ItemBillingBlockReason": "03",
                            "AdditionalMaterialGroup1": oDCPMapping?.MaterialGroup,
                            "DeliveryPriority": "04",
                            "ProfitCenter": oDCPMapping?.ProfitCenter,
                            "ProductionPlant":oDCPMapping?.Plant
                        };
                        // oSalesorderItem_PayLoad['to_ScheduleLine'] = [{
                        //     "SalesOrder": sSalesOrder,
                        //     "SalesOrderItem": oSalesOrderItem?.SalesOrderItem,
                        //     "RequestedDeliveryDate": `/Date(${new Date().getTime()})/`
                        // }];

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
                                oFeedDBData.DeliveryMethod = oFeedDBData.DeliveryMethod + ", " + sDeliveryMethod;
                                oFeedDBData.RemediationCounter = iRemediationCounter + 1;
                                oFeedDBData.Remediation = oFeedDBData.Remediation ? (oFeedDBData.Remediation + ', ' + result?.SalesOrderItem) : result?.SalesOrderItem;
                                let updateRes = await UPDATE(hanaDBTable).set({ Remediation: `${oFeedDBData.Remediation}`, DeliveryMethod: oFeedDBData.DeliveryMethod, RemediationCounter: oFeedDBData.RemediationCounter }).where({ ID: sID })

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
                else if (oDCPMapping) {
                    /*As per what is discussed with Pranav, For Shipping conditions other than 03, only pick up Generic Material. 
                    Pricing Ref Material for this item should be set as Title maintained in DistroSpec..
                    */
                    oSalesorderItem_PayLoad["Material"] = oDCPMapping?.Material;
                    oSalesorderItem_PayLoad["AdditionalMaterialGroup1"] = oDCPMapping?.MaterialGroup;
                    oSalesorderItem_PayLoad["RequestedQuantity"] = '1';
                    oSalesorderItem_PayLoad["RequestedQuantityISOUnit"] = 'EA';
                    oSalesorderItem_PayLoad["ItemBillingBlockReason"] = "03";
                    oSalesorderItem_PayLoad["PricingReferenceMaterial"] = distroSpecData?.Title_Product;
                    oSalesorderItem_PayLoad["DeliveryPriority"] = "04";
                    oSalesorderItem_PayLoad["ProfitCenter"] = oDCPMapping?.ProfitCenter;
                    oSalesorderItem_PayLoad["ProductionPlant"] = oDCPMapping?.Plant;
                    // oSalesorderItem_PayLoad["DeliveryPriority"] = sShippingType;
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
                            oFeedDBData.DeliveryMethod = oFeedDBData.DeliveryMethod + ", " + sDeliveryMethod;
                            oFeedDBData.RemediationCounter = iRemediationCounter + 1;
                            oFeedDBData.Remediation = oFeedDBData.Remediation ? (oFeedDBData.Remediation + ', ' + result?.SalesOrderItem) : result?.SalesOrderItem;
                            let updateRes = await UPDATE(hanaDBTable).set({ Remediation: `${oFeedDBData.Remediation}`, DeliveryMethod: oFeedDBData.DeliveryMethod, RemediationCounter: oFeedDBData.RemediationCounter }).where({ ID: sID })

                            var oBTPItem = await SELECT.one.from(BookingSalesorderItem).where({ SalesOrder: sSalesOrder, SalesOrderItem: result?.SalesOrderItem })
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
            oResponseStatus = { "error": [], "success": [], "warning": [], "nonpersistenterror":[] }; //Setting fresh response for the incoming request
            for (var i = 0; i < data.length; i++) {
                data[i].Status_ID = "A";
                data[i].IsActive = "Y";
                data[i].Version = 1;
                if(data[i]?.BookingType_ID !== "C" &&  data[i]?.BookingType_ID !== "U"){
                    data[i].BookingType_ID = "NO";
                }
                let sEntityID = data[i].EntityID, sBupa = data[i].Studio_BusinessPartner;
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
                    var oLocalResponse, oExistingData;
                    if(bReconcile){
                        oExistingData = await SELECT.one.from(hanatable).where({ ID: data[i].ID });
                        // oLocalResponse = await create_S4SalesOrder_WithItems_UsingNormalizedRules(req, data[i]);
                        // recordsToBeUpdated.push(entry_Active); 
                    }
                    if (data[i].BookingType_ID === "U" || data[i].BookingType_ID === "C") { //VERSION is updated only when BookingType is U or C
                        // var entry_Active = await SELECT.one.from(hanatable).where({ BookingID: data[i].BookingID, SalesOrder: {'!=': null, '!=': ''} }).orderBy({ ref: ['createdAt'], sort: 'desc' });
                        oExistingData = await SELECT.one.from(hanatable).where({ BookingID: data[i].BookingID, SalesOrder: {'!=': null, '!=': ''} }).orderBy({createdAt:'desc'});
                        if (oExistingData && oExistingData?.SalesOrder) {
                            data[i].Version = oExistingData.Version ? oExistingData.Version + 1 : 1;
                            // oLocalResponse = await create_S4SalesOrder_WithItems_UsingNormalizedRules(req, data[i]);
                                // recordsToBeUpdated.push(oExistingData); //This record will be set as Inactive
                                let sSalesOrder = oExistingData.SalesOrder, oFeedData = data[i];
                                let sHFR_Incoming = oFeedData?.HFR;
                                let dReqDelDate = oExistingData?.RequestedDelivDate;
                                oExistingData.IsActive="N";
                                recordsToBeUpdated.push(oExistingData); 

                                oFeedData.SalesOrder = oExistingData.SalesOrder;
                                oFeedData.IsActive = "Y";

                                let oSalesOrder = await s4h_sohv2_Txn.run(SELECT.one.from(S4H_SOHeader_V2).columns(['*', { "ref": ["to_Item"], "expand": ["*"] }]).where({ SalesOrder: sSalesOrder }));
                                if(oSalesOrder?.OverallDeliveryStatus === "A"){ //GO for update/Cancel only if DelStatus =
                                    var aSalesOrderItems = oSalesOrder.to_Item;
                                    let bItemForHFRUpdate_CancelPresent = false;  
                                    for (var p in aSalesOrderItems) {
                                        let oSalesOrderItem = aSalesOrderItems[p];
                                        let sShippingType = oSalesOrderItem?.ShippingType; 
                                        if(oFeedData.BookingType_ID === 'U'){
                                            if (oFeedData.RequestedDelivDate && dReqDelDate && oFeedData.RequestedDelivDate !== dReqDelDate) {
                                                let RequestedDeliveryDate = `/Date(${new Date(oFeedData.RequestedDelivDate).getTime()})/`;
                                                let ConfirmedDeliveryDate = `/Date(${new Date(oFeedData.RequestedDelivDate).getTime()})/`;
                                                let sDelBlockReason = "";
                                                if(sHFR_Incoming === "Y" && oFeedData.HFR === "Y"  && sShippingType === '07'){
                                                        sDelBlockReason = "50";
                                                }
                                                bItemForHFRUpdate_CancelPresent = true; 
                                                    await s4h_sohv2_Txn.send({
                                                        method: 'PATCH',
                                                        path: `/A_SalesOrderScheduleLine(SalesOrder='${oSalesOrderItem.SalesOrder}',SalesOrderItem='${oSalesOrderItem.SalesOrderItem}',ScheduleLine='1')`,
                                                        data: {
                                                            "DelivBlockReasonForSchedLine":sDelBlockReason,
                                                            "RequestedDeliveryDate":RequestedDeliveryDate,
                                                            "ConfirmedDeliveryDate": ConfirmedDeliveryDate               
                                                        }
                                                    }).catch((err) => {
                                                        oResponseStatus.error.push({
                                                            "message": `| For Booking ID: ${oFeedData.BookingID}-Sales Order: ${oSalesOrderItem?.SalesOrder}-${oSalesOrderItem?.SalesOrderItem}, Schedule line not created: ${err.message} `,
                                                            "errorMessage": err.message
                                                        });
                                                    }).then((result, param2) => {
                                                        oResponseStatus.success.push({
                                                            "BookingID": oFeedData?.BookingID,
                                                            "message": `| For Booking ID: ${oFeedData?.BookingID}-Sales Order: ${oSalesOrderItem?.SalesOrder}-${oSalesOrderItem?.SalesOrderItem}, Schedule line is created |`
                                                        });
                                                        oFeedData.Status_ID = "C";
                                                    });                                                                                     
                                            }
                                            else {    
                                                data[i].ErrorMessage = `| No Change in Delivery Date for update |`;
                                                oResponseStatus.error.push({
                                                    "message": data[i].ErrorMessage,
                                                    "errorMessage": data[i].ErrorMessage
                                                });
                                            }
                                        }//Update Block
                                        else if(oFeedData.BookingType_ID === 'C'){ //Cancel  
                                            bItemForHFRUpdate_CancelPresent = true;  
                                            await s4h_sohv2_Txn.send({
                                                method: 'PATCH',
                                                path: `/A_SalesOrderItem(SalesOrder='${oSalesOrderItem.SalesOrder}',SalesOrderItem='${oSalesOrderItem.SalesOrderItem}')`,
                                                data: {
                                                    "SalesDocumentRjcnReason":"70"                
                                                }
                                            }).catch((err) => {
                                                oResponseStatus.error.push({
                                                    "message": `| For Booking ID: ${oFeedData.BookingID}-Sales Order: ${oSalesOrderItem?.SalesOrder}-${oSalesOrderItem?.SalesOrderItem}, Cancellation failed: ${err.message} `,
                                                    "errorMessage": err.message
                                                });
                                            }).then((result, param2) => {
                                                    oResponseStatus.success.push({
                                                        "BookingID": oFeedData?.BookingID,
                                                        "message": `| For Booking ID: ${oFeedData?.BookingID}-Sales Order: ${oSalesOrderItem?.SalesOrder}-${oSalesOrderItem?.SalesOrderItem} has been cancelled |`
                                                    });
                                                    oFeedData.Status_ID = "C";
                                            });
                                        }//End of Cancel block                                     
                                    }//End of Sales Order Item Iteration
                                    if(!bItemForHFRUpdate_CancelPresent && !data[i].ErrorMessage){
                                    data[i].ErrorMessage = `There is no Sales Order Present for ${data[i].BookingType_ID === "U"?"update":"cancellation"}`;
                                    data[i].Status_ID = 'D';
        
                                    oResponseStatus.error.push({
                                        "message": `| ${data[i].ErrorMessage} |`,
                                        "errorMessage": data[i].ErrorMessage
                                    }); 

                                }  

                                } 
                                else{ //Delivery already completed, so cannot be updated/cancelled                              
                                    data[i].ErrorMessage = `Delivery already created for this order ${data[i].SalesOrder} (Status: ${oSalesOrder?.OverallDeliveryStatus}), hence can not change the order`;
                                    data[i].Status_ID = 'D';
        
                                    oResponseStatus.error.push({
                                        "message": `| ${data[i].ErrorMessage} |`,
                                        "errorMessage": data[i].ErrorMessage,
                                        "BookingID":data[i].BookingID
                                    });

                                }     
                        }
                        else{ //Entry for Update or Cancel not present
                            data[i].ErrorMessage = `There is no record exist with incoming Booking ID${data[i].BookingID} where Sales Order ${oExistingData?.SalesOrder} is linked for ${data[i].BookingType_ID === "U"?"update":"cancellation"}`;
                            data[i].Status_ID = 'D';
                            oResponseStatus.error.push({
                                "message": `| ${data[i].ErrorMessage} |`,
                                "errorMessage": data[i].ErrorMessage
                            });
                        }
                        oLocalResponse = oResponseStatus;
                    }//End of HFR = U or C
                    else { //New Order
                        if(bReconcile){ //For Reconcile, data already picked from table
                            oExistingData = data[i];
                        }
                        else{
                            oExistingData = await SELECT.one.from(hanatable).where({ BookingID: data[i].BookingID });
                        }                        
                        if (oExistingData && !bReconcile) {
                            oResponseStatus.nonpersistenterror.push({
                                "BookingID": data[i].BookingID,
                                "message": `| Booking ID ${data[i].BookingID} already exists|`,
                                "errorMessage": `Booking ID ${data[i].BookingID} already exists`
                            });
                            // oLocalResponse= oResponseStatus;
                            continue;
                        }
                        else{                            
                            oLocalResponse = await create_S4SalesOrder_WithItems_UsingNormalizedRules(req, data[i], bReconcile);
                        }
                    }
                    let oErrorEntry = oLocalResponse?.error?.find((item)=>{return item.BookingID === data[i].BookingID});
                    if (oLocalResponse?.success?.length && !oErrorEntry && (data[i].BookingType_ID === "NO")) {
                        data[i] = await updateBTPSOItemsAndS4Texts(req, data[i], oLocalResponse);
                    }
                    if (oLocalResponse?.success?.length && !oErrorEntry && (data[i].BookingType_ID === "NO")) {
                        // oResponseStatus?.success?.push(...oLocalResponse?.success);
                        data[i].SalesOrder = oLocalResponse?.SalesOrder;
                        data[i].DeliveryMethod = oLocalResponse?.DeliveryMethod;
                        data[i].RemediationCounter = 1;
                        data[i].Status_ID = "C";
                    }
                    if (oLocalResponse?.Status === 'R') { //Status is in Review
                        data[i].Status_ID = oLocalResponse.Status;
                        data[i].ErrorMessage = oLocalResponse?.error?.[0].errorMessage;
                    }
                    if (oErrorEntry) {
                        // oResponseStatus?.error?.push(...oLocalResponse?.error);
                        data[i].ErrorMessage = oErrorEntry?.errorMessage;
                        data[i].Status_ID = data[i].Status_ID? data[i].Status_ID: "D"; //Either Soft Reconcile status or Error
                    }
                    oLocalResponse = {};
                }
                if (bReconcile) {
                    var sID = data[i].ID;
                    let aBTPItemFields = Object.keys(BookingSalesorderItem?.elements);
                    aBTPItemFields = aBTPItemFields.filter((item)=> item !=='createdBy' && item !== 'createdAt' &&
                        item !== 'modifiedBy' && item !== 'modifiedAt');
                    let aSOItems = data[i].to_Item; //Items which got created in S4
                    let btpItems = [];    
                    for(let i in aSOItems){//Iterating S4 Items
                        let oItems = aSOItems[i],  entry = {};
                        let aS4keys = Object.keys(oItems);
                        for(let j in aS4keys){
                            let sFieldName = aS4keys[j];
                            if(aBTPItemFields.find((field)=> field === sFieldName ) ){
                                entry[sFieldName] = oItems[sFieldName];
                            }
                        }
                        btpItems.push({...entry});
                    }
                    let aBTPPartnerFields = Object.keys(BookingSalesorderPartner?.elements);
                    aBTPPartnerFields = aBTPPartnerFields.filter((item)=> item !=='createdBy' && item !== 'createdAt' &&
                        item !== 'modifiedBy' && item !== 'modifiedAt');
                    let aS4Partners = data[i].to_Partner; //Items which got created in S4
                    let btpPartners = [];    
                    for(let i in aS4Partners){//Iterating S4 Items
                        let oItems = aS4Partners[i],  entry = {};
                        let aS4keys = Object.keys(oItems);
                        for(let j in aS4keys){
                            let sFieldName = aS4keys[j];
                            if(aBTPPartnerFields.find((field)=> field === sFieldName ) ){
                                entry[sFieldName] = oItems[sFieldName];
                            }
                        }
                        btpPartners.push({...entry});
                    }
                    
                    await UPDATE(hanatable).set({ ErrorMessage: sErrorMessage, SalesOrder: data[i].SalesOrder, Status_ID: data[i].Status_ID, to_Item: btpItems, to_Partner: btpPartners }).where({
                        ID: sID
                    });
                }
                else {
                    recordsToBeInserted.push(data[i]); 
                }
                sErrorMessage = '';//Resetting Error message
            }//End of for loop
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
        const create_S4SalesOrder_WithItems_UsingNormalizedRules = async (req, oFeedData, bReconcile) => {
            var oPayLoad = {}, hanaDBTable = StudioFeed, aDeliverySeqFromDistHeader = [];
            var distroSpecData = await getDistroSpecData(req, oFeedData, aDeliverySeqFromDistHeader);
            var aContentPackageDistRestrictions, sContentDeliveryMethod, sKeyDeliveryMethod, sShippingType_Content, sShippingType_Key;
            let sOrigin = oFeedData?.Origin_OriginID;
            // oResponseStatus = { "error": [], "success": [], "warning": [] };//Resetting oResponseStatus
            oResponseStatus.distroSpecData = distroSpecData;
            oResponseStatus.SalesOrder = '';//Resetting Sales order for next entry
            let iDistroSpecID = distroSpecData?.DistroSpecID,
            sOrderType = oFeedData?.OrderType_code,
            sBookingType = oFeedData?.BookingType_ID,
            sTheaterID = oFeedData?.TheaterID,
            sHFR = oFeedData?.HFR ,
            sTitle = distroSpecData?.Title_Product;
            oFeedData.Title_Product = sTitle;
            if(sTitle){
                let oMat = await prdtx.run(SELECT.one.from(TitleCustVH).where({Product: sTitle}));
                oFeedData.TitleText = oMat?.ProductName;
            }
            let sBupa = oFeedData?.Studio_BusinessPartner;
            if(sBupa){
                let oBP = await s4h_bp_vh.run(SELECT.one.from(S4H_BusinessPartnerapi).where({ BusinessPartner: sBupa }));
                oFeedData.StudioText = oBP?.BusinessPartnerFullName;
            }
            // oPayLoad.SalesOrderType = aConfig?.find((e) => { return e.VariableName === 'SOType_SPIRITWORLD' })?.VariableValue;
            oPayLoad.SalesOrderType = "TA";
            oFeedData.PlayStartTime = oFeedData?.PlayStartTime?oFeedData.PlayStartTime:'00:00:01';
            oFeedData.PlayEndTime = oFeedData?.PlayEndTime?oFeedData.PlayEndTime:'23:59:59';
            if(iDistroSpecID && sOrderType && (sBookingType && (sBookingType !== 'U' || sBookingType !== 'C')) && sTheaterID && sBupa && oFeedData.Status_ID !== 'S'){ //Check not applicable during Reconciliation of repetitie entries
                let aExistingEntry = await SELECT.from(hanaDBTable).where({CustomerReference: `${iDistroSpecID}`, OrderType_code: sOrderType, BookingType_ID: sBookingType, TheaterID: sTheaterID, Studio_BusinessPartner: sBupa }).orderBy({ ref: ['createdAt'], sort: 'desc' });
                for(let i in aExistingEntry){
                    let oExistingEntry = aExistingEntry[i];
                    let sCreatedAt = oExistingEntry?.createdAt;
    
                    var sStartDate = oFeedData?.PlayStartDate;
                    var sStartTime = oFeedData?.PlayStartTime;
                    var sEndDate = oFeedData?.PlayEndDate;
                    var sEndTime = oFeedData?.PlayEndTime;
                    var dStartDate = sStartTime ? new Date(`${sStartDate}T${sStartTime}`) : new Date(`${sStartDate}T00:00:00`);
                    var dEndDate = sEndTime ? new Date(`${sEndDate}T${sEndTime}`) : new Date(`${sEndDate}T00:00:00`);
                    var iDifferenceInHours = (dEndDate - dStartDate) / (60 * 60 * 1000);

                    if(dStartDate && dEndDate && sCreatedAt){
                        let dCreatedAt = new Date(sCreatedAt);
                        // let dToday = new Date();
                        let sSalesOrder = oExistingEntry?.SalesOrder;
                        // let iDiffInDays = (dToday.getTime()-dCreatedAt.getTime())/(1000 * 3600 * 24);
                        // if(iDiffInDays < 7 && sSalesOrder){
                        //     sErrorMessage = `This is a repetition of the SalesOrder ${sSalesOrder} with Booking ID ${oExistingEntry?.BookingID}, posted on ${sCreatedAt.split("T")[0]}`;
                        //     oFeedData.Status_ID = 'S';//Marked for Soft Reconcile
                        //     break;
                        // }
                        // if(dStartDate.getTime() <= dCreatedAt.getTime() && dEndDate.getTime() >= dCreatedAt.getTime() && sSalesOrder){
                        //     let iDiffInDays = (dToday.getTime()-dCreatedAt.getTime())/(1000 * 3600 * 24);
                        // } 

                        let iDiffStartInDays = (dStartDate.getTime()-dCreatedAt.getTime())/(1000 * 3600 * 24);
                        let iDiffEndInDays = (dEndDate.getTime()-dCreatedAt.getTime())/(1000 * 3600 * 24);
                        if(!bReconcile && sSalesOrder && ((!(iDiffStartInDays < 0) && iDiffStartInDays <7) || (!(iDiffEndInDays <0 ) && iDiffEndInDays <7))){
                            sErrorMessage = `This is a repetition of the SalesOrder ${sSalesOrder} with Booking ID ${oExistingEntry?.BookingID}, posted on ${sCreatedAt.split("T")[0]}`;
                            oFeedData.Status_ID = 'S';//Marked for Soft Reconcile
                            break;
                        }
                    }                    
                }
            }
            if (!sErrorMessage ){
                if (oFeedData.RequestedDelivDate) {
                    oPayLoad.RequestedDeliveryDate = `/Date(${new Date(oFeedData.RequestedDelivDate).getTime()})/`
                }
                else {
                    sErrorMessage = 'Requested Delivery Date not available';
                }
                if (!sErrorMessage) {
                    aDeliverySeqFromDistHeader = aDeliverySeqFromDistHeader?.filter((sDelSeq) => {
                        return sDelSeq !== ''
                    }); //Removing blank entries
    
                    oPayLoad.SoldToParty = sSoldToCustomer;
                    oPayLoad.SalesOrganization = SalesOrganization;
                    oPayLoad.DistributionChannel = DistributionChannel;
                    oPayLoad.OrganizationDivision = Division;
                    oPayLoad.PurchaseOrderByCustomer = oFeedData.BookingID;
                    oPayLoad.IncotermsClassification = "CPT";
                    oPayLoad.IncotermsLocation1 = "Destination";
                    oPayLoad.CustomerPurchaseOrderType = oFeedData?.Origin_OriginID; //RULE 10.1
                    var aContentPackages = distroSpecData?.to_Package, aKeyPackages = distroSpecData?.to_KeyPackage;
                    var sShipTo = "";
                    var sBPCustomerNumber = "", sPYCustomer = "", sCustomerGroupFromS4 = "", oSoldToSalesData;
                    oPayLoad.to_Partner = [];
                    if (sTheaterID) { //FIDNING SHIP-TO
                        oSoldToSalesData = await s4h_bp_Txn.run(SELECT.one.from(S4H_CustomerSalesArea, (salesArea) => { salesArea.to_PartnerFunction((partFunc) => { }) }).where({ Customer: sSoldToCustomer, SalesOrganization: SalesOrganization, DistributionChannel: DistributionChannel, Division: Division }));
                        if (!oSoldToSalesData) {
                            sErrorMessage = `Sales Data not maintained for Sold To Customer ${sSoldToCustomer}-${SalesOrganization}/${DistributionChannel}/${Division}`;
                        }
                        if (oSoldToSalesData?.CustomerPaymentTerms === '0001') {
                            sErrorMessage = `Check Payment Terms`;
                            oResponseStatus.Status = 'R';//For Review
                        }
                        if (!sErrorMessage) {
                            if(sTheaterID && (sOrigin === 'S' || sOrigin === 'M')){ //Applicable only for Manual and Spreadsheet
                                sShipTo = sTheaterID;
                                oPayLoad.to_Partner.push({ "PartnerFunction": 'WE', "Customer": sShipTo });
                            }
                            else{
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
                            if (sShipTo) {
                                var oShipToSalesData = await s4h_bp_Txn.run(SELECT.one.from(S4H_CustomerSalesArea, (salesArea) => { salesArea.to_PartnerFunction((partFunc) => { }) }).where({ Customer: sShipTo, SalesOrganization: SalesOrganization, DistributionChannel: DistributionChannel, Division: Division }));
                                sCustomerGroupFromS4 = oShipToSalesData?.CustomerGroup;
                            }
                            else {
                                sErrorMessage = "Ship-To not found";
                            }
                        }
                    }
                    else {
                        sErrorMessage = `Theater ID is not supplied in the payload`;
                    }
                    if (!sErrorMessage) {
                        var oPackages = await performPrioritySort_OrderType_ValidityCheck(oFeedData, distroSpecData); //Contains list of valid content pakcages
                        aContentPackages = oPackages?.ContentPackage;
                        aKeyPackages = oPackages?.KeyPackage;
    
                        if (!aContentPackages?.length && !aKeyPackages?.length) {// No matching content or Key packages found
                            sErrorMessage = `No matching Content Or Key Package available for DistroSpec ${distroSpecData?.DistroSpecID}`;
                        }
                        if (!sErrorMessage && aContentPackages?.length) { //RULE 2.3 => Lookup package ID Delivery method
                            var oContentPackages;
                            let sDeliveryMethodFromPackage = '';   //This stores teh actual delivery method used for SO creation
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
                                            sDeliveryMethodFromPackage = sDelSeq; //Assign the del method found as per sequence
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
                                    // else {
                                    //     sErrorMessage = `Sales Data not maintained for Ship To Customer ${sShipTo}-${SalesOrganization}/${DistributionChannel}/${Division}`;
                                    // }
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
                            sContentDeliveryMethod = sDeliveryMethodFromPackage;
                            if(!sErrorMessage){
                                //RULE 7.1 => Shipping Type for Content
                                if (sContentDeliveryMethod) {
                                    oPayLoad.ShippingCondition = sContentDeliveryMethod;
                                    oResponseStatus.DeliveryMethod = sContentDeliveryMethod;
                                    var oShippingTypeMapping = await SELECT.one.from(ShippingConditionTypeMapping).where({ ShippingCondition: sContentDeliveryMethod });
                                    sShippingType_Content = oShippingTypeMapping?.ShippingType;
        
                                    if (!sShippingType_Content) {
                                        sErrorMessage = `Shipping Type not maintained for Delivery Method: ${sContentDeliveryMethod}`;
                                    }
                                }
                                else {
                                    sErrorMessage = `Delivery Method could not be determined for Content`;
                                }
                                oPackages.ContentPackage = [oFilteredContentPackage];
    
                            }
                        }
                        if (!sErrorMessage && aKeyPackages?.length) { //For Key Package
                            sKeyDeliveryMethod = "04"; //Rule 3.3 => Delivery Method for Key is Fixed
                            sShippingType_Key = '07'; //RULE 7.2 => Shipping Type for KEY
                        }
                        if(!sErrorMessage){
                            for (var pk in oPackages) { //Going through both filtered content and Key packages if available
                                //RULE 2.2 and 3.2 => Package Restrictions (Common for both Content and Key)   - START
                                var aContOrKeyPckg = oPackages[pk] ;
                                // var aContOrKeyPckg = oPackages['ContentPackage'];
                                var aTheaters = [], aLanguage = [], aCircuits = [], aDistroRegions = [];
                                for(let i in aContOrKeyPckg){
                                    let aDistRestrictions = aContOrKeyPckg[i]['to_DistRestriction'];
                                    let aTh = aDistRestrictions.map((item) => {
                                            return item.Theater_BusinessPartner;                                   
                                    });
                                    aTheaters = aTheaters?.length?[...aTheaters, ...aTh]: [...aTh];
                                    aTheaters = aTheaters.filter((item)=>item);
                                    let aLang = aDistRestrictions.map((item) => {
                                            return item.DistributionFilterLanguage_code?.toUpperCase();                                 
                                    });
                                    aLanguage = aLanguage?.length?[...aLanguage, ...aLang] :[...aLang];
                                    aLanguage = aLanguage.filter((item)=>item);
                                    let aCirc = aDistRestrictions.map((item) => {
                                            return item.Circuit_CustomerGroup?.toUpperCase();
                                    });
                                    aCircuits = aCircuits?.length?[...aCircuits, ...aCirc]:[...aCirc];
                                    aCircuits = aCircuits.filter((item)=>item);
    
                                    let aReg = aDistRestrictions.map((item) => {
                                        return item.DistributionFilterRegion_ID?.toUpperCase();
                                    });
                                    aDistroRegions = aDistroRegions?.length?[...aDistroRegions, ...aReg]:[...aReg];
                                    aDistroRegions = aDistroRegions.filter((item)=>item);
                                }
                                // var aCountry = aContOrKeyPckg?.filter((item)=> item.to_DistRestriction)?.filter((rest) => {
                                //     return rest.DistributionFilterCountry_code?.length > 0;
                                // });
                                // var aCity = aContOrKeyPckg?.filter((item)=> item.to_DistRestriction)?.filter((rest) => {
                                //     return rest.DistributionFilterCity?.length > 0;
                                // });
                                // var aPostalCode = aContOrKeyPckg?.filter((item)=> item.to_DistRestriction)?.filter((rest) => {
                                //     return rest.DistributionFilterPostal?.length > 0;
                                // });
                                if (aContOrKeyPckg && aContOrKeyPckg.length) {
                                    if(aTheaters?.length && sShipTo){
                                        if(!aTheaters.includes(sShipTo)){
                                            sErrorMessage = `No Package found as ShipTo ${sShipTo} doesnot match with Theater Restriction`;
                                        }
                                        else{
                                            aContOrKeyPckg = aContOrKeyPckg?.filter((item)=> item.to_DistRestriction?.filter((rest) => {
                                                return rest.Theater_BusinessPartner === sShipTo;
                                            }));
                                        }
                                    }
                                    if(!sErrorMessage && aLanguage?.length){
                                            let oShipToSalesData = await s4h_bp_Txn.run(SELECT.one.from(S4H_CustomerSalesArea, (salesArea) => { salesArea.to_PartnerFunction((partFunc) => { }) }).where({ Customer: sShipTo, SalesOrganization: SalesOrganization, DistributionChannel: DistributionChannel, Division: Division }));
                                            let sShipToLang = oShipToSalesData?.YY1_Language_csa;                               
                                            if(sShipToLang && !aLanguage.includes(sShipToLang?.toUpperCase())){
                                                sErrorMessage = `No Package found as ShipTo ${sShipTo} Language ${sShipToLang} doesnot match with Language Restriction`;
                                            }
                                            else{
                                                aContOrKeyPckg = aContOrKeyPckg?.filter((item)=> item.to_DistRestriction?.filter((rest) => {
                                                    return rest.DistributionFilterLanguage_code?.toUpperCase() === sShipToLang?.toUpperCase();
                                                }));
                                            }
                                    }
                                    if(!sErrorMessage && aCircuits?.length){ 
                                        var oShipToCustomerDataFromS4 = await s4h_bp_Txn.run(SELECT.one.from(S4H_BPCustomer).where({Customer: sShipTo}));  
                                        let sAttr06 = oShipToCustomerDataFromS4?.FreeDefinedAttribute06;                        
                                        if(sAttr06 && !aCircuits.includes(sAttr06?.toUpperCase())){
                                                sErrorMessage = `No Package found as ShipTo ${sShipTo} Circuit (FreeDefinedAttribute06) ${sAttr06} doesnot match with Circuit Restriction`;
                                            }
                                            else{
                                                aContOrKeyPckg = aContOrKeyPckg?.filter((item)=> item.to_DistRestriction?.filter((rest) => {
                                                    return rest.Circuit_CustomerGroup?.toUpperCase() === sAttr06?.toUpperCase();
                                                }));
                                            }
                                        // var oBusinessPartnerAddrfromS4 = await SELECT.from(S4H_BusinessPartnerAddress).where({ BusinessPartner: sBuPa }); //GETTING ADDRESS DATA FROM S4
                                        // var oDistRestriction = aContOrKeyPckg.find((dist) => {
                                        //     return (dist.Theater_BusinessPartner === sShipTo && dist.Circuit_CustomerGroup === sCustomerGroupFromS4 &&
                                        //         ((oBusinessPartnerAddrfromS4?.Language && dist.DistributionFilterLanguage_code) ? oBusinessPartnerAddrfromS4.Language === dist.DistributionFilterLanguage_code : true) &&
                                        //         ((oBusinessPartnerAddrfromS4?.Country && dist.DistributionFilterCountry_code) ? oBusinessPartnerAddrfromS4.Country === dist.DistributionFilterCountry_code : true) &&
                                        //         ((oBusinessPartnerAddrfromS4?.Region && dist.DistributionFilterRegion_Country) ? oBusinessPartnerAddrfromS4.Region === dist.DistributionFilterRegion_Country : true) &&
                                        //         ((oBusinessPartnerAddrfromS4?.CityCode && dist.DistributionFilterCity) ? oBusinessPartnerAddrfromS4.CityCode === dist.DistributionFilterCity : true) &&
                                        //         ((oBusinessPartnerAddrfromS4?.PostalCode && dist.DistributionFilterPostal) ? oBusinessPartnerAddrfromS4.PostalCode === dist.DistributionFilterPostal : true)
                                        //     );
                                        // });
                                        // if (!oDistRestriction) {
                                        //     sErrorMessage = `No relevant Package IDs identified for restrictions.
                                        //     CustomerGroupFromS4:${sCustomerGroupFromS4}|
                                        //     PartnerAddress(Lang/Country/Region/CityCode/PostalCode from S4: ${oBusinessPartnerAddrfromS4.Language}/${oBusinessPartnerAddrfromS4.Country}/${oBusinessPartnerAddrfromS4.Region}/${oBusinessPartnerAddrfromS4.CityCode}/${oBusinessPartnerAddrfromS4.PostalCode})`;
                                        // }
                                    }
                                    if(!sErrorMessage && aDistroRegions?.length){ 
                                        var oShipToAddressFromS4 = await s4h_bp_Txn.run(SELECT.one.from(S4H_BusinessPartnerAddress).where({BusinessPartner: sShipTo}));  
                                        let sS4Country = oShipToAddressFromS4?.Country;                        
                                        if(sS4Country ){
                                            // let aDistRegions = await SELECT.columns(['Code']).from('DistributionService.GeoRegions').where({ID: {"IN": aRegions}});
                                            let aDistCountries = await SELECT.from('DistributionService.GeoCountries').where({SAPCountry: sS4Country});
                                            let aRegionIDs = aDistCountries.map((item)=>item._Region_ID?.toUpperCase());
                                            if(aRegionIDs?.length){
                                                aRegionIDs = [...new Set(aRegionIDs)];
                                                let aTerritories = await SELECT.columns(['_Territory_ID']).from('DistributionService.GeoRegions').where({ ID: {"IN": aRegionIDs} } );
                                                aTerritories = aTerritories.map((item)=>item._Territory_ID)?.filter((item)=>item);
                                                if(aTerritories?.length){
                                                    aRegionIDs = [...aRegionIDs, ...aTerritories]
                                                }
                                                aRegionIDs = [...new Set(aRegionIDs)];
                                                aRegionIDs = aRegionIDs.map((item)=>item.toUpperCase());
                                                let sMattchedRegionID;
                                                for(let i in aDistroRegions){
                                                    if(aRegionIDs.includes(aDistroRegions[i])){
                                                        sMattchedRegionID = aDistroRegions[i];
                                                        break;
                                                    }
                                                }
                                                if(!sMattchedRegionID){
                                                    sErrorMessage = `No Package found as Region IDs for Country ${sS4Country} => (${aRegionIDs?.toString()}) doesnot match with Region Restriction =>(${aDistroRegions?.toString()})`;
                                                }
                                                else{
                                                    aContOrKeyPckg = aContOrKeyPckg?.filter((item)=> item.to_DistRestriction?.filter((rest) => {
                                                        return rest.DistributionFilterRegion_ID?.toUpperCase() === sMattchedRegionID?. toUpperCase();
                                                    }));
                                                }
                                            }
                                        }
                                    }
                                }
                                // oResponseStatus['ContentPackage'] = aContOrKeyPckg?.[0] ? [aContOrKeyPckg?.[0]] : [];
                                oResponseStatus[pk] = aContOrKeyPckg?.[0] ? [aContOrKeyPckg?.[0]] : [];
                                if(sErrorMessage){
                                    break;
                                }
                                //RULE 2.2 and 3.2 => Package Restrictions (Common for both Content and Key)   - END
                            }//Package loop
                        }
                        if (!sErrorMessage) {
                            var oFinalContentPackage = oResponseStatus?.ContentPackage?.[0];
                            var oFinalKeyPackage = oResponseStatus?.KeyPackage?.[0];
                            var sStartDate = oFeedData?.PlayStartDate;
                            var sStartTime = oFeedData?.PlayStartTime;
                            var sEndDate = oFeedData?.PlayEndDate;
                            var sEndTime = oFeedData?.PlayEndTime;
                            var dStartDate = sStartTime ? new Date(`${sStartDate}T${sStartTime}`) : new Date(`${sStartDate}T00:00:00`);
                            var dEndDate = sEndTime ? new Date(`${sEndDate}T${sEndTime}`) : new Date(`${sEndDate}T00:00:00`);
                            var iDifferenceInHours = (dEndDate - dStartDate) / (60 * 60 * 1000);
                            var sReleaseDate = distroSpecData?.ReleaseDate;
                            var ReleaseDate = sReleaseDate ? new Date(`${sReleaseDate}T00:00:00`) : undefined;
                            var sRepertoryDate = distroSpecData?.RepertoryDate;
                            var RepertoryDate = sRepertoryDate ? new Date(`${sRepertoryDate}T00:00:00`) : undefined;
                            oPayLoad.to_Item = [];
    
                            var sLongText;
    
                            // if ((oFinalContentPackage) && sShippingType_Content === '03'  || sShippingType_Content === '06' || sShippingType_Content === '12') {  
                            if (oFinalContentPackage) {  
                                // RULE 5.1 and 6.3 => Applicable only for Content and Key with Include Content  
                                // 27.05.2025:5:29PM (Pranav): When HDD (03), it should pick only DCP with AddMaterialGroup1 derived from Generic Material. No Generic Material to be created here
                                // let oDCPMapping = await getVariableBasedDCPMapping(ReleaseDate, dStartDate, RepertoryDate, sShippingType_Content);
                                let oVarMapping = await getVariableBasedDCPMapping(ReleaseDate, dStartDate, RepertoryDate, sShippingType_Content, CompanyCode);                            
                                let oDCPMapping = oVarMapping?.mapping;
                                // if(sShippingType_Content === '01' || sShippingType_Content === '02' || sShippingType_Content === '06'){ //Satellite Or e-Delivery or HDD => Pick only generic material as per email from Pranav on 3rd Jun 13:05
                                if(sShippingType_Content !== '03' && sShippingType_Content !== '06' && sShippingType_Content !== '12'){ //All other than Physical/HDD/DCDC HDD (as per Teams conversation in Teams with Pranav and Ravneet on 5th Jun 17:00)
                                    if(oDCPMapping){
                                        oPayLoad.to_Item.push({
                                            "Material": oDCPMapping?.Material,
                                            "AdditionalMaterialGroup1": oDCPMapping?.MaterialGroup,
                                            "RequestedQuantity": '1',
                                            "RequestedQuantityISOUnit": "EA",
                                            "DeliveryPriority": `1`,
                                            "PricingReferenceMaterial": distroSpecData?.Title_Product,
                                            "ShippingType": sShippingType_Content,
                                            "ProfitCenter": oDCPMapping?.ProfitCenter,
                                            "ProductionPlant":oDCPMapping?.Plant
                                        });
                                    }
                                    else{
                                        sErrorMessage = `DCP Material Mapping not maintained for: ${oVarMapping?.mode} - ${sShippingType_Content} - ${CompanyCode}, hence generic item not created for content`;
                                        oResponseStatus.error.push({
                                            "BookingID": oFeedData?.BookingID,
                                            "message": `| ${sErrorMessage} |`,
                                            "errorMessage": sErrorMessage
                                        });
                                    }
                                }
                                else{ //DCP Material Creation
                                    if (oFinalContentPackage?.to_DCPMaterial) {
                                        for (var j in oFinalContentPackage.to_DCPMaterial) {
                                            var oMatRecord = oFinalContentPackage.to_DCPMaterial[j];
                                            if (sContentDeliveryMethod === '02') { //RULE 5.2 => LongText for GoFilex TitleID NORAM to pass in Items
                                                var oAssetvault = await SELECT.one.from(AssetVault_Local).where({ DCP: oMatRecord.DCPMaterialNumber_Product });
                                                var sGoFilexTitleID = oAssetvault?.GoFilexTitleID_NORAM;
                                                sLongText = sGoFilexTitleID;
                                            }
                                            var oEntry = {
                                                "Material": oMatRecord.DCPMaterialNumber_Product,
                                                "RequestedQuantity": '1',
                                                "RequestedQuantityISOUnit": "EA",
                                                // "DeliveryPriority": `${oFinalContentPackage?.Priority}`,
                                                "DeliveryPriority": `1`,
                                                "PricingReferenceMaterial": distroSpecData?.Title_Product,
                                                "ShippingType": sShippingType_Content,
                                                "AdditionalMaterialGroup1": oDCPMapping?.MaterialGroup,
                                                "ProfitCenter": oDCPMapping?.ProfitCenter,
                                                "ProductionPlant":oDCPMapping?.Plant
                                            };
                                            oPayLoad.to_Item.push(oEntry);
                                        }
                                        // var aDCPs = oFinalContentPackage?.to_DCPMaterial.map((item) => { return item.DCPMaterialNumber_Product });
                                    }
                                    else {
                                        sErrorMessage = "DCP Material not available";
                                    }                                
                                } 
                            }                        
                            if (oFinalKeyPackage) { //This indicates Key is also applicable
                                // let oDCPMapping = await getVariableBasedDCPMapping(ReleaseDate, dStartDate, RepertoryDate, sShippingType_Key);
                                let oVarMapping = await getVariableBasedDCPMapping(ReleaseDate, dStartDate, RepertoryDate, sShippingType_Key, CompanyCode);
                                let oDCPMapping = oVarMapping?.mapping;
                                if(sShippingType_Key !== '03' && sShippingType_Key !== '06' && sShippingType_Key !== '12'){ //All other than Physical/HDD/DCDC HDD (as per Teams conversation in Teams with Pranav and Ravneet on 5th Jun 17:00)
                                    if (oDCPMapping) {
                                        if(!oPayLoad.to_Item?.find((item)=>{return item.Material === oDCPMapping.Material})){
                                            let oItemEntry = {
                                                "Material": oDCPMapping?.Material,
                                                "AdditionalMaterialGroup1": oDCPMapping?.MaterialGroup,
                                                "RequestedQuantity": '1',
                                                "RequestedQuantityISOUnit": "EA",
                                                "DeliveryPriority": `1`,
                                                "PricingReferenceMaterial": distroSpecData?.Title_Product,
                                                "ShippingType": '07',
                                                "ProfitCenter": oDCPMapping?.ProfitCenter,
                                                "ProductionPlant":oDCPMapping?.Plant
                                            };
                                            // if(sHFR){
                                            //     if(sHFR === "Y" && sBookingType === "NO"){
                                            //         oItemEntry["to_ScheduleLine"] = [{
                                            //             "RequestedDeliveryDate": `/Date(${new Date().getTime()})/`,
                                            //             "DelivBlockReasonForSchedLine": "50"
                                            //         }];
                                            //     }
                                            // }

                                            oPayLoad.to_Item.push(oItemEntry);
                                            // oPayLoad.to_Item.push({...oItemEntry})
                                        }
                                    }
                                    else {
                                        sErrorMessage = `DCP Material Mapping not maintained for: ${oVarMapping?.mode} - ${sShippingType_Content} - ${CompanyCode}, hence generic item not created for key`;
                                        oResponseStatus.error.push({
                                            "BookingID":oFeedData?.BookingID,
                                            "message": `| ${sErrorMessage} |`,
                                            "errorMessage": sErrorMessage
                                        });
                                    }
                                } 
                            }
                        }
                    }
                }
            }
            var sSalesOrder = "";
            if (sErrorMessage) {
                oResponseStatus.error.push({
                    "BookingID": oFeedData?.BookingID,
                    "message": `| Booking ID: ${oFeedData.BookingID}: ${sErrorMessage} |`,
                    "errorMessage": sErrorMessage
                })
            }
            else if(!oPayLoad?.to_Item?.length){
                sErrorMessage = 'Line items could not be determined';
                oResponseStatus.error.push({
                    "BookingID": oFeedData?.BookingID,
                    "message": `| Booking ID: ${oFeedData.BookingID}: ${sErrorMessage} |`,
                    "errorMessage": sErrorMessage
                });
            }
            else {
                var postResult = await s4h_sohv2_Txn.send({
                    method: 'POST',
                    path: '/A_SalesOrder',
                    data: oPayLoad
                }).catch((err) => {
                    oResponseStatus.error.push({
                        "BookingID": oFeedData.BookingID,
                        "message": `| Booking ID: ${oFeedData.BookingID}: ${err.message} |`,
                        "errorMessage": err.message
                    })
                }).then((result) => {
                    if (result) {
                        sSalesOrder = result?.SalesOrder;
                        oResponseStatus.success.push({
                            "BookingID": oFeedData?.BookingID,
                            "message": `| Booking ID: ${oFeedData.BookingID}, Sales Order: ${result?.SalesOrder} is created |`,
                            "SalesOrder": sSalesOrder
                        });
                        oResponseStatus.SalesOrder = sSalesOrder;
                    }
                });
            }
            oResponseStatus.payLoad = oPayLoad;
            oResponseStatus.FilteredPackage = oFinalContentPackage;
            return oResponseStatus;
        };
        const getVariableBasedDCPMapping = async (ReleaseDate, dStartDate, RepertoryDate, sShippingType, sCompanyCode) => {

            // RULE 5.1, 6.1 => Common for Content and Key
            var sMode, dAddSevenDays;
            // if (iDifferenceInHours < 24) {
            //     sMode = 'Screening';
            // }
            if (ReleaseDate) {
                dAddSevenDays = await addDays(ReleaseDate, 7);
            }
            if (ReleaseDate && dStartDate < ReleaseDate) {
                sMode = 'PreRelease';
            }
            else if (ReleaseDate && dStartDate?.getTime() > dAddSevenDays.getTime()) {
                sMode = 'PostBreak';
            }
            else if (ReleaseDate && (dStartDate?.getTime() === ReleaseDate.getTime() || dStartDate?.getTime() <= dAddSevenDays.getTime())) {
                sMode = 'Release';
            }
            else if (RepertoryDate && dStartDate.getTime() >= RepertoryDate.getTime()) {
                sMode = 'Repertory';
            }
            if (sMode) {
                if(sCompanyCode){
                    var oDCPMapping = await SELECT.one.from(DCPMaterialMapping).where({ ShippingType: sShippingType, Variable: sMode, CompanyCode: sCompanyCode });
                }
                else{
                    oDCPMapping = await SELECT.one.from(DCPMaterialMapping).where({ ShippingType: sShippingType, Variable: sMode });
                }
            }
            return {"mode":sMode, "mapping":oDCPMapping};
        }
        const addDays = async (date, days) => {
            const newDate = new Date(date);
            newDate.setDate(date.getDate() + days);
            return newDate;
        }
        const  checkDateFormat = async (dateString)=> {

            // 1. Check format with regex
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            if (!regex.test(dateString)) {
                return false;
            }
            
            // 2. Validate date components
            const date = new Date(dateString);
            // Check if it's a valid date and if the parsed date matches the original string
            return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString;
        }
        const getDistroSpecData = async (req, oContentData, aDeliverySeqFromDistHeader) => {
            let distroSpecData, sOrigin = oContentData.Origin_OriginID,
            sTitle = oContentData.Title_Product,
            sBuPa = oContentData.Studio_BusinessPartner,
            sCustomerRef = oContentData.CustomerReference;            
            var oDistroQuery = SELECT.from(DistroSpec_Local, (dist) => {
                dist('*'),
                    dist.to_StudioKey((studio) => { studio('*') }),
                    dist.to_Package((pkg) => {
                        // pkg('*'),
                            pkg.PackageUUID,
                            pkg.OrderType_code,
                            pkg.PackageName,
                            pkg.Priority,
                            pkg.ValidFrom,
                            pkg.ValidTo,
                            pkg.GofilexTitleID,
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
                            pkg.to_DistRestriction((dist) => { dist('*') }),
                            pkg.to_DCPMaterial((dcpmat) => {
                                dcpmat('*'),
                                    dcpmat.to_DCPDetail((dcpdet) => { dcpdet('*') })
                            })
                    }),
                    dist.to_KeyPackage((keyPkg) => {
                        // keyPkg('*'),
                            keyPkg.PackageUUID,
                            keyPkg.OrderType_code,
                            keyPkg.PackageName,
                            keyPkg.Priority,
                            keyPkg.ValidFrom,
                            keyPkg.ValidTo,
                            keyPkg.to_DistRestriction((dist) => { dist('*') }),
                            keyPkg.to_CPLDetail((cpl) => { cpl('*') })
                    })
            });
            if (sOrigin === "F") { //Feed               
                var oCustomerRef = await SELECT.one.from('DistributionService.CustomerRef').where({ CustomerReference: sCustomerRef });
                var to_DistroSpec_DistroSpecUUID = oCustomerRef?.to_DistroSpec_DistroSpecUUID, //Getting DistroID from Customer Ref table
                    to_StudioKey_StudioKeyUUID = oCustomerRef?.to_StudioKey_StudioKeyUUID;//Getting Studio from Customer Ref table
                if (oCustomerRef && to_DistroSpec_DistroSpecUUID && to_StudioKey_StudioKeyUUID) {    
                    oDistroQuery.SELECT.where = [{ ref: ["DistroSpecUUID"] }, "=", { val: to_DistroSpec_DistroSpecUUID }, "and" ,{ ref: ["Status"] }, "=", { val: true }];
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
            else if(sOrigin === "S" || sOrigin === "M"){//Manual Or Spreadsheet                
                if (isNaN(sCustomerRef)) {
                    sErrorMessage = `Distro ID should be a number formatted as Text during upload. Uploaded content has ${sCustomerRef} as DistroID`;
                }
                else {
                    var iDistroSpecID = parseInt(sCustomerRef);
                    oDistroQuery.SELECT.where = [{ ref: ["DistroSpecID"] }, "=", { val: iDistroSpecID }, "and" , { ref: ["Status"] }, "=", { val: true }];
                    aDistroSpecData = await oDistroQuery;
                    if (aDistroSpecData?.length) {
                        distroSpecData = aDistroSpecData[0];                        
                        if(!distroSpecData?.to_StudioKey || distroSpecData?.to_StudioKey?.length === 0){
                            sErrorMessage = 'Studio not maintained in DistroSpec ${iDistroSpecID}';
                        }
                        else if(!distroSpecData?.to_StudioKey?.find((item)=>{return sBuPa === item.Studio_BusinessPartner})){
                            sErrorMessage = `Studio ${sBuPa} not found in DistroSpec ${iDistroSpecID}`;
                        }                        
                    }
                    else {
                        sErrorMessage = `Active DistroSpec with Distro ID ${sCustomerRef} not found`;
                    }    
                }
            }
            else { // Portal or any Other values
                // var oProductDescFromS4 = await s4h_products_Crt.run(SELECT.one.from(ProductDescription).where({ ProductDescription: sTitle, Language: 'EN' }));
                // var Product = oProductDescFromS4?.Product;
                var Product = sTitle;
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
                    sErrorMessage = `Title is empty`;
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
            var sSalesOrder = oResponseStatus?.SalesOrder, sContentIndicator = oContentData?.OrderType_code;
            var distroSpecData = oResponseStatus?.distroSpecData, oContentPackage = oResponseStatus?.ContentPackage?.[0],
                oPayLoad = oResponseStatus?.payLoad, oKeyPackage = oResponseStatus?.KeyPackage?.[0];
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

                oContentData.to_Item.push({}); //to_Item from to be mapped with _Item of local CDS
                oContentData.to_Item[i]["Product"] = oSalesOrderItem.Material;
                var oAssetvault = await SELECT.one.from(AssetVault_Local).columns(["*", { "ref": ["_Items"], "expand": ["*"] }]).
                    where({ DCP: oSalesOrderItem.Material });
                // var sGoFilexTitleID = oAssetvault?.GoFilexTitleID_NORAM;
                oContentData.to_Item[i].ProductGroup = oSalesOrderItem.MaterialGroup;
                oContentData.to_Item[i].AdditionalMaterialGroup1 = oSalesOrderItem.AdditionalMaterialGroup1;
                oContentData.to_Item[i].Plant = oSalesOrderItem.ProductionPlant;
                if (oPayLoad?.ShippingCondition === '02' && oContentPackage?.GofilexTitleID) { //RULE 5.2 
                    oContentData.to_Item[i].LongText = oContentPackage.GofilexTitleID;
                    await updateItemTextForSalesOrder(req, "Z004", oContentPackage.GofilexTitleID, oResponseStatus, oSalesOrderItem, oContentData);
                }
                var aKeyPkgCPL = oKeyPackage?.to_CPLDetail, aKeyPkgCTT = [], sKeyPkgCTTs, aKeyPkgCPLUUID = [], sKeyPkgCPLUUIDs; //For Key package CTT and CPLUUID
                let aKeyKenCastIDs = [], aKeyKrakenIDs = [];
                var aContentPkgDCP = oContentPackage?.to_DCPMaterial, sContentPkgCTTs, sContentPkgCPLUUIDs; //For Content package CTT and CPLUUID
                var sKrakenTitlesForContentFromAssetVault, sContentPkgAssetIDs, sKencastIDs, sKeyKenCasts, sKeyKrakenIDs;
                var sPackageUUID, sPackageName;
                if (sShippingType === '07') { //Key Order Item
                    sPackageUUID = oKeyPackage?.PackageUUID;
                    sPackageName = oKeyPackage?.PackageName;
                    oContentData.to_Item[i].DistroSpecPackageID = oKeyPackage?.PackageUUID;
                    oContentData.to_Item[i].DistroSpecPackageName = oKeyPackage?.PackageName;
                    for (var c in aKeyPkgCPL) {
                        if (aKeyPkgCPL[c]?.CPLUUID) {
                            aKeyPkgCPLUUID.push(aKeyPkgCPL[c]?.CPLUUID);
                            const oCplList = await SELECT.one.from(CplList).where({ LinkedCPLUUID: aKeyPkgCPL[c]?.CPLUUID });
                            aKeyPkgCTT.push(oCplList?.LinkedCTT);
                            aKeyKenCastIDs.push(oCplList?.KencastID); 
                            aKeyKrakenIDs.push(oCplList?.ProjectID);
                        }
                    }
                    // if (aKeyKenCastIDs?.length) { 
                    //     sKeyKenCasts = aKeyKenCastIDs?.map((u) => { return u ? u : false }).join(`,`);
                    //     oContentData.to_Item[i].AssetIDs = sKeyKenCasts;
                    //     await updateItemTextForSalesOrder(req, "Z013", sKeyKenCasts, oResponseStatus, oSalesOrderItem, oContentData);
                    // }
                    if (aKeyKrakenIDs?.length) {
                        aKeyKrakenIDs = [...new Set(aKeyKrakenIDs) ];
                        sKeyKrakenIDs = aKeyKrakenIDs?.map((u) => { return u ? u : false }).join(`,`);
                        oContentData.to_Item[i].KrakenIDs = sKeyKrakenIDs;
                        await updateItemTextForSalesOrder(req, "Z006", sKeyKrakenIDs, oResponseStatus, oSalesOrderItem, oContentData);
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
                    let sHFR = oContentData?.HFR, sBookingType = oContentData?.BookingType_ID;
                    if(sHFR){
                        if(sHFR === "Y" && (sBookingType === "NO")){
                            await s4h_sohv2_Txn.send({
                                method: 'PATCH',
                                path: `/A_SalesOrderScheduleLine(SalesOrder='${oSalesOrderItem.SalesOrder}',SalesOrderItem='${oSalesOrderItem.SalesOrderItem}',ScheduleLine='1')`,
                                data: {
                                    "DelivBlockReasonForSchedLine":"50"
    
                                }
                            }).catch((err) => {
                                oResponseStatus.warning.push({
                                    "message": `| For Booking ID: ${oContentData.BookingID}-Sales Order: ${oSalesOrderItem?.SalesOrder}-${oSalesOrderItem?.SalesOrderItem}, Schedule line not created: ${err.message} `,
                                    "errorMessage": err.message
                                });
                            }).then((result, param2) => {
                                // if (result) {
                                    oResponseStatus.success.push({
                                        "BookingID": oContentData?.BookingID,
                                        "message": `| For Booking ID: ${oContentData?.BookingID}-Sales Order: ${oSalesOrderItem?.SalesOrder}-${oSalesOrderItem?.SalesOrderItem}, Schedule line is created |`
                                    });
                                // }
                            });                            
                        }
                    }
                        
                }
                else { //Content Order item
                    sPackageUUID = oContentPackage?.PackageUUID;
                    sPackageName = oContentPackage?.PackageName;
                    oContentData.to_Item[i].DistroSpecPackageID = oContentPackage?.PackageUUID;
                    oContentData.to_Item[i].DistroSpecPackageName = oContentPackage?.PackageName;
                    var aFinalCPLs = [], aFinalCTTs = [], aFinalAssetIDs = [];
                    for (var c in aContentPkgDCP) {
                        var aDCPDet = aContentPkgDCP[c];
                        var aLinkedCPLUUIDs = aContentPkgDCP[c]?.to_DCPDetail?.map((item) => { return item.LinkedCPLUUID });
                        var aCTTs = aContentPkgDCP[c]?.to_DCPDetail?.map((item) => { return item.LinkedCTT });
                        let aAssetIDs = aContentPkgDCP[c]?.to_DCPDetail?.map((item) => { return item.AssetMapUUID });
                        let aUniqueAssetIDs = [...new Set(aAssetIDs)];

                        if (aLinkedCPLUUIDs?.length) {
                            aFinalCPLs = aFinalCPLs?.length ? [...aFinalCPLs, ...aLinkedCPLUUIDs] : [...aLinkedCPLUUIDs];
                        }
                        if (aCTTs?.length) {
                            aFinalCTTs = aFinalCTTs?.length ? [...aFinalCTTs, ...aCTTs] : [...aCTTs];
                        }
                        if (aUniqueAssetIDs?.length) {
                            aFinalAssetIDs = aFinalAssetIDs?.length ? [...aFinalAssetIDs, ...aUniqueAssetIDs] : [...aUniqueAssetIDs];
                        }

                        var aDCPMats = aContentPkgDCP[c]?.to_DCPDetail?.map((item) => { return item.DCP });
                        let aUniqueDCPMats = [...new Set(aDCPMats)];
                        if(aDCPMats?.length){
                            let aKencastID = await SELECT.from(AssetVault_Local).columns(["KencastID"]).
                            where({ ProjectID : {'IN': aUniqueDCPMats} }); //Retrieving KencastID from Assetvault based on AssetID maintained in Content DCP

                            if(aKencastID?.length){
                                sKencastIDs = aKencastID?.map((item)=>{ return item.KencastID})?.join(',');
                                oContentData.to_Item[i].AssetIDs = sKencastIDs;
                                if(sKencastIDs)
                                await updateItemTextForSalesOrder(req, "Z013", sKencastIDs, oResponseStatus, oSalesOrderItem, oContentData); 
                            }  
                            let aKrakens = await SELECT.from(AssetVault_Local).columns(["ProjectID"]).
                            where({ ProjectID : {'IN': aUniqueDCPMats} }); //Retrieving Krakens from Assetvault based on AssetID maintained in Content DCP
                            if(aKrakens?.length){
                                sKrakenTitlesForContentFromAssetVault = aKrakens?.map((item)=>{ return item.ProjectID})?.join(',');
                                if(sKrakenTitlesForContentFromAssetVault)
                                await updateItemTextForSalesOrder(req, "Z006", sKrakenTitlesForContentFromAssetVault, oResponseStatus, oSalesOrderItem, oContentData); 
                            }                             
                        }
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
                    // if (aFinalAssetIDs?.length) { //made it only for C as per email from Ravneet on 27th May and as discusssed with Pranav on 27th 3:17PM)
                    //     // sContentPkgAssetIDs = aFinalAssetIDs?.map((u) => { return u ? u : false }).join(`,`);
                    //     // oContentData.to_Item[i].AssetIDs = sContentPkgAssetIDs;
                    //     // await updateItemTextForSalesOrder(req, "Z013", sContentPkgAssetIDs, oResponseStatus, oSalesOrderItem, oContentData); 
                    //     let aKencastID = await SELECT.from(AssetVault_Local).columns(["KencastID"]).
                    //     where({ AssetMapID : {'IN': aFinalAssetIDs} }); //Retrieving KencastID from Assetvault based on AssetID maintained in Content DCP

                    //     if(aKencastID?.length){
                    //         sKencastIDs = aKencastID?.map((item)=>{ return item.KencastID})?.join(',');
                    //         oContentData.to_Item[i].AssetIDs = sKencastIDs;
                    //         if(sKencastIDs)
                    //         await updateItemTextForSalesOrder(req, "Z013", sKencastIDs, oResponseStatus, oSalesOrderItem, oContentData); 
                    //     }                       
                        
                    //     let aKrakens = await SELECT.from(AssetVault_Local).columns(["ProjectID"]).
                    //     where({ AssetMapID : {'IN': aFinalAssetIDs} }); //Retrieving Krakens from Assetvault based on AssetID maintained in Content DCP
                    //     if(aKrakens?.length){
                    //         sKrakenTitlesForContentFromAssetVault = aKrakens?.map((item)=>{ return item.ProjectID})?.join(',');
                    //         if(sKrakenTitlesForContentFromAssetVault)
                    //         await updateItemTextForSalesOrder(req, "Z006", sKrakenTitlesForContentFromAssetVault, oResponseStatus, oSalesOrderItem, oContentData); 
                    //     }
                    // }                         
                }
                if (oSalesOrderItem?.AdditionalMaterialGroup1 && sPackageName) { //RULE 9.9 (made it for both C and K as per discussion on 22nd May)
                    // var oProdGroup = await s4h_prodGroup.run(SELECT.one.from(S4_ProductGroupText).where({ MaterialGroup: oSalesOrderItem?.AdditionalMaterialGroup1, Language: 'EN' }));
                    var oProdGroup = await prdgrp1tx.run(SELECT.one.from(S4H_ProductGroup1).where({ AdditionalMaterialGroup1: oSalesOrderItem?.AdditionalMaterialGroup1, Language: 'EN' }));
                    if (oProdGroup) {
                        await updateItemTextForSalesOrder(req, "Z002", `${sPackageName} ${oProdGroup?.AdditionalMaterialGroup1Name}`, oResponseStatus, oSalesOrderItem, oContentData);
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
        const performPrioritySort_OrderType_ValidityCheck = async (oFeedData, distroSpecData) => {
            var sFeedOrderType = oFeedData?.OrderType_code;
            var aContentPackage = distroSpecData?.to_Package;
            var aKeyPackage = distroSpecData?.to_KeyPackage;

            aContentPackage?.sort(function (a, b) {
                return a.Priority - b.Priority;
            });
            aKeyPackage?.sort(function (a, b) {
                return a.Priority - b.Priority;
            });

            var dPlayStartDate = new Date(oFeedData.PlayStartDate.replace(/-/g, '/'));
            var dPlayEndDate = new Date(oFeedData.PlayEndDate.replace(/-/g, '/'));

            if (sFeedOrderType === 'C' ) { //Package check when Feed Order Type is C
                aContentPackage = aContentPackage?.filter((pkg) => { //Pick only C or B entries of Content
                    var sDistValidFrom = pkg.ValidFrom;
                    var sDistValidTo = pkg.ValidTo;
                    sDistValidFrom = new Date(sDistValidFrom.replace(/-/g, '/'));
                    sDistValidTo = new Date(sDistValidTo.replace(/-/g, '/'));
                    let bDateCheck = (dPlayStartDate >= sDistValidFrom && dPlayEndDate <= sDistValidTo);
                    if (pkg.OrderType_code) { //If content package has Order type maintained
                        return (bDateCheck && (pkg.OrderType_code === "C" || pkg.OrderType_code === 'B'));
                    }
                    else {
                        return false;
                    }
                });
                aKeyPackage = aKeyPackage?.filter((pkg) => { //Key package check when Feed Order Type = C or B
                    var sDistValidFrom = pkg.ValidFrom;
                    var sDistValidTo = pkg.ValidTo;
                    sDistValidFrom = new Date(sDistValidFrom.replace(/-/g, '/'));
                    sDistValidTo = new Date(sDistValidTo.replace(/-/g, '/'));
                    let bDateCheck = (dPlayStartDate >= sDistValidFrom && dPlayEndDate <= sDistValidTo);
                    if (pkg.OrderType_code) { //If content package has Order type maintained
                        return (bDateCheck && (pkg.OrderType_code === "C" || pkg.OrderType_code === 'B'));
                    }
                    else {
                        return false;
                    }
                });
            }
            else if (sFeedOrderType === 'K') { //Package check when Feed Order Type is K 
                aKeyPackage = aKeyPackage?.filter((pkg) => { //Key package check when Feed Order Type = K or B
                    var sDistValidFrom = pkg.ValidFrom;
                    var sDistValidTo = pkg.ValidTo;
                    sDistValidFrom = new Date(sDistValidFrom.replace(/-/g, '/'));
                    sDistValidTo = new Date(sDistValidTo.replace(/-/g, '/'));
                    let bDateCheck = (dPlayStartDate >= sDistValidFrom && dPlayEndDate <= sDistValidTo);
                    if (pkg.OrderType_code) { //If content package has Order type maintained
                        return (bDateCheck && (pkg.OrderType_code === "K" || pkg.OrderType_code === 'B'));
                    }
                    else {
                        return false;
                    }
                });
                aContentPackage = aContentPackage?.filter((pkg) => { //Pick only K or B entries of Content
                    var sDistValidFrom = pkg.ValidFrom;
                    var sDistValidTo = pkg.ValidTo;
                    sDistValidFrom = new Date(sDistValidFrom.replace(/-/g, '/'));
                    sDistValidTo = new Date(sDistValidTo.replace(/-/g, '/'));
                    let bDateCheck = (dPlayStartDate >= sDistValidFrom && dPlayEndDate <= sDistValidTo);
                    if (pkg.OrderType_code) { //If content package has Order type maintained
                        return (bDateCheck && (pkg.OrderType_code === "K" || pkg.OrderType_code === 'B'));
                    }
                    else {
                        return false;
                    }
                });
            }
            else if (sFeedOrderType === 'B' ) { //Package check when Feed Order Type is B
                aContentPackage = aContentPackage?.filter((pkg) => { //Pick only C or K or B entries of Content
                    var sDistValidFrom = pkg.ValidFrom;
                    var sDistValidTo = pkg.ValidTo;
                    sDistValidFrom = new Date(sDistValidFrom.replace(/-/g, '/'));
                    sDistValidTo = new Date(sDistValidTo.replace(/-/g, '/'));
                    let bDateCheck = (dPlayStartDate >= sDistValidFrom && dPlayEndDate <= sDistValidTo);
                    if (pkg.OrderType_code) { //If content package has Order type maintained
                        return (bDateCheck && (pkg.OrderType_code === "C" || pkg.OrderType_code === "K" || pkg.OrderType_code === 'B'));
                    }
                    else {
                        return false;
                    }
                });
                aKeyPackage = aKeyPackage?.filter((pkg) => { //Key package check when Feed Order Type = C or K or B
                    var sDistValidFrom = pkg.ValidFrom;
                    var sDistValidTo = pkg.ValidTo;
                    sDistValidFrom = new Date(sDistValidFrom.replace(/-/g, '/'));
                    sDistValidTo = new Date(sDistValidTo.replace(/-/g, '/'));
                    let bDateCheck = (dPlayStartDate >= sDistValidFrom && dPlayEndDate <= sDistValidTo);
                    if (pkg.OrderType_code) { //If content package has Order type maintained
                        return (bDateCheck && (pkg.OrderType_code === "C" || pkg.OrderType_code === "K" || pkg.OrderType_code === 'B'));
                    }
                    else {
                        return false;
                    }
                });
            }
            else { // If Feed Ordertype is blank, no content/key packages can be fected
                return { "ContentPackage": [], "KeyPackage": [] };
            }
            return { "ContentPackage": aContentPackage, "KeyPackage": aKeyPackage };
        };
        this.on('READ', S4H_BPCustomer , async(req)=>{
            return await s4h_bp_Txn.run(req.query);
        });
        this.on('READ', TitleCustVH , async(req)=>{
            return await prdtx.run(req.query);
        });
        this.on('READ', StudioVH , async(req)=>{
            return await bpapi.run(req.query);
        });        
        this.on(['READ'], S4H_ProformaReport, async (req)=>{
            let aWhere = req.query.SELECT.where, aWhere_V2 = [];
            if(aWhere?.find((cond)=>  cond.xpr)){
                for(let i in aWhere){
                    if(aWhere[i].xpr){
                        let aTemp = aWhere[i].xpr
                        for(let j in aTemp){
                            if(aTemp[j]?.args?.[0]){
                                aWhere_V2.push(aTemp[j].args[0]);
                            }
                            else{
                                aWhere_V2.push(aTemp[j]);
                            }                        
                        }
                    }
                    else{
                        aWhere_V2.push(aWhere[i]);
                    }
                } 
            } 
            else if(aWhere){
                for(let j in aWhere){
                    if(aWhere[j]?.args?.[0]){
                        aWhere_V2.push(aWhere[j].args[0]);
                    }
                    else{
                        aWhere_V2.push(aWhere[j]);
                    }                        
                }
            }      
            if(aWhere_V2?.length)
                req.query.SELECT.where = aWhere_V2;
            if(req.query.SELECT.orderBy){
                req.query.SELECT.orderBy = undefined;
            }
            // let aData = await proformaAPI.run(req.query);
            let aData = await bpapi.run(req.query);
            let aBPList = [];//For BP Address Search optimization
            if(Array.isArray(aData)){
                // for(let i in aData){
                //     let query = SELECT.one.from(StudioFeed).where({SalesOrder: aData[i].SalesDocument});
                //     let oSalesOrder = await query;
                //     if (oSalesOrder?.PlayStartDate) {
                //         aData[i].PlayStartDate = oSalesOrder?.PlayStartDate;
                //     }
                //     if (oSalesOrder?.PlayEndDate) {
                //         aData[i].PlayEndDate = oSalesOrder?.PlayEndDate;
                //     }
                //     aData[i].RequestID = oSalesOrder?.RequestId;
                //     aData[i].BookerName = oSalesOrder?.BookerName;
                //     let oPackTitleText = await s4h_sohv2_Txn.run(SELECT.one.from(S4H_SalesOrderItemText).where({SalesOrder: aData[i].SalesDocument, SalesOrderItem: aData[i].SalesDocumentItem, LongTextID: 'Z010'}));
                //     if(oPackTitleText){
                //         aData[i].PackageTitle = oPackTitleText?.LongText;
                //     }
                //     let oBP = await bpsoapi.run(SELECT.one.from(SalesDocumentHeaderPartner).where({SalesDocument: aData[i].SalesDocument}));
                //     let sBusinessPartner = oBP?.ReferenceBusinessPartner;
                //     if(sBusinessPartner){
                //         let oBPFound = aBPList.find((item)=>{return item.bp === sBusinessPartner});
                //         aData[i].ReferenceBusinessPartner = sBusinessPartner;
                //         let oBPAddress;
                //         if(!oBPFound){
                //             let oBPDetails = await s4h_bp_Txn.run(SELECT.one.from(S4H_BuisnessPartner).columns(['*', { "ref": ["to_BusinessPartnerAddress"], "expand": ["*"] }]).where({ BusinessPartner: sBusinessPartner }));
                //             oBPAddress = oBPDetails?.to_BusinessPartnerAddress?.[0];
                //             aBPList.push({"bp":sBusinessPartner,"Address":oBPAddress});
                //         }
                //         else{
                //             oBPAddress = oBPFound.Address;
                //         }
                        
                //         if(oBPAddress){
                //             aData[i].BPStreetName = oBPAddress?.StreetName;
                //             aData[i].BPCityName = oBPAddress?.CityName;
                //             aData[i].BPPostalCode = oBPAddress?.PostalCode;
                //             aData[i].BPRegion = oBPAddress?.Region;                                                        
                //             aData[i].BPCountry = oBPAddress?.Country; 
                //             aData[i].AddressID = oBPAddress?.AddressID; 
                //         }
                //     }
                //     let oShipDetails = await proformaDelDocAPI.run(SELECT.one.from(S4H_ProformaDeliveryDoc).where({SalesDocument: aData[i].SalesDocument, SalesDocumentItem: aData[i].SalesDocumentItem}));
                //     // aData[i].ShipDate = oShipDetails?.ActualGoodsMovementDate;
                //       aData[i].ShipDate = oShipDetails?.PlannedGoodsIssueDate;
                    
                // }


                // Enriched Code 

                    const salesOrderIds = aData.map(e => e.SalesDocument);
                    const salesOrderItems = aData.map(e => ({
                        SalesDocument: e.SalesDocument,
                        SalesDocumentItem: e.SalesDocumentItem
                    }));
                
                    // 1. Fetch StudioFeed data in bulk
                    const studioFeedData = await SELECT
                        .from(StudioFeed)
                        .columns(['*', { ref: ["Studio"], expand: ["*"] }])
                        .where({ SalesOrder: { in: salesOrderIds } });
                
                    // 2. Fetch S4H_SalesOrderItemText data in bulk
                    const salesOrderTexts = await s4h_sohv2_Txn.run(
                        SELECT
                            .from(S4H_SalesOrderItemText)
                            .where({ 
                                SalesOrder: { in: salesOrderIds },
                                LongTextID: 'Z010'
                            })
                    );
                
                    // 3. Fetch Partner data in bulk
                    const partnerData = await bpsoapi.run(
                        SELECT
                            .from(SalesDocumentHeaderPartner)
                            .where({ SalesDocument: { in: salesOrderIds } })
                    );
                
                    const businessPartners = partnerData.map(p => p.ReferenceBusinessPartner);
                
                    // 4. Fetch BusinessPartner data in bulk
                    const bpDetailsList = await s4h_bp_Txn.run(
                        SELECT
                            .from(S4H_BuisnessPartner)
                            .columns(['*', { ref: ["to_BusinessPartnerAddress"], expand: ["*"] }])
                            .where({ BusinessPartner: { in: businessPartners } })
                    );
                
                    // 5. Fetch Shipping Details in bulk
                    const shipDetails = await proformaDelDocAPI.run(
                        SELECT
                            .from(S4H_ProformaDeliveryDoc)
                            .where({
                                SalesDocument: { in: salesOrderIds }
                            })
                    );
                
                    // Mapping fetched data for fast lookup
                    const studioFeedMap = Object.fromEntries(studioFeedData.map(o => [o.SalesOrder, o]));
                    const textMap = new Map();
                    for (let text of salesOrderTexts) {
                        textMap.set(`${text.SalesOrder}-${text.SalesOrderItem}`, text.LongText);
                    }
                
                    const bpPartnerMap = Object.fromEntries(partnerData.map(p => [p.SalesDocument, p.ReferenceBusinessPartner]));
                    const bpAddressMap = new Map();
                    for (let bp of bpDetailsList) {
                        const address = bp?.to_BusinessPartnerAddress?.[0];
                        if (address) bpAddressMap.set(bp.BusinessPartner, address);
                    }
                
                    const shipMap = new Map();
                    for (let ship of shipDetails) {
                        shipMap.set(`${ship.SalesDocument}-${ship.SalesDocumentItem}`, ship);
                    }
                
                    // Enriching aData with mapped results
                    for (let item of aData) {
                        const studio = studioFeedMap[item.SalesDocument];
                        if (studio) {
                            item.Studio = studio.Studio;
                            item.StudioText = studio.StudioText;
                            item.StudioTheatreId = studio.TheaterID;
                            item.StudioMediaOrderID = studio.RequestId;
                            item.PlayStartDate = studio.PlayStartDate;
                            item.PlayEndDate = studio.PlayEndDate;
                            item.RequestID = studio.RequestId;
                            item.BookerName = studio.BookerName;
                        }
                
                        const longTextKey = `${item.SalesDocument}-${item.SalesDocumentItem}`;
                        item.PackageTitle = textMap.get(longTextKey);
                
                        const bpId = bpPartnerMap[item.SalesDocument];
                        item.ReferenceBusinessPartner = bpId;
                        const bpAddress = bpAddressMap.get(bpId);
                        if (bpAddress) {
                            item.BPStreetName = bpAddress.StreetName + bpAddress.District  ;
                            item.BPCityName = bpAddress.CityName;
                            item.BPPostalCode = bpAddress.PostalCode;
                            item.BPRegion = bpAddress.Region;
                            item.BPCountry = bpAddress.Country;
                            item.AddressID = bpAddress.AddressID;
                        }
                
                        const ship = shipMap.get(longTextKey);
                        if (ship) {
                            item.ShipDate = ship.PlannedGoodsIssueDate;
                        }
                    }
                
                
            }
            else{ //For Object Page
                let query = SELECT.one.from(StudioFeed).where({SalesOrder: aData['SalesDocument']});
                let oSalesOrder = await query;
                if (oSalesOrder?.PlayStartDate) {
                    aData['PlayStartDate'] = oSalesOrder?.PlayStartDate;
                }
                if (oSalesOrder?.PlayEndDate) {
                    aData['PlayEndDate'] = oSalesOrder?.PlayEndDate;
                }
                aData['RequestID'] = oSalesOrder?.RequestId;
                aData['BookerName'] = oSalesOrder?.BookerName;
                if(aData['SalesDocument'] && aData['SalesDocumentItem']){
                    let oPackTitleText = await s4h_sohv2_Txn.run(SELECT.one.from(S4H_SalesOrderItemText).where({SalesOrder: aData['SalesDocument'], SalesOrderItem: aData['SalesDocumentItem'], LongTextID: 'Z010'}));
                    if(oPackTitleText){
                        aData['PackageTitle'] = oPackTitleText?.LongText;
                    }

                }
                // let aBP = [], sBusinessPartner = aData["ReferenceBusinessPartner"];
                if(aData['SalesDocument']){
                    let oBP = await bpsoapi.run(SELECT.one.from(SalesDocumentHeaderPartner).where({SalesDocument: aData['SalesDocument']}));
                    let sBusinessPartner = oBP?.ReferenceBusinessPartner;
                    if(sBusinessPartner){
                        let oBPFound = aBPList.find((item)=>{return item.bp === sBusinessPartner});
                        aData["ReferenceBusinessPartner"] = sBusinessPartner;
                        let oBPAddress;
                        if(!oBPFound){
                            let oBPDetails = await s4h_bp_Txn.run(SELECT.one.from(S4H_BuisnessPartner).columns(['*', { "ref": ["to_BusinessPartnerAddress"], "expand": ["*"] }]).where({ BusinessPartner: sBusinessPartner }));
                            oBPAddress = oBPDetails?.to_BusinessPartnerAddress?.[0];
                            aBPList.push({"bp":sBusinessPartner,"Address":oBPAddress});
                        }
                        else{
                            oBPAddress = oBPFound.Address;
                        }
                        if(oBPAddress){
                            aData["BPStreetName"] = oBPAddress?.StreetName;
                            aData["BPCityName"] = oBPAddress?.CityName;
                            aData["BPPostalCode"] = oBPAddress?.PostalCode;
                            aData["BPRegion"] = oBPAddress?.Region;                                                        
                            aData["BPCountry"] = oBPAddress?.Country; 
                            aData["AddressID"] = oBPAddress?.AddressID;
                        }
                    }
                    
                    let oShipDetails = await proformaDelDocAPI.run(SELECT.one.from(S4H_ProformaDeliveryDoc).where({SalesDocument: aData["SalesDocument"], SalesDocumentItem: aData["SalesDocumentItem"]}));
                    aData["ShipDate"] = oShipDetails?.ActualGoodsMovementDate;
                }
            }
            return aData;
        });
        this.on('READ', S4H_ProformaDeliveryDoc , async(req)=>{
            return await proformaDelDocAPI.run(req.query);
        });
        this.on(['READ'], S4H_BusinessPartnerAddress, async (req) => {
            return await s4h_bp_Txn.run(req.query);
        });
        this.on('READ',SalesDocumentHeaderPartner, async(req)=>{
            return await bpsoapi.run(req.query);
        })
        this.on(['READ'], S4_SalesParameter, async (req) => {
            return s4h_salesparam_Txn.run(req.query);
        });
        this.on(['READ'], DCPMaterialMapping, async (req) => {
            return distrospec_Txn.run(req.query);
        });
        this.on(['READ'], S4_ProductGroupText, async (req) => {
            return s4h_prodGroup.run(req.query);
        });

        this.on(['READ'], BillingDocumentPartner, async (req) => {
            return srv_BillingDocument.run(req.query);
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

        this.on(['READ'], S4_Plants, async req => {
            return await s4h_planttx.run(req.query);
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
                        "BookingID": oContentData?.BookingID,
                        "message": `| For Booking ID: ${oContentData?.BookingID}-Sales Order: ${oSalesOrderItem?.SalesOrder}-${oSalesOrderItem?.SalesOrderItem}, ${sType} Item Text is created |`
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
        this.on("READ", BillingDocument, async req => {
            return await srv_BillingDocument.run(req.query);
        });
        this.on("READ", BillingDocumentItem, async req => {
            return await srv_BillingDocument.run(req.query);
        });

        this.on("READ", [S4H_Country, CountryText], async (req, res) => {
            return await s4h_country.run(req.query);
        });

        this.on("READ", [TitleV], async (req, res) => {
            // return await s4h_country.run(req.query);
            const dbData = await cds.tx(req).run(req.query);
            const oTitleCategory = {
                "Z006": "Provisional/Unknown Title",
                "Z007": "Confirmed/Known Title"
            }
            if (dbData.length > 0) {
                const countryCodes = [...new Set(dbData.map(row => row.RegionCode != null ? row.RegionCode : ''))]
                const aStudioDistrbution = [...new Set(dbData.map(row => row.StudioDistributor != null ? row.StudioDistributor.slice(0, 10) : ''))]
                const aLanguage = [...new Set(dbData.map(row => row.LanguageCode != null ? row.LanguageCode.toLowerCase() : ''))]

                const countryTexts = await s4h_country.run(
                    SELECT.from(CountryText).where({ Country: { in: countryCodes } })
                )

                const textMap = Object.fromEntries(countryTexts.map(ct => [ct.Country, ct.CountryName]))

                const aStudioText = await s4h_bp_vh.run(
                    SELECT.from(S4H_BusinessPartnerapi).where({ BusinessPartner: { in: aStudioDistrbution } })
                );
                const textMapStudio = Object.fromEntries(aStudioText.map(ct => [ct.BusinessPartner, ct.BusinessPartnerFullName]))

                const aLanguageText = await distrospec_Txn.run(
                    SELECT.from(Languages).where({ code: { in: aLanguage } })
                );
                const textMapLanguage = Object.fromEntries(aLanguageText.map(ct => [ct.code, ct.name]))


                return dbData.map(row => ({
                    ...row,
                    //   Country : row.RegionalCode,
                    Region: textMap[row.RegionCode] || null,
                    TitleCategoryText: oTitleCategory[row.TitleCategory] || null,
                    StudioText: textMapStudio[row.StudioDistributor] || null,
                    LangCodeText: textMapLanguage[row.LanguageCode != null ? row.LanguageCode.toLowerCase() : ''] || null
                }))
            }
            else {
                const oneDb = await SELECT.one.from(TitleV).where({
                    MaterialMasterTitleID: dbData.MaterialMasterTitleID,
                    LocalTitleId: dbData.LocalTitleId,
                    ID: dbData.ID,
                    TitleType: dbData.TitleType
                });
                if (oneDb) {
                    const countryTexts = await s4h_country.run(
                        SELECT.one.from(CountryText).where({ Country: oneDb.RegionCode, Language: 'EN' })
                    )
                    const oStudioText = await s4h_bp_vh.run(
                        SELECT.one.from(S4H_BusinessPartnerapi).where({ BusinessPartner: oneDb.StudioDistributor })
                    );

                    const oLanguageText = await distrospec_Txn.run(
                        SELECT.one.from(Languages).where({ code: oneDb.LanguageCode.toLowerCase() })
                    );
                    dbData.Region = countryTexts?.CountryName;
                    dbData.TitleCategoryText = oTitleCategory[oneDb.TitleCategory]
                    dbData.StudioText = oStudioText?.BusinessPartnerFullName;
                    dbData.LangCodeText = oLanguageText?.name;
                    return dbData
                }
            }
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
            var aMatDoc = await s4h_material_read.run(req.query);

            const aMaterials = [...new Set(aMatDoc.map(row => row.Material))]
            const aPlant = [...new Set(aMatDoc.map(row => row.Plant))]
            const aBatch = [...new Set(aMatDoc.map(row => row.Batch))]
            const aSupplier = [...new Set(aMatDoc.map(row => row.Supplier))]

            if (aMaterials.length != 0) {
                var aMaterialTexts = await s4h_products_Crt.run(
                    SELECT.from(ProductDescription).where({ Product: { in: aMaterials }, Language: 'EN' })
                )
            } else {
                var aMaterialTexts = [];
            }

            if (aPlant.length != 0) {
                var aPlantTexts = await s4h_planttx.run(
                    SELECT.from(S4_Plants).where({ Plant: { in: aPlant } })
                );
            }
            else {
                var aPlantTexts = [];
            }

            if (aSupplier.length != 0) {
                var aSupplierTexts = await s4h_bp_Txn.run(SELECT.from(S4H_BuisnessPartner).where({ Supplier: { in: aSupplier } }))
            } else {
                var aSupplierTexts = [];
            }

            if (aBatch.length != 0) {
                var aBatchTexts = await cds.transaction(req).run(SELECT.from(Batch).where({ BatchNumber: { in: aBatch } }));
            } else {
                var aBatchTexts = [];
            }


            const mDescMap = Object.fromEntries(aMaterialTexts.map(ct => [ct.Product, ct.ProductDescription]))
            const mPlantDescMap = Object.fromEntries(aPlantTexts.map(ct => [ct.Plant, ct.PlantName]))
            const mSupplierDescMap = Object.fromEntries(aSupplierTexts.map(ct => [ct.Supplier, ct.BusinessPartnerFullName]))
            const mBatchDescMap = Object.fromEntries(aBatchTexts.map(ct => [ct.BatchNumber, ct.InventoryBinName]))

            return aMatDoc.map(row => ({
                ...row,
                //   Country : row.RegionalCode,
                MaterialDescription: mDescMap[row.Material] || null,
                PlantDescription: mPlantDescMap[row.Plant] || null,
                BatchDescription: mBatchDescMap[row.Batch] || null,
                SupplierDescription: mSupplierDescMap[row.Supplier] || null
            }))

        });
        // this.on(['READ'], MaterialDocumentItem_Print, async req => { //s4h_bp_vh

        //     var aPlants= s4h_planttx.run(SELECT.from(MaterialDocumentItem_Print).where({ ComapnyCode: '3011' }));
        //     return await s4h_material_read.run(req.query);
        // });
        // this.on(['READ'], MaterialDocumentHeader_Prnt, async req => { //s4h_bp_vh
        //     return await s4h_material_read.run(req.query);
        // });

        this.on(['READ'], S4H_BusinessPartnerapi, async req => { //s4h_bp_vh
            return await s4h_bp_vh.run(req.query);
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
                const response = await s4h_products_Crt.run(UPDATE(Products).set({ ProductGroup: input.ProductGroup }).where({ Product: input.Product }));
                //const response = await s4h_products_Crt.run(UPDATE(ProductBasicText).set({ LongText: input.to_ProductBasicText[0].LongText }).where({ Product: input.Product, Language: 'EN' }));
                const sDescription = await s4h_products_Crt.run(SELECT.from(ProductDescription).where({ Product: input.Product, Language: 'EN' }));
                if (sDescription.length != 0) {
                    const response1 = await s4h_products_Crt.run(UPDATE(ProductDescription).set({ ProductDescription: input.to_Description[0].ProductDescription }).where({ Product: input.Product, Language: 'EN' }));
                }
                else {
                    const response1 = await s4h_products_Crt.run(INSERT.into(ProductDescription).entries({ ProductDescription: input.to_Description[0].ProductDescription, Product: input.Product, Language: 'EN' }));
                }

                const sBasicText = await s4h_products_Crt.run(SELECT.from(ProductBasicText).where({ Product: input.Product, Language: 'EN' }));
                if (sBasicText.length != 0) {
                    const response = await s4h_products_Crt.run(UPDATE(ProductBasicText).set({ LongText: input.to_ProductBasicText[0].LongText }).where({ Product: input.Product, Language: 'EN' }));
                }
                else {
                    const response = await s4h_products_Crt.run(INSERT.into(ProductBasicText).entries({ Product: input.Product, LongText: input.to_ProductBasicText[0].LongText, Language: 'EN' }));
                }

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
                return { Product: input.Product };
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
                        return (item?.LinkedCTT?.toUpperCase().includes('RTG') || item?.LinkedCTT?.toUpperCase().includes('RATING'));
                    });
                    await aRatingItems?.forEach(element => {
                        Content.push({
                            "ContentText": `${element.LinkedCTT}
Duration:${element.RunTime ? element.RunTime : '-'} Start Of Credits:${element.StartOfCredits ? element.StartOfCredits : '-'} Crawl:${element.StartOfCrawl ? element.StartOfCrawl : '-'}`
                        });
                    });
                    RatingCount = aRatingItems?.length;

                    var aTrailerItems = aItems?.filter((item) => {
                        return item?.LinkedCTT?.toUpperCase().includes('TLR');
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
                    // if (Product) {
                    //     var oProdLongText = await s4h_products_Crt.run(SELECT.one.from(ProductBasicText).where({ Product: Product, Language: 'EN' }));
                    //     Title = oProdLongText?.LongText;
                    // }
                    var convertedBytes = await convertBytes(oAssetVault?.AssetMapFileSize);
                    TotalSize = convertedBytes;

                    // var distroSpecData = await SELECT.one.from('DistributionService.DistroSpec', (dist) => {
                    //     dist.DistroSpecUUID,
                    //         dist.DistroSpecID,
                    //         dist.Title_Product,
                    //         dist.Name,
                    //         dist.to_StudioKey((studio) => {
                    //             studio.Studio_BusinessPartner
                    //         })
                    // }).where({ Title_Product: DCPBarcode });
                    // var sBupa = distroSpecData?.to_StudioKey?.[0]?.Studio_BusinessPartner;
                    let oTitleV = await SELECT.one.from(TitleV).where({ MaterialMasterTitleID: Product, TitleType: 'Parent' });
                    var sBupa = oTitleV?.StudioDistributor;
                    if(oTitleV?.UseSecureName === "No"){
                        Title = oTitleV.OriginalTitleName;
                    }
                    else{
                       Title = oTitleV.SecurityTitle;
                    }
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
                console.log("materialDocument", materialDocument);
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
                        ProductDescription: product.to_Description[0].ProductDescription,
                        ProductManufacturerNumber: product.ProductManufacturerNumber,
                        YY1_CustomerDes_PRD: product.YY1_CustomerDes_PRD,
                        YY1_matcust_PRD: product.YY1_matcust_PRD
                    };
                });

                // Construct GRMatItemNode array with mapped product details
                const GRMatItemNode = materialDocument[0].to_MaterialDocumentItem?.reduce((accum, item) => {
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
                            EntryUnit: item.EntryUnit,
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
                            // Material: item.Material,
                            Material: productMap[item.Material]?.ProductDescription || "Unknown Material",
                            MaterialDocument: item.MaterialDocument,
                            MaterialDocumentItem: item.MaterialDocumentItem,
                            MaterialDocumentYear: item.MaterialDocumentYear,
                            MaterialGrossWeight: 13.0,
                            MaterialName: productMap[item.Material]?.ProductManufacturerNumber == '' ? productMap[item.Material]?.to_Description !== undefined ? productMap[item.Material]?.to_Description[0].ProductDescription : '' : productMap[item.Material]?.ProductManufacturerNumber, // Barcode text,
                            MaterialNetWeight: 12.0,
                            MaterialSizeOrderDimensionDesc: "",
                            MaterialVolume: 0.0,
                            MaterialWeightUnit: "",
                            NumberOfLabelsToBePrinted: "2",
                            NumberOfSlipsToBePrinted: "1",
                            OrderPriceUnit: "EA",
                            OrderQuantityUnit: "1500",
                            Plant: "AT21",
                            QtyInPurchaseOrderPriceUnit: item.QuantityInEntryUnit
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
                            Client: productData[0]?.YY1_CustomerDes_PRD,
                            Product: oMaterialDocument.MaterialDocument,
                            MaterialDocument: oMaterialDocument.MaterialDocument,
                            MaterialDocumentHeaderText: productData[0]?.YY1_CustomerDes_PRD,
                            MaterialDocumentItem: oMaterialDocument.MaterialDocument,
                            MaterialDocumentYear: oMaterialDocument.MaterialDocument,
                            PrinterIsCapableBarCodes: GRMatItemNode[0]?.MaterialName, // Barcode text
                            ReferenceDocument: productData[0]?.YY1_CustomerDes_PRD,
                            GRMI: {
                                GRMatItemNode
                            }
                        }
                    }
                };
                // const formData = {
                //     Form: {
                //         "GRLabel": {
                //             "Client": productData[0]?.YY1_CustomerDes_PRD,
                //             "BarCode": productData[0]?.ProductManufacturerNumber == '' ? productData[0]?.to_Description[0].ProductDescription : productData[0]?.ProductManufacturerNumber, // Barcode text
                //             "Quantity": item.QuantityInEntryUnit,
                //             "Unit": item.EntryUnit,
                //             "Description": productData[0]?.to_Description[0].ProductDescription,
                //             "ReceiptDate": materialDocument[0].PostingDate
                //         }
                //     }
                // };

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

        /* this.on("SDBIL_CI_STANDARD_US_E", async (req, res) => {
            try {
                var form_name = req.data.form;
                var query = `/v1/forms/${form_name}`;
                var oFormObject = await deluxe_adsrestapi.get(query);
                var sXMLTemplate = oFormObject.templates[0].xdpTemplate;
                var oBillingDocument = req?.data?.Billing;
        
                // Fetch the selected Billing Document with expanded BillingDocumentItems
                const billingDocument = await cds.run(
                    SELECT.from(BillingDocument, (header) => {
                        header.BillingDocument,
                        header.BillingDocumentDate,
                        header.BillingDocumentType,
                        header.BillingDocumentCategory,
                        header.to_Item();
                    }).where({ BillingDocument: oBillingDocument.BillingDocument })
                );
        
                // If no document found, return empty response
                if (!billingDocument.length) {
                    console.log("No billing document found for", oBillingDocument.BillingDocument);
                    return;
                }
        
                // Construct BillingItemNode array
                const BillingItemNode = billingDocument[0].to_Item.reduce((accum, item) => {
                    if (item.BillingDocumentItem == oBillingDocument.BillingDocumentItem) {
                        accum.push({
                            BillingDocumentItem: item.BillingDocumentItem,
                            Material: item.Material,
                            MaterialName: item.MaterialName || "Unknown",
                            NetAmount: item.NetAmount || 0,
                            Quantity: item.Quantity || 1,
                            QuantityUnit: item.QuantityUnit || "EA",
                            TaxAmount: item.TaxAmount || 0,
                            YY1_Description_BDI: item.MaterialName || "No Description",
                            YY1_ExtendedAmount_BDI: item.NetAmount || 0,
                            YY1_UnitPrice_BDI: item.Quantity ? (item.NetAmount / item.Quantity).toFixed(2) : "0.00"
                        });
                    }
                    return accum;
                }, []);
        
                // Construct final formData object
                const formData = {
                    Form: {
                        BillingHeaderNode: {
                            BillingDocument: oBillingDocument.BillingDocument,
                            Language: "EN",
                            BillingDate: billingDocument[0].BillingDocumentDate,
                            BillingDocumentType: billingDocument[0].BillingDocumentType,
                            BillingDocumentCategory: billingDocument[0].BillingDocumentCategory,
                            YY1_Customer_BDH: "Customer A",
                            YY1_CompanyEmail_BDH: "billing@example.com",
                            YY1_Title_BDH: "Invoice",
                            TotalNetAmount: BillingItemNode.reduce((sum, item) => sum + Number(item.NetAmount), 0),
                            TotalTaxAmount: BillingItemNode.reduce((sum, item) => sum + Number(item.TaxAmount), 0),
                            TotalGrossAmount: BillingItemNode.reduce((sum, item) => sum + Number(item.NetAmount) + Number(item.TaxAmount), 0),
                            TransactionCurrency: "USD",
                            BDI: {
                                BillingItemNode
                            }
                        }
                    }
                };
        
                console.log(JSON.stringify(formData, null, 2));
        
                // Convert JSON to XML
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
        }); */
        this.on("invoiceForm_LABEL", async (req, res) => {
            try {
                var form_name = req.data.form, aItems = [];
                var query = `/v1/forms/${form_name}`;
                var oFormObject = await deluxe_adsrestapi.get(query);
                var sXMLTemplate = oFormObject.templates[0].xdpTemplate;

                var oBillingDocument = req?.data?.Billing;

                const billingDocument = await srv_BillingDocument.run(
                    SELECT.from(BillingDocument, (header) => {
                        header.BillingDocumentDate,
                            header.BillingDocumentCategory,
                            header.BillingDocumentType,
                            header.CompanyCode,
                            header.SalesOrganization,
                            header.DistributionChannel
                        header.Division
                        header.Customer,
                            header.FiscalYear,
                            header.CustomerPaymentTerms,
                            header.to_Item()
                    }).where({ BillingDocument: oBillingDocument.BillingDocument })
                );

                const aBillingItems = billingDocument[0].to_Item || [];

                const oBillingDocumentPartner = await srv_BillingDocument.run(
                    SELECT.one.from(BillingDocumentPartner).where({ BillingDocument: oBillingDocument.BillingDocument, PartnerFunction: 'RE' })
                )
                const oBillingDocumentPartnerSoldToPart = await srv_BillingDocument.run(
                    SELECT.one.from(BillingDocumentPartner).where({ BillingDocument: oBillingDocument.BillingDocument, PartnerFunction: 'AG' })
                )

                const aSalesParameter = await s4h_salesparam_Txn.run(SELECT.one.from(S4_SalesParameter).where({ SalesOrganization: billingDocument[0].SalesOrganization, DistributionChannel: billingDocument[0].DistributionChannel, Division: billingDocument[0].Division, CompanyCode: billingDocument[0].CompanyCode, SoldTo: oBillingDocumentPartnerSoldToPart?.Customer, BillTo: oBillingDocumentPartner?.Customer }));
                const oBusinessPartnerAddrfromS4 = await s4h_bp_Txn.run(SELECT.one.from(S4H_BusinessPartnerAddress, (header) => {
                    header.FullName, header.HouseNumber, header.StreetName, header.CityName, header.PostalCode, header.Region, header.Country, header.BusinessPartner,
                        header.to_EmailAddress()
                }).where({ BusinessPartner: oBillingDocumentPartner.Customer }));

                const aBillingDocumentItem = await srv_BillingDocument.run(
                    SELECT.from(BillingDocumentItem).where({ BillingDocument: oBillingDocument.BillingDocument })
                )
                var aItem10 = aBillingDocumentItem.filter(function (item) {
                    return item.BillingDocumentItem === '10'
                })

                var sMapBillingDocumentItem = [...new Set(aBillingDocumentItem.map(row => row.BillingDocumentItem))];
                var sMapPricingReference = [...new Set(aBillingDocumentItem.map(row => row.PricingReferenceMaterial))];
                var sMapSalesDocument = [...new Set(aBillingDocumentItem.map(row => row.SalesDocument))];
                var sMapSalesDocumentItem = [...new Set(aBillingDocumentItem.map(row => row.SalesDocumentItem))];
                var aPartFuncList = [...new Set(['SP', 'SH'])];
                var aOrderItemPart = await s4h_sohv2_Txn.run(SELECT.from(SalesOrderItemPartners).where({ SalesOrder: { in: sMapSalesDocument }, SalesOrderItem: { in: sMapSalesDocumentItem }, PartnerFunction: 'SH' }));
                var aOrderHeaderPart = await s4h_sohv2_Txn.run(SELECT.from(SalesOrderHeaderPartner).where({ SalesOrder: { in: sMapSalesDocument }, PartnerFunction: { in: aPartFuncList } }));
                const aSalesOrderv2 = await s4h_sohv2_Txn.run(
                    SELECT.from(S4H_SOHeader_V2).where({ SalesOrder: { in: sMapSalesDocument } })
                );

                var sMapSalesOrg = [...new Set(aBillingDocumentItem.map(row => row.SalesOrderSalesOrganization))];
                var sMapDistributionChannel = [...new Set(aBillingDocumentItem.map(row => row.SalesOrderDistributionChannel))];
                var sMapOrganizationDivision = [...new Set(aBillingDocumentItem.map(row => row.OrganizationDivision))];
                var sMapCustomerSP = [...new Set(aOrderHeaderPart.map(row => { if (row.PartnerFunction === 'SP') { return row.Customer } else { return '' } }))];
                var sMapCustomerTheatre = [...new Set(aOrderHeaderPart.map(row => { if (row.PartnerFunction === 'SH') { return row?.Customer === undefined ? '' : row?.Customer } else { return '' } })), ...new Set(aOrderItemPart.map(row => { if (row.PartnerFunction === 'SH') { return row.Customer } else { return '' } }))];

                const oBusinessPartnerAddrTheatre = await s4h_bp_Txn.run(SELECT.from(S4H_BusinessPartnerAddress, (header) => {
                    header.FullName, header.HouseNumber, header.StreetName, header.CityName, header.PostalCode, header.Region, header.Country,header.BusinessPartner
                        header.to_EmailAddress()
                }).where({ BusinessPartner: { in: sMapCustomerTheatre } }));
                const oBusinessPartnerCustAreaSales = await s4h_bp_Txn.run(SELECT.from(CustSalesPartnerFunc).where({ Customer: { in: sMapCustomerSP.length === 0 ? [''] : sMapCustomerSP }, SalesOrganization: { in: sMapSalesOrg.length === 0 ? [''] : sMapSalesOrg }, DistributionChannel: { in: sMapDistributionChannel.length === 0 ? [''] : sMapDistributionChannel  }, Division: { in: sMapOrganizationDivision.length === 0 ? [''] : sMapOrganizationDivision } }));


                // const aBasicText = await s4h_products_Crt.run(SELECT.from(ProductBasicText).where({ Product: { in : mapPricingReference}}));
                // const aItemList = await srv_BillingDocument.run(SELECT.from(BillingDocumentItemText).where({BillingDocument:oBillingDocument.BillingDocument, BillingDocumentItem: { in : sMapBillingDocumentItem},LongTextID:"Z002"}));
                const aProductBasicText = await s4h_products_Crt.run(SELECT.from(ProductBasicText).where({ Product: { in: sMapPricingReference } }));
                const aItemList = await srv_BillingDocument.run(SELECT.from(BillingDocumentItemText).where({ BillingDocument: oBillingDocument.BillingDocument, BillingDocumentItem: { in: sMapBillingDocumentItem }, LongTextID: 'Z002' }));
                const aPriceItem = await srv_BillingDocument.run(SELECT.from(BillingDocumentItemPrcgElmnt).where({ BillingDocument: oBillingDocument.BillingDocument, BillingDocumentItem: { in: sMapBillingDocumentItem }, ConditionClass: 'B', ConditionInactiveReason: '', ConditionIsForStatistics: false }));
                const aDiscountItem = await srv_BillingDocument.run(SELECT.from(BillingDocumentItemPrcgElmnt).where({ BillingDocument: oBillingDocument.BillingDocument, BillingDocumentItem: { in: sMapBillingDocumentItem }, ConditionClass: 'A', ConditionIsForStatistics: false }));
                const aExtendedAmount = await srv_BillingDocument.run(SELECT.from(BillingDocumentItemPrcgElmnt).where({ BillingDocument: oBillingDocument.BillingDocument, BillingDocumentItem: { in: sMapBillingDocumentItem }, ConditionClass: 'B', ConditionInactiveReason: '', ConditionIsForStatistics: false }));
                const aCompanyCode = await s4h_Company.run(SELECT.one.from(Company).where({ CompanyCode: billingDocument[0].CompanyCode }))
                const oAddrCompanyCode = await invformAPI.run(SELECT.one.from(AddressPostal).where({ AddressID: aCompanyCode.AddressID }));
                const oAddrPhone = await invformAPI.run(SELECT.one.from(AddressPhoneNumber).where({ AddressID: aCompanyCode.AddressID }));
                const oAddrEmail = await invformAPI.run(SELECT.one.from(AddressEmailAddress).where({ AddressID: aCompanyCode.AddressID }));
                const oAddrCompanyCodendfo = await invformAPI.run(SELECT.one.from(AddlCompanyCodeInformation).where({ CompanyCode: aCompanyCode.AddressID, CompanyCodeParameterType: 'SAPTIN' }));
                const oAddrCoCodeCountryVATReg = await invformAPI.run(SELECT.one.from(CoCodeCountryVATReg).where({ CompanyCode: aCompanyCode.AddressID, VATRegistrationCountry: aCompanyCode.Country }));
                const oJournalEntryItem = await invformAPI.run(SELECT.one.from(JournalEntryItem).where({ ReferenceDocument: oBillingDocument.BillingDocument, FiscalYear: billingDocument[0].FiscalYear, CompanyCode: billingDocument[0].CompanyCode }));
                const oPaymentTermsText = await invformAPI.run(SELECT.one.from(PaymentTermsText).where({ PaymentTerms: billingDocument[0].CustomerPaymentTerms, Language: 'EN' }));
                const aTaxamount = await srv_BillingDocument.run(SELECT.from(BillingDocumentItemPrcgElmnt).where({ BillingDocument: oBillingDocument.BillingDocument, BillingDocumentItem: { in: sMapBillingDocumentItem }, ConditionClass: 'D', ConditionIsForStatistics: false }));

                var sMapPricingTypeText = [...new Set(aTaxamount.map(row => row.ConditionType))];
                const aPricingConditionTypeText = await invformAPI.run(SELECT.from(PricingConditionTypeText).where({ ConditionType: { in: sMapPricingTypeText }, Language: 'EN', ConditionApplication: 'TX' }));



                for (var index in aTaxamount) {
                    var oPriceBasedCondition;
                    [oPriceBasedCondition] = aPricingConditionTypeText.filter(item => { return item.ConditionType == aTaxamount[index].ConditionType })
                    aTaxamount[index]["ConditionTypeName"] = oPriceBasedCondition?.ConditionTypeName;
                }
                var oTaxObjectforForm = generateTaxTables(aTaxamount);
                var iNetAmount = 0, iDiscountItem = 0;
                const itemMap = {};
                for (var index in aBillingDocumentItem) {

                    const key = aBillingDocumentItem[index].PricingReferenceMaterial || 'NO_KEY';
                    iNetAmount += parseInt(aBillingDocumentItem[index]?.NetAmount);
                    iDiscountItem += parseInt(aDiscountItem[index]?.ConditionAmount)
                    var oTaxSerial;
                    [oTaxSerial] = oTaxObjectforForm.TaxforMainTable.filter(item => { return item.ConditionRateValue === aTaxamount[index]?.ConditionRateValue })

                    if (!itemMap[key]) {
                        itemMap[key] = []
                        itemMap[key].push({
                            "SrNo": 0,
                            "Title": aItemList[index]?.LongText,
                            "Qty": aBillingDocumentItem[index]?.BillingQuantity,
                            "UOM": aBillingDocumentItem[index]?.BillingQuantityUnit,
                            "Cur": aBillingDocumentItem[index]?.TransactionCurrency,
                            "Price": parseFloat(aPriceItem[index]?.ConditionRateValue).toFixed(2),
                            "Discount": aDiscountItem[index]?.ConditionAmount == undefined ? '0.00' : aDiscountItem[index]?.ConditionAmount.toFixed(2),
                            "Extended": aExtendedAmount[index]?.ConditionAmount.toFixed(2),
                            "Tax": oTaxSerial?.SerialNo
                        });
                    }
                    else {
                        itemMap[key].push({
                            "SrNo": 0,
                            "Title": aItemList[index]?.LongText,
                            "Qty": aBillingDocumentItem[index]?.BillingQuantity,
                            "UOM": aBillingDocumentItem[index]?.BillingQuantityUnit,
                            "Cur": aBillingDocumentItem[index]?.TransactionCurrency,
                            "Price": parseFloat(aPriceItem[index]?.ConditionRateValue).toFixed(2),
                            "Discount": aDiscountItem[index]?.ConditionAmount == undefined ? '0.00' : aDiscountItem[index]?.ConditionAmount.toFixed(2),
                            "Extended": aExtendedAmount[index]?.ConditionAmount.toFixed(2),
                            "Tax": oTaxSerial?.SerialNo
                        });
                    }
                    // aItems.push({
                    //     "SrNo": index + 1,
                    //     "Title": aItemList[index]?.LongText,
                    //     "Qty": aBillingDocumentItem[index].BillingQuantity,
                    //     "UOM": aBillingDocumentItem[index].BillingQuantityUnit,
                    //     "Cur": aBillingDocumentItem[index].TransactionCurrency,
                    //     "Price": aPriceItem[index].ConditionRateValue,
                    //     "Discount": 0,
                    //     "Extended": "",
                    //     "Tax": 0.0
                    // })
                }

                // Rebuild grouped array with proper SrNo
                var aTableRow = []
                let srNoCounter = 1;

                for (const key in itemMap) {
                    const groupedList = itemMap[key];
                    for (const item of groupedList) {
                        item.SrNo = srNoCounter++;
                    }
                    var sKeyText;
                    [sKeyText] = aProductBasicText.filter(item => { return item.Product === key })
                    aTableRow.push({
                        "Title": [
                            {
                                "Title": "Title: " + sKeyText?.LongText
                            }
                        ],
                        "Items": groupedList

                    })
                }



                const oSalesOrder = await s4h_so_Txn.run(
                    SELECT.one.from(S4H_SOHeader).where({ SalesOrder: aItem10[0].SalesDocument })
                )
                if (!billingDocument.length) {
                    console.log("No billing document found for", oBillingDocument.BillingDocument);
                    return;
                }
                // Construct GRMatItemNode array with mapped product details
                const billingHeader = billingDocument[0]; // header
                const item = billingHeader.to_Item.find(it => it.BillingDocumentItem === oBillingDocument.BillingDocumentItem); // item

                //Populating Sales Order Data for Items
                const aDtlItems = [];

                for (const item of aBillingItems) {
                    const sSalesOrder = item.SalesDocument;
                    const sSalesOrderItem = item.BillingDocumentItem;

                    // // Fetch Sales Order V2 expanded details
                    // const oSalesOrderv2 = await s4h_sohv2_Txn.run(
                    //     SELECT.one.from(S4H_SOHeader_V2)
                    //         .columns([
                    //             '*',
                    //             { ref: ['to_Item'], expand: ['*'] },
                    //             { ref: ['to_Partner'], expand: ['*'] }
                    //         ])
                    //         .where({ SalesOrder: sSalesOrder })
                    // );

                    // if (!oSalesOrderv2) continue; // skip if no sales order

                    // // Find PartnerFunction = 'SH' from Partner node
                    // const partnerSH = oSalesOrderv2.to_Partner?.find(p => p.PartnerFunction === 'SH');
                    // const sCustomerId = partnerSH?.Customer;
                    var oCustItemPart, oCustHeadPartSH, oCustHeadPartSP, oSalesOrderv2, oCustomerId, oTheatreDet;

                    oCustItemPart = aOrderItemPart.filter(item => { return item.SalesOrder === sSalesOrder && item.SalesOrderItem === sSalesOrderItem })[0]
                    oCustHeadPartSH = aOrderHeaderPart.filter(item => { return item.SalesOrder === sSalesOrder && item.PartnerFunction === 'SH' })[0]
                    oCustHeadPartSP = aOrderHeaderPart.filter(item => { return item.SalesOrder === sSalesOrder && item.PartnerFunction === 'SP' })[0]
                    oSalesOrderv2 = aSalesOrderv2.filter(item => { return item.SalesOrder === sSalesOrder })[0]
                    oCustomerId = oBusinessPartnerCustAreaSales.filter(item => {
                        return item.Customer == oCustHeadPartSP?.Customer && item.SalesOrganization == oSalesOrderv2?.SalesOrganization
                            && item.DistributionChannel == oSalesOrderv2?.DistributionChannel && item.Division == oSalesOrderv2?.OrganizationDivision && item.BPCustomerNumber == (oCustItemPart?.Customer === '' || oCustItemPart?.Customer === undefined ? oCustHeadPartSH?.Customer : oCustItemPart?.Customer) && item.PartnerFunction == 'SH'
                    })[0]
                    oTheatreDet = oBusinessPartnerAddrTheatre.filter(item => { return item.BusinessPartner === (oCustItemPart?.Customer === '' || oCustItemPart?.Customer === undefined ? oCustHeadPartSH?.Customer : oCustItemPart?.Customer) })[0]
                    let sTheatreName = oTheatreDet?.FullName;
                    let sCity = oTheatreDet?.CityName;
                    let sRegion = oTheatreDet?.Region;
                    let sPostalCode = oTheatreDet?.PostalCode;

                    const sSalesOrder1 = item.SalesDocument;
                    //const sSalesOrderItem1 = item.SalesDocumentItem;

                    const oStudioFeed = await SELECT.one.from(StudioFeed, (header) => {
                        header.RequestId, header.OrderID, header.BookerName
                    }).where({
                        SalesOrder: sSalesOrder1
                    });

                    const oBookingItem = await SELECT.one.from(BookingSalesorderItem).where({
                        SalesOrder: sSalesOrder1,
                        SalesOrderItem: sSalesOrderItem
                    });

                    // Final push into DtlItems array
                    aDtlItems.push({
                        SONo: item.SalesDocument,
                        CustThr: oCustomerId?.CustomerPartnerDescription || '',
                        TheatreName: sTheatreName || '',
                        City: sCity || '',
                        StZIP: (sRegion && sPostalCode) ? `${sRegion}/${sPostalCode}` : '',
                        RequestNo: oStudioFeed?.RequestId || '',
                        OrderNo: oStudioFeed?.OrderID || '',
                        Booker: oStudioFeed?.BookerName || '',
                        Start: oBookingItem?.PlayStartDate && oBookingItem?.StartTime
                            ? `${oBookingItem.PlayStartDate}T${oBookingItem.StartTime}`
                            : '',
                        End: oBookingItem?.PlayEndDate && oBookingItem?.EndTime
                            ? `${oBookingItem.PlayEndDate}T${oBookingItem.EndTime}`
                            : ''
                    });
                }

                //Fetching bank Details

                const sCompanyCode = billingDocument[0]?.CompanyCode;

                // 2. Get HouseBank using CompanyCode
                const oHouseBank = await invformAPI.run(
                    SELECT.one.from(HouseBank).where({
                        CompanyCode: sCompanyCode
                    })
                );


                // 3. Get Bank Details using BankCountry + BankInternalID
                const oBankDetails = await bankAPI.run(
                    SELECT.one.from(Bank).where({
                        BankCountry: oHouseBank == undefined ? '' : oHouseBank?.BankCountry,
                        BankInternalID: oHouseBank == undefined ? '' : oHouseBank?.BankInternalID
                    })
                );

                // 4. Get Bank Address via navigation: /Bank/{BankCountry}/{BankInternalID}/_BankAddress
                const oBankAddress = await bankAPI.run(
                    SELECT.one.from(BankAddress).where({
                        BankCountry: oHouseBank == undefined ? '' : oHouseBank?.BankCountry,
                        BankInternalID: oHouseBank == undefined ? '' : oHouseBank?.BankInternalID
                    })
                );

                var PayTableRow1 = [
                    {
                        Cell1: "Payee:",
                        Cell2: oHouseBank?.ContactPersonName || "",       // e.g., "Deluxe Media Inc."
                        Cell3: "Beneficiary:",
                        Cell4: oHouseBank?.ContactPersonName || ""
                    },
                    {
                        Cell1: "Lockbox #:",
                        Cell2: oBankAddress?.CompanyPostalCode || "", // e.g., "103374"
                        Cell3: "Account #:",
                        Cell4: oBankDetails?.BankNumber || ""         // e.g., "953238612"
                    },
                    {
                        Cell1: "Address:",
                        Cell2: `${oBankAddress?.StreetName || ""}`,
                        Cell3: "Routing # ACH:",
                        Cell4: oHouseBank?.CustomerByHouseBank || ""    // e.g., "124001545"
                    },
                    {
                        Cell1: "",                                         // second line of address
                        Cell2: `${oBankAddress?.CityName || ""}, ${oBankAddress?.Region || ""} ${oBankAddress?.PostalCode || ""}`,
                        Cell3: "Routing # Wire:",
                        Cell4: oHouseBank?.OrderingCompanyByBank || ""            // e.g., "021000021"
                    },
                    {
                        Cell1: "",
                        Cell2: "",
                        Cell3: "Swift Address:",
                        Cell4: oBankDetails?.SWIFTCode || ""          // e.g., "CHASUS33"
                    }
                ];

                var sCompanyAddress = oAddrCompanyCode === undefined ? '' : ( oAddrCompanyCode?.HouseNumber + "," + oAddrCompanyCode?.StreetName + "," + oAddrCompanyCode?.CityName + "," + oAddrCompanyCode?.PostalCode + "," + oAddrCompanyCode?.Region + "," + oAddrCompanyCode?.Country);
            

                var sFooterText = "Deluxe Digital Cinema is a wholly owned subsidiary of Deluxe Media Inc.," + " " + sCompanyAddress + "  "
                    + "Deluxe Standard terms and conditions apply. These can be accessed at http://bydeluxe.com/tands" + "  " + "This document has no tax value as per article 21 (Presidential Decree 633/72) since it has already been sent through the interchange system of the Revenue Agency."

                     
                     var iTypeLength = oTaxObjectforForm.TaxTable.TaxTableRow.length;
                     var iTaxableAmount = oTaxObjectforForm.TaxTable.TaxTableRow[iTypeLength-1].Cell2
                     var iGrandTotal = iNetAmount+iTaxableAmount-(isNaN(iDiscountItem)? 0 : parseInt(iDiscountItem))
                    oTaxObjectforForm.TaxTable.TaxTableRow[0].Cell2 = 'USD '+iNetAmount.toFixed(2)
                    oTaxObjectforForm.TaxTable.TaxTableRow[iTypeLength-3].Cell2 ='USD '+ ( isNaN(iDiscountItem)? 0 : parseInt(iDiscountItem).toFixed(2) )
                    oTaxObjectforForm.TaxTable.TaxTableRow[iTypeLength-1].Cell2 ='USD '+ ( isNaN(iGrandTotal)? 0 : parseInt(iGrandTotal).toFixed(2) )

                const billingDataNode = {
                    "TaxInvoice": {
                        "Header": {
                            "CompanyName":oAddrCompanyCode === undefined ? '' : oAddrCompanyCode?.AddresseeName1,
                            "CompanyAddress": sCompanyAddress,
                            "Telephone":oAddrPhone == undefined ? '' : oAddrPhone?.PhoneAreaCodeSubscriberNumber,
                            "TaxID":(oAddrCompanyCodendfo?.CompanyCodeParameterValue === '' || oAddrCompanyCodendfo?.CompanyCodeParameterValue === undefined) ? oAddrCoCodeCountryVATReg?.VATRegistration : oAddrCompanyCodendfo?.CompanyCodeParameterValue,
                            "Email": oAddrEmail === undefined ? '' : oAddrEmail?.EmailAddress ,
                            "PageNo": "",
                            "InvoiceNo": billingHeader.to_Item[0].BillingDocument,
                            "InvoiceDate": billingHeader.BillingDocumentDate,
                            "Terms": oPaymentTermsText.PaymentTermsName,
                            "PaymentDueDate": oJournalEntryItem?.NetDueDate
                        },
                        "BillTo": {
                            "BillToAddress": oBusinessPartnerAddrfromS4?.FullName + "," + oBusinessPartnerAddrfromS4?.HouseNumber + "," + oBusinessPartnerAddrfromS4?.StreetName + "," + oBusinessPartnerAddrfromS4?.CityName + "," + oBusinessPartnerAddrfromS4?.PostalCode + "," + oBusinessPartnerAddrfromS4?.Region + "," + oBusinessPartnerAddrfromS4?.Country,
                            "CustomerAccountNo": oBillingDocumentPartner?.Customer,
                            "CustomerPONo": oSalesOrder?.PurchaseOrderByCustomer,
                            "CustomerContact": aSalesParameter?.CustomerInvoiceContact,
                            "DeluxContact": aSalesParameter?.DeluxeContact,
                            "DeliverInvoiceByMailTo": aSalesParameter?.CustomerInvoiceContactEmail
                        },
                        "Table": {
                            "TabHeader": [
                                {
                                    "SrNo": "1",
                                    "Title": "A",
                                    "Qty": "10",
                                    "UOM": "pcs",
                                    "Cur": "USD",
                                    "Price": "100.000",
                                    "Discount": "5%",
                                    "Extended": "Yes",
                                    "Tax": 7.500
                                }
                            ],
                            "TabRow": aTableRow,
                            //  [
                            //     {
                            //         "Title": [
                            //             {
                            //                 "Title": "Product Group A"
                            //             }
                            //         ],
                            //         "Items": aItems,
                            //         // "Items": [
                            //         //     {
                            //         //         "SrNo": "1",
                            //         //         "Title": "A",
                            //         //         "Qty": "10",
                            //         //         "UOM": "pcs",
                            //         //         "Cur": "USD",
                            //         //         "Price": 100.000,
                            //         //         "Discount": 5.000,
                            //         //         "Extended": 950.000,
                            //         //         "Tax": 7.500
                            //         //     }
                            //         // ]
                            //     }
                            // ]
                        },
                        "PaymentInfo": {
                            "PayTable": {
                                "PayTableRow": PayTableRow1
                            },
                            "TaxTable": oTaxObjectforForm.TaxTable,
                            "TaxTypeTable": oTaxObjectforForm.TaxTypeTable
                        },
                        "Footer": {
                            "FooterText": sFooterText
                        },
                        "DetailTable": {
                            "DtlTabHeader": [
                                {
                                    "SONo": "SO123",
                                    "CustThrNo": "CT456",
                                    "TheatreName": "Main Stage",
                                    "City": "New York",
                                    "StZIP": "10001",
                                    "RequestNo": "REQ001",
                                    "OrderNo": "ORD789",
                                    "Booker": "John Smith",
                                    "Start": "2025-04-01T00:00:00",
                                    "End": "2025-04-15T00:00:00"
                                }
                            ],
                            "DtlItems": aDtlItems
                        }
                    }
                }

                // const billingDataNode = {
                //     "TaxInvoiceNode": {
                //         "Header": {
                //             "CompanyAddress": "a",
                //             "PageNo": "",
                //             "InvoiceNo": "",
                //             "InvoiceDate": "",
                //             "Terms": "",
                //             "PaymentDueDate": ""
                //         },
                //         "BillTo": {
                //             "BillToAddress": "ss",
                //             "CustomerAccountNo": oBillingDocumentPartner.Customer,
                //             "CustomerPONo": oSalesOrder.PurchaseOrderByCustomer,
                //             "CustomerContact": "77979",
                //             "DeluxContact": "",
                //             "DeliverInvoiceByMailTo": ""
                //         },
                //         "Table": {
                //             "TabHeader": [
                //                 {
                //                     "SrNo": "",
                //                     "Title": "",
                //                     "Qty": "",
                //                     "UOM": "",
                //                     "Cur": "",
                //                     "Price": "",
                //                     "Discount": "",
                //                     "Extended": "",
                //                     "Tax": 0.0
                //                 }
                //             ],
                //             "Title": [
                //                 {
                //                     "Title": ""
                //                 }
                //             ],
                //             "Items": aItems,
                //         },
                //         "PaymentInfo": {
                //             "Payee": "",
                //             "LockBoxNo": "",
                //             "Address": "",
                //             "Beneficiary": "",
                //             "AccountNo": "",
                //             "RoutingNoACH": "",
                //             "RoutingNoWire": "",
                //             "SwitchAddress": "",
                //             "SubTotal": 0.0,
                //             "SalesTax1": 0.0,
                //             "SalesTax2": 0.0,
                //             "Discount": 0.0,
                //             "GrandTotalDue": 0.0,
                //             "SalexTax1Type": "",
                //             "SalesTax2Type": ""
                //         },
                //         "Footer": {
                //             "FooterText": ""
                //         }
                //     }

                // }


                // Construct final formData object
                const formData = {
                    Form: billingDataNode
                };
                console.log(JSON.stringify(formData, null, 2));

                const xmlData = xmljs.js2xml(formData, { compact: true, spaces: 4 });
                const base64EncodedXml = Buffer.from(xmlData, "utf-8").toString("base64");

                const headers = {
                    "Content-Type": 'application/json',
                    "accept": 'application/json'
                };

                const sDownloadPDFurl = "/v1/adsRender/pdf?TraceLevel=0";

                const data = {
                    xdpTemplate: sXMLTemplate,
                    xmlData: base64EncodedXml,
                    formType: "print",
                    formLocale: "en_US",
                    taggedPdf: 1,
                    embedFont: 0,
                    changeNotAllowed: false,
                    printNotAllowed: false
                };

                const oPrintForm = await deluxe_adsrestapi.send({
                    method: "POST",
                    path: sDownloadPDFurl,
                    data,
                    headers
                });

                return oPrintForm.fileContent;
            } catch (e) {
                req.error(502, e);
            }
        });

        function generateTaxTables(aTaxamount) {
            const grouped = {};

            aTaxamount.forEach(item => {
                const key = item.ConditionRateValue;

                if (!grouped[key]) {
                    grouped[key] = {
                        ConditionRateValue: item.ConditionRateValue,
                        ConditionTypeName: (item.ConditionTypeName === '' ? item.ConditionType : item.ConditionTypeName) + " " + item.ConditionRateValue.toFixed(2),
                        ConditionQuantityUnit: "%",
                        Currency : item.TransactionCurrency ,
                        TotalConditionAmount: 0
                    };
                }

                grouped[key].TotalConditionAmount += item.ConditionAmount;
            });

            const taxTableRows = [];
            const taxTypeTableRows = [];
            var iTaxableAmount=0

            const aTaxforMainTable = []
            taxTableRows.push({
                Cell1: "Sub-Total: ",
                Cell2: ""
            })

            taxTypeTableRows.push({
                Cell1: ""
            });

            Object.values(grouped).forEach((entry, index) => {
                const serialNo = index + 1;

                taxTableRows.push({
                    Cell1: entry.ConditionTypeName + entry.ConditionQuantityUnit,
                    Cell2: entry.Currency+ "  " + entry.TotalConditionAmount
                });

                iTaxableAmount += parseInt(entry.TotalConditionAmount)

                taxTypeTableRows.push({
                    Cell1: serialNo.toString()
                });

                aTaxforMainTable.push({
                    ConditionRateValue: entry.ConditionRateValue,
                    SerialNo: serialNo.toString()
                })
            });

            taxTableRows.push({
                Cell1: "Discount: ",
                Cell2: ""
            })

            taxTableRows.push({
                Cell1: "",
                Cell2: ""
            })

            taxTableRows.push({
                Cell1: "Grand Total Due: ",
                Cell2: iTaxableAmount
            })

            return {
                TaxTable: {
                    TaxTableRow: taxTableRows
                },
                TaxTypeTable: {
                    TaxTypeTableRow: taxTypeTableRows
                },
                TaxforMainTable: aTaxforMainTable
            };
        };

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