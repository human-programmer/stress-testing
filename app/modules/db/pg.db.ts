import {IDb} from "../../i/db/i.db";
import {PgClient} from "./src/pg.client";
import {DbSchema, IAnswer} from "../../i/i.structures";

export class PgDb implements IDb {
    private readonly client: PgClient

    constructor() {
        this.client = new PgClient()
    }

    init(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async save(answer: IAnswer): Promise<any> {
        const query = this.assembleQuery(answer)
        return await this.client.query(query)
    }

    private assembleQuery(answer: IAnswer): string {
        const values = PgDb.toValues(answer)
        return this.client.pgFormat(PgDb.query, values)
    }


    private static get query(): string {
        return `INSERT INTO ${DbSchema.metric} (url, method, request_time, answer_time, status_code, status_text) VALUES (%L) RETURNING id`
    }

    private static toValues(answer: IAnswer): any[] {
        return [
            answer.request.url,
            answer.request.method,
            answer.request.createdAt,
            answer.createdAt,
            answer.statusCode,
            answer.statusText
        ]
    }
}