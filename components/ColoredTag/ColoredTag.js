import React from 'react'
import PropTypes from 'prop-types'
import { Tag } from 'antd'
import noop from 'lodash/noop'

const propTypes = {
    color: PropTypes.string,
    onClose: PropTypes.func,
    onClick: PropTypes.func,
    className: PropTypes.string,
    closable: PropTypes.bool,
    children: PropTypes.node.isRequired,
}
const defaultProps = {
    color: '#01C7D1',
    onClose: noop,
    onClick: noop,
    className: null,
    closable: false,
}

const ColoredTag = ({ children, ...rest }) => {
    const props = {
        color: rest.color,
        onClose: rest.onClose,
        onClick: rest.onClick,
        closable: rest.closable,
        ...(rest.className ? { className: rest.className } : {}),
    }

    return <Tag {...props}>{children}</Tag>
}

ColoredTag.propTypes = propTypes
ColoredTag.defaultProps = defaultProps

export default ColoredTag
