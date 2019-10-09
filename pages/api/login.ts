import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    console.log("authentication");
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify({ name: "Nextjs" }));
  } else {
    res.statusCode = 400;
    res.end("not allowed");
  }
};
