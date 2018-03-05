const puppeteer = require('puppeteer');

// async function single_run_benchmark(html, file_path, run) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
//   const start = Date.now();
//   await page.goto(html, {waitUntil: 'networkidle0'});
//   const performanceTiming = JSON.parse(
//     await page.evaluate(() => JSON.stringify(window.performance.timing))
//   );
  
//   // const metrics = await page.metrics();
//   // console.log("test-bp-1M metrics : " + JSON.stringify(metrics));

//   await page.screenshot({path: file_path + "-" + run + ".png"});
//   await browser.close();

//   return performanceTiming;
// }

// async function multiple_run_benchmark(html, nruns, file_path) {

//   test_runs = [];
//   datafields = ['responseEnd', 'domInteractive', 'domContentLoadedEventEnd', 'loadEventEnd'];

//   for (var i=0; i < nruns; i++) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
//     // const start = Date.now();
//     await page.goto(html, {waitUntil: 'networkidle0'});
//     const performanceTiming = JSON.parse(
//       await page.evaluate(() => JSON.stringify(window.performance.timing))
//     );
    
//     // const metrics = await page.metrics();
//     // console.log("test-bp-1M metrics : " + JSON.stringify(metrics));
  
//     await page.screenshot({path: file_path + "-" + i + ".png"});
//     await browser.close();
  
//     const navigationStart = performanceTiming.navigationStart;
  
//     const extractedData = {};
//     datafields.forEach(name => {
//       extractedData[name] = performanceTiming[name] - navigationStart;
//     });
  
//     test_runs.push(extractedData);
//   }

//   return test_runs;
// }

// (async() => {
//   console.log("{ '10K': " + JSON.stringify(await multiple_run_benchmark('http://localhost:8081/components/epiviz-charts/performance/tests/test-bp-10K.html',
//     10, './screenshots/test10k')) + "},");
//   console.log("{ '100K': " + JSON.stringify(await multiple_run_benchmark('http://localhost:8081/components/epiviz-charts/performance/tests/test-bp-100K.html',
//     10, './screenshots/test100k')) + "},");
//   console.log("{ '1M': " + JSON.stringify(await multiple_run_benchmark('http://localhost:8081/components/epiviz-charts/performance/tests/test-bp-1M.html',
//     10, './screenshots/test1M')) + "},");
//   console.log("{ '100M': " + JSON.stringify(await multiple_run_benchmark('http://localhost:8081/components/epiviz-charts/performance/tests/test-bp-100M.html',
//     10, './screenshots/test100M')) + "},");
//   console.log("{ 'chr': " + JSON.stringify(await multiple_run_benchmark('http://localhost:8081/components/epiviz-charts/performance/tests/test-bp-chr.html',
//     10, './screenshots/testchr')) + "},");
// })();

// (async () => {
//   console.log("test-bp-10K start \n");
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
//   const start = Date.now();
//   await page.goto('http://localhost:8081/components/epiviz-charts/performance/tests/test-bp-10K.html', 
//         {waitUntil: 'networkidle0'});
//   const end = Date.now();
//   // console.log("before loading Page : " + start);
//   // console.log("After Page Load : " + end);
//   // console.log("Total Elapsed Time : " + (end - start));
//   const metrics = await page.metrics();
//   console.log("test-bp-10K metrics : " + JSON.stringify(metrics));
//   await page.screenshot({path: 'test-bp-10K.png'});
//   await browser.close();
//   console.log("test-bp-10K end \n");
// })();

// (async () => {
//   console.log("test-bp-100K start \n");
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
//   const start = Date.now();
//   await page.goto('http://localhost:8081/components/epiviz-charts/performance/tests/test-bp-100K.html', 
//         {waitUntil: 'networkidle0'});
//   const end = Date.now();
//   // console.log("before loading Page : " + start);
//   // console.log("After Page Load : " + end);
//   // console.log("Total Elapsed Time : " + (end - start));
//   const metrics = await page.metrics();
//   console.log("test-bp-100K metrics : " + JSON.stringify(metrics));
//   await page.screenshot({path: 'test-bp-100K.png'});
//   await browser.close();
//   console.log("test-bp-100K end \n");
// })();

