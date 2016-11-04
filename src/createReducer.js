import pull from 'lodash/pull'
import isArray from 'lodash/isArray'
import includes from 'lodash/includes'
import get from 'lodash/fp/get'
// import merge from 'lodash/fp/merge'
import pipe from 'lodash/fp/pipe'
import assign from 'lodash/fp/assign'
import __ from 'lodash/fp/placeholder'
import mergeWith from 'lodash/fp/mergeWith'

function normalizeType ( typeOrActionCreator ) {
	if ( typeOrActionCreator && typeOrActionCreator.getType ) {
		return typeOrActionCreator.toString()
	}
	return typeOrActionCreator
}

function merger ( objValue, srcValue ) {
	if ( isArray(objValue) ) {
		const newSrcValue = [].concat(srcValue)
		return includes(objValue, ...newSrcValue) ? pull(objValue, ...newSrcValue) : objValue.concat(srcValue)
	}
}

export default function createReducer ( handlers = {}, initialState ) {

	return function reduce ( state = initialState, action ) {

		const getAction = get(__, action)

		// NOTE: You can use lodash-fp, ramda etc...
		const composeState = ( ...funcs ) => pipe(...funcs)(state)

		const enhancedAction = {
			state,
			action,
			initialState,
			composeState,
			type: getAction('type'),
			meta: getAction('meta'),
			payload: getAction('payload'),
			assign: assign(state),
			merge: mergeWith(merger, state),
			// TODO: Debatable what should be default
			// merge: merge(state),
			// mergeWith: mergeWith(merger, state)
		}

		if ( action && handlers[ action.type ] ) {

			const calledReducer = handlers[ action.type ](enhancedAction, action.meta)
			// const calledReducer = handlers[ action.type ](state, enhancedAction, action.meta)

			if ( !calledReducer ) console.warn('Action', action.type, 'does not return new or old state!')

			return calledReducer
		} else {
			return state
		}
	}
}
