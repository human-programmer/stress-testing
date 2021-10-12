import {IOptions, MyMethod, TestMode} from "../i/i.structures";
import {Thread} from "./thread/thread";
import {SitemapLoader} from "./sitemap/sitemap";
import {IGateway} from "../i/utils/i.gateway";
import {Gateway} from "./utils/gateway";

export class MyTest {
    private readonly gateway: IGateway
    constructor(private readonly options: IOptions,
                private readonly urls: string[]) {
        this.gateway = new Gateway()
    }

    async start(): Promise<void> {
        if(this.options.testMode === TestMode.sitemap) return await this.sitemapMode()
        await this.targetUrlMode(this.urls)
    }

    private async sitemapMode(): Promise<void> {
        const urls = await this.loadUrls()
        await this.targetUrlMode(urls)
    }

    private async loadUrls(): Promise<string[]> {
        const promises = await Promise.all(this.urls.map(url => new SitemapLoader(url, this.gateway).load()))
        return promises.flatMap(i => i).filter(i => i)
    }

    private async targetUrlMode(urls: string[]): Promise<void> {
        const thread = Thread.create(this.options, urls, MyMethod.GET)
        await thread.run()
    }
}