import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
    size: PropTypes.number,
    color: PropTypes.string.isRequired,
}

const defaultProps = {
    size: 18,
}

const ColorCircle = ({ size, color }) => (
    <div
        style={{
            height: `${size}px`,
            width: `${size}px`,
            borderRadius: `${size}px`,
            backgroundColor: color,
        }}
    />
)

ColorCircle.propTypes = propTypes
ColorCircle.defaultProps = defaultProps

export default ColorCircle
