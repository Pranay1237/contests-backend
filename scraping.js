import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';
import axios from 'axios';

const scrapeLeetcode = async () => {
	try {
		const response = await axios.get('https://leetcode.com/graphql?query={ allContests { title titleSlug startTime duration __typename } }');
		return response.data;
	} catch (error) {
		throw new Error('An error occurred while scraping the contests.');
	}
};

const scrapeCodechef = async () => {

	// try {
	// 	const response = await axios.get('https://www.codechef.com/contests');
	// 	console.log(response.data);
	// } catch (error) {
	// 	throw new Error('An error occurred while scraping the contests.');
	// }

	const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] }); // Add --no-sandbox flag
	const page = await browser.newPage();

	await page.setViewport({ width: 1080, height: 1024 });

	await page.goto('https://www.codechef.com/contests', { waitUntil: 'networkidle0', timeout: 60000});

	const htmlContent = await page.content();

	await page.close();

	const dom = new JSDOM(htmlContent);
	const tbody = dom.window.document.querySelectorAll("tbody");
	const table = tbody[1];
	const rows = table.querySelectorAll("tr");

	const contests = [];

	for (let i = 0; i < rows.length; i++) {
		const cols = rows[i].querySelectorAll("td");
		const code = cols[0].textContent.trim();
		const name = cols[1].textContent.trim();
		const start = cols[2].textContent.trim();
		const duration = cols[3].textContent.trim();
		const link = cols[1].querySelector("a").getAttribute("href");

		const contest = {
			code: code,
			name: name,
			start: start,
			duration: duration,
			link: link
		};

		contests.push(contest);

	}

	const contestsJSON = JSON.stringify(contests);
	return contestsJSON;
};

const scrapeCodeforces = async () => {

	try {
		const response = await axios.get('https://codeforces.com/contests');
		// console.log(response.data);

		const contests = [];

		const dom = new JSDOM(response.data);
		const table = dom.window.document.querySelector("table");
		const rows = table.querySelectorAll("tr");
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
	} catch (error) {
		throw new Error('An error occurred while scraping the contests.');
	}
};

const scrapeCTF = async () => {
	try {
		const response = await axios.get('https://ctftime.org/api/v1/events/?limit=100&start=1422019499&finish=1423029499');
		return response;
	} catch (error) {
		throw new Error('An error occurred while scraping the CTF events.');
	}
};

export { scrapeLeetcode, scrapeCodechef, scrapeCodeforces, scrapeCTF };
