import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { image } = req.body;
  if (!image) return res.status(400).json({ error: "No image provided" });

  try {
    const apiKey = process.env.GOOGLE_VISION_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Google Vision API key not set" });
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [
          {
            image: { content: image.replace(/^data:image\/jpeg;base64,/, "") },
            features: [{ type: "WEB_DETECTION", maxResults: 5 }],
          },
        ],
      }
    );
    const webDetection = response.data.responses[0].webDetection;
    res.json({ webDetection });
  } catch (err) {
    let message = "Unknown error";
    if (err && typeof err === "object" && "message" in err) {
      message = (err as any).message;
    }
    res.status(500).json({ error: "Failed to recognize image", details: message });
  }
} 