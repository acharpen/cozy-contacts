import React from 'react'
import { PropTypes } from 'prop-types'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import ContactsListDataLoader from '../ContactsList/ContactsListDataLoader'
import Header from '../Header'
import Toolbar from '../Toolbar'

const ShowContent = ({ result }) => {
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
// ShowContent.propTypes = {
//   fetchStatus: PropTypes.string.isRequired,
//   hasMore: PropTypes.bool.isRequired,
//   contacts: PropTypes.array.isRequired,
//   fetchMore: PropTypes.func.isRequired
// }
ShowContent.propTypes = {
  result: PropTypes.object.isRequired
}

export default ShowContent
