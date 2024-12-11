const cds = require("@sap/cds");

module.exports = class DistributionService extends cds.ApplicationService {
    async init() {
        const { DistroSpec, BusinessPartners, ShippingConditions } = this.entities
        const { today } = cds.builtin.types.Date
        const bptx = await cds.connect.to('API_BUSINESS_PARTNER')
        const sctx = await cds.connect.to('YY1_SHIPPINGCONDITION_CDS')
        this.before('CREATE', DistroSpec, async req => {
            let { maxID } = await SELECT.one(`max(DistroSpecID) as maxID`).from(DistroSpec)
            req.data.DistroSpecID = ++maxID
            req.data.FieldControl = 1
        })

        this.before('SAVE', DistroSpec, req => {
            const { ValidFrom, ValidTo } = req.data
            if (ValidFrom < today()) req.error(400, `Valid From must not be before today.`, 'in/ValidFrom')
            if (ValidFrom > ValidTo) req.error(400, `Valid To must be after Valid From.`, 'in/ValidTo')
        })

        this.on('READ', BusinessPartners, async req => {
            return bptx.get(SELECT.from(BusinessPartners).where`BusinessPartnerType in ('Z001', 'Z002')`)
        })

        this.on('READ', ShippingConditions, async req => {
            return sctx.run(req.query)
        })

        return super.init()
    }
}