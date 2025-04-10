import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import has from 'lodash/has'
import get from 'lodash/get'
import noop from 'lodash/noop'

import { ScrollableTable } from 'components/PaginatedTable'
import { EXACT, BROAD, PHRASE } from 'constants/matchTypes'
import { PAUSED, ENABLED } from 'constants/resourceStates'
import { isActions } from 'helpers/inputTypes'
import { ACTIONS, NUMBER_INPUT, SELECT_INPUT } from 'constants/inputTypes'
import {
    KEYWORD_BID_MIN,
    KEYWORD_BID_MAX,
    KEYWORD_BID_STEP,
    KEYWORD_BID_PRECISION,
} from 'constants/keywords'

import AttachingTableEditableCell from './AttachingTableEditableCell'

class AttachingTable extends Component {
    static propTypes = {
        rowKey: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape()),
        attaching: PropTypes.bool.isRequired,

        // actions
        changeRecord: PropTypes.func.isRequired,
        deleteRecord: PropTypes.func.isRequired,
    }

    static defaultProps = {
        data: [],
    }

    getColumns() {
        const { rowKey, changeRecord } = this.props
        const columns = [
            {
                title: 'Added Keywords',
                dataIndex: 'text',
                fixed: 'left',
                align: 'left',
                width: 200,
            },
            {
                title: 'Match Type',
                dataIndex: 'match_type',
                align: 'left',
                // custom fields
                type: SELECT_INPUT,
                fieldId: 'match_type',
                options: [
                    { value: EXACT, label: 'Exact' },
                    { value: BROAD, label: 'Broad' },
                    { value: PHRASE, label: 'Phrase' },
                ],
            },
            {
                title: 'Status',
                dataIndex: 'state',
                align: 'left',
                // custom fields
                type: SELECT_INPUT,
                fieldId: 'state',
                options: [
                    { value: PAUSED, label: 'Paused' },
                    { value: ENABLED, label: 'Enabled' },
                ],
            },
            {
                title: 'Base Bid',
                dataIndex: 'bid',
                align: 'left',
                // custom fields
                type: NUMBER_INPUT,
                fieldId: 'bid',
                min: KEYWORD_BID_MIN,
                max: KEYWORD_BID_MAX,
                step: KEYWORD_BID_STEP,
                precision: KEYWORD_BID_PRECISION,
            },
            {
                title: 'Actions',
                dataIndex: rowKey,
                fixed: 'right',
                align: 'center',
                // custom fields
                type: ACTIONS,
            },
        ]
        return columns
            .map(column => ({
                width: isActions(column.type)
                    ? 70
                    : column.title.length * 6 + 70,
                ...column,
            }))
            .map(column => {
                if (has(column, 'type')) {
                    return {
                        ...column,
                        onCell: record => ({
                            record,
                            rowKey,
                            cellType: column.type,
                            fieldId: column.fieldId,
                            dataIndex: column.dataIndex,
                            options: column.options,
                            parser: column.parser,
                            min: column.min,
                            max: column.max,
                            step: column.step,
                            precision: column.precision,
                            onChange: changeRecord,
                            onDelete: this.delete,
                        }),
                    }
                }
                return column
            })
    }

    @autobind
    delete(record) {
        const { rowKey, deleteRecord } = this.props
        deleteRecord({ id: get(record, rowKey) })
    }

    render() {
        const components = {
            body: {
                cell: AttachingTableEditableCell,
            },
        }
        const { rowKey, data, attaching } = this.props
        const columns = this.getColumns()

        return (
            <ScrollableTable
                components={components}
                dataSource={data}
                columns={columns}
                rowClassName="editable-row"
                rowKey={rowKey}
                pagination={false}
                loading={attaching}
                onChange={noop}
                onRow={noop}
                tableSize="middle"
                maxHeight={null}
                maxScrollY={({ height }) => {
                    if (height > 350) {
                        return 350
                    }
                    return 0
                }}
                locale={{
                    emptyText:
                        "Keywords entered will appear here. Once added, review each keywords' match type, status, and base bid amount.",
                }}
            />
        )
    }
}

export default AttachingTable
