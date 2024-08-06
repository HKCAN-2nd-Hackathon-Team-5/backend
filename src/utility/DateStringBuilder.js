export function trimTime(dates) {
    if (!Array.isArray(dates)) {
        return dates.slice(0, 10);
    }

    dates.forEach((date, index) => {
        dates[index] = date.slice(0, 10);
    });

    return dates;
}
