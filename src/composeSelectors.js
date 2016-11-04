import compose from 'lodash/fp/compose'

export default function composeSelectors ( ...funcs ) {
	return ( state, ownProps ) => ({
		...funcs.reduce(( last, func ) => ({
			...last,
			...compose(func)(state, ownProps)
		}), {})
	})
}
