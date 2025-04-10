import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'

import './styles.scss'

const CustomToolTip = ({ children, ...rest }) => (
    <Tooltip {...rest}>{children}</Tooltip>
)

CustomToolTip.propTypes = {
    children: PropTypes.node,
}
CustomToolTip.defaultProps = {
    children: null,
}

export default CustomToolTip
