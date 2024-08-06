export function trimTime(dates) {
    if (!dates) {
        return null;
    }

    if (!Array.isArray(dates)) {
        return dates.toISOString().slice(0, 10);
    }

    dates.forEach((date, index) => {
        dates[index] = date.toISOString().slice(0, 10);
    });

    return dates;
}
