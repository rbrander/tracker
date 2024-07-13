import type { NextApiRequest, NextApiResponse } from "next";
import { TrackingPosition } from "@/types/TrackingPosition";
import fs from "fs";

const saveData = (data: TrackingPosition[]) => {
  // read the existing file data
  let fileData = [];
  try {
    console.log("reading file...");
    const file = fs.readFileSync("data.json", { encoding: "utf8" });
    fileData = JSON.parse(file);
    console.log(`successfully read file; found ${fileData.length} trips`);
  } catch (error) {
    console.log("no file found");
    fileData = [];
  }
  // add data to the file data
  fileData.push(data);
  // save the file data
  try {
    fs.writeFileSync("data.json", JSON.stringify(fileData), {
      encoding: "utf8",
    });
    console.log("successfully saved file data");
  } catch (error) {
    console.error(error);
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  // maxDuration: 5,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log("POST /trip");
    const data: TrackingPosition[] = JSON.parse(req.body);
    saveData(data);
    res.status(200).end();
    return;
  } else if (req.method === "GET") {
    console.log("GET /trip");
    const file = fs.readFileSync("data.json", { encoding: "utf8" });
    res.status(200).json(JSON.parse(file));
    return;
  }
  res.status(404).end();
}
