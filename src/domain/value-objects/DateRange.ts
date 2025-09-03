export class DateRange {
    constructor(
        public readonly start: Date | null,
        public readonly end: Date | null,
    ) {
        if (start && end && start > end) {
            throw new Error("Start date cannot be after end date");
        }
    }

    public contains(date: Date): boolean {
        if (!this.start && !this.end) return true;
        if (this.start && !this.end) return date >= this.start;
        if (!this.start && this.end) return date <= this.end;
        return this.start! <= date && date <= this.end!;
    }

    public overlaps(other: DateRange): boolean {
        if (!this.start && !this.end) return true;
        if (!other.start && !other.end) return true;

        const thisStart = this.start || new Date(0);
        const thisEnd = this.end || new Date(9999, 11, 31);
        const otherStart = other.start || new Date(0);
        const otherEnd = other.end || new Date(9999, 11, 31);

        return thisStart <= otherEnd && otherStart <= thisEnd;
    }

    public static createFromStrings(start?: string, end?: string): DateRange {
        return new DateRange(
            start ? new Date(start) : null,
            end ? new Date(end) : null,
        );
    }
}
