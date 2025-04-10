/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import noop from 'lodash/noop'

import styles from './styles.scss'

class Collapse extends Component {
    static propTypes = {
        children: PropTypes.node,
        isOpened: PropTypes.bool,
        onRest: PropTypes.func,
    }

    static defaultProps = {
        children: null,
        isOpened: false,
        onRest: noop,
    }

    state = {
        height: '0',
        overflow: 'hidden',
        visibility: 'hidden',
    }

    componentDidMount() {
        const { isOpened } = this.props
        if (this.content && isOpened) {
            this.setExpanded()
        }
    }

    componentDidUpdate(prevProps) {
        const { isOpened } = this.props

        if (!this.content) {
            return
        }

        // expand
        if (!prevProps.isOpened && isOpened) {
            this.setState({
                height: `${this.getHeight()}px`,
                visibility: 'visible',
            })
        }

        // collapse
        if (prevProps.isOpened && !isOpened) {
            this.setState({ height: `${this.getHeight()}px` })
            window.requestAnimationFrame(() => {
                setTimeout(() => {
                    this.setState({
                        height: '0',
                        overflow: 'hidden',
                    })
                })
            })
        }
    }

    @autobind
    onTransitionEnd(e) {
        const { onRest, isOpened } = this.props

        if (e.target === this.content && e.propertyName === 'height') {
            if (isOpened) {
                this.setExpanded()
            } else {
                this.setCollapsed()
            }
            if (onRest) {
                onRest()
            }
        }
    }

    setCollapsed() {
        this.setState({ visibility: 'hidden' })
    }

    setExpanded() {
        this.setState({
            height: 'auto',
            overflow: 'visible',
            visibility: 'visible',
        })
    }

    getHeight() {
        return this.content.scrollHeight
    }

    render() {
        const { children } = this.props
        const { height, overflow, visibility } = this.state
        return (
            <div
                ref={el => {
                    this.content = el
                }}
                style={{ height, overflow, visibility }}
                className={styles['collapse-wrapper']}
                onTransitionEnd={this.onTransitionEnd}
            >
                {children}
            </div>
        )
    }
}

export default Collapse
