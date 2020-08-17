import { get } from 'lodash'

// export function buildLastNameFirst(contact) {
//   const givenNameA =
//     contact.name && contact.name.givenName
//       ? contact.name.givenName.toUpperCase()
//       : ''
//   const familyNameA =
//     contact.name && contact.name.familyName
//       ? contact.name.familyName.toUpperCase()
//       : ''
//   const nameA = `${familyNameA} ${givenNameA}`.trim()
//   return nameA
// }

// export const sortLastNameFirst = (contact, comparedContact) => {
//   const nameA = buildLastNameFirst(contact)
//   const nameB = buildLastNameFirst(comparedContact)
//   return nameA.localeCompare(nameB)
// }

export const sortEmptyIndexAtEnd = contacts => {
  const contactWithEmptyIndex = contacts.filter(
    contact =>
      get(contact, 'indexes.byFamilyNameGivenNameEmailCozyUrl', '') === ''
  )

  const contactWithoutEmptyIndex = contacts.filter(
    contact =>
      get(contact, 'indexes.byFamilyNameGivenNameEmailCozyUrl', '') !== ''
  )

  return contactWithoutEmptyIndex.concat(contactWithEmptyIndex)
}

/**
 * Categorize contacts by first letter of their index.
 * Expl.: all contacts with A as first letter will be in A category
 * @param {array} contacts - array of io.cozy.contact documents
 * @param {string} emptyHeader - header for empty contacts
 * @returns {object} categorized contacts
 */
export const categorizeContacts = (contacts, emptyHeader) => {
  const sortedContacts = sortEmptyIndexAtEnd(contacts)
  return sortedContacts.reduce((acc, contact) => {
    const index = get(contact, 'indexes.byFamilyNameGivenNameEmailCozyUrl', '')
    const header = (index[0] || '').toUpperCase() || emptyHeader
    acc[header] = acc[header] || []
    acc[header].push(contact)
    return acc
  }, {})
}

// export const categorizeContactsOld = (contacts, emptyList) => {
//   const sortedContacts = [...contacts].sort(sortLastNameFirst)
//   return sortedContacts.reduce((acc, contact) => {
//     const name = buildLastNameFirst(contact)
//     const header = name[0] || emptyList
//     acc[header] = acc[header] || []
//     acc[header].push(contact)
//     return acc
//   }, {})
// }
