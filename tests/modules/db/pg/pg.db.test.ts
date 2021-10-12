import * as chai from "chai";
import {testAnswer} from "../../../test.utils";
import {PgDb} from "../../../../app/modules/db/pg.db";
import {DbSchema, IAnswer, MyMethod} from "../../../../app/i/i.structures";
import {PgClient} from "../../../../app/modules/db/src/pg.client";

const assert = chai.assert
let answer: IAnswer, rowId: number

describe("PgDb", () => {
    before(() => require("dotenv").config({path: ".env.public"}))
    afterEach(async () => await deleteAnswer())
    it("save", async () => {
        const db = new PgDb()
        answer = testAnswer(MyMethod.GET)
        const result = await db.save(answer)
        rowId = result.rows[0].id
        assert.typeOf(rowId, "number")
    })
})

async function deleteAnswer(): Promise<void> {
    if(!rowId) return;
    const client = new PgClient()
    const query = `DELETE FROM ${DbSchema.metric} WHERE id = ${rowId}`
    await client.query(query)
}
