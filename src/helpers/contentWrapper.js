// import { useQuery, useQueries } from 'cozy-client'
import { useQuery } from 'cozy-client'
import {
  allContacts,
  contactsbyFamilyNameGivenNameEmailCozyUrl,
  contactsWithoutIndexes
} from '../helpers/queries'
import { updateIndexFullNameAndDisplayName } from '../helpers/contacts'
import { sortBy } from 'lodash'

/**
 * Fetches only contacts with indexes.byFamilyNameGivenNameEmailCozyUrl,
 * and fetches only contacts without indexes.byFamilyNameGivenNameEmailCozyUrl
 * and concat results
 * @returns {object} query result with data
 */
export const fetchContactsWithAndWithoutIndexes = () => {
  const resultWithIndexes = useQuery(
    contactsbyFamilyNameGivenNameEmailCozyUrl.definition,
    contactsbyFamilyNameGivenNameEmailCozyUrl.options
  )

  const resultWithoutIndexes = useQuery(
    contactsWithoutIndexes.definition,
    contactsWithoutIndexes.options
  )

  const fetchStatus =
    resultWithIndexes.fetchStatus === 'loaded' &&
    resultWithoutIndexes.fetchStatus === 'loaded'
      ? 'loaded'
      : 'loading'

  const hasMore = resultWithIndexes.hasMore || resultWithoutIndexes.hasMore

  const fetchMore = resultWithIndexes.hasMore
    ? resultWithIndexes.fetchMore
    : resultWithoutIndexes.fetchMore

  const data =
    fetchStatus === 'loaded'
      ? resultWithIndexes.data.concat(resultWithoutIndexes.data)
      : []

  return { data, fetchStatus, hasMore, fetchMore }
}

/**
 * Fetches all contacts, update them with updateIndexFullNameAndDisplayName()
 * and sort them by indexes.byFamilyNameGivenNameEmailCozyUrl
 * @returns {object} query result with data
 */
export const fetchAllContactsAndUpdateAndSort = () => {
  let data = []
  const result = useQuery(allContacts.definition, allContacts.options)
  const isInError = result.fetchStatus === 'error'
  const hasData = result.data && result.data.length > 0

  if (!isInError && hasData) {
    const contactsWithIndex = result.data.map(contact =>
      updateIndexFullNameAndDisplayName(contact)
    )
    data = sortBy(contactsWithIndex, [
      'indexes.byFamilyNameGivenNameEmailCozyUrl'
    ])
  }
  return { ...result, data }
}
