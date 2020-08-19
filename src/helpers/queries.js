import { Q } from 'cozy-client'
import { DOCTYPE_CONTACTS } from './doctypes'

// export const lastSuccess = {
//   definition: () =>
//     Q('io.cozy.triggers').where({
//       'message.name': 'keepIndexFullNameAndDisplayNameUpToDate'
//     }),
//   options: {
//     as: 'lastSuccess'
//   }
// }

// export const fullLastSuccess = {
//   definition: () =>
//     Q('io.cozy.triggers').where({
//       _id: 'e23d4426fa70245bc9a947fef4000263'
//     }),
//   options: {
//     as: 'fullLastSuccess'
//   }
// }

export const allContacts = {
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

export const contactsbyFamilyNameGivenNameEmailCozyUrl = {
  definition: () =>
    Q(DOCTYPE_CONTACTS)
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
      .sortBy([{ 'indexes.byFamilyNameGivenNameEmailCozyUrl': 'asc' }]),
  options: {
    as: 'contactsbyFamilyNameGivenNameEmailCozyUrl'
  }
}

export const contactsWithoutIndexes = {
  definition: () =>
    Q(DOCTYPE_CONTACTS)
      .include(['accounts'])
      .where({
        'indexes.byFamilyNameGivenNameEmailCozyUrl': {
          $exists: false
        }
      })
      .indexFields(['_id']),
  options: {
    as: 'contactsWithoutIndexes'
  }
}
