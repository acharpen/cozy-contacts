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
import Content from './Content'

const ContactsApp = props => {
  // HACK to avoid CozyBar error :
  // you tried to use the CozyBar API (BarCenter) but the CozyBar is not initialised yet via cozy.bar.init
  // TODO : TO BE REMOVED
  const [cozyBarHack, setcozyBarHack] = useState(false)

  useEffect(() => {
    initFlags()
    props.cleanTrashedGroups()

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
        <Content />
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
