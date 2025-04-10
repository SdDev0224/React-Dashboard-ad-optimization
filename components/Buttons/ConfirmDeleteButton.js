import React from 'react'
import PropTypes from 'prop-types'
import { Popconfirm } from 'antd'

import { ActionIcon } from 'components/PaginatedTable'

const propTypes = {
    title: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
}

const ConfirmDeleteButton = ({ title, onConfirm, ...rest }) => (
    <Popconfirm
        title={title}
        onConfirm={onConfirm}
        okText="Delete"
        cancelText="Cancel"
        placement="topRight"
        okType="danger"
    >
        <ActionIcon type="delete" {...rest} />
    </Popconfirm>
)

ConfirmDeleteButton.propTypes = propTypes

export default ConfirmDeleteButton
