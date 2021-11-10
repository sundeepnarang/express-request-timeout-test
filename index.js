const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

const DEFAULT_ROUTE = "/timeouttest";
const DEFAULT_RES_STATUS = 200;
const DEFAULT_RES_FAIL_STATUS = 429;
const DEFAULT_TIMEOUT = 5*60*1000; // 5 mins
const DEFAULT_LOG_INTERVAL = 10*1000; // 10 Seconds
const MAX_TESTS = 1

/**
 * Converts milliseconds into greater time units as possible
 * @param {int} ms - Amount of time measured in milliseconds
 * @return {Object|null} Reallocated time units. NULL on failure.
 */
function timeUnits( ms ) {
    if ( !Number.isInteger(ms) ) {
        return null
    }
    /**
     * Takes as many whole units from the time pool (ms) as possible
     * @param {int} msUnit - Size of a single unit in milliseconds
     * @return {int} Number of units taken from the time pool
     */
    const allocate = msUnit => {
        const units = Math.trunc(ms / msUnit)
        ms -= units * msUnit
        return units
    }
    // Property order is important here.
    // These arguments are the respective units in ms.
    return {
        days: allocate(86400000),
        hours: allocate(3600000),
        minutes: allocate(60000),
        seconds: allocate(1000),
        ms: ms // remainder
    }
}

function printUnit(val, unit, strAfter=""){
    if (val > 0) {
        return `${val} ${unit}${strAfter?`, ${strAfter}`:""}`
    }
    return strAfter
}

function timeUnitsStr({days=0, hours=0, minutes=0, seconds=0, ms=0}={}){
    return `${printUnit(days,"Days", printUnit(hours,"Hours", printUnit(minutes,"Minutes", printUnit(seconds,"Seconds", printUnit(ms, "Milliseconds")))))}`
}

function log(verbose){
    if(verbose){
        return console.log
    }
    return ()=>{}
}

module.exports = function ({
    timeout_route=DEFAULT_ROUTE,
    timeout=DEFAULT_TIMEOUT,
    interval=DEFAULT_LOG_INTERVAL,
    res_status=DEFAULT_RES_STATUS,
    res_fail_status=DEFAULT_RES_FAIL_STATUS,
    max_tests=MAX_TESTS,
    verbose=true
}={}) {
    return async function (req, res, next) {
        // Implement the middleware function based on the options object

        const logger = log(verbose)
        const url =  req.originalUrl

        if(url.toLowerCase().startsWith(timeout_route)){
            logger(`[${url}] ongoing timeout tests start ${req.app.locals.ongoing_timeout_tests}`);
            let {ongoing_timeout_tests=0} = req.app.locals
            req.app.locals.ongoing_timeout_tests = ongoing_timeout_tests
            if(req.app.locals.ongoing_timeout_tests>=max_tests){
                logger(`[${url}] Exceeded max timeout tests`)
                return res.sendStatus(res_fail_status);
            }
            req.app.locals.ongoing_timeout_tests += 1;
            logger(`[${url}] ongoing timeout tests mid ${req.app.locals.ongoing_timeout_tests}`);
            logger(`[${url}] Waiting for ${timeUnitsStr(timeUnits(timeout))}`);
            let startCount = interval
            const intervalId = setInterval(()=>{
                logger(`[${url}] ${timeUnitsStr(timeUnits(startCount))} elapsed, ${timeUnitsStr(timeUnits(timeout-startCount))} left`)
                startCount += interval;
            },interval)
            await setTimeoutPromise(timeout, true);
            clearInterval(intervalId);
            req.app.locals.ongoing_timeout_tests -= 1;
            res.sendStatus(res_status)
            logger(`[${url}] ongoing timeout tests end ${req.app.locals.ongoing_timeout_tests}`);
        }else{
            next();
        }
    }
}