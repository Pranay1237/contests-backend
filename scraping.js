import { JSDOM } from 'jsdom';
import axios from 'axios';

import { convertSecondsToHoursAndMinutes, convertSecondsToLocaleStartTime } from './utils/convertions.js';

const scrapeLeetcode = async () => {
	try {
		const response = await axios.get('https://leetcode.com/graphql?query={ allContests { title titleSlug startTime duration __typename } }');
		return response.data;
	} catch (error) {
		throw new Error('An error occurred while scraping the contests.');
	}
};

const scrapeCodechef = async () => {

	try {
		const response = await axios.get('https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=premium');
		// console.log(response.data);
		return response.data.future_contests;
	} catch (error) {
		throw new Error('An error occurred while scraping the contests.');
	}
};

const scrapeCodeforces = async () => {

	try {
		const response = await axios.get('https://codeforces.com/api/contest.list?gym=false');

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
		const response = await axios.get('https://ctftime.org/api/v1/events/?limit=100&start=1713810571&finish=1714481971');
		return response;
	} catch (error) {
		throw new Error('An error occurred while scraping the CTF events.');
	}
};

export { scrapeLeetcode, scrapeCodechef, scrapeCodeforces, scrapeCTF };
