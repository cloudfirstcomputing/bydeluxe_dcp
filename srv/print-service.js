const cds = require("@sap/cds");
const xmljs = require("xml-js");
const { Readable } = require('stream');

module.exports = class PrintFormService extends cds.ApplicationService {
    async init() {
        const deluxe_adsrestapi = await cds.connect.to("deluxe-ads-rest-api");
        const buspatx = await cds.connect.to('API_BUSINESS_PARTNER');
        const { HDDLabels, BusinessPartner } = this.entities;
        this.on('READ', HDDLabels, async (req) => {
            var form_name = 'HDDLabel';
            var query = `/v1/forms/${form_name}`;
            var oFormObject = await deluxe_adsrestapi.get(query);
            var sXMLTemplate = oFormObject.templates[0].xdpTemplate;

            var sFilter = req.http?.req?.query?.["$filter"]
            var aFilterParams = sFilter?.replaceAll('and','')?.replaceAll('eq','')?.split('  ');
            var DCPBarcode = aFilterParams[1]?.replaceAll("'","");
            var Title, Studio, VersionDescription, TotalSize, RatingCount, FeatureCount, TrailerCount, Content = [];
            if (DCPBarcode) {
                var oAssetVault = await SELECT.one.from('DistributionService.DistributionDcp', (dist)=>{
                    dist.Title,
                    dist.VersionDescription,
                    dist.KrakenTitleID,
                    dist.AssetMapFileSize,
                    dist._Items((items)=>{
                        items.LinkedCTT,
                        items.StartOfCrawl,
                        items.LinkedCPLUUID,
                        items.RunTime,
                        items.StartOfCredits
                    })
                }).where({DCP: DCPBarcode});

                var aItems = oAssetVault?._Items;
                var aFeatureItems = aItems?.filter((item)=>{
                    return item?.LinkedCTT?.toUpperCase().includes('FTR');
                });
                await aFeatureItems?.forEach(element => {
                    Content.push({"ContentText":`${element.LinkedCTT} Duration:${element.RunTime} Start Of Credits:${element.StartOfCredits} Crawl:${element.StartOfCrawl}`});
                });                
                FeatureCount = aFeatureItems?.length;

                var aRatingItems = aItems?.filter((item)=>{
                    return item?.LinkedCTT?.toUpperCase().includes('RTG');
                });
                await aRatingItems?.forEach(element => {
                    Content.push({"ContentText":`${element.LinkedCTT} Duration:${element.RunTime} Start Of Credits:${element.StartOfCredits} Crawl:${element.StartOfCrawl}`});
                });
                RatingCount = aRatingItems?.length;

                var aTrailerItems = aItems?.filter((item)=>{
                    return item?.LinkedCTT?.toUpperCase().includes('TRL');
                });
                await aTrailerItems?.forEach(element => {
                    Content.push({"ContentText":`${element.LinkedCTT} Duration:${element.RunTime} Start Of Credits:${element.StartOfCredits} Crawl:${element.StartOfCrawl}`});
                });
                TrailerCount = aTrailerItems?.length;

                VersionDescription = oAssetVault?.VersionDescription;
                Title = oAssetVault?.Title;
                TotalSize = oAssetVault?.AssetMapFileSize;

                var distroSpecData = await SELECT.one.from('DistributionService.DistroSpec', (dist) => {
                    dist.DistroSpecUUID,
                        dist.DistroSpecID,
                        dist.Title_Product,
                        dist.Name,
                        dist.to_StudioKey((studio) => {
                            studio.Studio_BusinessPartner
                        })
                }).where({ Title_Product: DCPBarcode });
                var sBupa = distroSpecData?.to_StudioKey?.[0]?.Studio_BusinessPartner;

                if (sBupa) {
                    var oBupa = await buspatx.run(SELECT.one.columns(['BusinessPartnerFullName']).from(BusinessPartner).where({ BusinessPartner: sBupa }));
                    Studio = oBupa?.BusinessPartnerFullName;
                }                
            }
            // const formData = {
            //     Form: {
            //         HDDLabelNode: {
            //             Title: "Title",
            //             DCPBarcode: "8765789",
            //             VersionDescription: "Ver 1",
            //             Studio: "Studio",
            //             TotalSize: "34 TB",
            //             TrainingCount: 3,
            //             FeatureCount: 1,
            //             Content: { "ContentNode": [{ "ContentText": "Test1" }, { "ContentText": "Test1" }] }
            //         }
            //     }
            // };
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

            // Decode Base64 to Buffer
            const buffer = Buffer.from(oPrintForm.fileContent, 'base64');

            // Convert Buffer to Readable Stream
            const stream = Readable.from(buffer);

            req.res.setHeader("Content-Type", `application/pdf`);
            req.res.setHeader(
                "Content-Disposition",
                `attachment; filename="HDDLabel - ${DCPBarcode}.pdf"`
            );
            return stream;
        });
        this.on('getKrakenHDDLabel', async (req, res) => {
            try {
                var form_name = 'HDDLabel';
            var query = `/v1/forms/${form_name}`;
            var oFormObject = await deluxe_adsrestapi.get(query);
            var sXMLTemplate = oFormObject.templates[0].xdpTemplate;

            var DCPBarcode = req?.data?.DCPBarcode;
            var Title, Studio, VersionDescription, TotalSize, RatingCount, FeatureCount, TrailerCount, Content = [];
            if (DCPBarcode) {
                var oAssetVault = await SELECT.one.from('DistributionService.DistributionDcp', (dist)=>{
                    dist.Title,
                    dist.VersionDescription,
                    dist.KrakenTitleID,
                    dist.AssetMapFileSize,
                    dist._Items((items)=>{
                        items.LinkedCTT,
                        items.StartOfCrawl,
                        items.LinkedCPLUUID,
                        items.RunTime,
                        items.StartOfCredits
                    })
                }).where({DCP: DCPBarcode});

                var aItems = oAssetVault?._Items;
                var aFeatureItems = aItems?.filter((item)=>{
                    return item?.LinkedCTT?.toUpperCase().includes('FTR');
                });
                await aFeatureItems?.forEach(element => {
                    Content.push({"ContentText":`${element.LinkedCTT} Duration:${element.RunTime} Start Of Credits:${element.StartOfCredits} Crawl:${element.StartOfCrawl}`});
                });                
                FeatureCount = aFeatureItems?.length;

                var aRatingItems = aItems?.filter((item)=>{
                    return item?.LinkedCTT?.toUpperCase().includes('RTG');
                });
                await aRatingItems?.forEach(element => {
                    Content.push({"ContentText":`${element.LinkedCTT} Duration:${element.RunTime} Start Of Credits:${element.StartOfCredits} Crawl:${element.StartOfCrawl}`});
                });
                RatingCount = aRatingItems?.length;

                var aTrailerItems = aItems?.filter((item)=>{
                    return item?.LinkedCTT?.toUpperCase().includes('TRL');
                });
                await aTrailerItems?.forEach(element => {
                    Content.push({"ContentText":`${element.LinkedCTT} Duration:${element.RunTime} Start Of Credits:${element.StartOfCredits} Crawl:${element.StartOfCrawl}`});
                });
                TrailerCount = aTrailerItems?.length;

                VersionDescription = oAssetVault?.VersionDescription;
                Title = oAssetVault?.Title;
                TotalSize = oAssetVault?.AssetMapFileSize;

                var distroSpecData = await SELECT.one.from('DistributionService.DistroSpec', (dist) => {
                    dist.DistroSpecUUID,
                        dist.DistroSpecID,
                        dist.Title_Product,
                        dist.Name,
                        dist.to_StudioKey((studio) => {
                            studio.Studio_BusinessPartner
                        })
                }).where({ Title_Product: DCPBarcode });
                var sBupa = distroSpecData?.to_StudioKey?.[0]?.Studio_BusinessPartner;

                if (sBupa) {
                    var oBupa = await buspatx.run(SELECT.one.columns(['BusinessPartnerFullName']).from(BusinessPartner).where({ BusinessPartner: sBupa }));
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
        })
    }
}