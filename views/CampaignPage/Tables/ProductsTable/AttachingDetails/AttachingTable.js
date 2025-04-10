import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import has from 'lodash/has'
import get from 'lodash/get'
import noop from 'lodash/noop'

import { ScrollableTable } from 'components/PaginatedTable'

import { PAUSED, ENABLED } from 'constants/resourceStates'
import { ACTIONS, SELECT_INPUT } from 'constants/inputTypes'
import { isActions } from 'helpers/inputTypes'

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
                title: 'Added ASINs',
                dataIndex: 'asin',
                fixed: 'left',
                align: 'left',
                width: 200,
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
                            formatter: value => column.formatter(value, record),
                            parser: column.parser,
                            min: column.min,
                            max: column.max,
                            step: column.step,
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
                        "ASINs entered will appear here. Once added, review each ASINs' status.",
                }}
            />
        )
    }
}

export default AttachingTable
