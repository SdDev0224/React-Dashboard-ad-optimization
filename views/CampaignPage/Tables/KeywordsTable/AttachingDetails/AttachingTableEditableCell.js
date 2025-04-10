import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import get from 'lodash/get'
import noop from 'lodash/noop'
import identity from 'lodash/identity'

import { InputType } from 'components/InputType'
import { ActionIcon } from 'components/PaginatedTable'
import { ALL_TYPES } from 'constants/inputTypes'
import { isActions, isEditable } from 'helpers/inputTypes'

class AttachingTableEditableCell extends Component {
    static propTypes = {
        record: PropTypes.shape(),
        recordName: PropTypes.string,
        rowKey: PropTypes.string,
        dataIndex: PropTypes.string,
        fieldId: PropTypes.string,
        cellType: PropTypes.oneOf(ALL_TYPES),

        // select options for selectInput
        options: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.string,
                label: PropTypes.string,
            })
        ),

        // options for numberInput
        formatter: PropTypes.func,
        parser: PropTypes.func,
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        precision: PropTypes.number,

        onChange: PropTypes.func,
        onDelete: PropTypes.func,
    }

    static defaultProps = {
        record: null,
        recordName: '',
        rowKey: null,
        dataIndex: null,
        fieldId: null,
        cellType: null,
        options: [],
        formatter: identity,
        parser: identity,
        min: -Infinity,
        max: Infinity,
        step: 1,
        precision: 0,
        onChange: noop,
        onDelete: noop,
    }

    @autobind
    onChange(value) {
        const { rowKey, fieldId, record, onChange } = this.props
        onChange({ id: get(record, rowKey), fieldId, value })
    }

    render() {
        const {
            record,
            recordName,
            rowKey,
            dataIndex,
            fieldId,
            cellType,
            options,
            formatter,
            parser,
            min,
            max,
            step,
            precision,
            onDelete,
            ...restProps
        } = this.props

        if (isEditable(cellType)) {
            return (
                <td {...restProps}>
                    <InputType
                        inputType={cellType}
                        options={options}
                        formatter={formatter}
                        parser={parser}
                        min={min}
                        max={max}
                        step={step}
                        precision={precision}
                        defaultValue={get(record, fieldId)}
                        onChange={this.onChange}
                    />
                </td>
            )
        }

        if (isActions(cellType)) {
            return (
                <td {...restProps}>
                    <ActionIcon
                        type="delete"
                        onClick={() => onDelete(record)}
                    />
                </td>
            )
        }

        return <td {...restProps}>{restProps.children}</td>
    }
}

export default AttachingTableEditableCell
