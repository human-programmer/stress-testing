import {IOptions, TestMode} from "./i/i.structures";
import {MyTest} from "./modules/my.test";

require("dotenv").config({path:".env.public"})
require("dotenv").config({path:".env.private"})

// @ts-ignore
async function sitemapTest(): Promise<void> {
    const options = createOptions(TestMode.sitemap)
    const urls = [process.env.SITEMAP_URL || ""]
    await new MyTest(options, urls).start()
    console.log("\nEND")
    process.exit()
}

// @ts-ignore
async function targetUrlTest(): Promise<void> {
    const options = createOptions(TestMode.target_url)
    const urls = [process.env.TARGET_URL || ""]
    await new MyTest(options, urls).start()
    console.log("\nEND")
    process.exit()
}


targetUrlTest()
// sitemapTest()


function createOptions(testMode: TestMode): IOptions {
    return {
        rampApPeriodSec: 640,
        rps: 80,
        testDurationSec: 700,
        threads: 1,
        testMode
    }
}