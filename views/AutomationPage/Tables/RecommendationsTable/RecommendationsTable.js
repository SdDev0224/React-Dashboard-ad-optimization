import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import mapValues from 'lodash/mapValues'
import { Icon } from 'antd'

import { PaginatedTable } from 'components/PaginatedTable'
import { getTablePaginationOptions } from 'helpers/pagination'
import { ContentCard } from 'components/ContentCard'
import { SettingsButton } from 'components/Buttons'
import { SettingsModal } from 'components/SettingsModal'
import { titleCase, formatCerebroDateTime } from 'helpers/formatting'
import {
    getRecommendationResource,
    getRecommendationResourceType,
} from 'helpers/ui/automationPage'
import { AppLink } from 'components/AppLink'

const TABLE_CONFIG = {
    rowKey: 'id',
    actionColumns: [],
    columns: {
        resource: {
            title: 'Resource Name',
            dataIndex: 'id',
            align: 'left',
            fixed: 'left',
            render: (value, record) => {
                const { title, url } = getRecommendationResource(record)
                return <AppLink to={url}>{title}</AppLink>
            },
        },
        resource_type: {
            title: 'Resource Type',
            dataIndex: 'id',
            align: 'left',
            render: (value, record) => {
                const { type, icon } = getRecommendationResourceType(record)
                return (
                    <span>
                        <Icon type={icon} /> {type}
                    </span>
                )
            },
        },
        action_type: {
            title: 'Action Type',
            dataIndex: 'action_type',
            align: 'left',
            sorter: true,
            render: value => titleCase(value),
        },
        recommendation: {
            title: 'Recommendation',
            dataIndex: 'title',
            align: 'left',
        },
        description: {
            title: 'Description',
            dataIndex: 'description',
            align: 'left',
        },
        date: {
            title: 'Date',
            dataIndex: 'created_at',
            align: 'left',
            sorter: true,
            render: value => formatCerebroDateTime(value),
        },
    },
}

class RecommendationsTable extends Component {
    static propTypes = {
        tableData: PropTypes.shape({
            data: PropTypes.arrayOf(PropTypes.shape()),
            updating: PropTypes.bool,
            deleting: PropTypes.bool,
            loading: PropTypes.bool,
            pagination: PropTypes.shape({
                pageSize: PropTypes.number,
                current: PropTypes.number,
                total: PropTypes.number,
            }),
            sorter: PropTypes.shape({
                field: PropTypes.string,
                order: PropTypes.oneOf(['descend', 'ascend']),
            }),
            columnSettings: PropTypes.shape({
                order: PropTypes.array,
                displayState: PropTypes.shape(),
            }),
        }).isRequired,

        // actions
        updatePagination: PropTypes.func.isRequired,
        updateSorter: PropTypes.func.isRequired,
        updateColumnSettings: PropTypes.func.isRequired,
        reloadData: PropTypes.func.isRequired,
    }

    state = {
        settingsModalVisible: false,
    }

    @autobind
    handleToggleSettingsModal() {
        this.setState(state => ({
            settingsModalVisible: !state.settingsModalVisible,
        }))
    }

    @autobind
    handleUpdateColumnSettings(settings) {
        const { updateColumnSettings, reloadData } = this.props

        updateColumnSettings(settings)

        // Reload data
        reloadData()

        // Toggle settings modal
        this.handleToggleSettingsModal()
    }

    render() {
        const {
            tableData,
            updatePagination,
            updateSorter,
            reloadData,
        } = this.props
        const { settingsModalVisible } = this.state
        const columnTitles = mapValues(TABLE_CONFIG.columns, 'title')

        return (
            <ContentCard
                title="Recommended Actions"
                subTitle="Targeted action items to help you meet and exceed your advertising goals."
                actions={[
                    <SettingsButton
                        onClick={this.handleToggleSettingsModal}
                        tooltipTitle="Customize table columns"
                    />,
                ]}
            >
                <PaginatedTable
                    tableConfig={TABLE_CONFIG}
                    data={tableData.data}
                    loading={tableData.loading}
                    updating={tableData.updating}
                    deleting={tableData.deleting}
                    pagination={{
                        ...getTablePaginationOptions('Recommendations'),
                        ...tableData.pagination,
                    }}
                    sorter={tableData.sorter}
                    columnSettings={tableData.columnSettings}
                    updatePagination={updatePagination}
                    updateSorter={updateSorter}
                    reloadData={reloadData}
                />
                <SettingsModal
                    droppableId="paginatedTableSettingsModal"
                    modalTitle="Customize Table Columns"
                    visible={settingsModalVisible}
                    settings={tableData.columnSettings}
                    settingTitles={columnTitles}
                    handleOk={this.handleUpdateColumnSettings}
                    handleCancel={this.handleToggleSettingsModal}
                />
            </ContentCard>
        )
    }
}

export default RecommendationsTable
