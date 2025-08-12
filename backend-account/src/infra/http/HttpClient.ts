import axios from "axios";

export default interface HttpClient {
    post (url: string, body: any): Promise<any>;
}

export class AxiosAdapter implements HttpClient {

    async post(url: string, body: any): Promise<any> {
        const response = await axios.post(url, body);
        return response.data;
    }

}
