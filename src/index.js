import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import { applyMiddleware, createStore, combineReducers, compose } from 'redux'
import { createAction as _createAction } from 'redux-act'
import _createReducer from './createReducer'

export { compose }
export { createSelector } from 'reselect'
export { connect, Provider } from 'react-redux'

const INSTANCE = {
	store: undefined,
	reducers: state => state,
	initialState: undefined,
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
	return _createReducer(handlers, initialState)
}

export function registerReducer ( reducer, initialState = INSTANCE.initialState ) {
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

function configureStore ( reducers = INSTANCE.reducers, initialState = INSTANCE.initialState, middleware = INSTANCE.middleware, enhancers = INSTANCE.enhancers ) {
	return createStore(
		reducers,
		initialState,
		applyMiddleware(
			...middleware,
			...enhancers
		)
	)
}

export default (function redstate () {
	INSTANCE.store = configureStore()
	return INSTANCE.store
}())
