const cds = require("@sap/cds");

module.exports = class DistributionService extends cds.ApplicationService {
    async init() {
        const { DistroSpec, ShippingConditions, Products, DCPMaterialConfig, DCPProducts, Titles, Studios, Theaters } = this.entities
        const { today } = cds.builtin.types.Date
        const bptx = await cds.connect.to('API_BUSINESS_PARTNER')
        const sctx = await cds.connect.to('YY1_SHIPPINGCONDITION_CDS')
        const pdtx = await cds.connect.to('API_PRODUCT_SRV')
        this.before('CREATE', DistroSpec, async req => {
            let { maxID } = await SELECT.one(`max(DistroSpecID) as maxID`).from(DistroSpec)
            req.data.DistroSpecID = ++maxID
            req.data.FieldControl = 1
        })

        this.before('SAVE', DistroSpec, req => {
            const { ValidFrom, ValidTo } = req.data
            if (ValidFrom > ValidTo) req.error(400, `Valid To must be after Valid From.`, 'in/ValidTo')
        })

        this.before('NEW', DistroSpec.drafts, req => {
            req.data.ValidFrom = today()
        })

        this.before('NEW', `Package.drafts`, req => {
            req.data.ValidFrom = today()
        })

        this.on(['CREATE', 'UPDATE'], Products, req => {
            return pdtx.run(req.query)
        })

        this.on(['READ'], DCPProducts, req => {
            return pdtx.run(SELECT.from(Products).where({ ProductGroup: 'Z003' }))
        })

        this.on(['READ'], Titles, req => {
            return pdtx.run(SELECT.from(Products).where({ ProductGroup: 'Z007' }))
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

        this.on('createDCPMaterial', async req => {
            const id = req.params[0]
            const material = await SELECT.one.from(DCPMaterialConfig, id).columns(["*", { "ref": ["to_Plant"], "expand": ["*"] }, { "ref": ["to_SalesDelivery"], "expand": ["*"] }])
            const to_Plant = []
            const to_SalesDelivery = []
            const to_Valuation = []

            try {
                for (let j = 0; j < material.to_Plant.length; j++) {
                    const plant = material.to_Plant[j];
                    to_Plant.push({
                        "Plant": plant.Plant,
                        "ProfitCenter": "100402",
                        "SerialNumberProfile": "ZBP1",
                        "MRPType": "PD",
                        "MRPResponsible": "001",
                        "ProcurementType": "X",
                        "to_ProductSupplyPlanning": {
                            "Plant": plant.Plant,
                            "MRPType": "PD",
                            "MRPResponsible": "001",
                            "SafetyStockQuantity": "5",
                            "LotSizingProcedure": "MB",
                            "PlanningStrategyGroup": "40"
                        },
                        "to_StorageLocation": [
                            {
                                "Plant": plant.Plant,
                                "StorageLocation": plant.StorageLocation
                            }
                        ]
                    })
                    to_Valuation.push({
                        "ValuationClass": "7920",
                        "ValuationArea": plant.Plant,
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
                        "ProductSalesOrg": salesorg.ProductSalesOrg,
                        "ProductDistributionChnl": salesorg.ProductDistributionChnl,
                        "AccountDetnProductGroup": "03",
                        "ItemCategoryGroup": "NORM",
                        "SupplyingPlant": "1172",
                        "to_SalesTax": [
                            {
                                "Country": "US",
                                "TaxCategory": "UTXJ",
                                "TaxClassification": "0"
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
                            "ProductDescription": material.Description
                        }
                    ],
                    "to_Plant": to_Plant,
                    "to_SalesDelivery": to_SalesDelivery,
                    "to_Valuation": to_Valuation,
                    "to_ProductStorage": {
                        "StorageConditions": "10"
                    },
                }))
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