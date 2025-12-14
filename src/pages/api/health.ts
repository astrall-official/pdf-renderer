import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  status: string;
  timestamp: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  return res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
