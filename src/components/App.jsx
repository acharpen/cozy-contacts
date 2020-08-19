/* global cozy */
import React, { useState, useEffect } from 'react'
import { PropTypes } from 'prop-types'
import flow from 'lodash/flow'
import { Main, Layout } from 'cozy-ui/transpiled/react/Layout'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { Title } from 'cozy-ui/transpiled/react/Text'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import flag, { FlagSwitcher } from 'cozy-flags'

import { Sprite as IconSprite } from 'cozy-ui/transpiled/react/Icon'
import 'cozy-ui/transpiled/react/stylesheet.css'

import withContactsMutations from '../connections/allContacts'
import ContactsSelectionBar from './layout/ContactsSelectionBar'
import { ModalManager } from '../helpers/modalManager'
import { initFlags } from '../helpers/flags'
import container from './AppContainer'
import { useClient } from 'cozy-client'
import ContentWrapper from './Content/ContentWrapper'
import SpinnerContact from './Components/Spinner'

const ContactsApp = props => {
  // HACK to avoid CozyBar error :
  // you tried to use the CozyBar API (BarCenter) but the CozyBar is not initialised yet via cozy.bar.init
  // TODO : TO BE REMOVED
  const [cozyBarHack, setcozyBarHack] = useState(false)

  const [trigger, setTrigger] = useState(null)
  const [isTriggerLaunched, setIsTriggerLaunched] = useState(null)

  const setTriggerAndIsTriggerLaunched = async client => {
    const triggerName = 'keepIndexFullNameAndDisplayNameUpToDate'
    const triggers = await client.query(
      client.find('io.cozy.triggers', {
        'message.name': triggerName
      })
    )
    const normalizedTrigger = await client.query(
      client.get('io.cozy.triggers', triggers.data[0].id)
    )
    const trigger = normalizedTrigger.data
    setTrigger(trigger)
    setIsTriggerLaunched(trigger.current_state.last_success.length > 0)
  }

  const client = useClient()

  useEffect(() => {
    initFlags()
    props.cleanTrashedGroups()
    if (!trigger) {
      setTriggerAndIsTriggerLaunched(client)
    }

    // HACK to be removed
    setTimeout(() => {
      setcozyBarHack(true)
    }, 0)
  }, [])

  const { BarCenter } = cozy.bar
  const {
    t,
    breakpoints: { isMobile },
    deleteContact
  } = props

  return (
    <Layout monocolumn="true">
      {isMobile &&
        cozyBarHack && (
          <BarCenter>
            <Title>
              <span className={'fil-path-title'}>Contacts</span>
            </Title>
          </BarCenter>
        )}
      <Main>
        {flag('switcher') && <FlagSwitcher />}
        <ContactsSelectionBar trashAction={deleteContact} />
        {isTriggerLaunched === null ? (
          <SpinnerContact size="xxlarge" loadingType="fetching_contacts" />
        ) : (
          <ContentWrapper
            trigger={trigger}
            isTriggerLaunched={isTriggerLaunched}
          />
        )}
        <Alerter t={t} />
        <ModalManager />
      </Main>
      <IconSprite />
    </Layout>
  )
}

ContactsApp.propTypes = {
  deleteContact: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default flow(
  translate(),
  withContactsMutations,
  container,
  withBreakpoints()
)(ContactsApp)
