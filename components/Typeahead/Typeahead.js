import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import isEmpty from 'lodash/isEmpty'
import autobind from 'autobind-decorator'
import classNames from 'classnames'
import noop from 'lodash/noop'
import replace from 'lodash/replace'
import uniq from 'lodash/uniq'

import { ColoredTag } from 'components/ColoredTag'
import { Footer } from 'components/FilterControls'

import SearchInput from './SearchInput'
import Resizable from './Resizeable'
import styles from './styles.scss'

class Typeahead extends Component {
    static downshiftStateReducer(state, changes) {
        // this prevents the menu from being closed and prevents auto
        // complete of the input when the user selects an item with a keyboard or mouse
        switch (changes.type) {
            case Downshift.stateChangeTypes.keyDownEnter:
            case Downshift.stateChangeTypes.mouseUp:
            case Downshift.stateChangeTypes.clickItem:
                return {
                    ...changes,
                    isOpen: state.isOpen,
                    highlightedIndex: state.highlightedIndex,
                    inputValue: state.inputValue,
                }
            default:
                return changes
        }
    }

    static formatMatches(item, inputValue) {
        // underline matches found in option string
        const uniqueMatches = uniq(
            item.label.match(new RegExp(inputValue, 'gi')) || []
        )
        const option = uniqueMatches.reduce(
            (accumulator, match) =>
                replace(accumulator, new RegExp(match, 'g'), `<u>${match}</u>`),
            item.label
        )

        const metadata = item.metadata ? ` (<em>${item.metadata}</em>)` : ''

        return {
            ...item,
            html: `<strong>${option}</strong>${metadata}`,
        }
    }

    static propTypes = {
        placeholder: PropTypes.string.isRequired,
        toggleOptionSelection: PropTypes.func.isRequired,
        onChangeInput: PropTypes.func.isRequired,
        visible: PropTypes.bool,
        loading: PropTypes.bool.isRequired,
        selectedOptions: PropTypes.array,
        deselectOption: PropTypes.func.isRequired,
        resetLinkText: PropTypes.string,
        handleReset: PropTypes.func.isRequired,
        handleApply: PropTypes.func.isRequired,
        handleKeyDown: PropTypes.func,
        options: PropTypes.array.isRequired,
        dirty: PropTypes.bool.isRequired,
        color: PropTypes.string,
    }

    static defaultProps = {
        visible: true,
        selectedOptions: [],
        resetLinkText: null,
        handleKeyDown: noop,
        color: undefined,
    }

    @autobind
    syncDownshiftState(change) {
        const { toggleOptionSelection, onChangeInput } = this.props

        // toggle items from state when enter key is pressed
        if (change.type === Downshift.stateChangeTypes.keyDownEnter) {
            toggleOptionSelection(change.selectedItem)
        }

        if (
            change.type === Downshift.stateChangeTypes.changeInput &&
            !isEmpty(change.inputValue)
        ) {
            onChangeInput(change.inputValue)
        }
    }

    filteredOptions(inputValue) {
        const { options } = this.props
        return options
            .filter(
                item =>
                    !inputValue ||
                    item.label.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map(item => Typeahead.formatMatches(item, inputValue))
    }

    renderTypeahead(downshift) {
        const {
            getItemProps,
            getMenuProps,
            isOpen,
            inputValue,
            highlightedIndex,
            selectedItem,
        } = downshift
        const { toggleOptionSelection, selectedOptions } = this.props

        const listItemClassNames = (item, index) =>
            classNames({
                'ant-select-dropdown-menu-item': true,
                'ant-select-dropdown-menu-item-selected':
                    highlightedIndex === index,
                'ant-select-dropdown-menu-item-active':
                    selectedItem === item || selectedOptions.includes(item),
            })

        if (isOpen) {
            return (
                <div className={styles.typeahead}>
                    <ul
                        {...getMenuProps({
                            className: 'ant-select-dropdown-menu',
                        })}
                    >
                        {this.filteredOptions(inputValue).map((item, index) => (
                            <li
                                {...getItemProps({
                                    key: item.value,
                                    index,
                                    item,
                                    onClick: () => toggleOptionSelection(item),
                                    className: listItemClassNames(item, index),
                                    dangerouslySetInnerHTML: {
                                        __html: item.html,
                                    },
                                })}
                            />
                        ))}
                    </ul>
                </div>
            )
        }

        return null
    }

    renderFooter() {
        const {
            resetLinkText,
            handleReset,
            handleApply,
            selectedOptions,
            dirty,
        } = this.props
        return (
            <Footer
                additionalContent={this.renderSelectedOptions()}
                leftElement={resetLinkText}
                leftOnClick={handleReset}
                leftDisabled={isEmpty(selectedOptions)}
                rightOnClick={handleApply}
                rightDisabled={!dirty}
            />
        )
    }

    renderSelectedOptions() {
        const { selectedOptions } = this.props
        return (
            <div className={styles['selected-options']}>
                {selectedOptions.map(option => this.renderTag(option))}
            </div>
        )
    }

    renderTag(option) {
        const { color, deselectOption } = this.props

        return (
            <ColoredTag
                key={option.value}
                className={styles.tag}
                color={color}
                closable
                onClose={() => deselectOption(option)}
                onClick={() => deselectOption(option)}
            >
                {option.label}
            </ColoredTag>
        )
    }

    render() {
        const { placeholder, visible, handleKeyDown, loading } = this.props
        return (
            <Downshift
                itemToString={item => (item ? item.label : '')}
                stateReducer={Typeahead.downshiftStateReducer}
                selectedItem={null}
                onStateChange={this.syncDownshiftState}
            >
                {downshift => (
                    <Resizable
                        {...downshift.getRootProps({
                            refKey: 'innerRef',
                            className: styles.content,
                            defaultSize: {
                                width: 400,
                            },
                            enable: {
                                top: false,
                                right: true,
                                bottom: false,
                                left: false,
                                topRight: false,
                                bottomRight: false,
                                bottomLeft: false,
                                topLeft: false,
                            },
                        })}
                    >
                        <SearchInput
                            downshift={downshift}
                            placeholder={placeholder}
                            visible={visible}
                            onKeyDown={handleKeyDown}
                            loading={loading}
                        />
                        {this.renderTypeahead(downshift)}
                        {this.renderFooter()}
                    </Resizable>
                )}
            </Downshift>
        )
    }
}

export default Typeahead
