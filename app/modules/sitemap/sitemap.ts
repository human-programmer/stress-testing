const convert = require('xml-js')
import {ISitemap} from "../../i/sitemap/i.sitemap";
import {IGateway} from "../../i/utils/i.gateway";

// interface ISplitMap {
//     readonly sitemaps: string[]
//     readonly urls: string
// }

export class Sitemap implements ISitemap {
    constructor(private readonly gateway: IGateway) {}

    async loadSitemap(url: string): Promise<string[]> {
        return await new SitemapLoader(url, this.gateway).load()
    }
}

export class SitemapLoader {
    private readonly sitemaps: string[] = []
    private readonly urls: string[] = []
    constructor(url: string, private readonly gateway: IGateway) {
        this.sitemaps.push(url)
    }

    async load(): Promise<string[]> {
        await this.loadAll()
        return this.urls
    }

    private async loadAll(): Promise<void> {
        const url = this.nextSitemapUrl
        if(!url) return;
        await this.loadUrl(url)
        await this.loadAll()
    }

    private get nextSitemapUrl(): string|null {
        return this.sitemaps.splice(0, 1)[0] || null
    }

    private async loadUrl(url: string): Promise<void> {
        const map = await this.loadMap(url)
        this.saveSitemapUrls(map)
        this.saveUrls(map)
    }

    private async loadMap(url: string): Promise<any> {
        const doc = await this.getDoc(url)
        return  SitemapLoader.parseXml(doc)
    }

    private async getDoc(url: string): Promise<string> {
        const answer =  await this.gateway.get(url)
        return answer?.data || ""
    }

    private static async parseXml(doc: string): Promise<any> {
        const jsonData = convert.xml2json(doc, {compact: true, spaces: 4});
        return JSON.parse(jsonData)
    }

    private saveSitemapUrls(map: any): void {
        const urls = map.sitemapindex?.sitemap?.map(i => i?.loc?._text).filter(i => i) || []
        this.sitemaps.push(...urls)
    }

    private saveUrls(map: any): void {
        const urls = map.urlset?.url?.map(i => i?.loc?._text).filter(i => i) || []
        this.urls.push(...urls)
    }
}