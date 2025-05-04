import lighthouse from "lighthouse";
import axios from "axios";
const targetUrl = process.env.TARGET_URL;
const metricsApi = process.env.METRICS_API;
const renderingType = process.env.RENDERING_TYPE;
console.log("TARGET_URL:", process.env.TARGET_URL);
if (!targetUrl || !metricsApi || !renderingType) {
    console.error('Missing environment variables: TARGET_URL/METRICS_API/RENDERING_TYPE');
    process.exit(1);
}
function round(value) {
    return parseFloat(Number(value).toFixed(2));
}
async function runAudit() {
    const options = {
        port: 3000,
        hostname: 'chrome',
        onlyCategories: ['performance', 'accessibility', 'seo'],
        onlyAudits: ['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'speed-index', 'total-blocking-time'],
        output: 'json',
    };
    const runnerResult = await lighthouse(targetUrl, options);
    const lhr = runnerResult?.lhr;
    if (lhr) {
        const report = {
            performance: round(lhr.categories.performance.score),
            accessibility: round(lhr.categories.accessibility.score),
            seo: round(lhr.categories.seo.score),
            firstContentfulPaint: round(lhr.audits['first-contentful-paint'].numericValue),
            largestContentfulPaint: round(lhr.audits['largest-contentful-paint'].numericValue),
            cumulativeLayoutShift: round(lhr.audits['cumulative-layout-shift'].numericValue),
            speedIndex: round(lhr.audits['speed-index'].numericValue),
            totalBlockingTime: round(lhr.audits['total-blocking-time'].numericValue),
        };
        console.log("Type:", renderingType);
        console.log("Report:", report);
        return;
        const payload = {
            operating_system: 'Windows',
            rendering_type: renderingType,
            report: report,
        };
        console.log("Payload:", payload);
        try {
            await axios.post(metricsApi, payload);
            console.log("Lighthouse report sent successfully to metrics API.");
        }
        catch (err) {
            console.error("Failed to send report to metrics API:", err);
        }
    }
}
runAudit().catch((err) => {
    console.error("Lighthouse audit failed:", err);
    process.exit(1);
});
