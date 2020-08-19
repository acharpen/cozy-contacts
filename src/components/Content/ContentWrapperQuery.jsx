import React from 'react'
import { DOCTYPE_CONTACTS } from '../../helpers/doctypes'
import ContactsListDataLoader from '../ContactsList/ContactsListDataLoader'
import Header from '../Header'
import Toolbar from '../Toolbar'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import { Query, useClient } from 'cozy-client'
import { updateIndexFullNameAndDisplayName } from '../../helpers/contacts'
import { sortBy } from 'lodash'
import log from 'cozy-logger'

const QueryResult1 = () => {
  const client = useClient()
  const query1 = client =>
    client
      .all(DOCTYPE_CONTACTS)
      .include(['accounts'])
      .where({
        trashed: {
          $exists: false
        },
        'indexes.byFamilyNameGivenNameEmailCozyUrl': {
          $exists: true
        }
      })
      .indexFields(['indexes.byFamilyNameGivenNameEmailCozyUrl'])
      .sortBy([{ 'indexes.byFamilyNameGivenNameEmailCozyUrl': 'asc' }])

  const query2 = client =>
    client
      .all(DOCTYPE_CONTACTS)
      .include(['accounts'])
      .where({
        'indexes.byFamilyNameGivenNameEmailCozyUrl': {
          $exists: false
        }
      })
      .indexFields(['_id'])

  return (
    <Query query={query1(client)}>
      {({
        data: contacts1,
        fetchStatus: fetchStatus1,
        hasMore: hasMore1,
        fetchMore: fetchMore1
      }) => {
        console.info('fetchStatus1', fetchStatus1)
        return (
          <Query query={query2(client)}>
            {({
              data: contacts2,
              fetchStatus: fetchStatus2,
              hasMore: hasMore2,
              fetchMore: fetchMore2
            }) => {
              // if (fetchStatus1 !== 'loaded' || fetchStatus2 !== 'loaded') {
              //   return <div>LOADING</div>
              // }
              console.info('fetchStatus1', fetchStatus1)
              console.info('fetchStatus2', fetchStatus2)
              const fetchStatus =
                fetchStatus1 === 'loaded' && fetchStatus2 === 'loaded'
                  ? 'loaded'
                  : 'loading'

              console.info('fetchStatus', fetchStatus)
              const hasMore = hasMore1 || hasMore2
              const fetchMore = hasMore1 ? fetchMore1 : fetchMore2
              const data =
                fetchStatus === 'loaded' ? contacts1.concat(contacts2) : []

              console.info('contacts1', contacts1)
              console.info('contacts2', contacts2)
              console.info('hasMore', hasMore)
              console.info('fetchMore', fetchMore)
              console.info('data', data.length)

              // if (fetchStatus !== 'loaded') {
              //   return <div>LOADING</div>
              // }

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
      }}
    </Query>
  )
}

const QueryResult2 = () => {
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
        const contactsWithIndex = contacts.map(contact =>
          updateIndexFullNameAndDisplayName(contact)
        )
        const data = sortBy(contactsWithIndex, [
          'indexes.byFamilyNameGivenNameEmailCozyUrl'
        ])
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

const ContentWrapper = ({ trigger, isTriggerLaunched }) => {
  // trigger keepIndexFullNameAndDisplayNameUpToDate service
  // if never launched before
  const client = useClient()
  if (trigger && isTriggerLaunched === false) {
    log(
      'info',
      `Executing keepIndexFullNameAndDisplayNameUpToDate service by Contacts app`
    )
    client.collection('io.cozy.triggers').launch(trigger)
  }

  return (
    <>
      {isTriggerLaunched && <QueryResult1 />}
      {!isTriggerLaunched && <QueryResult2 />}
    </>
  )
}
export default ContentWrapper
