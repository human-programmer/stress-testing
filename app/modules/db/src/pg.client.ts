import {Client} from "pg"
var format = require('pg-format')

export class PgClient {
    private static client: Client

    static async ini(): Promise<void> {
        await PgClient.loadClient()
    }

    private static async loadClient(): Promise<void> {
        if(PgClient.client) return;
        PgClient.client = new Client()
        await PgClient.client.connect()
    }

    async query(query: string, variables?: any[]): Promise<any> {
        PgClient.client || await PgClient.ini()
        try {
            return await PgClient.client.query(query, variables)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    pgFormat(query: string, values: any[]): string {
        return format(query, values)
    }
}