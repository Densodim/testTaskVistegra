import { Response } from "express";

export function ErrorReadFile(res: Response, value:string) {
    return res.status(500).json({error: `Failed to read ${value} file`});
}

