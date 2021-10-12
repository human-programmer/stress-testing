import {IAnswer} from "../i.structures";

export interface IDb {
    init(): Promise<void>
    save(answer: IAnswer): Promise<any>
}