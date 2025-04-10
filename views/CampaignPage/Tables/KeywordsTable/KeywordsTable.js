import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { generatePath } from 'react-router-dom'
import autobind from 'autobind-decorator'
import has from 'lodash/has'
import get from 'lodash/get'
import mapValues from 'lodash/mapValues'
import isEmpty from 'lodash/isEmpty'

import { AppLink } from 'components/AppLink'
import { PaginatedTable } from 'components/PaginatedTable'
import {
    BRAND_CAMPAIGN_KEYWORD_PAGE,
    CAMPAIGN_KEYWORD_PAGE,
} from 'constants/pages'
import { getPath } from 'helpers/pages'
import { getTablePaginationOptions } from 'helpers/pagination'
import { METRIC_COLUMNS } from 'configuration/tables'
import { titleCase, formatCurrency } from 'helpers/formatting'
import { PAUSED, ARCHIVED, ENABLED } from 'constants/resourceStates'
import { ACTIONS, NUMBER_INPUT, SELECT_INPUT } from 'constants/inputTypes'
import {
    KEYWORD_BID_MIN,
    KEYWORD_BID_MAX,
    KEYWORD_BID_STEP,
    KEYWORD_BID_PRECISION,
} from 'constants/keywords'
import { ContentCard } from 'components/ContentCard'
import {
    SettingsButton,
    DownloadButton,
    CreateResourceButton,
} from 'components/Buttons'
import { SettingsModal } from 'components/SettingsModal'

import { AttachingDetails } from './AttachingDetails'
import ActiveBidCell from './ActiveBidCell/ActiveBidCell'

class KeywordsTable extends Component {
    static actionsToolTip(record) {
        if (record.keyword.state === ARCHIVED) {
            return 'Archived Keywords cannot be modified.'
        }
        return null
    }

