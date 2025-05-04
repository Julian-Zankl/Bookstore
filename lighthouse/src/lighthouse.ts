import lighthouse, { OutputMode } from "lighthouse";
import axios from "axios";

const targetUrl = process.env.TARGET_URL;
const renderingType = process.env.RENDERING_TYPE;
const os = process.env.HOST_OS;

if (!targetUrl || !renderingType) {
  console.error('Missing environment variables: TARGET_URL/RENDERING_TYPE');
  process.exit(1);
}

interface LighthouseReport {
  performance: number;
  accessibility: number;
  seo: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  speedIndex: number;
  totalBlockingTime: number;
}

function round(value: number | null | undefined): number {
  return parseFloat(Number(value).toFixed(2));
}

async function runAudit() {
  const options = {
    port: 3000,
    hostname: 'chrome',
    onlyCategories: ['performance', 'accessibility', 'seo'],
    onlyAudits: ['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'speed-index', 'total-blocking-time'],
    output: 'json' as OutputMode,
  };
  const runnerResult = await lighthouse(targetUrl, options);
  const lhr = runnerResult?.lhr;

  if (lhr) {
    const report: LighthouseReport = {
      performance: round(lhr.categories.performance.score) * 100,
      accessibility: round(lhr.categories.accessibility.score) * 100,
      seo: round(lhr.categories.seo.score) * 100,
      firstContentfulPaint: round(lhr.audits['first-contentful-paint'].numericValue),
      largestContentfulPaint: round(lhr.audits['largest-contentful-paint'].numericValue),
      cumulativeLayoutShift: round(lhr.audits['cumulative-layout-shift'].numericValue),
      speedIndex: round(lhr.audits['speed-index'].numericValue),
      totalBlockingTime: round(lhr.audits['total-blocking-time'].numericValue),
    }

    const payload = {
      operating_system: os,
      rendering_type: renderingType,
      report: report,
    };
  
    console.log("Payload:", payload);
  
    try {
      await axios.post("http://metrics:3001/metrics", payload);
      console.log("Lighthouse report sent successfully to metrics API.");
    } catch (err) {
      console.error("Failed to send report to metrics API:", err);
    }
  }
}

runAudit().catch((err) => {
  console.error("Lighthouse audit failed:", err);
  process.exit(1);
});
