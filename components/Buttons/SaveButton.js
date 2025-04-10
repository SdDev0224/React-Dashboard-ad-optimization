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
    tooltipTitle: 'Save',
    tooltipPlacement: 'top',
}

const SaveButton = ({ onClick, loading, tooltipTitle, tooltipPlacement }) => (
    <ToolTip title={tooltipTitle} placement={tooltipPlacement}>
        <Button
            icon="save"
            shape="circle"
            onClick={onClick}
            loading={loading}
            className={styles['no-border']}
        />
    </ToolTip>
)

SaveButton.propTypes = propTypes
SaveButton.defaultProps = defaultProps

export default SaveButton
