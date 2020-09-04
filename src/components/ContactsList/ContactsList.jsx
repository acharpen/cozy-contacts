import React, { Component } from 'react'
import PropTypes from 'prop-types'
import flag from 'cozy-flags'
import Button from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'

// import { categorizeContacts } from '../../helpers/contactList'
import ContactsEmptyList from './ContactsEmptyList'
import ContactRow from './ContactRow'
// import ContactHeaderRow from './ContactHeaderRow'
import withModal from '../HOCs/withModal'
import ContactCardModal from '../Modals/ContactCardModal'
import withSelection from '../Selection/selectionContainer'

class ContactsList extends Component {
  showModalOnRowClick = contact => {
    console.info('showModalOnRowClick')
    this.props.showModal(
      <ContactCardModal onClose={this.hideContactCard} id={contact._id} />
    )
  }

  render() {
    const { clearSelection, contacts, selection, selectAll, t } = this.props

    if (contacts.length === 0) {
      return <ContactsEmptyList />
    } else {
      // console.info('ContactsList')
      const allContactsSelected = contacts.length === selection.length
      // const categorizedContacts = categorizeContacts(contacts, t('empty-list'))

      return (
        <div className="list-wrapper">
          {flag('select-all-contacts') && (
            <div>
              <Button
                label={
                  allContactsSelected ? t('unselect-all') : t('select-all')
                }
                theme="secondary"
                onClick={() =>
                  allContactsSelected ? clearSelection() : selectAll(contacts)
                }
              />
            </div>
          )}
          <ol className="list-contact">
            {Object.values(contacts).map(contact => (
              <ContactRow
                id={contact._id}
                key={contact._id}
                contact={contact}
                onClick={this.showModalOnRowClick}
              />
            ))}

            {/* {Object.keys(categorizedContacts).map(header => (
              <li key={`cat-${header}`}>
                <ContactHeaderRow key={header} header={header} />
                <ol className="sublist-contact">
                  {categorizedContacts[header].map(contact => (
                    <li key={`contact-${contact._id}`}>
                      <ContactRow
                        id={contact._id}
                        key={contact._id}
                        contact={contact}
                        onClick={this.showModalOnRowClick}
                      />
                    </li>
                  ))}
                </ol>
              </li>
            ))} */}
          </ol>
          <div />
        </div>
      )
    }
  }
}
ContactsList.propTypes = {
  showModal: PropTypes.func.isRequired,
  contacts: PropTypes.array.isRequired
}
ContactsList.defaultProps = {}

export default translate()(withModal(withSelection(ContactsList)))
