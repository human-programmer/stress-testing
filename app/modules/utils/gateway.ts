import axios from "axios"
import {IGateway} from "../../i/utils/i.gateway";

export class Gateway implements IGateway {
    async get(url: string): Promise<any> {
        return await axios.get(url)
    }
}