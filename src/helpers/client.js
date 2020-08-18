import CozyClient from 'cozy-client'
import manifest from '../../manifest.webapp'
import { schema } from './doctypes'

const getCozyURI = () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  const protocol = window.location.protocol

  return `${protocol}//${data.cozyDomain}`
}

const getToken = () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset

  return data.cozyToken
}

export const getClient = () => {
  const uri = getCozyURI()
  const token = getToken()

  return new CozyClient({
    uri,
    token,
    appMetadata: {
      slug: manifest.name,
      version: manifest.version
    },
    schema
  })
}
