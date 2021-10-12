import * as chai from "chai";
import {Thread} from "../../../app/modules/thread/thread";
import {testOptions, testRequest} from "../../test.utils";
import {MyMethod} from "../../../app/i/i.structures";

const assert = chai.assert

describe("Thread", function () {
    this.timeout(10000)
    before(() => require("dotenv").config({path: ".env.public"}))
    it("run", async () => {
        const thread = Thread.create(testOptions(), testRequest(MyMethod.GET))
        await thread.run()
        assert.equal(thread.endedRequests, 5)
    })
})