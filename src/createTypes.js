export default function createTypes ( prefix, types ) {
	return types.reduce(( last, type ) => {
		last[ type ] = `${prefix}/${type}`
		return last
	}, {})
}
