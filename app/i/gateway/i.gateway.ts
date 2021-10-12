import {IAnswer, IRequest} from "../i.structures";

export interface IGateway {
    request(request: IRequest): Promise<IAnswer>
}