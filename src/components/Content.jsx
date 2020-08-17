import React from 'react'
import { useQuery, Q } from 'cozy-client'
import { DOCTYPE_CONTACTS } from '../helpers/doctypes'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import ContactsListDataLoader from './ContactsList/ContactsListDataLoader'

const Hookquery = () => {
  const fetchAllContacts = {
    definition: () =>
      Q(DOCTYPE_CONTACTS)
        .include(['accounts'])
        .where({
          trashed: {
            $exists: false
          }
        })
        .indexFields(['_id']),
    options: {
      as: 'allContacts'
    }
  }

  const fetchContactsbyFamilyNameGivenNameEmailCozyUrl = {
    definition: () =>
      Q(DOCTYPE_CONTACTS)
        .include(['accounts'])
        .where({
          trashed: {
            $exists: false
          }
        })
        .indexFields(['indexes.byFamilyNameGivenNameEmailCozyUrl'])
        .sortBy([{ 'indexes.byFamilyNameGivenNameEmailCozyUrl': 'asc' }]),
    options: {
      as: 'contactsByIndex'
    }
  }

  const resultAllContacts = useQuery(
    fetchAllContacts.definition,
    fetchAllContacts.options
  )
  const resultContactsByIndex = useQuery(
    fetchContactsbyFamilyNameGivenNameEmailCozyUrl.definition,
    fetchContactsbyFamilyNameGivenNameEmailCozyUrl.options
  )

  const { data, fetchStatus, hasMore, fetchMore } = resultContactsByIndex

  resultAllContacts.fetchStatus === 'loaded' &&
    console.info('resultAllContacts', resultAllContacts.data)

  resultContactsByIndex.fetchStatus === 'loaded' &&
    console.info('resultContactsByIndex', resultContactsByIndex.data)

  // const isInError = result.fetchStatus === 'error'
  // const hasDataToShow = !isInError && result.data && result.data.length > 0
  // const isLoading = result.fetchStatus === 'loading' && !result.lastUpdate
  // const isEmpty = !isLoading && !hasDataToShow
  // hasDataToShow && console.info('result', result)

  return (
    <Content>
      <ContactsListDataLoader
        contacts={data}
        fetchStatus={fetchStatus}
        hasMore={hasMore}
        fetchMore={fetchMore}
      />
    </Content>
  )
}

export default Hookquery

/*
import React, { useState, useEffect } from 'react'
import { Query, useClient } from 'cozy-client'
import { DOCTYPE_CONTACTS } from '../helpers/doctypes'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import Header from './Header'
import Toolbar from './Toolbar'
import ContactsListDataLoader from './ContactsList/ContactsListDataLoader'
import { fetchLastSuccessOfService } from '../helpers/fetches'

const Contentwrapper = () => {
  return (
    <>
      <Query
        query={client =>
          client.all('io.cozy.triggers').where({
            'message.name': 'keepIndexFullNameAndDisplayNameUpToDate'
          })
        }
      >
        {data => {
          return (
            <>
              <div>result</div>
              <div>{data}</div>
            </>
          )
        }}
      </Query>
      <Query
        query={
          client =>
            client
              .all(DOCTYPE_CONTACTS)
              .include(['accounts'])
              .where({
                trashed: {
                  $exists: false
                }
              })
              .indexFields(['_id'])
          // .indexFields(['indexes.byFamilyNameGivenNameEmailCozyUrl'])
          // .sortBy([
          //   { 'indexes.byFamilyNameGivenNameEmailCozyUrl': 'asc' }
          // ])
        }
      >
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
    </>
  )
}

export default Contentwrapper
*/
