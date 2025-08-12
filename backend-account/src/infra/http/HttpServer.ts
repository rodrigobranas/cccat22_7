import express, { Request, Response } from "express";
import cors from "cors";

export default interface HttpServer {
    route (method: string, url: string, callback: Function): void;
    listen (port: number): void;
}

// Framework and Driver
export class ExpressAdapter implements HttpServer {
    app: any;

    constructor () {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors());
    }

    route(method: string, url: string, callback: Function): void {
        this.app[method](url, async (req: Request, res: Response) => {
            const params = req.params;
            const body = req.body;
            try {
                const output = await callback(params, body);
                res.json(output);
            } catch (e: any) {
                console.error(e);
                res.status(422).json({
                    message: e.message
                });
            }
        });
    }

    listen(port: number): void {
        this.app.listen(port);
    }

}
