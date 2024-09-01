import { JSDOM } from 'jsdom';
import axios from 'axios';

import { convertSecondsToHoursAndMinutes, convertSecondsToLocaleStartTime } from './utils/convertions.js';
import { leetcodeLink, codechefLink, codeforcesLink, ctfLink } from './utils/links.js';

const scrapeLeetcode = async () => {
	try {
		const response = await axios.get(leetcodeLink);
		return response.data;
	} catch (error) {
		throw new Error('An error occurred while scraping the contests.');
	}
};

const scrapeCodechef = async () => {

	try {
		const response = await axios.get(codechefLink);
		// console.log(response.data);
		return response.data.future_contests;
	} catch (error) {
		throw new Error('An error occurred while scraping the contests.');
	}
};

const scrapeCodeforces = async () => {

	try {
		const response = await axios.get(codeforcesLink);

		const c = response.data.result;
		const upcomingContests = c.filter(contest => contest.phase === 'BEFORE');
		const contests = [];

		for(let i = 0; i < upcomingContests.length; i++) {
			const name = upcomingContests[i].name;
			const start = convertSecondsToLocaleStartTime(upcomingContests[i].startTimeSeconds);
			const duration = convertSecondsToHoursAndMinutes(upcomingContests[i].durationSeconds);
			const startsIn = convertSecondsToLocaleStartTime(upcomingContests[i].relativeTimeSeconds);
			const register = `https://codeforces.com/contestRegistration/${upcomingContests[i].id}`;

			const contest = {
				name: name,
				start: start,
				duration: duration,
				startsIn: startsIn,
				register: register
			};

			contests.push(contest);
		}
		return contests;
	} catch (error) {
		throw new Error('An error occurred while scraping the contests.');
	}
};

const scrapeCTF = async () => {
	try {
		const response = await axios.get(ctfLink);
		return response;
	} catch (error) {
		throw new Error('An error occurred while scraping the CTF events.');
	}
};

export { scrapeLeetcode, scrapeCodechef, scrapeCodeforces, scrapeCTF };
