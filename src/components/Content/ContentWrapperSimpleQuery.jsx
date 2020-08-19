import React from 'react'
import { DOCTYPE_CONTACTS } from '../../helpers/doctypes'
import ContactsListDataLoader from '../ContactsList/ContactsListDataLoader'
import Header from '../Header'
import Toolbar from '../Toolbar'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import { Query, useClient } from 'cozy-client'
import { updateIndexFullNameAndDisplayName } from '../../helpers/contacts'
import { sortBy } from 'lodash'

const ContentWrapper = () => {
  const client = useClient()
  const query = client =>
    client
      .all(DOCTYPE_CONTACTS)
      .include(['accounts'])
      .where({
        trashed: {
          $exists: false
        },
        _id: {
          $gt: null
        }
      })
      .indexFields(['_id'])

  return (
    <Query query={query(client)}>
      {({ data: contacts, fetchStatus, hasMore, fetchMore }) => {
        let data = []
        const isInError = fetchStatus === 'error'
        const hasData = contacts && contacts.length > 0

        if (!isInError && hasData) {
          const contactsWithIndex = contacts.map(contact =>
            updateIndexFullNameAndDisplayName(contact)
          )
          data = sortBy(contactsWithIndex, [
            'indexes.byFamilyNameGivenNameEmailCozyUrl'
          ])
        }

        return (
          <>
            {data.length >= 1 && <Header right={<Toolbar />} />}
            <Content>
              <ContactsListDataLoader
                contacts={data}
                fetchStatus={fetchStatus}
                hasMore={hasMore}
                fetchMore={fetchMore}
              />
            </Content>
          </>
        )
      }}
    </Query>
  )
}

export default ContentWrapper
