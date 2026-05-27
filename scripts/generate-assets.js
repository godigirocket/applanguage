const fs = require("fs");
const path = require("path");
const https = require("https");

// A placeholder script to generate high-quality 3D assets for Langlume using OpenAI DALL-E 3.
// Usage: node generate-assets.js
// Note: Requires OPENAI_API_KEY environment variable.

const API_KEY = process.env.OPENAI_API_KEY;

const ASSETS_TO_GENERATE = [
  {
    name: "mascot-happy",
    prompt:
      "A high quality 3D render of a cute firefly mascot named Lume, smiling happily. Disney Pixar style, vibrant colors, clear background, highly detailed.",
  },
  {
    name: "mascot-thinking",
    prompt:
      "A high quality 3D render of a cute firefly mascot named Lume, looking thoughtful with a glowing tail. Disney Pixar style, vibrant colors, clear background, highly detailed.",
  },
  {
    name: "mascot-celebrating",
    prompt:
      "A high quality 3D render of a cute firefly mascot named Lume, celebrating with confetti and a bright glowing tail. Disney Pixar style, vibrant colors, clear background, highly detailed.",
  },
  {
    name: "culture-brazil",
    prompt:
      "A beautiful highly detailed 3D illustration of Christ the Redeemer and Sugarloaf mountain in Rio de Janeiro, Brazil. Vibrant colors, stylized like a premium video game, sunset lighting.",
  },
  {
    name: "culture-japan",
    prompt:
      "A beautiful highly detailed 3D illustration of Mount Fuji and cherry blossoms in Japan. Vibrant colors, stylized like a premium video game, spring lighting.",
  },
];

const OUTPUT_DIR = path.join(__dirname, "../public/assets/generated");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateImage(prompt, filename) {
  if (!API_KEY) {
    console.warn("⚠️ OPENAI_API_KEY not found. Skipping generation for:", filename);
    return;
  }

  console.log(`Generating image for: ${filename}...`);

  const data = JSON.stringify({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  const options = {
    hostname: "api.openai.com",
    path: "/v1/images/generations",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const req = https.request(options, (res) => {
    let body = "";

    res.on("data", (chunk) => {
      body += chunk;
    });

    res.on("end", () => {
      try {
        const response = JSON.parse(body);
        if (response.data && response.data.length > 0) {
          const imageUrl = response.data[0].url;
          downloadImage(imageUrl, path.join(OUTPUT_DIR, `${filename}.png`));
        } else {
          console.error("Failed to generate image:", response);
        }
      } catch (e) {
        console.error("Error parsing response:", e);
      }
    });
  });

  req.on("error", (e) => {
    console.error("Request error:", e);
  });

  req.write(data);
  req.end();
}

function downloadImage(url, dest) {
  const file = fs.createWriteStream(dest);
  https
    .get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`✅ Saved ${dest}`);
      });
    })
    .on("error", (err) => {
      fs.unlink(dest, () => {});
      console.error(`Error downloading image: ${err.message}`);
    });
}

async function run() {
  console.log("Starting Langlume 3D Asset Generation Pipeline...");
  for (const asset of ASSETS_TO_GENERATE) {
    await generateImage(asset.prompt, asset.name);
    // Add delay to respect API rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

run();
