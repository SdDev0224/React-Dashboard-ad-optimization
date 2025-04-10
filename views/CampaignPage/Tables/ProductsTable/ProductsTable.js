import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import { generatePath } from 'react-router-dom'
import { Icon } from 'antd'
import truncate from 'lodash/truncate'
import has from 'lodash/has'
import get from 'lodash/get'
import mapValues from 'lodash/mapValues'
import isEmpty from 'lodash/isEmpty'

import { PaginatedTable } from 'components/PaginatedTable'
import { AppLink } from 'components/AppLink'
import { getTablePaginationOptions } from 'helpers/pagination'
import { METRIC_COLUMNS } from 'configuration/tables'
import { titleCase, formatCurrency } from 'helpers/formatting'
import { UNDEFINED_VALUE } from 'constants/formatting'
import { PAUSED, ARCHIVED, ENABLED } from 'constants/resourceStates'
import { SELECT_INPUT } from 'constants/inputTypes'
import { getPath } from 'helpers/pages'
import {
    BRAND_CAMPAIGN_PRODUCT_AD_PAGE,
    CAMPAIGN_PRODUCT_AD_PAGE,
} from 'constants/pages'
import { asinUrl } from 'helpers/urls'
import { ContentCard } from 'components/ContentCard'
import {
    SettingsButton,
    DownloadButton,
    CreateResourceButton,
} from 'components/Buttons'
import { SettingsModal } from 'components/SettingsModal'

import { AttachingDetails } from './AttachingDetails'
import styles from './styles.scss'

class ProductsTable extends Component {
    static actionsToolTip(record) {
        if (record.product_ad.state === ARCHIVED) {
            return 'Archived Product Ads cannot be modified.'
        }
        return null
    }

    static propTypes = {
        brandId: PropTypes.string,
        campaign: PropTypes.shape({
            id: PropTypes.string,
            ad_groups: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.string,
                    name: PropTypes.string,
                    state: PropTypes.string,
                    default_bid: PropTypes.number,
                })
            ),
        }),
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
        attachProductsRequest: PropTypes.func.isRequired,
        updateProductRequest: PropTypes.func.isRequired,
        deleteProductRequest: PropTypes.func.isRequired,
    }

    static defaultProps = {
        brandId: null,
        campaign: {},
    }

    state = {
        settingsModalVisible: false,
        collapseOpen: false,
    }

    static getEditableColumnsForRow(record) {
        return record.product_ad.state !== ARCHIVED
    }

    getProductAdPageUrl(productAdId) {
        const {
            brandId,
            campaign: { id: campaignId },
        } = this.props
        if (brandId) {
            return generatePath(getPath(BRAND_CAMPAIGN_PRODUCT_AD_PAGE), {
                brandId,
                campaignId,
                productAdId,
            })
        }
        return generatePath(getPath(CAMPAIGN_PRODUCT_AD_PAGE), {
            campaignId,
            productAdId,
        })
    }

    getTableConfig() {
        return {
            name: 'product ad',
            rowKey: 'product_ad.id',
            actionColumns: ['actions'],
            columns: {
                actions: {
                    title: 'Actions',
                    dataIndex: 'product_ad.id',
                    fixed: 'right',
                    align: 'center',
                    // custom fields
                    type: 'actions',
                },
                'product_metadata.title': {
                    title: 'Product Title',
                    dataIndex: 'product_ad.product_metadata.title',
                    fixed: 'left',
                    align: 'left',
                    width: 300,
                    render: (value, record) =>
                        value ? (
                            <div className={styles.container}>
                                <img
                                    src={get(
                                        record,
                                        'product_ad.product_metadata.small_image_url'
                                    )}
                                    alt={value}
                                />
                                <AppLink
                                    to={this.getProductAdPageUrl(
                                        get(record, 'product_ad.id')
                                    )}
                                >
                                    {truncate(value, { length: 45 })}
                                </AppLink>
                            </div>
                        ) : (
                            <div className={styles.container}>
                                <Icon
                                    type="picture"
                                    theme="outlined"
                                    className={styles['missing-img-icon']}
                                />
                                <AppLink
                                    to={this.getProductAdPageUrl(
                                        get(record, 'product_ad.id')
                                    )}
                                >
                                    {get(record, 'product_ad.asin')}
                                </AppLink>
                            </div>
                        ),
                },
                'product_metadata.price': {
                    title: 'Product Price',
                    dataIndex: 'product_ad.product_metadata.price',
                    align: 'left',
                    render: (value, record) =>
                        value
                            ? formatCurrency(value, {
                                  decimal: true,
                                  currencyCode: get(
                                      record,
                                      'product_ad.product_metadata.currency_code'
                                  ),
                              })
                            : UNDEFINED_VALUE,
                },
                'product_ad.asin': {
                    title: 'ASIN',
                    dataIndex: 'product_ad.asin',
                    align: 'left',
                    width: 150,
                    render: (value, record) =>
                        value ? (
                            <a
                                href={asinUrl(
                                    value,
                                    get(record, 'profile.country_code')
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {value} <Icon type="amazon" theme="outlined" />
                            </a>
                        ) : (
                            UNDEFINED_VALUE
                        ),
                },
                'product_ad.sku': {
                    title: 'SKU',
                    dataIndex: 'product_ad.sku',
                    align: 'right',
                    render: value =>
                        value === null || value === undefined
                            ? UNDEFINED_VALUE
                            : value,
                },
                'product_ad.state': {
                    title: 'State',
                    dataIndex: 'product_ad.state',
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
            attachProductsRequest,
        } = this.props
        // use the first ad_group_id for now
        const adGroupId =
            !isEmpty(adGroups) && has(adGroups, ['0', 'id'])
                ? get(adGroups, ['0', 'id'])
                : null

        const products = values.map(product => ({
            ...product,
            campaign_id: campaignId,
            ad_group_id: adGroupId,
        }))

        attachProductsRequest({ products })
    }

    @autobind
    saveRecord({ id: productId, values: data }) {
        const { updateProductRequest } = this.props
        updateProductRequest({ productId, data })
    }

    @autobind
    deleteRecord({ id: productId }) {
        const { deleteProductRequest } = this.props
        deleteProductRequest({ productId })
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
                title="Product Ads Table"
                subTitle="Manage and view product ads for this campaign."
                actions={[
                    <CreateResourceButton onClick={this.handleToggleCollapse}>
                        Add New Product Ads
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
                        ...getTablePaginationOptions('Product Ads'),
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
                        ProductsTable.getEditableColumnsForRow
                    }
                    actionsToolTip={ProductsTable.actionsToolTip}
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

export default ProductsTable
