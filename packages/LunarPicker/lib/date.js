import calendar from './calendar';

const getCurrentDate = () => {
    const date = new Date();
    return [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours()];
};

export const FIRST_YEAR = 1930;
const currentDate = getCurrentDate();
const solarCache = Object.create(null);
const lunarCache = Object.create(null);
const hourText = [
    '时辰不详', '00:00-00:59(早子)', '01:00-01:59(丑)', '02:00-02:59(丑)', '03:00-03:59(寅)',
    '04:00-04:59(寅)', '05:00-05:59(卯)', '06:00-06:59(卯)', '07:00-07:59(辰)', '08:00-08:59(辰)',
    '09:00-09:59(巳)', '10:00-10:59(巳)', '11:00-11:59(午)', '12:00-12:59(午)', '13:00-13:59(未)',
    '14:00-14:59(未)', '15:00-15:59(申)', '16:00-16:59(申)', '17:00-17:59(酉)', '18:00-18:59(酉)',
    '19:00-19:59(戌)', '20:00-20:59(戌)', '21:00-21:59(亥)', '22:00-22:59(亥)', '23:00-23:59(晚子)'
];

// 生成日期
const makeDays = (start, end, lunar) => {
    const cache = lunar ? lunarCache : solarCache;
    const key = `d${start},${end}`;
    let days;
    if (cache[key]) {
        days = cache[key];
    } else {
        const len = end - start + 1;
        days = new Array(len);
        for (let i = 0, j = start; i < len; i += 1, j += 1) {
            days[i] = {
                val: j,
                text: lunar ? calendar.toChinaDay(j) : (j + '日')
            };
        }
        cache[key] = days;
    }
    return days;
};

// 某年某月对应日次
export const getDays = (year, month, lunar) => {
    if (lunar) {
        if (month < 0) {
            return makeDays(1, calendar.leapDays(year), true);
        } else {
            return makeDays(1, calendar.monthDays(year, month), true);
        }
    } else {
        return makeDays(1, calendar.solarDays(year, month));
    }
};

// 某年对应月份
export const getMonths = (year, type) => {
    let months;
    if (type) {
        // 农历需要处理闰月
        const leapMonth = calendar.leapMonth(year);
        const key = `m${leapMonth}`;
        const cache = lunarCache;
        if (cache[key]) {
            months = cache[key];
        } else {
            months = [];
            for (let i = 1; i <= 12; i += 1) {
                months.push({
                    val: i,
                    text: calendar.toChinaMonth(i)
                });
                if (i === leapMonth) {
                    months.push({
                        val: -i, // 农历闰月作了负数处理
                        text: `闰${calendar.toChinaMonth(i)}`
                    });
                }
            }
            cache[key] = months;
        }
    } else {
        // 公历返回的月份列表是固定的1-12
        const key = 'm';
        const cache = solarCache;
        if (cache[key]) {
            months = cache[key];
        } else {
            months = new Array(12);
            for (let i = 1; i <= 12; i += 1) {
                months[i - 1] = {
                    val: i,
                    text: i + '月'
                };
            }
            cache[key] = months;
        }
    }
    return months;
};

// 年份
export const getYears = () => {
    const currentYear = currentDate[0];
    const years = new Array(currentYear - FIRST_YEAR + 1);
    for (let year = FIRST_YEAR; year <= currentYear; year += 1) {
        years[year - FIRST_YEAR] = {
            val: year,
            text: year + '年'
        };
    }
    return years;
};

export const getHours = () => {
    const len = hourText.length;
    const hours = new Array(len);
    for (let i = 0; i < len; i += 1) {
        hours[i] = {
            // 0代表0:00 - 0:59依次类推，即24代表未传
            val: i > 0 ? (i - 1): (len - 1),
            text: hourText[i]
        };
    }
    return hours;
};

export const lunar2solar = (year, month, day) => calendar.lunar2solar(year, Math.abs(month), day, month < 0);

export const solar2lunar = (year, month, day) => calendar.solar2lunar(year, month, day);

export const getLeapMonth = year => calendar.leapMonth(year);
