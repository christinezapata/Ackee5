import { useMutation, gql } from '@apollo/client'

import addAndSortModify from '../utils/addAndSortModify'
import eventFields from '../fragments/eventFields'

const mutation = gql`
	mutation createEvent($input: CreateEventInput!) {
		createEvent(input: $input) {
			payload {
				...eventFields
			}
		}
	}

	${ eventFields }
`

const update = (cache, result) => {
	const data = result.data.createEvent.payload
	const fragment = eventFields

	cache.modify({
		fields: {
			events: (...args) => {
				const newRef = cache.writeFragment({ data, fragment })
				return addAndSortModify(newRef, 'title')(...args)
			}
		}
	})
}

export default () => {

	const [ mutate, { loading: fetching, error }] = useMutation(mutation)

	return {
		mutate: (opts) => mutate({
			update,
			...opts
		}),
		fetching,
		error
	}

}