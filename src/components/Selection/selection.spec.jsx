import React from 'react'
import PropTypes from 'prop-types'
import { shallow } from 'enzyme'
import selectionContainer from './selectionContainer'
import AppLike from '../../tests/Applike'
import configureStore from '../../store/configureStore'
import getCozyClient from '../../tests/client'

const DummyComponent = ({ title = '' }) => <span title={title} />
DummyComponent.propTypes = {
  title: PropTypes.string
}
const DummyComponentWithSelection = selectionContainer(DummyComponent)

// Uses a different version of react-redux
// to prevent Enzyme's incompatibility with actual react-redux version
// see https://github.com/enzymejs/enzyme/issues/2202 and https://github.com/enzymejs/enzyme/issues/2302
jest.mock('react-redux', () => require('react-redux-test'))

describe('A component with selection', () => {
  let testedComponent
  let wrapper = ''
  let noConnectedComponent
  let realConnectedComponent
  beforeEach(() => {
    const store = configureStore(getCozyClient(), null, {})

    const root = (
      <AppLike>
        <DummyComponentWithSelection store={store} />
      </AppLike>
    )
    wrapper = shallow(root)
    testedComponent = wrapper.dive()
    noConnectedComponent = testedComponent.find('Connect(DummyComponent)')
    realConnectedComponent = noConnectedComponent.dive()
  })

  it('should toggle the selection', () => {
    realConnectedComponent.prop('toggleSelection')({ _id: 1, id: 1 })
    realConnectedComponent.prop('toggleSelection')({ _id: 2, id: 2 })
    realConnectedComponent.update()

    expect(realConnectedComponent.prop('selection')).toEqual([
      { _id: 1, id: 1 },
      { _id: 2, id: 2 }
    ])

    realConnectedComponent.prop('toggleSelection')({ _id: 2, id: 2 })
    realConnectedComponent.update()
    expect(realConnectedComponent.prop('selection')).toEqual([
      { _id: 1, id: 1 }
    ])
  })

  it('should clear the selection', () => {
    expect(realConnectedComponent.prop('selection').length).toEqual(0)

    realConnectedComponent.prop('toggleSelection')({ _id: 1, id: 1 })
    realConnectedComponent.prop('toggleSelection')({ _id: 2, id: 2 })
    realConnectedComponent.update()

    expect(realConnectedComponent.prop('selection').length).toEqual(2)

    realConnectedComponent.prop('clearSelection')()
    realConnectedComponent.update()

    expect(realConnectedComponent.prop('selection').length).toEqual(0)
  })

  it('should pass other props', () => {
    const root = (
      <AppLike>
        <DummyComponentWithSelection title={'with prop'} />
      </AppLike>
    )
    testedComponent = shallow(root)
    noConnectedComponent = testedComponent.find('Connect(DummyComponent)')

    expect(noConnectedComponent.prop('title')).toEqual('with prop')
  })
})
