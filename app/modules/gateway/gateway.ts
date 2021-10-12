import axios from "axios"
import {IGateway} from "../../i/gateway/i.gateway";
import {IAnswer, IRequest} from "../../i/i.structures";

export class Gateway implements IGateway {
    async request(request: IRequest): Promise<IAnswer> {
        const answer = await Gateway.axRequest(request)
        return Gateway.answerFormatting(request, answer)
    }

    private static async axRequest(request: IRequest): Promise<any> {
        try {
            return await axios({method: request.method, url: request.url})
        } catch (error) {
            return typeof error === "object" && error?.response ? error?.response : error
        }
    }

    private static answerFormatting(request: IRequest, answer: any): IAnswer {
        return Gateway.isInnerError(answer) ? Gateway.innerErrorAnswer(request, answer) : Gateway.outerAnswer(request, answer)
    }

    private static innerErrorAnswer(request: IRequest, error: any): IAnswer {
        return {
            createdAt: new Date(),
            statusCode: -1,
            statusText: error && typeof error === "object" ? error.message || "" : "",
            request
        }
    }

    private static outerAnswer(request: IRequest, answer: any): IAnswer {
        return {
            createdAt: new Date(),
            statusCode: +answer.status,
            statusText: answer.statusText ? ("" + answer.statusText).toLowerCase().trim() : "",
            request
        }
    }

    private static isInnerError(error: any): boolean {
        const flag1 = !error && typeof error === "object"
        const flag2 = typeof error !== "object"
        return flag1 || flag2 || error.status === undefined
    }
}