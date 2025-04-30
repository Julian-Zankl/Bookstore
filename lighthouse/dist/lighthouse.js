import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import axios from 'axios';
const targetUrl = process.env.TARGET_URL;
const metricsApi = process.env.METRICS_API;
const hostOS = process.env.HOST_OS;
if (!targetUrl || !metricsApi || !hostOS) {
    console.error('Missing environment variables: TARGET_URL and/or METRICS_API and/or HOST_OS');
    process.exit(1);
}
async function runAudit() {
    const chrome = await chromeLauncher.launch({ port: 3002, chromeFlags: [
            '--headless',
            '--no-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
        ] });
    const options = { port: chrome.port, output: 'json' };
    const runnerResult = await lighthouse(targetUrl, options);
    const reportJson = runnerResult?.report;
    const scores = {};
    console.log(reportJson);
    for (const [key, category] of Object.entries(runnerResult.lhr.categories)) {
        // @ts-ignore
        scores[key] = category.score;
    }
    const payload = {
        operating_system: hostOS,
        rendering_type: 'CSR',
        report: reportJson,
        timestamp: new Date().toISOString(),
    };
    try {
        await axios.post(metricsApi, payload);
        console.log('Lighthouse report sent successfully to metrics API.');
    }
    catch (err) {
        console.error('Failed to send report to metrics API:', err);
    }
    console.log('Full Lighthouse JSON report:');
    console.log(JSON.stringify(JSON.parse(reportJson), null, 2));
    await chrome.kill();
}
runAudit().catch(err => {
    console.error('Lighthouse audit failed:', err);
    process.exit(1);
});
