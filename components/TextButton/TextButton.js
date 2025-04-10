import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import noop from 'lodash/noop'
import classNames from 'classnames'

import styles from './styles.scss'

const propTypes = {
    icon: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    link: PropTypes.bool,
    disabled: PropTypes.bool,
}
const defaultProps = {
    icon: null,
    className: null,
    onClick: noop,
    link: false,
    disabled: false,
}

const TextButton = ({ children, ...rest }) => {
    const { icon, onClick, className, link, disabled } = rest
    return (
        <div
            className={classNames(className, {
                [styles.button]: !disabled,
                [styles.disabled]: disabled,
                [styles.link]: link,
            })}
            onClick={disabled ? undefined : onClick}
            role="button"
            tabIndex="-1"
            onKeyPress={noop}
        >
            {icon && <Icon type={icon} />}
            <span>{children}</span>
        </div>
    )
}

TextButton.propTypes = propTypes
TextButton.defaultProps = defaultProps

export default TextButton
