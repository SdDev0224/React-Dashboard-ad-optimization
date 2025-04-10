import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const AppLink = ({ children, ...rest }) => <Link {...rest}>{children}</Link>

AppLink.propTypes = {
    children: PropTypes.node,
}
AppLink.defaultProps = {
    children: null,
}

export default AppLink
