const cds = require('@sap/cds')

module.exports = class DcnStatusService extends cds.ApplicationService {
    async init() {
        const { StatusStaging, StudioFeed, StatusConversion } = this.entities

        this.on('fillStatusStaging', async req => {
            const feeds = await SELECT.from(StudioFeed)
            const rules = await SELECT.from(StatusConversion).orderBy(`Preference`)

            for (let index = 0; index < feeds.length; index++) {
                const feed = feeds[index];
                const rule = rules.filter(item => item.SapDocStatus === feed.ErrorMessage)
                if (!rule) continue
                await INSERT.into(StatusStaging).entries({
                    BookingID: feed.BookingID,
                    OrderID: feed.OrderID,
                    OriginatingEnvironment: feed?.Origin_OriginID,
                    studioId: feed?.Studio_BusinessPartner,
                    studioName: feed?.StudioText,
                    SalesOrder: feed?.SalesOrder,
                    CplUUID: feed?.CPLUUIDs,
                    DeliveryMethod: feed?.DeliveryMethod,
                    // VersionDescription:feed.Version,
                    SapDocType: rule?.SapDocType,
                    // SapDocStatus: rule.SapDocStatus,
                    OrderType: rule?.OrderType,
                    StatusTypeCode: rule?.StatusTypeCode,
                    StatusTypeDescription: rule?.StatusTypeDescription,
                    StatusCode: rule?.StatusCode,
                    StatusDescription: rule?.StatusDescription

                })
            }
        })

        return super.init()
    }
}