import thunk from 'redux-thunk'
import findConfig from 'find-config'
import promiseMiddleware from 'redux-promise'
import { applyMiddleware, createStore, combineReducers, compose } from 'redux'
import { createAction as _createAction, createReducer as _createReducer } from 'redux-act'

const INSTANCE = {
	store: undefined,
	reducers: null,
	middleware: [
		thunk,
		promiseMiddleware
	],
	enhancers: []
}

export { createSelector } from 'reselect'

export function dispatch ( action ) {
	const isArray = action instanceof Array

	if ( isArray ) {
		return action.forEach(a => INSTANCE.store.dispatch(a))
	} else {
		return INSTANCE.store.dispatch(action)
	}

}

export function createReducer ( initialState, handlers ) {

	const hasSingleReducer = INSTANCE.reducers && typeof INSTANCE.reducers === 'function'

	if ( hasSingleReducer ) {
		console.warn('You are about to replace a single reducer. If you want named reducers use createNamedReducer')
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

export function composeSelectors ( ...funcs ) {
	return ( state, ownProps ) => ({
		...funcs.reduce(( last, func ) => ({
			...last,
			...compose(func)(state, ownProps)
		}), {})
	})
}

export default (function redstate () {

	try {
		const config = findConfig.require('configureStore.js', { module: true })

		if ( config.initialState ) {
			INSTANCE.initialState = config.initialState
		}

		if ( config.reducers ) {
			if ( config && config.reducers ) {
				if ( typeof config.reducers === 'function' ) {
					INSTANCE.reducers = config.reducers
				} else {
					INSTANCE.reducers = combineReducers({ ...config.reducers })
				}
			}
		} else {
			INSTANCE.reducers = state => state
		}

		if ( config.middlewares ) {
			INSTANCE.middleware = INSTANCE.middleware.concat(config.middlewares)
		}

		if ( config.enhancers ) {
			INSTANCE.enhancers = INSTANCE.enhancers.concat(config.enhancers)
		}
	} catch ( e ) {}

	INSTANCE.store = createStore(
		INSTANCE.reducers,
		INSTANCE.initialState,
		applyMiddleware(
			...INSTANCE.middleware,
			...INSTANCE.enhancers
		)
	)

}())
