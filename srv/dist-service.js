const cds = require("@sap/cds");
const axios = require('axios');
const { uuid } = cds.utils

module.exports = class DistributionService extends cds.ApplicationService {
    async init() {
        const { DistroSpec, ShippingType, Regions, GeoRegions, Plants, Characteristic, CustomerGroup, Country, ShippingConditions, Products, SalesDistricts, DCPMapProducts,
            StorageLocations, ProductGroup, TitleV, ProductGroup1, CplList, CPLDetail, Parameters, SalesOrganizations, DistributionChannels, DCPProducts, Titles, Studios, Theaters, DeliveryPriority } = this.entities
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
        const paramtx = await cds.connect.to('YY1_PARAMETER_CDS')
        const shiptyptx = await cds.connect.to("YY1_I_SHIPPINGTYPE_CDS_0001");
        const prdgrptx = await cds.connect.to("API_PRODUCTGROUP_SRV");
        const prdgrp1tx = await cds.connect.to("YY1_ADDITIONALMATERIALGRP1_CDS");
        const charactx = await cds.connect.to("YY1_CLFNCHARACTERISTIC_CDS");
        const bpstx = await cds.connect.to("ZAPI_BUSINESSPARTNERS");
        const prdtx = await cds.connect.to("ZCL_PRODUCT_VH");
        const charsttx = await cds.connect.to("YY1_CHARACTERISTIC_ST_CDS");
        const charsftx = await cds.connect.to("YY1_CHARACTERISTIC_SF_CDS");
        const charmstx = await cds.connect.to("YY1_CHARACTERISTIC_MS_CDS");
        const charmftx = await cds.connect.to("YY1_CHARACTERISTIC_MFRS_CDS");
        const charlltx = await cds.connect.to("YY1_CHARACTERISTIC_LL_CDS");
        const charfftx = await cds.connect.to("YY1_CHARACTERISTIC_FF_CDS");
        const chardttx = await cds.connect.to("YY1_CHARACTERISTIC_DT_CDS");
        const chardgtx = await cds.connect.to("YY1_CHARACTERISTIC_DG_CDS");
        const charartx = await cds.connect.to("YY1_CHARACTERISTIC_AR_CDS");

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

        const uniquePriority = arr => {
            const resArr = []
            const lookup = arr.reduce((a, e) => {
                a[e.Priority] = ++a[e.Priority] || 0;
                return a;
            }, {});
            for (const key in lookup) {
                if (Object.prototype.hasOwnProperty.call(lookup, key)) {
                    const element = lookup[key];
                    if (element > 0) {
                        const packs = arr.filter(item => item.Priority === Number(key))
                        for (let index = 0; index < packs.length; index++) {
                            const pack1 = packs[index];
                            for (let x = 0; x < packs.length; x++) {
                                if (index === x) continue
                                let char = String(index) + String(x)
                                let resIndx = resArr.findIndex(item => item === char.split("").reverse().join(""))
                                if (resIndx >= 0) continue
                                const pack2 = packs[x];
                                if (pack1.ValidFrom <= pack2.ValidFrom && pack2.ValidFrom <= pack1.ValidTo) {
                                    return `${pack1.PackageName} ${pack2.PackageName}`
                                }
                                resArr.push(char)
                            }
                        }
                    }
                }
            }
        }

        this.before('CREATE', DistroSpec, async req => {
            let { maxID } = await SELECT.one(`max(DistroSpecID) as maxID`).from(DistroSpec)
            req.data.DistroSpecID = ++maxID
            req.data.FieldControl = 1
            const titlev = await SELECT.one.from(TitleV).where({ MaterialMasterTitleID: req.data.Title_Product })
            req.data.ReleaseDate = titlev?.ReleaseDate
            req.data.RepertoryDate = titlev?.RepertoryDate

        })

        this.before("NEW", `StudioKey.drafts`, async (req) => {
            req.data.Studio_BusinessPartner = '1000011'
            req.data.KeyStartTime = '00:01:00'
            req.data.KeyEndTime = '02:00:00'
            req.data.OffsetBPD = 24
            req.data.OffsetEPD = 24
            req.data.InitialKeyDuration = 13
            req.data.NextKeyDuration = 6
            req.data.ProcessKDMS = 24
        })

        // this.on('UPDATE', DistroSpec.drafts, async req => {
        //     if (req.data.Title) {

        //     }
        // })

        this.on("READ", `StudioKey`, async (req, next) => {
            if (!req.query.SELECT.columns) return next();
            const fields = ["Studio_BusinessPartner"]
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
                        records = await bpstx.run(SELECT.from(Studios).where({ BusinessPartner: ids }))

                        break;

                    // case "SalesTerritory_SalesDistrict":
                    //     const rec = asArray(await salesdisttx.run(SELECT.from(SalesDistricts)
                    //         .columns(["SalesDistrict", { "ref": ["to_Text"], "expand": ["*"] }])
                    //         .where({ SalesDistrict: ids })))
                    //     records = rec.map(item => {
                    //         return { SalesDistrict: item.SalesDistrict, Name: item.to_Text.find(text => text.Language === req.locale.toUpperCase()).SalesDistrictName }
                    //     })
                    //     break;

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
                        records = asArray(await prdtx.run(SELECT.from(Titles).where({ Product: ids })))

                        break;
                    case "DeliverySequence1_ShippingCondition": case "DeliverySequence2_ShippingCondition":
                    case "DeliverySequence3_ShippingCondition": case "DeliverySequence7_ShippingCondition":
                    case "DeliverySequence4_ShippingCondition": case "DeliverySequence8_ShippingCondition":
                    case "DeliverySequence5_ShippingCondition": case "DeliverySequence9_ShippingCondition":
                    case "DeliverySequence6_ShippingCondition": case "DeliverySequence10_ShippingCondition":
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
        this.on("READ", [`DistRestrictions`, `KeyDistRestrictions`], async (req, next) => {
            if (!req.query.SELECT.columns) return next();
            const fields = ["Circuit_CustomerGroup"]
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

                    // case "DistributionFilterRegion_ID":
                    //     records = await SELECT.from(GeoRegions).where({ ID: ids })

                    //     break;
                    default:
                        break;
                }

                for (const record of records)
                    maps[record[element[1]]] = record;

                for (const note of asArray(response)) {
                    note[element[0]] = maps[note[processedField[index]]];
                }
            }

            return response;
        })

        // Package?$expand
        this.on("READ", [`Package`], async (req, next) => {
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
                    case "DeliveryMethod1_ShippingCondition": case "DeliveryMethod2_ShippingCondition":
                    case "DeliveryMethod3_ShippingCondition": case "DeliveryMethod7_ShippingCondition":
                    case "DeliveryMethod4_ShippingCondition": case "DeliveryMethod8_ShippingCondition":
                    case "DeliveryMethod5_ShippingCondition": case "DeliveryMethod9_ShippingCondition":
                    case "DeliveryMethod6_ShippingCondition": case "DeliveryMethod10_ShippingCondition":
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
                        records = asArray(await prdtx.run(SELECT.from(DCPProducts).where({ Product: ids })))

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

        // this.after('each', `DCPMaterials`, async req => {
        //     if (req.DCPMaterialNumber_Product) {
        //         const assetvault = await SELECT.one.from(DistributionDcp)
        //             .columns(["*", { "ref": ["_Items"], "expand": ["*"] }])
        //             .where({
        //                 DCP: req.DCPMaterialNumber_Product
        //             })
        //         if (assetvault?._Items?.length > 0) {
        //             req.CTT = assetvault._Items.map(u => u.LinkedCTT).join(`\n`)
        //             req.CPLUUID = assetvault._Items.map(u => u.LinkedCPLUUID).join(`\n`)
        //         }
        //     }
        // })

        this.after('each', `CPLDetail`, async (req) => {
            if (req.CPLUUID) {
                const assetvault = await SELECT.one.from(CplList).where({ LinkedCPLUUID: req.CPLUUID })
                req.CTT = assetvault.LinkedCTT
                req.Email = assetvault.Email
                req.Download = assetvault.Download
            }
        })

        // this.on('setDownloadEmail', async req => {
        //     const { DCP, LinkedCPLUUID } = req.params[3]
        //     const assetvault = await SELECT.one.from(DistributionDcp)
        //         .columns(["*"])
        //         .where({
        //             DCP: DCP
        //         })
        //     if (assetvault) {
        //         await UPDATE('DistributionService.DistributionDcp__Items').with({
        //             Email: req.data.email,
        //             Download: req.data.download
        //         }).where({ up__ProjectID: assetvault.ProjectID, LinkedCPLUUID: LinkedCPLUUID })
        //     }
        // })

        this.on('setDownloadEmail', async req => {
            const { ID } = req.params[2]
            const cpl = await SELECT.one.from(CPLDetail, ID)
            await UPDATE('DistributionService.DistributionDcp__Items').with({
                Email: req.data.email,
                Download: req.data.download
            }).where({ LinkedCPLUUID: cpl.CPLUUID })
        })

        this.before('SAVE', DistroSpec, async req => {
            let ret = uniquePriority(req.data.to_Package)
            if (ret) {
                req.error(400, `Priority should be unique in Content Package: ${ret}`)
            }

            ret = uniquePriority(req.data.to_KeyPackage)
            if (ret) {
                req.error(400, `Priority should be unique in Key Package: ${ret}`)
            }

            await _gofilexcreation(req);
        })

        async function _gofilexcreation(req) {
            var sBearer = await getBearerToken();
            var oGoFilex_DEST = await cds.connect.to("GoFilex_api");
            const headers = {
                Authorization: `Bearer ${sBearer}`
            };
            // const headers = {
            //     "Content-Type": 'application/json',
            //     "accept": 'application/json',
            // };
            // Print PDF code logic
            var sUrl = "/dc-delivery-gofilex-api/v1/gofilex-portals/urn:deluxe:dc-delivery-gofilex:gofilex-portal:56657f4a-0e58-48e6-a425-3fb3567a0484/proxy/api/method/v1/title/add"

            const data = {
                "identifier": {
                    "source": "deluxe",
                    "value": "1073677"
                },
                "name": req.data.to_Package[req.data.to_Package.length - 1].PackageName,
                "releaseDate": req.data.ReleaseDate,
                "ownerId": "HXXA6vm4DQ3Yrddiu",
                "countries": [
                    "US"
                ]
            };

            var oGoFilex = await oGoFilex_DEST.send({
                method: "POST",
                path: sUrl,
                data,
                headers
            });
            req.data.to_Package[req.data.to_Package.length - 1].GofilexTitleID = oGoFilex
            return req
        }


        async function getBearerToken() {
            const tokenUrl = 'https://login.dmlib.in/oauth2/aussw63cpzrSVEZDi0h7/v1/token';

            const username = '0oa25ibcpnkQUlMnj0h8';  // ✅ USERNAME
            const password = 'iwMg6SqEV32qpyGF1sXBaHPqPapiV1LHdWJd84b6mS9vD_NPU4qSaa1oGklq6gGc'; // ✅ USER PASSWORD

            const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

            const data = new URLSearchParams({
                grant_type: 'client_credentials',
                scope: 'dc-sap-btp-proxy',
            });

            var response = await axios.post(tokenUrl, data.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${basicAuth}`
                }
            })
            // .then(response => {
            //   console.log('Access Token:', response.data.access_token);
            // })
            // .catch(error => {
            //   console.error('Error fetching token:', error.response?.data || error.message);
            // });

            return response.data.access_token;

        }

        this.before('NEW', `Package.drafts`, req => {
            req.data.ValidFrom = today()
        })

        this.before('NEW', `KeyPackage.drafts`, req => {
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

        this.on(['READ'], [DCPProducts, Titles, DCPMapProducts], async req => {
            return prdtx.run(req.query)
        })

        this.on('READ', Studios, async req => {
            return bpstx.run(req.query)
        })

        this.on('READ', Theaters, async req => {
            return bpstx.run(req.query)
        })

        this.on('READ', Characteristic, async req => {
            return charactx.run(req.query)
        })

        this.on('READ', ShippingConditions, async req => {
            return sctx.run(req.query)
        })

        this.on('READ', ShippingType, async req => {
            return shiptyptx.run(req.query)
        })

        this.on('READ', ProductGroup, async req => {
            const data = _asArray(await prdgrptx.run(SELECT.from(ProductGroup).columns(["*", { "ref": ["to_Text"], "expand": ["*"] }])))
            return data.map(item => {
                return { MaterialGroup: item.MaterialGroup, Name: item.to_Text.find(text => text.Language === req.locale.toUpperCase()).MaterialGroupName }
            })
        })

        this.on('READ', ProductGroup1, async req => {
            return prdgrp1tx.run(SELECT.from(ProductGroup1).where({ Language: req.locale.toUpperCase() }))
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

        this.on('READ', Parameters, async req => {
            return paramtx.run(req.query)
        })

        this.on('READ', 'PlayBackCapability1', (req) => {
            return charartx.run(req.query)
        })
        this.on('READ', 'PlayBackCapability2', (req) => {
            return chardttx.run(req.query)
        })
        this.on('READ', 'PlayBackCapability3', (req) => {
            return chardgtx.run(req.query)
        })
        this.on('READ', 'PlayBackCapability4', (req) => {
            return charmstx.run(req.query)
        })
        this.on('READ', 'PlayBackCapability5', (req) => {
            return charsftx.run(req.query)
        })
        this.on('READ', 'PlayBackCapability6', (req) => {
            return charfftx.run(req.query)
        })
        this.on('READ', 'PlayBackCapability7', (req) => {
            return charsttx.run(req.query)
        })
        this.on('READ', 'PlayBackCapability8', (req) => {
            return charmftx.run(req.query)
        })
        this.on('READ', 'PlayBackCapability9', (req) => {
            return charlltx.run(req.query)
        })
        this.on('READ', 'PlayBackCapability10', () => {
            return paramtx.run(SELECT.from(Parameters).where({ VariableName: 'PlayBackCapability10' }))
        })

        return super.init()
    }
}
