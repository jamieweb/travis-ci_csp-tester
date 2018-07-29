const HCCrawler = require('headless-chrome-crawler');
const CSVExporter = require('headless-chrome-crawler/exporter/csv');

const exporter = new CSVExporter({
    file: 'crawled.csv',
    fields: ['response.url', 'response.status', 'links.length']
});

(async () => {
    const crawler = await HCCrawler.launch({
        maxDepth: 4, //Maximum recursion depth
        jQuery: false, //This is required to re-enable the CSP header in Puppeteer
        allowedDomains: [process.argv[2]], //Array of permitted domains (without scheme)
        exporter //Export results as CSV to be printed in log
    });
    await crawler.queue({ url: 'http://' + process.argv[2] + '/' });
    await crawler.onIdle();
    console.log("Crawler Done");
    await crawler.close();
})();
