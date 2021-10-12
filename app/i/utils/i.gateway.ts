export interface IGateway {
    get(url: string): Promise<any>
}