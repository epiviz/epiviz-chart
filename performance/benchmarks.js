const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  const start = Date.now();
  await page.goto('http://localhost:8081/components/epiviz-charts/performance/index-test.html', 
        {waitUntil: 'networkidle0'});
  const end = Date.now();
  console.log("before loading Page : " + start);
  console.log("After Page Load : " + end);
  console.log("Total Elapsed Time : " + (end - start));
  const metrics = await page.metrics();
  console.log(JSON.stringify(metrics));
  await page.screenshot({path: 'test.png'});
  await browser.close();
})();