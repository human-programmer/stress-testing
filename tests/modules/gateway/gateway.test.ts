import * as chai from "chai";
import {MyMethod} from "../../../app/i/i.structures";
import {Gateway} from "../../../app/modules/gateway/gateway";
import {testRequest} from "../../test.utils";

const assert = chai.assert

describe("Gateway", () => {
    it("GET request", async () => {
        const gateway = new Gateway()
        const request = testRequest(MyMethod.GET)
        const answer = await gateway.request(request)
        assert(!!answer)
    })
})