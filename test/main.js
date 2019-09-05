import TimeTraveler from '../src/time-traveler'
import Tpl from './tpl.eft'
import ControlBar from './control-bar.eft'
import {inform, exec, onNextRender} from 'ef-core'

const timeTraveler = new TimeTraveler()

const tpl = new Tpl()
timeTraveler.register(tpl, ['inputVal1', 'inputVal2', 'inputVal3'])

const timeTraveler2 = new TimeTraveler()
timeTraveler2.register(timeTraveler, ['currentPos'])

const controlBar = new ControlBar({
	$methods: {
		updateTraveler1({value}) {
			timeTraveler.currentPos = parseInt(value, 10)
		},
		updateTraveler2({value}) {
			timeTraveler2.currentPos = parseInt(value, 10)
		},
		resetTo({value}) {
			timeTraveler2.reset(parseInt(value, 10))
		},
		revert({value}) {
			timeTraveler2.revert(parseInt(value, 10))
		}
	}
})

timeTraveler.$subscribe('historyCount', ({value}) => {
	onNextRender(() => {
		const lastPos = controlBar.$data.currentPos
		inform()
		controlBar.$data.currentPos = 0
		controlBar.$data.currentPos = lastPos
		exec()
	})
	controlBar.$data.rangeMax = value
})
timeTraveler.$subscribe('currentPos', ({value}) => {
	controlBar.$data.currentPos = value
})

timeTraveler2.$subscribe('historyCount', ({value}) => {
	onNextRender(() => {
		const lastPos = controlBar.$data.currentPos2
		inform()
		controlBar.$data.currentPos2 = 0
		controlBar.$data.currentPos2 = lastPos
		exec()
	})
	controlBar.$data.rangeMax2 = value
})
timeTraveler2.$subscribe('currentPos', ({value}) => {
	controlBar.$data.currentPos2 = value
})

tpl.$mount({target: document.body})
controlBar.$mount({target: document.body})
