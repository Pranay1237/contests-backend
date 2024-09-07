
const convertSecondsToHoursAndMinutes = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
};

const convertSecondsToLocaleStartTime = (seconds) => {
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return { days, hours, minutes };
    }
    const date = new Date(seconds * 1000);
    return date.toDateString() + ' ' + date.toLocaleTimeString();
};

const getRelativeTimeInSeconds = (seconds) => {
    const date = new Date(seconds * 1000);
    const now = new Date();
    return (now - date) / 1000;
}

const convertISOToLocaleStartTime = (iso) => {
    const date = new Date(iso);
    return date.toDateString() + ' ' + date.toLocaleTimeString();
};

const convertISOToSeconds = (iso) => {
    const date = new Date(iso);
    return date.getTime() / 1000;
};

export { convertSecondsToHoursAndMinutes, convertSecondsToLocaleStartTime, getRelativeTimeInSeconds, convertISOToLocaleStartTime, convertISOToSeconds };