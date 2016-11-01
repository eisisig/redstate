import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import { applyMiddleware, createStore, combineReducers, compose } from 'redux'
import { createAction as _createAction } from 'redux-act'
import _createReducer from './createReducer'

export compose from 'lodash/fp/compose'
export { createSelector } from 'reselect'
export { connect, Provider } from 'react-redux'

const INSTANCE = {
	store: undefined,
	reducers: state => state,
	middleware: [
		thunk,
		promiseMiddleware
	],
	enhancers: []
}

export function dispatch ( action ) {
	const isArray = action instanceof Array

	if ( isArray ) {
		return action.forEach(a => INSTANCE.store.dispatch(a))
	} else {
		return INSTANCE.store.dispatch(action)
	}

}

export function getStore () {
	return INSTANCE.store
}

export function createReducer ( initialState, handlers ) {

	const hasSingleReducer = INSTANCE.reducers && typeof INSTANCE.reducers === 'function'

	if ( hasSingleReducer ) {
		// console.warn('You are about to replace a single reducer. If you want named reducers use createNamedReducer')
	}

	INSTANCE.reducers = _createReducer(handlers, initialState)
	INSTANCE.store.replaceReducer(INSTANCE.reducers)
}

export function createNamedReducer ( name, initialState, handlers ) {

	const hasSingleReducer = INSTANCE.reducers && typeof INSTANCE.reducers === 'function'

	if ( hasSingleReducer ) {
		console.warn('You are about to replace a single reducer with a named reducer map.')
		INSTANCE.reducers = {}
	}

	INSTANCE.reducers = Object.assign({}, INSTANCE.reducers, { [name]: _createReducer(handlers, initialState) })
	INSTANCE.store.replaceReducer(combineReducers({ ...INSTANCE.reducers }))
}

export function createAction ( ...args ) {
	return _createAction(...args).bindTo(INSTANCE.store)
}

export function getState () {
	return INSTANCE.store.getState()
}

export function subscribe ( fn ) {
	return INSTANCE.store.subscribe(fn)
}

export function unsubscribe () {
	return INSTANCE.store.unsubscribe()
}

export function createTypes ( prefix, types ) {
	return types.reduce(( last, type ) => {
		last[ type ] = `${prefix}/${type}`
		return last
	}, {})
}

export function createRootDOMEl () {
	return document.body.appendChild(document.createElement('div'))
}

export function composeSelectors ( ...funcs ) {
	return ( state, ownProps ) => ({
		...funcs.reduce(( last, func ) => ({
			...last,
			...compose(func)(state, ownProps)
		}), {})
	})
}

export default (function redstate () {

	INSTANCE.store = createStore(
		INSTANCE.reducers,
		INSTANCE.initialState,
		applyMiddleware(
			...INSTANCE.middleware,
			...INSTANCE.enhancers
		)
	)

	return INSTANCE.store

}())
