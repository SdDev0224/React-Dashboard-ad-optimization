import React from 'react'
import PropTypes from 'prop-types'
import Resizable from 're-resizable'

const propTypes = {
    children: PropTypes.node,
    innerRef: PropTypes.func.isRequired,
}

const defaultProps = {
    children: null,
}

/**
 * Required so Downshift can pass reference to Resizeable
 *
 * @see https://github.com/paypal/downshift/blob/master/README.md#getrootprops
 */
const ResizableWithRef = ({ innerRef, children, ...rest }) => (
    <Resizable ref={innerRef} {...rest}>
        {children}
    </Resizable>
)

ResizableWithRef.propTypes = propTypes
ResizableWithRef.defaultProps = defaultProps

export default ResizableWithRef
