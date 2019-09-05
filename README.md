# ef-time-traveler
A time traveler written for ef, written with ef

## Usage

Import the time traveler and template to be time-traveled
```javascript
import TimeTraveler from 'ef-time-traveler'
import Template from './template.eft'
```

Create a time traveler instance and a new template instance
```javascript
const timeTraveler = new TimeTraveler()
const template = new Template()
```

---

Register the template instance to the time traveler instance. Specify keys to tell the time traveler to record which things needed:
```javascript
timeTraveler.register(template, ['key1', 'key2.subProp'])
```
---


Then do some operations on template instance, history will be automatically recorded

---


Get how many history is recorded. This is a read only value:
```javascript
const count = timeTraveler.historyCount
```


Jump back to history at position `X<int>`
```javascript
timeTraveler.currentPos = X
```

Recording is disabled when viewing history. Resume to the last history position in order to continue editing:
```javascript
timeTraveler.currentPos = timeTraveler.historyCount
```

Revert `X<int>` history records. Newer history record is then discarded:
```javascript
timeTraveler.revert(X)
```

Reset to position `X<int>` and then all newer history is discarded:

```javascript
timeTraveler.reset(X)
```

## Notice

This time traveler only records changes, so you may need to be careful when manually setting `currentPos`. Reverting history would lead to a full history reconstruct, so use carefully to avoid performance issue.


## License
[MIT](http://cos.mit-license.org/)
