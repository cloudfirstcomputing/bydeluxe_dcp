const cds = require("@sap/cds");

module.exports = class DistributionService extends cds.ApplicationService {
    async init() {
        const { DistroSpec, Regions, Plants, DistributionDcp, CustomerGroup, Country, ShippingConditions, Products, DCPMaterialConfig, SalesDistricts,
            StorageLocations, SalesOrganizations, DistributionChannels, DCPProducts, Titles, Studios, Theaters, DeliveryPriority } = this.entities
        const { today } = cds.builtin.types.Date
        const _asArray = x => Array.isArray(x) ? x : [x]
        const bptx = await cds.connect.to('API_BUSINESS_PARTNER')
        const sctx = await cds.connect.to('ZAPI_SHIPPINGCONDITION')
        const pdtx = await cds.connect.to('API_PRODUCT_SRV')
        const dlvprtx = await cds.connect.to('YY1_DELIVERYPRIORITY_CDS')
        const cstgrptx = await cds.connect.to('API_CUSTOMERGROUP_SRV')
        const ctrytx = await cds.connect.to('API_COUNTRY_SRV')
        const rgtx = await cds.connect.to('ZAPI_REGION')
        const planttx = await cds.connect.to('API_PLANT_SRV')
        const sloctx = await cds.connect.to('YY1_STORAGELOCATION_CDS')
        const salesorgtx = await cds.connect.to('API_SALESORGANIZATION_SRV')
        const distchtx = await cds.connect.to('API_DISTRIBUTIONCHANNEL_SRV')
        const salesdisttx = await cds.connect.to('API_SALESDISTRICT_SRV')

        const expand = (req, fields = []) => {
            const processedField = [], lreq = req
            for (let index = 0; index < fields.length; index++) {
                const element = fields[index].split('_');

                const expandIndex = lreq.query.SELECT.columns.findIndex(
                    ({ expand, ref }) => expand && ref[0] === element[0]
                );
                if (expandIndex < 0) continue
                processedField.push(fields[index])
                // Remove expand from query
                lreq.query.SELECT.columns.splice(expandIndex, 1);

                // Make sure Field will be returned
                if (!lreq.query.SELECT.columns.indexOf('*') >= 0 &&
                    !lreq.query.SELECT.columns.find(
                        column => column.ref && column.ref.find((ref) => ref == fields[index]))
                ) {
                    lreq.query.SELECT.columns.push({ ref: [fields[index]] });
                }
            }

            return { processedField, lreq }

        }

        this.before('CREATE', DistroSpec, async req => {
            let { maxID } = await SELECT.one(`max(DistroSpecID) as maxID`).from(DistroSpec)
            req.data.DistroSpecID = ++maxID
            req.data.FieldControl = 1
        })

        this.on("READ", `StudioKey`, async (req, next) => {
            if (!req.query.SELECT.columns) return next();
            const fields = ["Studio_BusinessPartner", "SalesTerritory_SalesDistrict"]
            const { processedField, lreq } = expand(req, fields)
            if (processedField.length === 0) return next();

            const response = await cds.run(lreq.query);

            const asArray = x => Array.isArray(x) ? x : [x];

            for (let index = 0; index < processedField.length; index++) {
                const element = processedField[index].split('_');
                const ids = asArray(response).map(resp => resp[processedField[index]]);
                const maps = {};
                let records = []

                switch (processedField[index]) {
                    case "Studio_BusinessPartner":
                        records = await bptx.run(SELECT.from(Studios).where({ BusinessPartner: ids }))

                        break;

                    case "SalesTerritory_SalesDistrict":
                        const rec = asArray(await salesdisttx.run(SELECT.from(SalesDistricts)
                            .columns(["SalesDistrict", { "ref": ["to_Text"], "expand": ["*"] }])
                            .where({ SalesDistrict: ids })))
                        records = rec.map(item => {
                            return { SalesDistrict: item.SalesDistrict, Name: item.to_Text.find(text => text.Language === req.locale.toUpperCase()).SalesDistrictName }
                        })
                        break;

                    default:
                        break;
                }

                for (const record of records)
                    maps[record[element[1]]] = record;

                // Add titles to result
                for (const note of asArray(response)) {
                    note[element[0]] = maps[note[processedField[index]]];
                }
            }
            return response;
        })

        // DistroSpec?$expand
        this.on("READ", DistroSpec, async (req, next) => {
            if (!req.query.SELECT.columns) return next();
            const fields = ["Title_Product", "DeliverySequence1_ShippingCondition", "DeliverySequence2_ShippingCondition", "DeliverySequence3_ShippingCondition"
                , "DeliverySequence4_ShippingCondition", "DeliverySequence5_ShippingCondition", "DeliverySequence6_ShippingCondition", "DeliverySequence7_ShippingCondition"
                , "DeliverySequence8_ShippingCondition", "DeliverySequence9_ShippingCondition", "DeliverySequence10_ShippingCondition"
            ]
            const { processedField, lreq } = expand(req, fields)
            if (processedField.length === 0) return next();

            const response = await cds.run(lreq.query);

            const asArray = x => Array.isArray(x) ? x : [x];

            for (let index = 0; index < processedField.length; index++) {
                const element = processedField[index].split('_');
                const ids = asArray(response).map(resp => resp[processedField[index]]);
                const maps = {};
                let records = []

                switch (processedField[index]) {
                    case "Title_Product":
                        const data = asArray(await pdtx.run(SELECT.from(Products)
                            .columns(["Product", { "ref": ["to_Description"], "expand": ["*"] }])
                            .where({ Product: ids })))
                        records = data.map(item => {
                            return { Product: item.Product, Name: (item.to_Description.length) ? item.to_Description.find(text => text.Language === req.locale.toUpperCase()).ProductDescription : '' }
                        })

                        break;
                    case "DeliverySequence1_ShippingCondition" || "DeliverySequence2_ShippingCondition" ||
                        "DeliverySequence3_ShippingCondition" || "DeliverySequence7_ShippingCondition" ||
                        "DeliverySequence4_ShippingCondition" || "DeliverySequence8_ShippingCondition" ||
                        "DeliverySequence5_ShippingCondition" || "DeliverySequence9_ShippingCondition" ||
                        "DeliverySequence6_ShippingCondition" || "DeliverySequence10_ShippingCondition":
                        records = await sctx.run(SELECT.from(ShippingConditions).where({ ShippingCondition: ids }))
                        break;
                    default:
                        break;
                }

                for (const record of records)
                    maps[record[element[1]]] = record;

                // Add titles to result
                for (const note of asArray(response)) {
                    note[element[0]] = maps[note[processedField[index]]];
                }
            }
            return response;
        })

        // DistRestrictions?$expand
        this.on("READ", `DistRestrictions`, async (req, next) => {
            if (!req.query.SELECT.columns) return next();
            const fields = ["Circuit_CustomerGroup", "DistributionFilterRegion_Region"]
            const { processedField, lreq } = expand(req, fields)
            if (processedField.length === 0) return next();

            const response = await cds.run(lreq.query);

            const asArray = x => Array.isArray(x) ? x : [x];
            for (let index = 0; index < processedField.length; index++) {
                const element = processedField[index].split('_');
                const ids = asArray(response).map(resp => resp[processedField[index]]);
                const maps = {};
                let records = []

                switch (processedField[index]) {
                    case "Circuit_CustomerGroup":
                        const data = asArray(await cstgrptx.run(SELECT.from(CustomerGroup)
                            .columns(["CustomerGroup", { "ref": ["to_Text"], "expand": ["*"] }])
                            .where({ CustomerGroup: ids })))
                        records = data.map(item => {
                            return { CustomerGroup: item.CustomerGroup, Name: item.to_Text.find(text => text.Language === req.locale.toUpperCase()).CustomerGroupName }
                        })
                        break;

                    case "DistributionFilterRegion_Region":
                        records = await rgtx.run(SELECT.from(Regions).where({ Region: ids }))

                        break;
                    // case "PrimaryPlant_Plant":
                    //     records = await planttx.run(SELECT.from(Plants).where({ Plant: ids }))

                    //     break;
                    // case "SecondaryPlant_Plant":
                    //     records = await planttx.run(SELECT.from(Plants).where({ Plant: ids }))

                    //     break;
                    default:
                        break;
                }

                for (const record of records)
                    maps[record[element[1]]] = record;

                // Add titles to result
                for (const note of asArray(response)) {
                    if (processedField[index] === "DistributionFilterRegion_Region") {
                        note[element[0]] = records.find(item => item.Country === note.DistributionFilterCountry_code)
                    } else {
                        note[element[0]] = maps[note[processedField[index]]];
                    }
                }
            }

            return response;
        })

        // Package?$expand
        this.on("READ", `Package`, async (req, next) => {
            if (!req.query.SELECT.columns) return next();
            const fields = ["DeliveryMethod1_ShippingCondition", "DeliveryMethod2_ShippingCondition", "DeliveryMethod3_ShippingCondition"
                , "DeliveryMethod4_ShippingCondition", "DeliveryMethod5_ShippingCondition", "DeliveryMethod6_ShippingCondition", "DeliveryMethod7_ShippingCondition"
                , "DeliveryMethod8_ShippingCondition", "DeliveryMethod9_ShippingCondition", "DeliveryMethod10_ShippingCondition"
            ]
            const { processedField, lreq } = expand(req, fields)
            if (processedField.length === 0) return next();

            const response = await cds.run(lreq.query);

            const asArray = x => Array.isArray(x) ? x : [x];
            for (let index = 0; index < processedField.length; index++) {
                const element = processedField[index].split('_');
                const ids = asArray(response).map(resp => resp[processedField[index]]);
                const maps = {};
                let records = []

                switch (processedField[index]) {
                    case "DeliveryMethod1_ShippingCondition" || "DeliveryMethod2_ShippingCondition" ||
                        "DeliveryMethod3_ShippingCondition" || "DeliveryMethod7_ShippingCondition" ||
                        "DeliveryMethod4_ShippingCondition" || "DeliveryMethod8_ShippingCondition" ||
                        "DeliveryMethod5_ShippingCondition" || "DeliveryMethod9_ShippingCondition" ||
                        "DeliveryMethod6_ShippingCondition" || "DeliveryMethod10_ShippingCondition":
                        records = await sctx.run(SELECT.from(ShippingConditions).where({ ShippingCondition: ids }))

                        break;
                    default:
                        break;
                }

                for (const record of records)
                    maps[record[element[1]]] = record;

                // Add titles to result
                for (const note of asArray(response)) {
                    note[element[0]] = maps[note[processedField[index]]];
                }
            }

            return response;
        })

        // DCPMaterials?$expand
        this.on("READ", `DCPMaterials`, async (req, next) => {
            if (!req.query.SELECT.columns) return next();
            const fields = ["DCPMaterialNumber_Product"]
            const { processedField, lreq } = expand(req, fields)
            if (processedField.length === 0) return next();

            const response = await cds.run(lreq.query);

            const asArray = x => Array.isArray(x) ? x : [x];

            for (let index = 0; index < processedField.length; index++) {
                const element = processedField[index].split('_');
                const ids = asArray(response).map(resp => resp[processedField[index]]);
                const maps = {};
                let records = []

                switch (processedField[index]) {
                    case "DCPMaterialNumber_Product":
                        const data = asArray(await pdtx.run(SELECT.from(Products)
                            .columns(["Product", { "ref": ["to_Description"], "expand": ["*"] }])
                            .where({ Product: ids })))
                        records = data.map(item => {
                            return { Product: item.Product, Name: (item.to_Description.length) ? item.to_Description.find(text => text.Language === req.locale.toUpperCase()).ProductDescription : '' }
                        })

                        break;
                    default:
                        break;
                }

                for (const record of records)
                    maps[record[element[1]]] = record;

                // Add titles to result
                for (const note of asArray(response)) {
                    note[element[0]] = maps[note[processedField[index]]];
                }
            }
            return response;

        })

        this.after('each', `DCPMaterials`, async req => {
            if (req.DCPMaterialNumber_Product) {
                const assetvault = await SELECT.one.from(DistributionDcp)
                    .columns(["*", { "ref": ["_Items"], "expand": ["*"] }])
                    .where({
                        DCP: req.DCPMaterialNumber_Product
                    })
                if (assetvault?._Items?.length > 0) {
                    req.CTT = assetvault._Items.map(u => u.LinkedCTT).join(`\n`)
                    req.CPLUUID = assetvault._Items.map(u => u.LinkedCPLUUID).join(`\n`)
                }
            }
        })

        this.on('setDownloadEmail', async req => {
            const { DCPMaterialUUID } = req.params[2]
            const material = await SELECT.one.from('DistributionService.DCPMaterials').where({ DCPMaterialUUID: DCPMaterialUUID })
            const assetvault = await SELECT.one.from(DistributionDcp)
                .columns(["*"])
                .where({
                    DCP: material.DCPMaterialNumber_Product
                })
            if (assetvault) {
                await UPDATE('DistributionService.DistributionDcp__Items').with({
                    Email: req.data.email,
                    Download: req.data.download
                }).where({ up__ProjectID: assetvault.ProjectID, LinkedCPLUUID: req.data.cpl })
            }
        })

        this.before('NEW', `Package.drafts`, req => {
            req.data.ValidFrom = today()
        })

        this.on(['READ', 'CREATE', 'UPDATE'], Products, req => {
            return pdtx.run(req.query)
        })

        this.on(['READ'], Plants, req => {
            return planttx.run(req.query)
        })

        this.on(['READ'], SalesOrganizations, async req => {
            const data = _asArray(await salesorgtx.run(SELECT.from(SalesOrganizations).columns(["SalesOrganization", { "ref": ["to_Text"], "expand": ["*"] }])))
            return data.map(item => {
                return { SalesOrganization: item.SalesOrganization, Name: item.to_Text.find(text => text.Language === req.locale.toUpperCase()).SalesOrganizationName }
            })
        })

        this.on(['READ'], StorageLocations, req => {
            return sloctx.run(req.query)
        })

        this.on(['READ'], DistributionChannels, async req => {
            const data = _asArray(await distchtx.run(SELECT.from(DistributionChannels).columns(["DistributionChannel", { "ref": ["to_Text"], "expand": ["*"] }])))
            return data.map(item => {
                return { DistributionChannel: item.DistributionChannel, Name: item.to_Text.find(text => text.Language === req.locale.toUpperCase()).DistributionChannelName }
            })
        })

        this.on(['READ'], DCPProducts, async req => {
            const data = _asArray(await pdtx.run(SELECT.from(Products).columns(["Product", { "ref": ["to_Description"], "expand": ["*"] }]).where({ ProductGroup: 'Z003' })))
            return data.map(item => {
                return { Product: item.Product, Name: item.to_Description.find(text => text.Language === req.locale.toUpperCase()).ProductDescription }
            })
        })

        this.on(['READ'], Titles, async req => {
            const data = _asArray(await pdtx.run(SELECT.from(Products).columns(["Product", { "ref": ["to_Description"], "expand": ["*"] }]).where({ ProductGroup: 'Z007' })))
            return data.map(item => {
                return { Product: item.Product, Name: (item.to_Description.length) ? item.to_Description.find(text => text.Language === req.locale.toUpperCase()).ProductDescription : '' }
            })
        })

        this.on('READ', Studios, async req => {
            return bptx.run(SELECT.from(Studios).where`BusinessPartnerType in ('Z001', 'Z002')`)
        })

        this.on('READ', Theaters, async req => {
            return bptx.run(SELECT.from(Theaters).where`BusinessPartnerType = 'Z003'`)
        })

        this.on('READ', ShippingConditions, async req => {
            return sctx.run(req.query)
        })

        this.on('READ', Regions, async req => {
            return rgtx.run(req.query)
        })

        this.on('READ', DeliveryPriority, async req => {
            return dlvprtx.run(req.query)
        })

        this.on('READ', Country, async req => {
            const data = _asArray(await ctrytx.run(SELECT.from(Country).columns(["*", { "ref": ["to_Text"], "expand": ["*"] }])))
            return data.map(item => {
                return { Country: item.Country, Name: item.to_Text.find(text => text.Language === req.locale.toUpperCase()).CountryName }
            })
        })

        this.on('READ', CustomerGroup, async req => {
            const data = _asArray(await cstgrptx.run(SELECT.from(CustomerGroup).columns(["*", { "ref": ["to_Text"], "expand": ["*"] }])))
            return data.map(item => {
                return { CustomerGroup: item.CustomerGroup, Name: item.to_Text.find(text => text.Language === req.locale.toUpperCase()).CustomerGroupName }
            })
        })

        this.on('READ', SalesDistricts, async req => {
            const data = _asArray(await salesdisttx.run(SELECT.from(SalesDistricts).columns(["*", { "ref": ["to_Text"], "expand": ["*"] }])))
            return data.map(item => {
                return { SalesDistrict: item.SalesDistrict, Name: item.to_Text.find(text => text.Language === req.locale.toUpperCase()).SalesDistrictName }
            })
        })

        this.before('NEW', 'DCPMaterialConfig.to_Plant.drafts', req => {
            req.data.StorageLocation_Plant = req.data.Plant_Plant
        })

        this.on('createDCPMaterial', async req => {
            const id = req.params[0]
            const material = await SELECT.one.from(DCPMaterialConfig, id).columns(["*", { "ref": ["to_Plant"], "expand": ["*"] }, { "ref": ["to_SalesDelivery"], "expand": ["*"] }])
            const to_Plant = []
            const to_SalesDelivery = []
            const to_Valuation = []
            const assetvault = await SELECT.one.from(DistributionDcp, material.ProjectID_ProjectID).columns(["*", { "ref": ["_Items"], "expand": ["*"] }])
            if (assetvault.CreatedinSAP) return req.error(400, 'DCP Material already created!')
            try {
                for (let j = 0; j < material.to_Plant.length; j++) {
                    const plant = material.to_Plant[j];
                    to_Plant.push({
                        "Plant": plant.Plant_Plant,
                        "ProfitCenter": "100402",
                        // "SerialNumberProfile": "ZBP1",
                        "AvailabilityCheckType": "SR",
                        "MRPType": "PD",
                        "MRPResponsible": "001",
                        "ProcurementType": "X",
                        "to_ProductSupplyPlanning": {
                            "Plant": plant.Plant_Plant,
                            "MRPType": "PD",
                            "MRPResponsible": "001",
                            "SafetyStockQuantity": "5",
                            "LotSizingProcedure": "MB",
                            "PlanningStrategyGroup": "10"
                        },
                        "to_StorageLocation": [
                            {
                                "Plant": plant.Plant_Plant,
                                "StorageLocation": plant.StorageLocation_StorageLocation
                            }
                        ]
                    })
                    to_Valuation.push({
                        "ValuationClass": "7920",
                        "ValuationArea": plant.Plant_Plant,
                        "ValuationType": "",
                        "Currency": "USD",
                        "PriceDeterminationControl": "2",
                        "InventoryValuationProcedure": "S",
                        "StandardPrice": "0.01"
                    })
                }
                for (let k = 0; k < material.to_SalesDelivery.length; k++) {
                    const salesorg = material.to_SalesDelivery[k];
                    to_SalesDelivery.push({
                        "ProductSalesOrg": salesorg.ProductSalesOrg_SalesOrganization,
                        "ProductDistributionChnl": salesorg.ProductDistributionChnl_DistributionChannel,
                        "AccountDetnProductGroup": "03",
                        "ItemCategoryGroup": "NORM",
                        "SupplyingPlant": "1172",
                        "to_SalesTax": [
                            {
                                "Country": "US",
                                "TaxCategory": "UTXJ",
                                "TaxClassification": "0"
                            }
                        ],
                        "to_SalesText": [
                            {
                                "ProductSalesOrg": salesorg.ProductSalesOrg_SalesOrganization,
                                "ProductDistributionChnl": salesorg.ProductDistributionChnl_DistributionChannel,
                                "Language": "EN",
                                "LongText": assetvault._Items.map(u => u.LinkedCTT).join(`\n`)
                            }
                        ]
                    })
                }
                const ins = await pdtx.run(INSERT.into(Products).entries({
                    "ProductType": "FERT",
                    "ProductGroup": "Z003",
                    "BaseUnit": "EA",
                    "NetWeight": "1",
                    "GrossWeight": "1",
                    "WeightUnit": "KG",
                    "to_Description": [
                        {
                            "Language": "EN",
                            "ProductDescription": assetvault.AssetMapIDDescription
                        }
                    ],
                    "to_Plant": to_Plant,
                    "to_SalesDelivery": to_SalesDelivery,
                    "to_Valuation": to_Valuation,
                    "to_ProductStorage": {
                        "StorageConditions": "10"
                    },
                }))
                await UPDATE(DistributionDcp, assetvault.ProjectID).with({
                    DCP: ins.Product,
                    CreatedinSAP: true
                })
                await DELETE.from(DCPMaterialConfig, id)
                req.info({
                    message: `DCP Material ${ins.Product} created`,
                })
                return ins
            } catch (error) {
                req.error(502, error)
            }
        })

        return super.init()
    }
}