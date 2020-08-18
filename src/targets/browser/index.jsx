/* global cozy */

import 'styles'

import React from 'react'
import { Provider } from 'react-redux'
import { CozyProvider } from 'cozy-client'
import { render } from 'react-dom'
import { I18n, initTranslation } from 'cozy-ui/transpiled/react/I18n'
import App from 'components/App'
import configureStore from 'store/configureStore'
import { hot } from 'react-hot-loader'
import { getClient } from '../../helpers/client'
import { getValues } from '../../helpers/bar'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'

const HotedApp = hot(module)(App)

function init() {
  const root = document.querySelector('[role=application]')
  const { appName, appNamePrefix, iconPath, lang } = getValues(root.dataset)
  const polyglot = initTranslation(lang, lang => require(`locales/${lang}`))
  const client = getClient()
  const persistedState = {}
  const store = configureStore(
    client,
    polyglot.t.bind(polyglot),
    persistedState
  )

  /** I don't know why I need to for this... But if I don't it seems that
   * we have a race between configureStore and initCozyBar resulting in
   * an error from cozy-client "store is already defined"
   */
  setTimeout(() => {
    cozy.bar.init({
      appName,
      appNamePrefix,
      cozyClient: client,
      iconPath,
      lang,
      replaceTitleOnMobile: false
    })
  }, 0)

  render(
    <Provider store={store}>
      <CozyProvider client={client} store={store}>
        <I18n lang={lang} polyglot={polyglot}>
          <MuiCozyTheme>
            <HotedApp />
          </MuiCozyTheme>
        </I18n>
      </CozyProvider>
    </Provider>,
    root
  )
}

document.addEventListener('DOMContentLoaded', () => {
  init()
})
