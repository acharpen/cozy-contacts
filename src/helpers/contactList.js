export function buildLastNameFirst(contact) {
  const givenNameA =
    contact.name && contact.name.givenName
      ? contact.name.givenName.toUpperCase()
      : ''
  const familyNameA =
    contact.name && contact.name.familyName
      ? contact.name.familyName.toUpperCase()
      : ''
  const nameA = `${familyNameA} ${givenNameA}`.trim()
  return nameA
}

export const sortLastNameFirst = (contact, comparedContact) => {
  const nameA = buildLastNameFirst(contact)
  const nameB = buildLastNameFirst(comparedContact)
  return nameA.localeCompare(nameB)
}

export const categorizeContacts = (contacts, emptyList) => {
  console.info('contacts', contacts)
  // const sortedContacts = [...contacts].sort(sortLastNameFirst)
  const sortedContacts = contacts

  return sortedContacts.reduce((acc, contact) => {
    const name = buildLastNameFirst(contact)
    // console.info('name', name)

    const header = name[0] || emptyList
    // console.info('header', header)

    acc[header] = acc[header] || []
    acc[header].push(contact)
    return acc
  }, {})
}

export const categorizeContactsOLD = (contacts, emptyList) => {
  const sortedContacts = [...contacts].sort(sortLastNameFirst)
  return sortedContacts.reduce((acc, contact) => {
    const name = buildLastNameFirst(contact)
    const header = name[0] || emptyList
    acc[header] = acc[header] || []
    acc[header].push(contact)
    return acc
  }, {})
}
