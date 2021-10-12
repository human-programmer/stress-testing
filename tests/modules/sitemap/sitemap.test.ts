import * as chai from "chai";
import {Gateway} from "../../../app/modules/utils/gateway";
import {SitemapLoader} from "../../../app/modules/sitemap/sitemap";
const dotenv = require("dotenv")

const assert = chai.assert

describe("Sitemap", function () {
    this.timeout(5000)
    before(() => {
        dotenv.config({path: ".env.public"})
        dotenv.config({path: ".env.private"})
    })
    it("loadSitemap", async () => {
        const gateway = new Gateway()
        const loader = new SitemapLoader(process.env.SITEMAP_URL || "", gateway)
        const urls = await loader.load()
        assert(urls.length > 0)
    })
})