import express from 'express';
import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';

const app = express();
const port = 3000;

const scrapeCodechef = async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.setViewport({ width: 1080, height: 1024 });

	await page.goto('https://www.codechef.com/contests', { waitUntil: 'networkidle0' });

	const htmlContent = await page.content();

	await page.close();

	const dom = new JSDOM(htmlContent);
	const tbody = dom.window.document.querySelectorAll("tbody");
	const table = tbody[1];
	const rows = table.querySelectorAll("tr");

	const contests = [];

	for (let i = 0; i < rows.length; i++) {
		const cols = rows[i].querySelectorAll("td");
		const name = cols[0].textContent.trim();
		const start = cols[1].textContent.trim();
		const end = cols[2].textContent.trim();
		const duration = cols[3].textContent.trim();
		const link = cols[1].querySelector("a").getAttribute("href");

		const contest = {
			name: name,
			start: start,
			end: end,
			duration: duration,
			link: link
		};

		contests.push(contest); // Add the contest object to the array

	}

	const contestsJSON = JSON.stringify(contests); // Convert the array to JSON
	return contestsJSON;
};


app.use(express.json());

app.get('/codechef', (req, res) => {
    scrapeCodechef().catch((error) => {
        console.error(error);
        res.send("An error occurred while scraping the contests.");
    }).then((contests) => {
        res.send(contests);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
