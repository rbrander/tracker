import type { NextApiRequest, NextApiResponse } from "next";
import { TrackingPosition } from "@/types/TrackingPosition";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const id = parseInt(req.query.id as string);
    console.log("GET /trip/" + id);
    let data: TrackingPosition[] = [];
    try {
      const fileContents: string = fs.readFileSync("data.json", {
        encoding: "utf8",
      });
      const parsedFile: TrackingPosition[][] = JSON.parse(fileContents);
      data = parsedFile[id] ?? [];
    } catch (error) {
      data = [];
    }
    console.log(`successfully read file; found ${data.length} trips`);
    res.status(200).json(data);
    return;
  }
  res.status(404).end();
}
