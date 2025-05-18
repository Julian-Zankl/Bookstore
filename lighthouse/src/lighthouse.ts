import lighthouse from "lighthouse";
import axios from "axios";

const targetUrl = process.env.TARGET_URL;
const renderingType = process.env.RENDERING_TYPE;
const os = process.env.HOST_OS;
const iterationGroup = process.env.ITERATION_GROUP;
const page = process.env.PAGE;
const throttlingMethod = process.env.THROTTLING_METHOD;

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

interface Payload {
  operating_system: string,
  rendering_type: string,
  report: LighthouseReport;
  iteration_group: number,
  page: string,
  throttling_method: ThrottlingMethod;
}

type ThrottlingMethod = 'simulate' | 'devtools' | 'provided';

function round(value: number | null | undefined): number {
  return parseFloat(Number(value).toFixed(2));
}

function hasValidEnvironment(): boolean {
  return Boolean(targetUrl && renderingType && os && iterationGroup && page && throttlingMethod);
}

async function runAudit() {
  if (!hasValidEnvironment()) {
    console.error('Missing environment variables');
    process.exit(1);
  }

  const options = {
    port: 3000,
    hostname: 'chrome',
  };

  const config = {
    extends: 'lighthouse:default',
    settings: {
      onlyCategories: ['performance', 'accessibility', 'seo'],
      onlyAudits: ['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'speed-index', 'total-blocking-time'],
      throttlingMethod: throttlingMethod as ThrottlingMethod
    }
  }

  const runnerResult = await lighthouse(targetUrl, options, config);
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

    const payload: Payload = {
      operating_system: os!,
      rendering_type: renderingType!,
      report: report!,
      iteration_group: parseInt(iterationGroup!),
      page: page!,
      throttling_method: throttlingMethod as ThrottlingMethod
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
