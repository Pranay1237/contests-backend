import express from 'express';
import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';
import axios from 'axios';

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

const scrapeLeetcode = async () => {
	try {
		const response = await axios.get('https://leetcode.com/graphql?query={ allContests { title titleSlug startTime duration __typename } }');
		return response.data;
	} catch (error) {
		throw new Error('An error occurred while scraping the contests.');
	}
}

const scrapeCodeforces = async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.setViewport({ width: 1080, height: 1024 });

	await page.goto('https://codeforces.com/contests', { waitUntil: 'networkidle0' });

	const htmlContent = await page.content();

	await page.close();

	const contests = [];

	const dom = new JSDOM(htmlContent);
	const table = dom.window.document.querySelectorAll("table");
	const rows = table[0].querySelectorAll("tr");
	for(let i = 1; i < rows.length; i++) {
		const cols = rows[i].querySelectorAll("td");
		const name = cols[0].textContent.trim();
		const start = cols[2].textContent.trim();
		const duration = cols[3].textContent.trim();
		const startsIn = cols[4].textContent.trim();
		let register = cols[5].querySelector("a");
		if(register)
			register = register.getAttribute("href");
		else
			register = "";

		const contest = {
			name: name,
			start: start,
			duration: duration,
			startsIn: startsIn,
			register: (register != "" ? "https://codeforces.com" + register : "")
		};

		contests.push(contest);
		
	}
	return JSON.stringify(contests);
};

const scrapeCTF = async () => {
	try {
		const response = await axios.get('https://ctftime.org/api/v1/events/?limit=100&start=1422019499&finish=1423029499');
		return response;
	} catch (error) {
		throw new Error('An error occurred while scraping the CTF events.');
	}
};

app.use(express.json());

app.get('/', (req, res) => {
	res.send("Welcome to the contest scraper API.");
});

app.get('/codechef', (req, res) => {
    scrapeCodechef().catch((error) => {
        console.error(error);
        res.send("An error occurred while scraping the contests.");
    }).then((contests) => {
        res.send(contests);
    });
});

app.get('/leetcode', (req, res) => {
	scrapeLeetcode().catch((error) => {
		console.error(error);
		res.send("An error occurred while scraping the contests.");
	}).then((contests) => {
		const ans = contests.data.allContests.slice(0, 2);
		res.send(ans);
	});
});

app.get('/codeforces', (req, res) => {
	scrapeCodeforces().catch((error) => {
		console.error(error);
		res.send("An error occurred while scraping the contests.");
	}).then((contests) => {
		res.send(contests);
	});
});

app.get('/ctf', (req, res) => {
	scrapeCTF().catch((error) => {
		console.error(error);
		res.send("An error occurred while scraping the contests.");
	}).then((contests) => {
		res.send(contests);
	});
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