    static propTypes = {
        brandId: PropTypes.string,
        brand: PropTypes.shape({
            brand_name: PropTypes.string,
            country_code: PropTypes.string,
            currency_code: PropTypes.string,
            id: PropTypes.string,
            region: PropTypes.string,
            timezone: PropTypes.string,
        }),
        campaign: PropTypes.shape({
            budget: PropTypes.number,
            budget_type: PropTypes.string,
            campaign_type: PropTypes.string,
            created_date: PropTypes.string,
            dayparting_enabled: PropTypes.bool,
            end_date: PropTypes.string,
            id: PropTypes.string,
            name: PropTypes.string,
            ad_groups: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string,
                    name: PropTypes.string,
                    state: PropTypes.string,
                    default_bid: PropTypes.number,
                })
            ),
            premium_bid_adjustment: PropTypes.bool,
            profile_id: PropTypes.string,
            start_date: PropTypes.string,
            state: PropTypes.string,
            synced_date: PropTypes.string,
            targeting_type: PropTypes.string,
            updated_date: PropTypes.string,
        }),
        hourlyMultipliers: PropTypes.arrayOf(
            PropTypes.shape({
                hour: PropTypes.number,
                multiplier: PropTypes.number,
            })
        ),
        downloading: PropTypes.bool.isRequired,
        tableData: PropTypes.shape({
            data: PropTypes.arrayOf(PropTypes.shape()),
            loading: PropTypes.bool,
            attaching: PropTypes.bool,
            updating: PropTypes.bool,
            deleting: PropTypes.bool,
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
        downloadData: PropTypes.func.isRequired,
        attachKeywordsRequest: PropTypes.func.isRequired,
        updateKeywordRequest: PropTypes.func.isRequired,
        deleteKeywordRequest: PropTypes.func.isRequired,
    }

    static defaultProps = {
        brandId: null,
        brand: {},
        campaign: {},
        hourlyMultipliers: [{}],
    }

    state = {
        settingsModalVisible: false,
        collapseOpen: false,
    }

    static getEditableColumnsForRow(record) {
        return record.keyword.state !== ARCHIVED
    }

    getTableConfig() {
        const { brand, brandId, campaign, hourlyMultipliers } = this.props
        return {
            name: 'keyword',
            rowKey: 'keyword.id',
            actionColumns: ['actions'],
            columns: {
                actions: {
                    title: 'Actions',
                    dataIndex: 'keyword.id',
                    fixed: 'right',
                    align: 'center',
                    // custom fields
                    type: ACTIONS,
                },
                'keyword.text': {
                    title: 'Keyword',
                    dataIndex: 'keyword.text',
                    fixed: 'left',
                    align: 'left',
                    width: 200,
                    render: (text, record) => {
                        let path
                        if (brandId) {
                            path = generatePath(
                                getPath(BRAND_CAMPAIGN_KEYWORD_PAGE),
                                {
                                    brandId,
                                    campaignId: campaign.id,
                                    keywordId: record.keyword.id,
                                }
                            )
                        } else {
                            path = generatePath(
                                getPath(CAMPAIGN_KEYWORD_PAGE),
                                {
                                    campaignId: campaign.id,
                                    keywordId: record.keyword.id,
                                }
                            )
                        }
                        return <AppLink to={path}>{text}</AppLink>
                    },
                },
                'keyword.match_type': {
                    title: 'Match Type',
                    dataIndex: 'keyword.match_type',
                    align: 'left',
                    render: text => titleCase(text),
                },
                'keyword.bid': {
                    title: 'Active Bid',
                    align: 'right',
                    render: (text, record) => (
                        <ActiveBidCell
                            brand={brand}
                            campaign={campaign}
                            hourlyMultipliers={hourlyMultipliers}
                            keyword={record.keyword}
                        />
                    ),
                },
                'keyword.base_bid': {
                    title: 'Bid',
                    dataIndex: campaign.dayparting_enabled
                        ? 'keyword.base_bid'
                        : 'keyword.bid',
                    align: 'right',
                    render: text =>
                        formatCurrency(text, {
                            decimal: true,
                            currencyCode: brand.currency_code,
                        }),
                    // custom fields
                    type: NUMBER_INPUT,
                    fieldId: 'bid',
                    min: KEYWORD_BID_MIN,
                    max: KEYWORD_BID_MAX,
                    step: KEYWORD_BID_STEP,
                    precision: KEYWORD_BID_PRECISION,
                },
                'keyword.state': {
                    title: 'State',
                    dataIndex: 'keyword.state',
                    align: 'center',
                    render: value => titleCase(value),
                    // custom fields
                    type: SELECT_INPUT,
                    fieldId: 'state',
                    options: [
                        { value: PAUSED, label: 'Paused' },
                        { value: ENABLED, label: 'Enabled' },
                    ],
                },
                ...METRIC_COLUMNS,
            },
        }
    }

    @autobind
    attachRecords(values) {
        const {
            campaign: { id: campaignId, ad_groups: adGroups },
            attachKeywordsRequest,
        } = this.props
        // use the first ad_group_id for now
        const adGroupId =
            !isEmpty(adGroups) && has(adGroups, ['0', 'id'])
                ? get(adGroups, ['0', 'id'])
                : null

        const keywords = values.map(keyword => ({
            ...keyword,
            campaign_id: campaignId,
            ad_group_id: adGroupId,
        }))

        attachKeywordsRequest({ keywords })
    }

    @autobind
    saveRecord({ id: keywordId, values: data }) {
        const { updateKeywordRequest } = this.props
        updateKeywordRequest({ keywordId, data })
    }

    @autobind
    deleteRecord({ id: keywordId }) {
        const { deleteKeywordRequest } = this.props
        deleteKeywordRequest({ keywordId })
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

    @autobind
    handleToggleCollapse() {
        this.setState(state => ({
            collapseOpen: !state.collapseOpen,
        }))
    }

    render() {
        const {
            brand,
            downloading,
            tableData,
            updatePagination,
            updateSorter,
            reloadData,
            downloadData,
        } = this.props
        const { settingsModalVisible, collapseOpen } = this.state
        const tableConfig = this.getTableConfig()
        const columnTitles = mapValues(tableConfig.columns, 'title')

        return (
            <ContentCard
                title="Keywords Table"
                subTitle="Manage and view tabular data for Keywords"
                actions={[
                    <CreateResourceButton onClick={this.handleToggleCollapse}>
                        Add New Keywords
                    </CreateResourceButton>,
                    <SettingsButton
                        onClick={this.handleToggleSettingsModal}
                        tooltipTitle="Customize table columns"
                    />,
                    <DownloadButton
                        loading={downloading}
                        onClick={downloadData}
                    />,
                ]}
                collapseOpen={collapseOpen}
                collapseContent={
                    <AttachingDetails
                        brand={brand}
                        attaching={tableData.attaching}
                        onAttach={this.attachRecords}
                        onCancel={this.handleToggleCollapse}
                    />
                }
            >
                <PaginatedTable
                    tableConfig={tableConfig}
                    data={tableData.data}
                    loading={tableData.loading}
                    updating={tableData.updating}
                    deleting={tableData.deleting}
                    pagination={{
                        ...getTablePaginationOptions('Keywords'),
                        ...tableData.pagination,
                    }}
                    sorter={tableData.sorter}
                    columnSettings={tableData.columnSettings}
                    updatePagination={updatePagination}
                    updateSorter={updateSorter}
                    reloadData={reloadData}
                    saveRecord={this.saveRecord}
                    deleteRecord={this.deleteRecord}
                    getEditableColumnsForRow={
                        KeywordsTable.getEditableColumnsForRow
                    }
                    actionsToolTip={KeywordsTable.actionsToolTip}
                />
                <SettingsModal
                    droppableId="paginatedTableSettingsModal"
                    modalTitle="Customize Table Columns"
                    visible={settingsModalVisible}
                    handleCancel={this.handleToggleSettingsModal}
                    handleOk={this.handleUpdateColumnSettings}
                    settings={tableData.columnSettings}
                    settingTitles={columnTitles}
                />
            </ContentCard>
        )
    }
}

export default KeywordsTable
