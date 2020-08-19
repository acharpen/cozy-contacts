import React from 'react'
import { PropTypes } from 'prop-types'
import { useClient } from 'cozy-client'
import log from 'cozy-logger'
import { useQuery } from 'cozy-client'
import { allContacts } from '../../helpers/queries'

import { Content } from 'cozy-ui/transpiled/react/Layout'
import ContactsListDataLoader from '../ContactsList/ContactsListDataLoader'
import Header from '../Header'
import Toolbar from '../Toolbar'

const ContentWrapper = ({ trigger, isTriggerLaunched }) => {
  const client = useClient()

  // trigger keepIndexFullNameAndDisplayNameUpToDate service
  // if never launched before
  if (trigger && isTriggerLaunched === false) {
    log(
      'info',
      `Executing keepIndexFullNameAndDisplayNameUpToDate service by Contacts app`
    )
    client.collection('io.cozy.triggers').launch(trigger)
  }

  const result = useQuery(allContacts.definition, allContacts.options)

  const { fetchStatus, hasMore, fetchMore } = result
  const contacts = result.data === null ? [] : result.data

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
ContentWrapper.propTypes = {
  trigger: PropTypes.object,
  isTriggerLaunched: PropTypes.bool
}
export default ContentWrapper
