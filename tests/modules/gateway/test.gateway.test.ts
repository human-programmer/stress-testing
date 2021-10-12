import * as chai from "chai";
import {MyMethod} from "../../../app/i/i.structures";
import {TestGateway} from "../../../app/modules/test.gateway/test.gateway";
import {testRequest} from "../../test.utils";

const assert = chai.assert

describe("TestGateway", () => {
    it("GET request", async () => {
        const gateway = new TestGateway()
        const request = testRequest(MyMethod.GET)
        const answer = await gateway.request(request)
        assert(!!answer)
    })
})