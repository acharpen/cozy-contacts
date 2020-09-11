import React from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import { generateUniversalLink } from 'cozy-ui/transpiled/react/AppLinker'

import { DOCTYPE_CONTACTS } from '../../helpers/doctypes'

export const getFilteredStoreUrl = client =>
  generateUniversalLink({
    cozyUrl: client.getStackClient().uri,
    slug: 'store',
    subDomainType: client.getInstanceOptions().cozySubdomainType,
    nativePath: `discover/?type=konnector&doctype=${DOCTYPE_CONTACTS}`
  })

const StoreButton = () => {
  const client = useClient()
  const { t } = useI18n()
  const appStoreUrl = getFilteredStoreUrl(client)

  return (
    <ButtonLink
      className="u-m-0"
      href={appStoreUrl}
      label={t('empty.store')}
      theme="secondary"
      extension="full"
      icon={<AppIcon app={'store'} className="u-h-1 u-w-1 u-mr-half" />}
    />
  )
}

export default StoreButton
