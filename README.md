# redstate

> Idea taken from [https://github.com/luisvinicius167/mockstate]() which I really liked. Props to @luisvinicius167

> ### WIP - This is a test project and for now just a POC for alternative way of using redux.

> NOTE: this is a single store setup

## Purpose

Main purpose of playing around with this is to get rid of more of the "plumbings" needed when creating the "redux" part of our apps.

Easily call auto bound actions without importing or needing the dispatch method and enhanced reducer creator that has helper methods that we are always using

The helper methods are methods that I found myself (and my team) always doing. update, merge, replace the state. And the problem with Object.assign is that sometimes people forgot to add the empty object to make it immutable. That was causing problems.

**WIP**

```js`
// The methods changing state are using lodash/fp and are curried with the current state so no need to provide that
({ assign, payload }) => assign(payload)
// There is also a "compose" method with the current state to compose fp methods
({ payload, composeState }) => composeState(
	assign({ items: [1,2,3] }),
	merge({ settings: { showState: true } })
)
 ````

## Problems

- Reducer needs to be created before calling it's actions

## Libraries used

- redux
- redux-thunk
- redux-act
- redux-promise
- reselect
- recompose (just passthru, 'redstate/recompose')

> Note: Their methods are used inside this lib so not all are exposed or have the same call parameters etc...

## TODO

- [ ] Add devTools
- [ ] Make recompose a peer-dependency

## Usage

### Basic example 

```js
import axios from 'axios'
import { createAction, createReducer, registerReducers, getState } from 'redstate'

// actions
const fetch = createAction('FETCH', axios.get('/items'))
const reset = createAction('RESET')
const create = createAction('CREATE')

// initial reducer state
const initialState = { items: [] }

// reducer
const accounts = createReducer({
	[fetch]: ({ state, payload }) => Object.assign({}, state, { items: payload }),
	[create]: ({ state, payload }) => Object.assign({}, state, { items: [ ...state.items, payload ] }),
	[reset]: ({ state }) => Object.assign({}, initialState),
})

registerReducers({ accounts })

getState() // { accounts: { items: [] } }
fetch()
getState() // { accounts: { items: [ { name: 'From server' } ] } }
create({ name: 'My item' })
getState() // { accounts: { items: [ { name: 'From server' }, { name: 'My item' } ] } }
```

## methods

#### dispatch

Dispatch is automatically bound to store

#### createAction

Action is automatically bound to store so no need to use dispatch

```
import store, { dispatch, createAction } from 'redstate'

const FETCH = 'FETCH'
const action = createAction(FETCH)

// These are all the same
store.dispatch({ type: FETCH })
dispatch({ type: FETCH })
action()
```

#### createTypes

Creates a namespaced object of constants

```js
// constants.js
export default createTypes('my-app', [
	'FETCH',
	'CREATE'
	// ...
])

// actions.js
import { FETCH } from './actions'

export const fetch = createAction(FETCH) // { type: 'my-app/FETCH' }
```

#### createReducer

Creates an enhanced reducer. The enhancements are in the second parameter called in the action handlers. There you can pull out helpers

```js
const initialState = { items: [] }
const reducer = createReducer(initialState, {
	[fetch]: ( { state, action, type, meta, initialState, payload, composeState, assign, merge }) => {
		// TODO: Explain args
	}
})
```

#### createRootDOMEl

Return a dom element to render React app into

```js
const domEL = createRootDOMEl() // document.body.appendChild(document.createElement('div'))
ReactDOM.render(<App />, domEl)
```

#### getStore

Return the redux store

#### getState

Return the current reduc store state `tore.getState()`
