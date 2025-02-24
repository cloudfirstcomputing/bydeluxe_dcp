const cds = require("@sap/cds");
const { v4: uuidv4 } = require('uuid'); // Import UUID package
const xmljs = require("xml-js");
const { Readable } = require('stream');

module.exports = class AssetVaultService extends cds.ApplicationService {
    async init() {

        var deluxe_adsrestapi = await cds.connect.to("deluxe-ads-rest-api");


        this.on("READ","MediaFiles",async (req, res) => {
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
        return stream ;
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