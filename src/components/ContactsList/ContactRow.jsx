import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import isEqual from 'lodash/isEqual'

import { models } from 'cozy-client'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import { fullContactPropTypes } from '../ContactPropTypes'
import ContactWithSelection from './ContactSelection'
import ContactPhone from './Contacts/ContactPhone'
import ContactIdentity from './Contacts/ContactIdentity'
import ContactCozy from './Contacts/ContactCozy'
import ContactEmail from './Contacts/ContactEmail'

const { getPrimaryCozy, getPrimaryPhone, getPrimaryEmail } = models.contact

// id de contact modifié : e4d02e0624a00d56343b13635b05fa52
// id d'un contact non modifié : bd35b629-5b2a-4475-b990-ed81544bb186

class ContactRow extends PureComponent {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.contact.id === 'e4d02e0624a00d56343b13635b05fa52' ||
      this.props.contact.id === 'bd35b629-5b2a-4475-b990-ed81544bb186'
    ) {
      if (nextProps.breakpoints !== this.props.breakpoints)
        console.info('ContactRow : prop breakpoints changed')

      if (nextProps.contact !== this.props.contact)
        // console.info('compare contact', nextProps.contact, this.props.contact)
        console.info('ContactRow : prop contact changed')

      if (!isEqual(nextProps.contact, this.props.contact)) {
        console.info('ContactRow deep comp: prop contact changed')
        console.info(nextProps.contact, this.props.contact)
      }

      if (nextProps.onClick !== this.props.onClick)
        // console.info('compare onClick', nextProps.onClick, this.props.onClick)
        console.info('ContactRow : prop onClick changed')
    }

    return true
  }

  // tous les contacts ou seulement quelques uns => tous
  // remonter la chaine

  render() {
    const {
      contact,
      onClick,
      breakpoints: { isMobile }
    } = this.props
    const email = getPrimaryEmail(contact) || undefined
    const phone = getPrimaryPhone(contact) || undefined
    const cozyUrl = getPrimaryCozy(contact) || undefined

    console.info('ContactRow')

    // const toto1 = {
    //   id: 'bd35b629-5b2a-4475-b990-ed81544bb186',
    //   _id: 'bd35b629-5b2a-4475-b990-ed81544bb186',
    //   _type: 'io.cozy.contacts',
    //   _rev: '2-2087539d9f6b93df44c7b1adfe15f936',
    //   address: [
    //     {
    //       city: 'Brisbane',
    //       country: 'New Zealand',
    //       postcode: '19161',
    //       primary: true,
    //       street: '93 Sawmill Lane'
    //     }
    //   ],
    //   birthday: '1963-11-25',
    //   displayName: 'Aiden Backer',
    //   email: [
    //     {
    //       address: 'aiden.backer@sealine.mobi',
    //       primary: true
    //     }
    //   ],
    //   fullname: 'Aiden Backer',
    //   indexes: {
    //     byFamilyNameGivenNameEmailCozyUrl:
    //       'Backeraidenaiden.backer@sealine.mobi'
    //   },
    //   name: {
    //     familyName: 'Backer',
    //     givenName: 'Aiden'
    //   },
    //   phone: [
    //     {
    //       number: '+33 (4)8 91 13 14 66',
    //       primary: true
    //     }
    //   ],
    //   relationships: {},
    //   groups: {
    //     target: {
    //       id: 'bd35b629-5b2a-4475-b990-ed81544bb186',
    //       _id: 'bd35b629-5b2a-4475-b990-ed81544bb186',
    //       _type: 'io.cozy.contacts',
    //       _rev: '2-2087539d9f6b93df44c7b1adfe15f936',
    //       address: [
    //         {
    //           city: 'Brisbane',
    //           country: 'New Zealand',
    //           postcode: '19161',
    //           primary: true,
    //           street: '93 Sawmill Lane'
    //         }
    //       ],
    //       birthday: '1963-11-25',
    //       displayName: 'Aiden Backer',
    //       email: [
    //         {
    //           address: 'aiden.backer@sealine.mobi',
    //           primary: true
    //         }
    //       ],
    //       fullname: 'Aiden Backer',
    //       indexes: {
    //         byFamilyNameGivenNameEmailCozyUrl:
    //           'Backeraidenaiden.backer@sealine.mobi'
    //       },
    //       name: {
    //         familyName: 'Backer',
    //         givenName: 'Aiden'
    //       },
    //       phone: [
    //         {
    //           number: '+33 (4)8 91 13 14 66',
    //           primary: true
    //         }
    //       ],
    //       relationships: {}
    //     },
    //     name: 'groups',
    //     doctype: 'io.cozy.contacts.groups'
    //   },
    //   accounts: {
    //     target: {
    //       id: 'bd35b629-5b2a-4475-b990-ed81544bb186',
    //       _id: 'bd35b629-5b2a-4475-b990-ed81544bb186',
    //       _type: 'io.cozy.contacts',
    //       _rev: '2-2087539d9f6b93df44c7b1adfe15f936',
    //       address: [
    //         {
    //           city: 'Brisbane',
    //           country: 'New Zealand',
    //           postcode: '19161',
    //           primary: true,
    //           street: '93 Sawmill Lane'
    //         }
    //       ],
    //       birthday: '1963-11-25',
    //       displayName: 'Aiden Backer',
    //       email: [
    //         {
    //           address: 'aiden.backer@sealine.mobi',
    //           primary: true
    //         }
    //       ],
    //       fullname: 'Aiden Backer',
    //       indexes: {
    //         byFamilyNameGivenNameEmailCozyUrl:
    //           'Backeraidenaiden.backer@sealine.mobi'
    //       },
    //       name: {
    //         familyName: 'Backer',
    //         givenName: 'Aiden'
    //       },
    //       phone: [
    //         {
    //           number: '+33 (4)8 91 13 14 66',
    //           primary: true
    //         }
    //       ],
    //       relationships: {}
    //     },
    //     name: 'accounts',
    //     doctype: 'io.cozy.contacts.accounts'
    //   }
    // }

    // const toto2 = {
    //   id: 'bd35b629-5b2a-4475-b990-ed81544bb186',
    //   _id: 'bd35b629-5b2a-4475-b990-ed81544bb186',
    //   _type: 'io.cozy.contacts',
    //   _rev: '2-2087539d9f6b93df44c7b1adfe15f936',
    //   address: [
    //     {
    //       city: 'Brisbane',
    //       country: 'New Zealand',
    //       postcode: '19161',
    //       primary: true,
    //       street: '93 Sawmill Lane'
    //     }
    //   ],
    //   birthday: '1963-11-25',
    //   displayName: 'Aiden Backer',
    //   email: [
    //     {
    //       address: 'aiden.backer@sealine.mobi',
    //       primary: true
    //     }
    //   ],
    //   fullname: 'Aiden Backer',
    //   indexes: {
    //     byFamilyNameGivenNameEmailCozyUrl:
    //       'Backeraidenaiden.backer@sealine.mobi'
    //   },
    //   name: {
    //     familyName: 'Backer',
    //     givenName: 'Aiden'
    //   },
    //   phone: [
    //     {
    //       number: '+33 (4)8 91 13 14 66',
    //       primary: true
    //     }
    //   ],
    //   relationships: {},
    //   groups: {
    //     target: {
    //       id: 'bd35b629-5b2a-4475-b990-ed81544bb186',
    //       _id: 'bd35b629-5b2a-4475-b990-ed81544bb186',
    //       _type: 'io.cozy.contacts',
    //       _rev: '2-2087539d9f6b93df44c7b1adfe15f936',
    //       address: [
    //         {
    //           city: 'Brisbane',
    //           country: 'New Zealand',
    //           postcode: '19161',
    //           primary: true,
    //           street: '93 Sawmill Lane'
    //         }
    //       ],
    //       birthday: '1963-11-25',
    //       displayName: 'Aiden Backer',
    //       email: [
    //         {
    //           address: 'aiden.backer@sealine.mobi',
    //           primary: true
    //         }
    //       ],
    //       fullname: 'Aiden Backer',
    //       indexes: {
    //         byFamilyNameGivenNameEmailCozyUrl:
    //           'Backeraidenaiden.backer@sealine.mobi'
    //       },
    //       name: {
    //         familyName: 'Backer',
    //         givenName: 'Aiden'
    //       },
    //       phone: [
    //         {
    //           number: '+33 (4)8 91 13 14 66',
    //           primary: true
    //         }
    //       ],
    //       relationships: {}
    //     },
    //     name: 'groups',
    //     doctype: 'io.cozy.contacts.groups'
    //   },
    //   accounts: {
    //     target: {
    //       id: 'bd35b629-5b2a-4475-b990-ed81544bb186',
    //       _id: 'bd35b629-5b2a-4475-b990-ed81544bb186',
    //       _type: 'io.cozy.contacts',
    //       _rev: '2-2087539d9f6b93df44c7b1adfe15f936',
    //       address: [
    //         {
    //           city: 'Brisbane',
    //           country: 'New Zealand',
    //           postcode: '19161',
    //           primary: true,
    //           street: '93 Sawmill Lane'
    //         }
    //       ],
    //       birthday: '1963-11-25',
    //       displayName: 'Aiden Backer',
    //       email: [
    //         {
    //           address: 'aiden.backer@sealine.mobi',
    //           primary: true
    //         }
    //       ],
    //       fullname: 'Aiden Backer',
    //       indexes: {
    //         byFamilyNameGivenNameEmailCozyUrl:
    //           'Backeraidenaiden.backer@sealine.mobi'
    //       },
    //       name: {
    //         familyName: 'Backer',
    //         givenName: 'Aiden'
    //       },
    //       phone: [
    //         {
    //           number: '+33 (4)8 91 13 14 66',
    //           primary: true
    //         }
    //       ],
    //       relationships: {}
    //     },
    //     name: 'accounts',
    //     doctype: 'io.cozy.contacts.accounts'
    //   }
    // }

    // console.info('isEqual', isEqual(toto1, toto2))
    // console.info('===', toto1 === toto2)

    return (
      <div
        className="contact"
        onClick={() => {
          onClick(contact)
        }}
      >
        <ContactWithSelection contact={contact} />
        <ContactIdentity contact={contact} />
        {!isMobile && <ContactEmail email={email} />}
        {!isMobile && <ContactPhone phone={phone} />}
        {!isMobile && <ContactCozy cozyUrl={cozyUrl} />}
      </div>
    )
  }
}

ContactRow.propTypes = {
  contact: fullContactPropTypes.isRequired,
  onClick: PropTypes.func
}
ContactRow.defaultProps = {
  selection: null,
  onClick: null
}

export default withBreakpoints()(ContactRow)