(async () => {
  console.log("test-bp-1M start \n");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  var chart_draw_time = null;
  page.on('console', msg => {
    // console.log(msg.text());
    chart_draw_time = JSON.parse(msg.text());
  });

  requests_map = {};
  total_http_req_time = 0;

  await page.setRequestInterception(true);

  page.on('request', interceptedRequest => {
    var url = interceptedRequest.url();
    if (url.indexOf("?requestId=") != -1 && url.indexOf("&action=") != -1) {
      requests_map[url] = {
        requestSent: Date.now() 
      };
    }

    interceptedRequest.continue();
  });

  page.on("requestfinished", interceptedResponse => {
    var url = interceptedResponse.url();

    if (url.indexOf("?requestId=") != -1 && url.indexOf("&action=") != -1) {
      requests_map[url]["requestReceived"] = Date.now();
      requests_map[url]["requestTime"] = requests_map[url]["requestReceived"] - requests_map[url]["requestSent"];  
      total_http_req_time += requests_map[url]["requestTime"];
    }
  });
  
  // const start = Date.now();
  // await page.tracing.start({path: 'trace-1M.json'});
  // const page_start = Date.now();
  await page.goto('http://localhost:8081/components/epiviz-charts/performance/tests/test-bp-100M.html', 
        {waitUntil: 'networkidle0'});
  // const page_end = Date.now();

  // console.log("page rendering: " + (page_end - page_start));

  console.log("total http time : " + total_http_req_time);
  console.log("total_draw_time : " + chart_draw_time.total_draw_time);

  // await page.tracing.stop(); 

  // const end = Date.now();
  // console.log("before loading Page : " + start);
  // console.log("After Page Load : " + end);
  // console.log("Total Elapsed Time : " + (end - start));
  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );

  console.log("page load time: " + (performanceTiming.loadEventEnd - performanceTiming.navigationStart));
  console.log(performanceTiming);

  const metrics = await page.metrics();
  console.log("test-bp-1M metrics : " + JSON.stringify(metrics));


  console.log(requests_map);
  // await page.screenshot({path: 'test-bp-1M.png'});
  await browser.close();
  console.log("test-bp-1M end \n");
})();

// (async () => {
//   console.log("test-bp-100M start \n");
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
//   const start = Date.now();
//   await page.goto('http://localhost:8081/components/epiviz-charts/performance/tests/test-bp-100M.html', 
//         {waitUntil: 'networkidle0'});
//   const end = Date.now();
//   // console.log("before loading Page : " + start);
//   // console.log("After Page Load : " + end);
//   // console.log("Total Elapsed Time : " + (end - start));
//   const metrics = await page.metrics();
//   console.log("test-bp-100M metrics : " + JSON.stringify(metrics));
//   await page.screenshot({path: 'test-bp-100M.png'});
//   await browser.close();
//   console.log("test-bp-100M end \n");
// })();

// (async () => {
//   console.log("test-bp-chr start \n");
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
//   const start = Date.now();
//   await page.goto('http://localhost:8081/components/epiviz-charts/performance/tests/test-bp-chr.html', 
//         {waitUntil: 'networkidle0'});
//   const end = Date.now();
//   // console.log("before loading Page : " + start);
//   // console.log("After Page Load : " + end);
//   // console.log("Total Elapsed Time : " + (end - start));
//   const metrics = await page.metrics();
//   console.log("test-bp-chr metrics : " + JSON.stringify(metrics));
//   await page.screenshot({path: 'test-bp-chr.png'});
//   await browser.close();
//   console.log("test-bp-chr end \n");
// })();