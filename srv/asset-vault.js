const cds = require("@sap/cds");
const LOG = cds.log('productionProcess')
const locLog = cds.log('location')
const xmljs = require("xml-js");
const { Readable } = require('stream');
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");
const e = require("express");

module.exports = class AssetVaultService extends cds.ApplicationService {
    async init() {

        var deluxe_adsrestapi = await cds.connect.to("deluxe-ads-rest-api");
        const { DistributionDcp, Studios, Titles, CustomerCompany, Plants, StorageLocations, Parameters, Products, ValuationArea,
            SalesOrganizations, CustomerPlant, SalesOrgDistCh, Company, MaterialBOM, ProductionVersion, ProductionProcess } = this.entities
        const _asArray = x => Array.isArray(x) ? x : [x]
        const bptx = await cds.connect.to('API_BUSINESS_PARTNER')
        const pdtx = await cds.connect.to('API_PRODUCT_SRV')
        const planttx = await cds.connect.to('API_PLANT_SRV')
        const sloctx = await cds.connect.to('YY1_STORAGELOCATION_CDS')
        const salesorgtx = await cds.connect.to('API_SALESORGANIZATION_SRV')
        const distchtx = await cds.connect.to('YY1_SLSORGANIZATIONDISTRCH_CDS')
        const cuspltx = await cds.connect.to('YY1_CUSTOMERCOMPANYBYPLANT_CDS')
        const comptx = await cds.connect.to('API_COMPANYCODE_SRV')
        const bomtx = await cds.connect.to('API_BILL_OF_MATERIAL_SRV')
        const prdver = await cds.connect.to('PRODUCTIONVERSION')
        const paramtx = await cds.connect.to('YY1_PARAMETER_CDS')
        const valareatx = await cds.connect.to('YY1_VALUATIONAREA_CDS')
        const productionProcess = async x => {
            const aProductionProcess = []
            let prdProcess = {}
            const param = await paramtx.run(SELECT.from(Parameters)
                .where({ VariableName: ['BillOfOperationsGroup1', 'BillOfOperationsGroup2', 'ProductionLine1', 'ProductionLine2'] }))
            const bgv1 = param.find(item => item.VariableName === 'BillOfOperationsGroup1')
            const bgv2 = param.find(item => item.VariableName === 'BillOfOperationsGroup2')
            const plv1 = param.find(item => item.VariableName === 'ProductionLine1')
            const plv2 = param.find(item => item.VariableName === 'ProductionLine2')
            for (let index = 0; index < x.length; index++) {
                const element = x[index];
                prdProcess = {
                    Material: element.Material,
                    Plant: element.Plant,
                    IsBomCreated: element.IsBomCreated,
                    IsProductionVersion1: element.IsProductionVersion1,
                    IsProductionVersion2: element.IsProductionVersion2
                }
                try {
                    if (!prdProcess.IsBomCreated) {
                        await bomtx.run(INSERT.into(MaterialBOM).entries({
                            "Material": `${element.Material}`,
                            "Plant": `${element.Plant}`,
                            "BillOfMaterialVariantUsage": "1",
                            "BOMHeaderBaseUnit": "EA",
                            "BOMHeaderQuantityInBaseUnit": "1",
                            "to_BillOfMaterialItem": [
                                {
                                    "BillOfMaterialComponent": "CRU-SATA-1-TB",
                                    "BillOfMaterialItemCategory": "L",
                                    "BillOfMaterialItemUnit": "EA",
                                    "BillOfMaterialItemQuantity": "1",
                                    "AlternativeItemGroup": "1",
                                    "AlternativeItemPriority": "2",
                                    "AlternativeItemStrategy": "2",
                                    "UsageProbabilityPercent": "100"
                                },
                                {
                                    "BillOfMaterialComponent": "CRU-SATA-1.5-TB",
                                    "BillOfMaterialItemCategory": "L",
                                    "BillOfMaterialItemUnit": "EA",
                                    "BillOfMaterialItemQuantity": "1",
                                    "AlternativeItemGroup": "1",
                                    "AlternativeItemPriority": "2",
                                    "AlternativeItemStrategy": "2",
                                    "UsageProbabilityPercent": "100"
                                },
                                {
                                    "BillOfMaterialComponent": "CRU-SATA-2-TB",
                                    "BillOfMaterialItemCategory": "L",
                                    "BillOfMaterialItemUnit": "EA",
                                    "BillOfMaterialItemQuantity": "1",
                                    "AlternativeItemGroup": "1",
                                    "AlternativeItemPriority": "2",
                                    "AlternativeItemStrategy": "2",
                                    "UsageProbabilityPercent": "100"
                                },
                                {
                                    "BillOfMaterialComponent": "CRU-SATA-3-TB",
                                    "BillOfMaterialItemCategory": "L",
                                    "BillOfMaterialItemUnit": "EA",
                                    "BillOfMaterialItemQuantity": "1",
                                    "AlternativeItemGroup": "1",
                                    "AlternativeItemPriority": "2",
                                    "AlternativeItemStrategy": "2",
                                    "UsageProbabilityPercent": "100"
                                },
                                {
                                    "BillOfMaterialComponent": "CRU-SATA-4-TB",
                                    "BillOfMaterialItemCategory": "L",
                                    "BillOfMaterialItemUnit": "EA",
                                    "BillOfMaterialItemQuantity": "1",
                                    "AlternativeItemGroup": "1",
                                    "AlternativeItemPriority": "2",
                                    "AlternativeItemStrategy": "2",
                                    "UsageProbabilityPercent": "100"
                                },
                                {
                                    "BillOfMaterialComponent": "CRU-SATA-0250-GB",
                                    "BillOfMaterialItemCategory": "L",
                                    "BillOfMaterialItemUnit": "EA",
                                    "BillOfMaterialItemQuantity": "1",
                                    "AlternativeItemGroup": "1",
                                    "AlternativeItemPriority": "2",
                                    "AlternativeItemStrategy": "2",
                                    "UsageProbabilityPercent": "100"
                                },
                                {
                                    "BillOfMaterialComponent": "CRU-SATA-0320-GB",
                                    "BillOfMaterialItemCategory": "L",
                                    "BillOfMaterialItemUnit": "EA",
                                    "BillOfMaterialItemQuantity": "1",
                                    "AlternativeItemGroup": "1",
                                    "AlternativeItemPriority": "2",
                                    "AlternativeItemStrategy": "2",
                                    "UsageProbabilityPercent": "100"
                                },
                                {
                                    "BillOfMaterialComponent": "CRU-SATA-0400-GB",
                                    "BillOfMaterialItemCategory": "L",
                                    "BillOfMaterialItemUnit": "EA",
                                    "BillOfMaterialItemQuantity": "1",
                                    "AlternativeItemGroup": "1",
                                    "AlternativeItemPriority": "2",
                                    "AlternativeItemStrategy": "2",
                                    "UsageProbabilityPercent": "100"
                                },
                                {
                                    "BillOfMaterialComponent": "CRU-SATA-0500-GB",
                                    "BillOfMaterialItemCategory": "L",
                                    "BillOfMaterialItemUnit": "EA",
                                    "BillOfMaterialItemQuantity": "1",
                                    "AlternativeItemGroup": "1",
                                    "AlternativeItemPriority": "2",
                                    "AlternativeItemStrategy": "2",
                                    "UsageProbabilityPercent": "100"
                                },
                                {
                                    "BillOfMaterialComponent": "CRU-SATA-0640-GB",
                                    "BillOfMaterialItemCategory": "L",
                                    "BillOfMaterialItemUnit": "EA",
                                    "BillOfMaterialItemQuantity": "1",
                                    "AlternativeItemGroup": "1",
                                    "AlternativeItemPriority": "2",
                                    "AlternativeItemStrategy": "2",
                                    "UsageProbabilityPercent": "100"
                                },
                                {
                                    "BillOfMaterialComponent": "CRU-SATA-0750-GB",
                                    "BillOfMaterialItemCategory": "L",
                                    "BillOfMaterialItemUnit": "EA",
                                    "BillOfMaterialItemQuantity": "1",
                                    "AlternativeItemGroup": "1",
                                    "AlternativeItemPriority": "2",
                                    "AlternativeItemStrategy": "2",
                                    "UsageProbabilityPercent": "100"
                                }
                            ]
                        }))
                        prdProcess.IsBomCreated = true
                    }
                    if (!prdProcess.IsProductionVersion1) {
                        await prdver.run(INSERT.into(ProductionVersion).entries({
                            "Material": `${element.Material}`,
                            "Plant": `${element.Plant}`,
                            "ProductionVersion": "0001",
                            "ProductionVersionText": "Replication",
                            "BillOfOperationsType": "N",
                            "BillOfOperationsGroup": bgv1?.VariableValue,
                            "BillOfOperationsVariant": "1",
                            "BillOfMaterialVariantUsage": "1",
                            "BillOfMaterialVariant": "1",
                            "ProductionLine": plv1?.VariableValue,
                            "ProductionVersionStatus": "2",
                            "BOMCheckStatus": "1",
                            "ProductionVersionLockText": "Not locked",
                            "BillOfOperationsTypeName": "Routing"
                        }))
                        prdProcess.IsProductionVersion1 = true
                    }

                    if (!prdProcess.IsProductionVersion2) {
                        await prdver.run(INSERT.into(ProductionVersion).entries({
                            "Material": `${element.Material}`,
                            "Plant": `${element.Plant}`,
                            "ProductionVersion": "0002",
                            "ProductionVersionText": "Replication-Manual",
                            "BillOfOperationsType": "N",
                            "BillOfOperationsGroup": bgv2?.VariableValue,
                            "BillOfOperationsVariant": "1",
                            "BillOfMaterialVariantUsage": "1",
                            "BillOfMaterialVariant": "1",
                            "ProductionLine": plv2?.VariableValue,
                            "ProductionVersionStatus": "2",
                            "BOMCheckStatus": "1",
                            "ProductionVersionLockText": "Not locked",
                            "BillOfOperationsTypeName": "Routing"
                        }))
                        prdProcess.IsProductionVersion2 = true
                    }
                } catch (error) {
                    LOG.error(`${element.Material} ${element.Plant} : ${error?.message}`)
                    continue
                } finally {
                    aProductionProcess.push(prdProcess)
                }
            }
            for (let index = 0; index < aProductionProcess.length; index++) {
                const element = aProductionProcess[index];
                await UPDATE(ProductionProcess).with({
                    IsBomCreated: element.IsBomCreated,
                    IsProductionVersion1: element.IsProductionVersion1,
                    IsProductionVersion2: element.IsProductionVersion2
                }).where({
                    Material: element.Material,
                    Plant: element.Plant
                })
            }

        }

        this.on('READ', [Studios, CustomerCompany], async req => {
            return bptx.run(req.query)
        })

        this.on('READ', [ValuationArea], async req => {
            return valareatx.run(req.query)
        })

        this.on(['READ'], CustomerPlant, req => {
            return cuspltx.run(req.query)
        })

        this.on(['READ'], Company, req => {
            return comptx.run(req.query)
        })

        this.on(['READ'], SalesOrgDistCh, req => {
            return distchtx.run(req.query)
        })

        this.on(['READ'], StorageLocations, req => {
            return sloctx.run(req.query)
        })

        this.on(['READ'], Plants, req => {
            return planttx.run(req.query)
        })

        this.on(['READ'], SalesOrganizations, async req => {
            return salesorgtx.run(req.query)
        })

        this.on(['READ'], Parameters, async req => {
            return paramtx.run(req.query)
        })

        this.on(['READ'], MaterialBOM, async req => {
            return bomtx.run(req.query)
        })

        this.on(['READ'], ProductionVersion, async req => {
            return prdver.run(req.query)
        })

        this.on(['READ'], Titles, async req => {
            const data = _asArray(await pdtx.run(SELECT.from(Titles).columns(["Product", { "ref": ["to_Description"], "expand": ["*"] }]).where({ ProductGroup: 'Z007' })))
            return data.map(item => {
                return { Product: item.Product, Name: (item.to_Description.length) ? item.to_Description.find(text => text.Language === req.locale.toUpperCase()).ProductDescription : '' }
            })
        })

        this.after('CREATE', DistributionDcp, async req => {
            const aCpl = []
            for (let index = 0; index < req._Items.length; index++) {
                const element = req._Items[index];
                let itemCpl = { DKDMS3location: null, CPLS3location: null, ProjectID: null, ID: null }
                itemCpl.ProjectID = req.ProjectID
                itemCpl.ID = element.ID
                try {
                    const dkdm = await executeHttpRequest(
                        {
                            destinationName: "TDLCertificateAPI",
                        },
                        {
                            method: "post",
                            url: "/dc-asset-vault-api/v1/kdms/search",
                            data: {
                                "metadata":
                                {
                                    "compositionPlaylist":
                                    {
                                        "uuid": `${element.LinkedCPLUUID}`
                                    }
                                }
                            }
                        }
                    );
                    const cpl = await executeHttpRequest(
                        {
                            destinationName: "TDLCertificateAPI",
                        },
                        {
                            method: "get",
                            url: `/dc-asset-vault-api/v1/assets/${element.LinkedCPLUUID}`
                        }
                    );
                    itemCpl.DKDMS3location = dkdm.data.items[0]?.storageInformation?.locations?.find(item => item.type === 's3')?.path
                    itemCpl.CPLS3location = cpl.data?.storageInformation?.locations?.find(item => item.type === 's3')?.path
                    // cds.tx(async () => {
                    //     await UPDATE(`DELUXE_ASSETVAULT_DISTRIBUTIONDCP__ITEMS`)
                    //         .with({ DKDMS3location: element.DKDMS3location, CPLS3location: element.CPLS3location })
                    //         .where`UP__PROJECTID = ${req.ProjectID} AND ID = ${element.ID}`
                    // })
                } catch (error) {
                    locLog.error(`Error in s3 Location api ${req.ProjectID} : ${element.LinkedCPLUUID} : ${error}`)
                    continue
                } finally {
                    aCpl.push(itemCpl)
                }
            }
            for (let index = 0; index < aCpl.length; index++) {
                const element = aCpl[index];
                await UPDATE(`DELUXE_ASSETVAULT_DISTRIBUTIONDCP__ITEMS`)
                    .with({ DKDMS3location: element.DKDMS3location, CPLS3location: element.CPLS3location })
                    .where`UP__PROJECTID = ${element.ProjectID} AND ID = ${element.ID}`
            }
            return req
        })

        this.on('createDcp', async req => {
            const { ProjectID } = req.params[0]
            const { Customer, Title } = req.data
            let to_Plant = []
            let to_SalesDelivery = []
            let to_Valuation = []
            let assetvault = await SELECT.one.from(DistributionDcp, ProjectID).columns(["*", { "ref": ["_Items"], "expand": ["*"] }])
            if (assetvault.CreatedinSAP) return req.error(400, 'DCP Material already created!')
            const prdCheck = await pdtx.run(SELECT.one.from(Products).columns('Product').where({ Product: ProjectID }))
            if (prdCheck?.Product) {
                await UPDATE(DistributionDcp, assetvault.ProjectID).with({
                    DCP: ProjectID,
                    CreatedinSAP: true
                })
                return req.warn(400, 'DCP Material already created!')
            }
            try {
                const plants1 = await planttx.run(SELECT.from(Plants))
                const plants = plants1.filter(item => item.Plant.startsWith('9') === false)
                const plantIds = plants.map(item => item.Plant)
                const compIds = plants.map(item => item.CompanyCode)
                const valArea = await valareatx.run(SELECT.from(ValuationArea).where({ CompanyCode: compIds }))
                const slocs = await sloctx.run(SELECT.from(StorageLocations).where({ Plant: plantIds }))
                const sorgs = await salesorgtx.run(SELECT.from(SalesOrganizations).where({ CompanyCode: compIds }))
                const sorgIds = sorgs.map(item => item.SalesOrganization)
                const sorgdist = await distchtx.run(SELECT.from(SalesOrgDistCh).where({ SalesOrganization: sorgIds }))
                const comp = await comptx.run(SELECT.from(Company).where({ CompanyCode: compIds }))

                for (let index = 0; index < plants.length; index++) {
                    const plant = plants[index];
                    const element = comp.find(item => item.CompanyCode === plant.CompanyCode)
                    if (!['US', 'CA'].includes(element.Country)) continue
                    const valuation = valArea.find(item => item.CompanyCode === plant.CompanyCode)
                    to_Plant.push({
                        "Product": ProjectID,
                        "Plant": plant.Plant,
                        "ProfitCenter": "117990",
                        "AvailabilityCheckType": "SR",
                        "MRPType": "PD",
                        "MRPResponsible": "001",
                        "ProcurementType": "X",
                        "PeriodType": "W",
                        "to_ProductSupplyPlanning": {
                            "Product": ProjectID,
                            "Plant": plant.Plant,
                            //MRP1
                            "MRPType": "PD",
                            "MRPResponsible": "001",
                            "AssemblyScrapPercent": "15.00",
                            "LotSizingProcedure": "MB",
                            //MRP2
                            "ProcurementType": "X",
                            "SafetyStockQuantity": "5",
                            //MRP3
                            "ProdRqmtsConsumptionMode": "2",
                            "FwdConsumptionPeriodInWorkDays": "60",
                            "BackwardCnsmpnPeriodInWorkDays": "30",
                            "AvailabilityCheckType": "SR",
                            "PlanningStrategyGroup": "40"
                        },
                        "to_ProductWorkScheduling": {
                            "Product": ProjectID,
                            "Plant": plant.Plant,
                            "ProductionSchedulingProfile": "YB0001"
                        },
                        "to_PlantSales": {
                            "Product": ProjectID,
                            "Plant": plant.Plant,
                            "AvailabilityCheckType": "SR"
                        },
                        "to_StorageLocation": slocs.filter(sloc => sloc.Plant === plant.Plant)
                            .map(item => {
                                return {
                                    "Product": ProjectID,
                                    "Plant": item.Plant,
                                    "StorageLocation": item.StorageLocation
                                }
                            })
                    })
                    to_Valuation.push({
                        "Product": ProjectID,
                        "ValuationClass": "7920",
                        "ValuationArea": valuation.ValuationArea,
                        "ValuationType": "",
                        "Currency": element.Currency,
                        "PriceDeterminationControl": "2",
                        "InventoryValuationProcedure": "S",
                        "StandardPrice": "0.01"
                    })
                }

                for (let k = 0; k < sorgs.length; k++) {
                    const salesorg = sorgs[k];
                    const element = comp.find(item => item.CompanyCode === salesorg.CompanyCode)
                    if (!['US', 'CA'].includes(element.Country)) continue
                    const salesData = sorgdist.filter(item => item.SalesOrganization === salesorg.SalesOrganization)
                        .map(item => {
                            return {
                                "Product": ProjectID,
                                "ProductSalesOrg": item.SalesOrganization,
                                "ProductDistributionChnl": item.DistributionChannel,
                                "AccountDetnProductGroup": "03",
                                "ItemCategoryGroup": "NORM",
                                "PricingReferenceProduct": Title,
                                "to_SalesTax": [
                                    {
                                        "Product": ProjectID,
                                        "Country": 'US',
                                        "TaxCategory": "UTXJ",
                                        "TaxClassification": "0"
                                    },
                                    {
                                        "Product": ProjectID,
                                        "Country": 'CA',
                                        "TaxCategory": "CTXJ",
                                        "TaxClassification": "0"
                                    }
                                ],
                                "to_SalesText": [
                                    {
                                        "Product": ProjectID,
                                        "ProductSalesOrg": item.SalesOrganization,
                                        "ProductDistributionChnl": item.DistributionChannel,
                                        "Language": element.Language,
                                        "LongText": assetvault._Items.map(u => u.LinkedCTT).join(`\n`)
                                    }
                                ]
                            }
                        })
                    to_SalesDelivery.push(...salesData)
                }
                const ins = await pdtx.run(INSERT.into(Products).entries({
                    "ProductType": "ZDCP",
                    "Product": ProjectID,
                    "ProductGroup": "Z003",
                    "BaseUnit": "EA",
                    "NetWeight": "0.01",
                    "GrossWeight": "0.01",
                    "WeightUnit": "KG",
                    "to_Description": [
                        {
                            "Product": ProjectID,
                            "Language": "EN",
                            "ProductDescription": assetvault.VolumeName.substring(0, 40)
                        }
                    ],
                    "to_ProductBasicText": [
                        {
                            "Product": ProjectID,
                            "Language": "EN",
                            "LongText": assetvault._Items.map(u => u.AssetMapUUID).join(`\n`)
                        }
                    ],
                    "to_Plant": to_Plant,
                    "to_SalesDelivery": to_SalesDelivery,
                    "to_Valuation": to_Valuation,
                    "to_ProductStorage": {
                        "Product": ProjectID,
                        "StorageConditions": "10"
                    },
                }))

                await INSERT.into(ProductionProcess).entries(to_Plant.map(item => {
                    return {
                        Material: item.Product,
                        Plant: item.Plant,
                        IsBomCreated: false,
                        IsProductionVersion1: false,
                        IsProductionVersion2: false
                    }
                }))

                await UPDATE(DistributionDcp, assetvault.ProjectID).with({
                    DCP: ins.Product,
                    Title: Title,
                    CreatedinSAP: true
                })

                productionProcess(to_Plant.map(item => {
                    return {
                        Material: item.Product,
                        Plant: item.Plant,
                        IsBomCreated: false,
                        IsProductionVersion1: false,
                        IsProductionVersion2: false
                    }
                }))

                req.info({
                    message: `DCP Material ${ins.Product} created! Production process started for DCP Material ${ins.Product}`,
                })
            } catch (error) {
                req.error(502, error)
            }
        })

        this.on("reprocessProductionProcess", async req => {
            const { ProjectID } = req.params[0]
            let assetvault = await SELECT.one.from(DistributionDcp, ProjectID)
            if (!assetvault.CreatedinSAP) return req.error(400, 'DCP Material is not created!')
            const prodProcess = await SELECT.from(ProductionProcess).where({ Material: ProjectID })

            productionProcess(prodProcess)
            req.info({
                message: `Production process started for DCP Material ${ProjectID}`,
            })
        })

        this.on("READ", "MediaFiles", async (req, res) => {
            try {
                var form_name = 'frm_058'
                var query = `/v1/forms/${form_name}`;
                var oFormObject = await deluxe_adsrestapi.get(query);
                var sXMLTemplate = oFormObject.templates[0].xdpTemplate;
                const jsonData = {
                    customer: {
                        name: "John Doe",
                        address: "1234 Elm Street",
                        city: "Berlin",
                        country: "Germany"
                    },
                    items: [
                        { description: "Laptop", quantity: 1, price: 1200 },
                        { description: "Mouse", quantity: 2, price: 25 }
                    ],
                    total: 1250
                };

                // Wrap everything in a single root element to ensure well-formed XML
                const wrappedJson = { root: jsonData };

                // Convert JSON to XML (Ensure single root)
                const xmlData = xmljs.js2xml(wrappedJson, { compact: true, spaces: 4 });

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


                // Decode Base64 to Buffer
                const buffer = Buffer.from(oPrintForm.fileContent, 'base64');

                // Convert Buffer to Readable Stream
                const stream = Readable.from(buffer);

                req._.res.setHeader("Content-Type", `application/pdf`);
                req._.res.setHeader(
                    "Content-Disposition",
                    `attachment; filename="test.pdf"`
                );
                return stream;
                // return oPrintForm.fileContent;
            }
            catch (e) {
                req.error(502, e)
            }
        }),
            this.on("downloadFormADS", async (req, res) => {
                try {
                    var form_name = 'frm_058'
                    var query = `/v1/forms/${form_name}`;
                    var oFormObject = await deluxe_adsrestapi.get(query);
                    var sXMLTemplate = oFormObject.templates[0].xdpTemplate;
                    const jsonData = {
                        customer: {
                            name: "John Doe",
                            address: "1234 Elm Street",
                            city: "Berlin",
                            country: "Germany"
                        },
                        items: [
                            { description: "Laptop", quantity: 1, price: 1200 },
                            { description: "Mouse", quantity: 2, price: 25 }
                        ],
                        total: 1250
                    };

                    // Wrap everything in a single root element to ensure well-formed XML
                    const wrappedJson = { root: jsonData };

                    // Convert JSON to XML (Ensure single root)
                    const xmlData = xmljs.js2xml(wrappedJson, { compact: true, spaces: 4 });

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
