import {IAnswer, IRequest} from "../i.structures";

export interface ITestGateway {
    request(request: IRequest): Promise<IAnswer>
}