const cds = require("@sap/cds");

module.exports = class MasteringService extends cds.ApplicationService {
    async init() {
        const { BusinessPartners } = this.entities
        const bptx = await cds.connect.to('API_BUSINESS_PARTNER')

        this.on('READ', BusinessPartners, async req => {
            return bptx.run(req.query)
        })

        return super.init()
    }
}