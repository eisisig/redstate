import assign from 'lodash/assign'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import reduce from 'lodash/reduce'
import { connect } from 'react-redux'

// TODO: refactor
export default function composeConnect ( ...selectors ) {
	return connect(( state, ownProps ) => ({
		...reduce(selectors, ( last, selector ) => {

			if ( selector && isFunction(selector) ) {
				last = assign({}, last, { ...selector(state, ownProps) })
			}

			if ( selector && isObject(selector) ) {

				const objMap = reduce(selector, ( l, value, key ) => {
					l = assign({}, l, { [key]: value(state, ownProps) })
					return l
				}, {})

				last = assign({}, last, objMap)
			}

			return last
		}, {})
	}))
}
