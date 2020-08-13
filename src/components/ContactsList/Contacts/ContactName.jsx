import React from 'react'
import PropTypes from 'prop-types'

const ContactName = ({ displayName, lastname }) => {
  const namesToShow = (displayName && displayName.split(' ')) || []
  return (
    <div className="u-ellipsis">
      {namesToShow.map((name, key) => (
        <>
          <span
            key={key}
            className={name === lastname ? 'contact-lastname' : 'u-ml-1'}
          >
            {name}
          </span>
          &nbsp;
        </>
      ))}
    </div>
  )
}
ContactName.propTypes = {
  firstname: PropTypes.string,
  lastname: PropTypes.string,
  me: PropTypes.bool
}
ContactName.defaultProps = {
  firstname: '',
  lastname: '',
  me: false
}
export default ContactName
