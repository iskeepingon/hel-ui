const empty = '', zero = '0';
const minuteCount = 60, hourCount = 24;

export const getClockList = function (filters) {
    let hourFilter, minuteFilter;
    if (Array.isArray(filters)) {
        [hourFilter, minuteFilter] = filters;
    } else {
        hourFilter = minuteFilter = filters;
    }
    const minutes = new Array(minuteCount), hours = new Array(hourCount);
    for (let i = 0; i < minuteCount; i += 1) {
        minutes[i] = {
            text: minuteFilter ? minuteFilter(i) : `${i < 10 ? zero : empty}${i}分`,
            val: i
        };
    }
    for (let i = 0; i < hourCount; i += 1) {
        hours[i] = {
            text: hourFilter ? hourFilter(i) : `${i < 10 ? zero : empty}${i}点`,
            val: i
        };
    }
    return [hours, minutes];
};


const isLeapYear = function (year) {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
};

const getDayCount = function (year, month) {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        case 2:
            if (isLeapYear(year)) {
                return 29;
            } else {
                return 28;
            }
        default:
            return 0;
    }
};

const fullMonthVal = new Array(12);
for (let i = 0; i < 12; i += 1) {
    fullMonthVal[i] = i + 1;
}
const days31Val = new Array(31);
for (let i = 0; i < 31; i += 1) {
    days31Val[i] = i + 1;
}

export const getDateList = function (startDate, endDate, textFilters = []) {
    const [startYear, startMonth, startDay] = startDate;
    const [endYear, endMonth, endDay] = endDate;
    let yearTextFilter, monthTextFilter, dayTextFilter;
    if (Array.isArray(textFilters)) {
        [yearTextFilter, monthTextFilter, dayTextFilter] = textFilters;
    } else {
        yearTextFilter = monthTextFilter = dayTextFilter = textFilters;
    }

    const yearCount = endYear - startYear + 1;

    const fullMonth = fullMonthVal.map(val => {
        return {
            text: monthTextFilter ? monthTextFilter(val) : `${val}月`, val
        };
    });
    const days31 = days31Val.map(val => {
        return {
            text: dayTextFilter ? dayTextFilter(val) : `${val}日`, val
        };
    });
    const days30 = days31.slice(0, 30);
    const days29 = days31.slice(0, 29);
    const days28 = days31.slice(0, 28);

    const years = new Array(yearCount), months = new Array(yearCount), days = new Array(yearCount);
    for (let year = startYear; year <= endYear; year += 1) {
        const index = year - startYear;
        // 塞入年
        years[index] = {
            text: yearTextFilter ? yearTextFilter(year) : `${year}年`,
            val: year
        };
        // 塞入月
        let month;
        if(year !== startYear && year !== endYear) {
            month = fullMonth;
        } else if(year === startYear && year === endYear) {
            month = fullMonth.slice(startMonth - 1, endMonth);
        } else if (year === startYear) {
            month = fullMonth.slice(startMonth - 1);
        } else if (year === endYear) {
            month = fullMonth.slice(0, endMonth);
        } 
        months[index] = month;
        // 塞入日
        let start, end;
        if(year !== startYear && year !== endYear) {
            start = 1;
            end = 12;
        } else if(year === startYear && year === endYear) {
            start = startMonth;
            end = endMonth;
        } else if (year === startYear) {
            start = startMonth;
            end = 12;
        } else if (year === endYear) {
            start = 1;
            end = endMonth;
        }
        const wholeYearDays = new Array(end - start + 1);
        for (let month = start; month <= end; month += 1) {
            const targetMonth = month - start;
            let dayList;
            switch (getDayCount(year, month)) {
                case 31:
                    dayList = days31;
                    break;
                case 30:
                    dayList = days30;
                    break;
                case 28:
                    dayList = days28;
                    break;
                case 29:
                    dayList = days29;
                    break;
                default:
                    dayList = [];
            }
            if(year === startYear && year === endYear && month === startMonth && month === endMonth) {
                dayList = dayList.slice(startDay - 1, endDay);
            } else {
                if (year === startYear && month === startMonth) {
                    dayList = dayList.slice(startDay - 1);
                } else if (year === endYear && month === endMonth) {
                    dayList = dayList.slice(0, endDay);
                }
            }
            wholeYearDays[targetMonth] = dayList;
        }
        days[index] = wholeYearDays;
    }
    return [years, months, days];
};
