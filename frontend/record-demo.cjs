const { chromium } = require("playwright");
const { spawn } = require("child_process");

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });

  const context = await browser.newContext({
    viewport: {
      width: 1440,
      height: 900,
    },
  });

  const page = await context.newPage();

  console.log("Opening VoxShield...");

  await page.goto("http://localhost:5173", {
    waitUntil: "networkidle",
  });

  await page.waitForTimeout(2000);

  console.log("Opening Live Detection...");

  await page.goto("http://localhost:5173/live", {
    waitUntil: "networkidle",
  });

  await page.waitForTimeout(3000);

  console.log("Starting screen recording...");

  const ffmpeg = spawn("ffmpeg", [
    "-y",

    // Windows desktop capture
    "-f",
    "gdigrab",

    // Capture the full desktop
    "-framerate",
    "30",

    "-i",
    "desktop",

    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-pix_fmt",
    "yuv420p",

    "VoxShield_Demo.mp4",
  ]);

  ffmpeg.stderr.on("data", (data) => {
    const message = data.toString();

    if (message.includes("frame=")) {
      process.stdout.write("\rRecording...");
    }
  });

  await page.waitForTimeout(2000);

  console.log("\nStarting VoxShield demo...");

  const startButton = page.getByRole("button", {
    name: /Start Live Demo/i,
  });

  await startButton.click();

  console.log("Demo running...");

  // Current Live Detection demo reaches CRITICAL at ~20 seconds.
  await page.waitForTimeout(26000);

  console.log("\nCritical alert reached.");

  // Keep the alert visible for the video.
  await page.waitForTimeout(5000);

  console.log("Stopping recording...");

  ffmpeg.kill("SIGINT");

  await new Promise((resolve) => {
    ffmpeg.on("close", resolve);
  });

  await context.close();
  await browser.close();

  console.log("\nDone!");
  console.log("Video: VoxShield_Demo.mp4");
})();