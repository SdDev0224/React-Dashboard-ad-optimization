import React, { Component } from 'react'
import { Input, Icon } from 'antd'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'

/**
 * Search component from Ant Design that always has focus when it's visible.
 */
class SearchInput extends Component {
    static propTypes = {
        downshift: PropTypes.shape().isRequired,
        placeholder: PropTypes.string.isRequired,
        visible: PropTypes.bool.isRequired,
        onKeyDown: PropTypes.func,
        loading: PropTypes.bool,
    }

    static defaultProps = {
        onKeyDown: noop,
        loading: false,
    }

    inputRef = React.createRef()

    componentDidMount() {
        const { visible } = this.props
        if (visible) {
            this.inputRef.current.focus()
        } else {
            this.inputRef.current.blur()
        }
    }

    componentDidUpdate() {
        const { visible } = this.props
        if (visible) {
            this.inputRef.current.focus()
        } else {
            this.inputRef.current.blur()
        }
    }

    render() {
        const { downshift, placeholder, onKeyDown, loading } = this.props
        const suffix = loading ? <Icon type="loading" /> : null

        return (
            <Input
                {...downshift.getInputProps({
                    placeholder,
                    onKeyDown,
                    ref: this.inputRef,
                    suffix,
                })}
            />
        )
    }
}

export default SearchInput
