import { TimeUnit } from "@chartiq/react-native-chartiq";
import moment from "moment";
import { createRef } from "react";

export const intervalVal = createRef(null);
const getMinutes = (interval) => {
    switch (interval) {
        case "1":
            return moment().startOf("minute").add(1, "minute");
        case "5":
            return moment()
                .startOf("minute")
                .add(5 - (moment().minutes() % 5), "minute");
        case "10":
            return moment()
                .startOf("minute")
                .add(10 - (moment().minutes() % 10), "minute");
        case "15":
            return moment()
                .startOf("minute")
                .add(15 - (moment().minutes() % 15), "minute");
        case "30":
            return moment()
                .startOf("minute")
                .add(30 - (moment().minutes() % 30), "minute");
        default:
            break;
    }
};
const getHours = (interval) => {
    switch (interval) {
        case "1":
            return moment().startOf("hour").add(1, "hour");
        case "4":
            return moment().startOf("hour").add(4, "hour");
    }
};
export const getInterval = (periodicTime) => {
    switch (periodicTime?.timeUnit) {
        case TimeUnit.WEEK:
            return moment().startOf("week").add(1, "week");
        case TimeUnit.MONTH:
            return moment().startOf("month").add(1, "month");
        case TimeUnit.HOUR:
            return getHours(periodicTime?.interval);
        case TimeUnit.DAY:
            return moment().startOf("day").add(1, "day");
        case TimeUnit.MINUTE:
            return getMinutes(periodicTime?.interval);
        case TimeUnit.SECOND:
            break;
        default:
            break;
    }
};
export const runOnItervalChange = (periodicTime, handleRunInterval) => {
    let nextTime = getInterval(periodicTime);
    intervalVal.current = setInterval(() => {
        // console.log(
        //     periodicTime,
        //     moment().startOf(periodicTime?.timeUnit?.toLowerCase()).toISOString(),
        //     nextTime.toISOString(),
        //     "api hitted 0"
        // );
        if (
            nextTime.isSame(
                moment().startOf(periodicTime?.timeUnit?.toLowerCase()).toISOString()
            )
        ) {
            handleRunInterval();
            nextTime = getInterval(periodicTime);
            // console.log(
            //     moment().format("hh:mm:ss"),
            //     nextTime.format("hh:mm:ss"),
            //     "api hitted 1"
            // );
        }
    }, 1000);
};