import { JSDOM } from 'jsdom';
import axios from 'axios';

import { convertSecondsToHoursAndMinutes, convertSecondsToLocaleStartTime, getRelativeTimeInSeconds, convertISOToSeconds, convertMinutesToHoursAndMinutes, convertISOToEpochTime } from '../utils/convertions.js';
import { leetcodeLink, codechefLink, codeforcesLink, atcoderLink, ctfLink } from '../utils/links.js';
import { ContestDetails } from '../models/ContestDetails.js';

const scrapeLeetcode = async () => {
	try {
		const response = await axios.get(leetcodeLink);
		const res = response.data.data.allContests;
		const contests = [];
		for(let i = 0; i < 2; i++) {
			const name = res[i].title;
			const start = res[i].startTime;
			const duration = convertSecondsToHoursAndMinutes(res[i].duration);
			const startsIn = convertSecondsToLocaleStartTime(getRelativeTimeInSeconds(res[i].startTime));
			const register = `https://leetcode.com/contest/${res[i].titleSlug}/register/`;
			contests.push(new ContestDetails(name, start, duration, startsIn, register, 'LeetCode'));
		}
		return contests;
	} catch (error) {
		throw new Error('An error occurred while scraping the contests.', error);
	}
};

const scrapeCodechef = async () => {
	try {
		const response = await axios.get(codechefLink);

		const res = response.data.future_contests;
		const contests = [];
		for(let i = 0; i < res.length ; i++) {
			const name = res[i].contest_name;
			const start = convertISOToEpochTime(res[i].contest_start_date_iso);
			const duration = convertMinutesToHoursAndMinutes(res[i].contest_duration);
			const startsIn = convertSecondsToLocaleStartTime(getRelativeTimeInSeconds(convertISOToSeconds(res[i].contest_start_date_iso)));
			const register = `https://www.codechef.com/${res[i].code}`;
			contests.push(new ContestDetails(name, start, duration, startsIn, register, 'CodeChef'));
		}
		return contests;
	} catch (error) {
		console.log(error)
		throw new Error('An error occurred while scraping the contests.', error);
	}
};

const scrapeCodeforces = async () => {

	try {
		const response = await axios.get(codeforcesLink);

		const res = response.data.result;
		const upcomingContests = res.filter(contest => contest.phase === 'BEFORE');
		const contests = [];

		for(let i = 0; i < upcomingContests.length; i++) {
			const name = upcomingContests[i].name;
			const start = upcomingContests[i].startTimeSeconds;
			const duration = convertSecondsToHoursAndMinutes(upcomingContests[i].durationSeconds);
			const startsIn = convertSecondsToLocaleStartTime(upcomingContests[i].relativeTimeSeconds);
			const register = `https://codeforces.com/contestRegistration/${upcomingContests[i].id}`;

			contests.push(new ContestDetails(name, start, duration, startsIn, register , 'Codeforces'));
		}
		return contests;
	} catch (error) {
		throw new Error('An error occurred while scraping the contests.', error);
	}
};

const scrapeAtCoder = async () => {
	try {
		const response = await axios.get(atcoderLink);
		const contests = [];
		const dom = new JSDOM(response.data);
		const table = dom.window.document.getElementById('contest-table-upcoming');
		console.log(dom.window.document);
		// const rows = table.querySelectorAll('tr');

		// for (let i = 1; i < rows.length; i++) {
		// 	const columns = rows[i].querySelectorAll('td');
		// 	const name = columns[1].textContent;
		// 	const start = columns[2].textContent;
		// 	const duration = columns[3].textContent;
		// 	const startsIn = columns[4].textContent;
		// 	const register = columns[5].querySelector('a').href;

		// 	contests.push(new ContestDetails(name, start, duration, startsIn, register, 'AtCoder'));
		// }

		return table;
	} catch (error) {
		throw new Error('An error occurred while scraping the contests.', error);
	}
};

const scrapeCTF = async () => {
	try {
		const response = await axios.get(ctfLink);
		return response;
	} catch (error) {
		throw new Error('An error occurred while scraping the CTF events.', error);
	}
};

export { scrapeLeetcode, scrapeCodechef, scrapeCodeforces, scrapeAtCoder, scrapeCTF };
