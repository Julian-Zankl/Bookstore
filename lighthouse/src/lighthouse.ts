import lighthouse, { OutputMode } from "lighthouse";
import axios from "axios";

const targetUrl = process.env.TARGET_URL;
const metricsApi = process.env.METRICS_API;
const hostOS = process.env.HOST_OS;
const renderingType = process.env.RENDERING_TYPE;

if (!targetUrl || !metricsApi || !hostOS) {
  console.error(
    "Missing environment variables: TARGET_URL and/or METRICS_API and/or HOST_OS",
  );
  process.exit(1);
}

async function runAudit() {
  const options = {
    port: 3000,
    hostname: "chrome",
    output: "json" as OutputMode,
  };
  const runnerResult = await lighthouse(targetUrl, options);
  const lhr = runnerResult?.lhr;
  const report = runnerResult?.report as string;

  console.log("Runner result:", runnerResult);

  const scores = {
    performance: lhr?.categories.performance?.score,
    accessibility: lhr?.categories.accessibility?.score,
    seo: lhr?.categories.seo?.score,
  };

  console.log("Scores:", scores);

  const metrics = {
    firstContentfulPaint: lhr?.audits["first-contentful-paint"]?.numericValue, // in ms
    largestContentfulPaint: lhr?.audits["largest-contentful-paint"]
      ?.numericValue, // in ms
    cumulativeLayoutShift: lhr?.audits["cumulative-layout-shift"]?.numericValue, // unitless
    speedIndex: lhr?.audits["speed-index"]?.numericValue, // in ms
    totalBlockingTime: lhr?.audits["total-blocking-time"]?.numericValue, // in ms
  };

  console.log("Metrics:", metrics);

  const payload = {
    operating_system: hostOS,
    rendering_type: renderingType,
    report: report,
    timestamp: new Date().toISOString(),
  };

  try {
    await axios.post(metricsApi!, payload);
    console.log("Lighthouse report sent successfully to metrics API.");
  } catch (err) {
    console.error("Failed to send report to metrics API:", err);
  }
}

runAudit().catch((err) => {
  console.error("Lighthouse audit failed:", err);
  process.exit(1);
});
