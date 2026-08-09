export function range(from: number, to: number): number[] {
    const r: number[] = [];
    for (let i = from; i <= to; i++) {
        r.push(i);
    }
    return r;
}

export function getTimeStampByDate(t: Date | number | string): number {
    const d = new Date(t);

    return d.getTime();
}

export function getDateString(t: Date | number | string, format = "yyyy/MM/dd hh:mm:ss"): string {
    const d = new Date(getTimeStampByDate(t));

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();

    const formatedString = format
        .replace("yyyy", String(year))
        .replace("MM", String(month))
        .replace("dd", String(date))
        .replace("hh", String(hours))
        .replace("mm", String(minutes))
        .replace("ss", String(seconds));

    return formatedString;
}
