import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'
import classNames from 'classnames'
import { Button } from 'antd'

import { AddLabelIcon } from 'components/Icons'
import { ToolTip } from 'components/ToolTip'

import styles from './styles.scss'

const propTypes = {
    onClick: PropTypes.func,
    tooltipTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    tooltipPlacement: PropTypes.string,
    className: PropTypes.string,
}
const defaultProps = {
    onClick: noop,
    tooltipTitle: 'Add Labels',
    tooltipPlacement: 'top',
    className: '',
}

const CreateLabelButton = ({
    onClick,
    tooltipTitle,
    tooltipPlacement,
    className,
}) => (
    <ToolTip title={tooltipTitle} placement={tooltipPlacement}>
        <Button
            onClick={onClick}
            className={classNames(styles['non-styled-button'], className)}
        >
            <AddLabelIcon />
        </Button>
    </ToolTip>
)

CreateLabelButton.propTypes = propTypes
CreateLabelButton.defaultProps = defaultProps

export default CreateLabelButton
