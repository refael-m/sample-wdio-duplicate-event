const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    await client.send('Network.enable');

    await client.send('Network.setRequestInterception', {
        patterns: [{ urlPattern: '*' }],
    });

    await client.on('Network.requestIntercepted', async e => {
        console.log(e.request.url);

        await client.send('Network.continueInterceptedRequest', {
            interceptionId: e.interceptionId,
        });
    });

    await page.goto('https://www.google.com');
    await browser.close();
})();
