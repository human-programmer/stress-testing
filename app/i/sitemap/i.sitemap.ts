export interface ISitemap {
    loadSitemap(url: string): Promise<string[]>
}