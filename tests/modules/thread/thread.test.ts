import * as chai from "chai";
import {Thread} from "../../../app/modules/thread/thread";
import {testOptions} from "../../test.utils";
import {MyMethod, TestMode} from "../../../app/i/i.structures";

const assert = chai.assert

describe("Thread", function () {
    this.timeout(10000)
    before(() => require("dotenv").config({path: ".env.public"}))
    it("run with", async () => {
        const thread = Thread.create(testOptions(TestMode.target_url), ["https://www.google.by/"], MyMethod.GET)
        await thread.run()
        assert.equal(thread.endedRequests, 9)
    })
})