import DummyTimeTraveler from './time-traveler.eft'
import {inform, exec, onNextRender, registerProps} from 'ef-core'

const resolve = (properties, obj) => properties.reduce((prev, curr) => {
	if (!prev[curr]) prev[curr] = {}
	return prev[curr]
}, obj)

const copyVal = (properties, state, value) => {
	properties = Array.prototype.slice.call(properties, 0)
	const key = properties.pop()
	resolve(properties, state)[key] = value
}

const viewHistory = ({state, value}) => {
	value = parseInt(value, 10)
	for (let i of state.$ctx.registered) i.$data = i.$ctx.history[value]
}

const discardHistory = ({state, value}) => {
	if (value > state.$data.historyCount || state.$data.historyCount === state.$data.currentPos) return

	for (let i of state.$ctx.registered) i.$ctx.history.length = value

	inform()
	for (let i = 0; i <= value; i++) state.$data.currentPos = i
	exec()
}

const TimeTraveler = class extends DummyTimeTraveler {
	constructor(...args) {
		super(...args)
		this.$ctx.registered = []
		this.$subscribe('currentPos', viewHistory)
		this.$subscribe('historyCount', discardHistory)
	}

	register(component, valPaths) {
		if (this.$ctx.registered.indexOf(component) < 0) this.$ctx.registered.push(component)
		if (!component.$ctx.history) component.$ctx.history = []
		const history = component.$ctx.history

		const increasePos = () => {
			inform()
			this.$data.historyCount = history.length
			this.$data.currentPos = history.length
			exec()
		}

		const updateHistory = (valPath, value) => {
			const nextPos = this.$data.currentPos + 1
			if (history.length < nextPos) history.push({})
			const stateNow = history[this.$data.currentPos]
			copyVal(valPath.split('.'), stateNow, value)
			onNextRender(increasePos)
		}

		for (let i in valPaths) {
			const valPath = valPaths[i]
			component.$subscribe(valPath, ({value}) => {
				if (this.$data.currentPos < this.$data.historyCount) return
				updateHistory(valPath, value)
			})
		}
	}

	reset(pos) {
		this.historyCount = pos
	}

	revert(count) {
		this.historyCount = this.historyCount - count
	}
}

registerProps(TimeTraveler, {
	currentPos: {
		get() {
			return this.$data.currentPos
		},
		set(val) {
			if (val > this.$data.historyCount) return
			this.$data.currentPos = val
		}
	},
	historyCount: {
		get() {
			return this.$data.historyCount
		},
		set(val) {
			if (val >= this.$data.historyCount) return
			this.$data.historyCount = val
			console.log(val)
		}
	}
})

export default TimeTraveler
