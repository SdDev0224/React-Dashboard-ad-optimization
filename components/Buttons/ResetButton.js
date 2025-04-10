import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import noop from 'lodash/noop'

import { ToolTip } from 'components/ToolTip'

import styles from './styles.scss'

const propTypes = {
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    tooltipTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    tooltipPlacement: PropTypes.string,
}
const defaultProps = {
    onClick: noop,
    loading: false,
    tooltipTitle: 'Reset',
    tooltipPlacement: 'top',
}

const ResetButton = ({ onClick, loading, tooltipTitle, tooltipPlacement }) => (
    <ToolTip title={tooltipTitle} placement={tooltipPlacement}>
        <Button
            icon="close-circle"
            shape="circle"
            onClick={onClick}
            loading={loading}
            className={styles['no-border']}
        />
    </ToolTip>
)

ResetButton.propTypes = propTypes
ResetButton.defaultProps = defaultProps

export default ResetButton
