import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'
import classNames from 'classnames'
import { Icon, Button } from 'antd'

import { ToolTip } from 'components/ToolTip'

import styles from './styles.scss'

const propTypes = {
    showDetails: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    tooltipPlacement: PropTypes.string,
    className: PropTypes.string,
}
const defaultProps = {
    onClick: noop,
    tooltipPlacement: 'top',
    className: '',
}

const ShowDetailsButton = ({
    showDetails,
    onClick,
    tooltipPlacement,
    className,
    ...rest
}) => (
    <ToolTip
        title={showDetails ? 'Hide Details' : 'Show Details'}
        placement={tooltipPlacement}
    >
        <Button
            onClick={onClick}
            className={classNames(styles['non-styled-button'], className)}
            {...rest}
        >
            <Icon type={showDetails ? 'caret-up' : 'caret-down'} />
        </Button>
    </ToolTip>
)

ShowDetailsButton.propTypes = propTypes
ShowDetailsButton.defaultProps = defaultProps

export default ShowDetailsButton
