import express from 'express';
import cors from 'cors';

import { scrapeCodechef, scrapeLeetcode, scrapeCodeforces, scrapeCTF } from './scraping.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send("Welcome to the contest scraper API.");
});

app.get('/codechef', (req, res) => {
    const locale = req.query.locale;
    scrapeCodechef(locale)
        .then((contests) => {
            res.send(contests);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("An error occurred while scraping the contests.");
        });
});

app.get('/leetcode', (req, res) => {
    const locale = req.query.locale;
    scrapeLeetcode(locale)
        .then((contests) => {
            res.send(contests);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("An error occurred while scraping the contests.");
        });
});

app.get('/codeforces', (req, res) => {
    const locale = req.query.locale;
    scrapeCodeforces(locale)
        .then((contests) => {
            res.send(contests);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("An error occurred while scraping the contests.");
        });
});

app.get('/ctf', (req, res) => {
    scrapeCTF()
        .then((contests) => {
            console.log(contests);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("An error occurred while scraping the contests.");
        });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
