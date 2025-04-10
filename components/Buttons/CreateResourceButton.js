import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import noop from 'lodash/noop'

const propTypes = {
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
}
const defaultProps = {
    onClick: noop,
    loading: false,
    children: null,
    className: '',
}

const CreateResourceButton = ({ onClick, loading, children, className }) => (
    <Button
        className={className}
        icon="plus"
        type="primary"
        onClick={onClick}
        loading={loading}
    >
        {children}
    </Button>
)

CreateResourceButton.propTypes = propTypes
CreateResourceButton.defaultProps = defaultProps

export default CreateResourceButton
