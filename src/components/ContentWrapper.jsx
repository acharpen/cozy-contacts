import React from 'react'
import { DOCTYPE_CONTACTS } from '../helpers/doctypes'
import ContactsListDataLoader from './ContactsList/ContactsListDataLoader'
import Header from './Header'
import Toolbar from './Toolbar'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import { useQuery, Q } from 'cozy-client'
import { Query, useClient } from 'cozy-client'

const ContentWrapper = () => {
  const query = {
    definition: () =>
      Q(DOCTYPE_CONTACTS)
        .include(['accounts'])
        .where({
          trashed: {
            $exists: false
          },
          _id: {
            $gt: null
          }
        })
        .indexFields(['_id']),
    options: {
      as: 'query'
    }
  }

  const { data, fetchStatus, hasMore, fetchMore } = useQuery(
    query.definition,
    query.options
  )
  const contacts = data === null ? [] : data

  return (
    <>
      {contacts.length >= 1 && <Header right={<Toolbar />} />}
      <Content>
        <ContactsListDataLoader
          contacts={contacts}
          fetchStatus={fetchStatus}
          hasMore={hasMore}
          fetchMore={fetchMore}
        />
      </Content>
    </>
  )
}
export default ContentWrapper

export const ContentWrapperOLD = () => {
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
        return (
          <>
            {contacts.length >= 1 && <Header right={<Toolbar />} />}
            <Content>
              <ContactsListDataLoader
                contacts={contacts}
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
