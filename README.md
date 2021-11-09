# express-request-timeout-test

### Usage

```javascript
const timeoutTest = require('express-request-timeout-test');

app.use(timeoutTest({
    timeout_route: '/timeouttest',
    timeout: 140000,
    interval: 10000,
    res_status: 200,
    verbose: true
}))
```

Log Output

```
[/timeouttest] Waiting for 2 Minutes, 20 Seconds
[/timeouttest] 10 Seconds elapsed, 2 Minutes, 10 Seconds left
[/timeouttest] 20 Seconds elapsed, 2 Minutes left
[/timeouttest] 30 Seconds elapsed, 1 Minutes, 50 Seconds left
[/timeouttest] 40 Seconds elapsed, 1 Minutes, 40 Seconds left
[/timeouttest] 50 Seconds elapsed, 1 Minutes, 30 Seconds left
[/timeouttest] 1 Minutes elapsed, 1 Minutes, 20 Seconds left
[/timeouttest] 1 Minutes, 10 Seconds elapsed, 1 Minutes, 10 Seconds left
[/timeouttest] 1 Minutes, 20 Seconds elapsed, 1 Minutes left
[/timeouttest] 1 Minutes, 30 Seconds elapsed, 50 Seconds left
[/timeouttest] 1 Minutes, 40 Seconds elapsed, 40 Seconds left
[/timeouttest] 1 Minutes, 50 Seconds elapsed, 30 Seconds left
[/timeouttest] 2 Minutes elapsed, 20 Seconds left
[/timeouttest] 2 Minutes, 10 Seconds elapsed, 10 Seconds left
GET /timeouttest 200 140009.159 ms - -
```

### Options

|Option|Default|Description|
|------|-----|-----------|
|`timeout_route`|`'/timeouttest'`|Route to test timeout
|`timeout`|`300000`(5 minutes)|Timeout Interval
|`interval`|`10000`(10 seconds)|Logging Interval
|`res_status`|`200`|Response status
|`verbose`|`true`|Log output
