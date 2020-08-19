import React from 'react'
import { PropTypes } from 'prop-types'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import { useClient } from 'cozy-client'
import ContactsListDataLoader from './ContactsList/ContactsListDataLoader'
import Header from './Header'
import Toolbar from './Toolbar'
import log from 'cozy-logger'
import {
  fetchContactsWithAndWithoutIndexes,
  fetchAllContactsAndUpdateAndSort
} from '../helpers/contentWrapper'
import SpinnerContact from './Components/Spinner'

const ContentWrapper = ({ trigger, isTriggerLaunched }) => {
  const client = useClient()
  const fetchTriggerStatus = trigger ? 'loaded' : 'loading'

  // trigger keepIndexFullNameAndDisplayNameUpToDate service
  // if never launched before
  if (trigger && isTriggerLaunched === false) {
    log(
      'info',
      `Executing keepIndexFullNameAndDisplayNameUpToDate service by Contacts app`
    )
    client.collection('io.cozy.triggers').launch(trigger)
  }

  // use different queries
  // depends if keepIndexFullNameAndDisplayNameUpToDate service
  // was launched before or not
  const result =
    isTriggerLaunched === true
      ? fetchContactsWithAndWithoutIndexes()
      : isTriggerLaunched === false
        ? fetchAllContactsAndUpdateAndSort()
        : {
            data: [],
            fetchStatus: 'pending',
            hasMore: false,
            fetchMore: () => {}
          }

  const { data, fetchStatus, hasMore, fetchMore } = result

  console.info('data', data)
  console.info('fetchStatus', fetchStatus)
  console.info('hasMore', hasMore)
  console.info('fetchMore', fetchMore)

  const fetchAllStatus =
    fetchTriggerStatus === 'loaded' && fetchStatus === 'loaded'
      ? 'loaded'
      : 'loading'

  return (
    <>
      {data.length >= 1 && <Header right={<Toolbar />} />}
      {fetchTriggerStatus !== 'loaded' && (
        <SpinnerContact size="xxlarge" loadingType="fetching_contacts" />
      )}
      {fetchTriggerStatus === 'loaded' && (
        <Content>
          <ContactsListDataLoader
            contacts={data}
            fetchStatus={fetchAllStatus}
            hasMore={hasMore}
            fetchMore={fetchMore}
          />
        </Content>
      )}
    </>
  )
}

ContentWrapper.propTypes = {
  trigger: PropTypes.object,
  isTriggerLaunched: PropTypes.bool
}

export default ContentWrapper
