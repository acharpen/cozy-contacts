import React from 'react'
import { PropTypes } from 'prop-types'

import { Query, isQueryLoading } from 'cozy-client'
import { Content } from 'cozy-ui/transpiled/react/Layout'

import Header from './Header'
import Toolbar from './Toolbar'
import ContactsList from './ContactsList/ContactsList.jsx'
import SpinnerContact from './Components/Spinner'
import {
  contactsByFamilyNameGivenNameEmailCozyUrl,
  contactsWithoutIndexes
} from '../helpers/queries'
// import { reworkContacts } from '../helpers/contacts'

export const ContentWrapperResult = ({
  // hasServiceBeenLaunched,
  contactsWithIndexesResult,
  contactsWithNoIndexesResult
}) => {
  const dataHaveBeenLoaded =
    !isQueryLoading(contactsWithIndexesResult) &&
    !isQueryLoading(contactsWithNoIndexesResult) &&
    !contactsWithIndexesResult.hasMore &&
    !contactsWithNoIndexesResult.hasMore

  if (!dataHaveBeenLoaded)
    return <SpinnerContact size="xxlarge" loadingType="fetching_contacts" />

  // const contacts = reworkContacts(
  //   hasServiceBeenLaunched,
  //   contactsWithIndexesResult.data,
  //   contactsWithNoIndexesResult.data
  // )

  return (
    <>
      {contactsWithIndexesResult.data.length >= 1 && (
        <Header right={<Toolbar />} />
      )}
      <Content>
        <ContactsList contacts={contactsWithIndexesResult.data} />
      </Content>
    </>
  )
}

const ContentWrapper = ({ hasServiceBeenLaunched }) => {
  return (
    <Query
      query={contactsByFamilyNameGivenNameEmailCozyUrl.definition}
      as={contactsByFamilyNameGivenNameEmailCozyUrl.options.as}
    >
      {contactsWithIndexesResult => {
        if (contactsWithIndexesResult.hasMore) {
          contactsWithIndexesResult.fetchMore()
        }

        return (
          <Query
            query={contactsWithoutIndexes.definition}
            as={contactsWithoutIndexes.options.as}
          >
            {contactsWithNoIndexesResult => {
              if (contactsWithNoIndexesResult.hasMore) {
                contactsWithNoIndexesResult.fetchMore()
              }

              return (
                <ContentWrapperResult
                  hasServiceBeenLaunched={hasServiceBeenLaunched}
                  contactsWithIndexesResult={contactsWithIndexesResult}
                  contactsWithNoIndexesResult={contactsWithNoIndexesResult}
                />
              )
            }}
          </Query>
        )
      }}
    </Query>
  )
}

ContentWrapper.propTypes = {
  hasServiceBeenLaunched: PropTypes.bool
}

export default ContentWrapper
