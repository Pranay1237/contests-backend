import express from 'express';

import { scrapeCodechef, scrapeLeetcode, scrapeCodeforces, scrapeCTF } from './scraping.js';

const app = express();
const port = 3000;

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
