# redstate

> Idea taken from [https://github.com/luisvinicius167/mockstate]() which I really liked. Props to @luisvinicius167

> ### WIP - This is a test project and for now just a POC for alternative way of using redux.

> NOTE: this is a single store setup

## Libraries used

- redux
- redux-thunk
- redux-act
- redux-promise
- reselect

> Note: Their methods are used inside this lib so not all are exposed or have the same call parameters etc...

## TODO

- [ ] Add devTools
- [ ] createTypes method
- [ ] 

## Usage

### Single reducer 

```js
import axios from 'axios'
import { createAction, createReducer, getState } from 'redstate'

// actions
const fetch = createAction('FETCH', axios.get('/items'))
const reset = createAction('RESET')
const create = createAction('CREATE')

// initial reducer state
const initialState = { items: [] }

// reducer
const reducer = createReducer({
	[fetch]: ( state, payload ) => Object.assign({}, state, { items: payload }),
	[create]: ( state, payload ) => Object.assign({}, state, { items: [ ...state.items, payload ] }),
	[reset]: ( state ) => Object.assign({}, initialState),
})

getState() // { items: [] }
fetch()
getState() // { items: [ { name: 'From server' } ] }
create({ name: 'My item' })
getState() // { items: [ { name: 'From server' }, { name: 'My item' } ] }
```

### Named reducers 

```js
import axios from 'axios'
import { createAction, createNamedReducer, getState } from 'redstate'

const accountsFetch = createAction('accounts/FETCH', axios.get('/items'))

const initialState = { items: [] }

createNamedReducer('accounts', { items: [] }, {
	[accountsFetch]: ( state, payload ) => Object.assign({}, state, { items: payload }),
})

createNamedReducer('users', [], {
	[accountsFetch]: ( state, payload ) => Object.assign({}, state, payload ),
})

getState() // { accounts: { items: [] }, users: [] }
```

## Config

You can config the initial store startup by creating a config file in your project root directory `onfigureStore.js` At start the script will search for that and use that to initialize.

### Available properties

initialState = mixed
middlewares = array
reducers = object
