import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import { createAction as _createAction } from 'redux-act'
import isArray from 'lodash/isArray'

const INSTANCE = {
	store: undefined,
	reducers: state => state,
	middleware: [
		thunk,
		promiseMiddleware
	],
	enhancers: []
}

export default (function redstate () {
	return INSTANCE.store = configureStore()
}())

export function dispatch ( action ) {
	return isArray(action)
		? action.forEach(a => INSTANCE.store.dispatch(a))
		: INSTANCE.store.dispatch(action)

}

export function getStore () {
	return INSTANCE.store
}

export function registerReducer ( reducer ) {
	if ( typeof reducer === 'function' ) {
		INSTANCE.reducers = reducer
		INSTANCE.store = configureStore(reducer)
	} else {
		INSTANCE.reducers = Object.assign({}, INSTANCE.reducers, reducer)
		INSTANCE.store.replaceReducer(combineReducers(INSTANCE.reducers))
	}
}

export function registerReducers ( reducer ) {
	return registerReducer(reducer)
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

export function configureStore ( reducers = INSTANCE.reducers, initialState, middleware = INSTANCE.middleware, enhancers = INSTANCE.enhancers ) {
	return createStore(reducers, initialState, applyMiddleware(...middleware, ...enhancers))
}
