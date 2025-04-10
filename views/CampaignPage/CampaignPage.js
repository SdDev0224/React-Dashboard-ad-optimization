import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tabs } from 'antd'
import autobind from 'autobind-decorator'
import isEmpty from 'lodash/isEmpty'

import { PageHeader } from 'components/PageHeader'
import { MetricSummaryPanel } from 'components/MetricSummaryPanel'
import { LoadingIndicator } from 'components/LoadingIndicator'
import { BRANDS_SUMMARY_PAGE } from 'constants/pages'
import { SPONSORED_PRODUCT } from 'constants/factTypes'
import { MANUAL } from 'constants/targetingTypes'
import { DAYPARTING } from 'constants/featurePermissions'
import {
    hasPermissions,
    hasManageCampaignAutomationPermissions,
} from 'helpers/featurePermissions'
import {
    getCampaignPageBreadcrumbs,
    getBrandCampaignPageBreadcrumbs,
} from 'helpers/breadcrumbs'

import { KeywordsTableContainer, ProductsTableContainer } from './Tables'
import {
    RoiChartContainer,
    ConversionsChartContainer,
    ReachChartContainer,
} from './Charts'
import { FiltersContainer } from './Filters'
import { ResourceDetailsContainer } from './ResourceDetails'
import { CampaignDayparting } from './Dayparting'
import { CampaignAutomationContainer } from './Automation'

import styles from './styles.scss'

class CampaignPage extends Component {
    static propTypes = {
        topLevelPage: PropTypes.string.isRequired,
        featurePermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
        brand: PropTypes.shape({
            country_code: PropTypes.string,
        }),
        campaignId: PropTypes.string.isRequired,
        campaign: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            campaign_type: PropTypes.string,
            targeting_type: PropTypes.string,
            state: PropTypes.string,
            budget_type: PropTypes.string,
            budget: PropTypes.number,
            start_date: PropTypes.string,
            end_date: PropTypes.string,
            premium_bid_adjustment: PropTypes.bool,
            profile: PropTypes.string,
            dayparting_enabled: PropTypes.bool,
        }),
        hourlyMultipliers: PropTypes.arrayOf(PropTypes.shape()),
        campaignAggregate: PropTypes.shape().isRequired,
        mounting: PropTypes.bool.isRequired,

        // Actions
        mountCampaignPage: PropTypes.func.isRequired,
        unmountCampaignPage: PropTypes.func.isRequired,
        updateCampaignRequest: PropTypes.func.isRequired,
        updateCampaignPageHourlyMultipliersRequest: PropTypes.func.isRequired,

        // tab state
        tab: PropTypes.oneOf([
            'roi',
            'reach',
            'conversions',
            'keywords',
            'product-ads',
            'automation',
        ]).isRequired,
        handleTabChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
        brand: {},
        campaign: {},
        hourlyMultipliers: [],
    }

    componentDidMount() {
        const { campaignId, mountCampaignPage } = this.props
        mountCampaignPage({ campaignId })
    }

    componentWillUnmount() {
        const { unmountCampaignPage } = this.props
        unmountCampaignPage()
    }

    getBreadCrumbs() {
        const { brand, campaign, topLevelPage } = this.props

        if (topLevelPage === BRANDS_SUMMARY_PAGE && !isEmpty(brand)) {
            return getBrandCampaignPageBreadcrumbs(brand, campaign)
        }

        return getCampaignPageBreadcrumbs(campaign)
    }

    hasAutomationPermission() {
        const { featurePermissions } = this.props

        return hasManageCampaignAutomationPermissions(featurePermissions)
    }

    shouldDisplayKeywordsTab() {
        const { campaign } = this.props
        return (
            campaign.targeting_type === MANUAL &&
            campaign.campaign_type === SPONSORED_PRODUCT
        )
    }

    shouldDisplayProductsTab() {
        const { campaign } = this.props
        return campaign.campaign_type === SPONSORED_PRODUCT
    }

    shouldShowDayparting() {
        const { featurePermissions, campaign } = this.props

        return (
            hasPermissions(featurePermissions, DAYPARTING) &&
            campaign.campaign_type === SPONSORED_PRODUCT &&
            campaign.targeting_type === MANUAL
        )
    }

    @autobind
    handleMultipliersChange(multipliers) {
        const { updateCampaignPageHourlyMultipliersRequest } = this.props
        updateCampaignPageHourlyMultipliersRequest(multipliers)
    }

    @autobind
    handleDaypartingEnabledChange(value) {
        const { updateCampaignRequest } = this.props
        updateCampaignRequest({
            dayparting_enabled: value,
        })
    }

    render() {
        const {
            brand,
            campaign,
            mounting,
            hourlyMultipliers,
            campaignAggregate,
            tab,
            handleTabChange,
        } = this.props

        if (mounting) {
            return (
                <div className={styles['empty-content']}>
                    <LoadingIndicator size="small" />
                </div>
            )
        }

        return (
            <React.Fragment>
                <PageHeader
                    breadcrumbs={this.getBreadCrumbs()}
                    filterGroupComponent={<FiltersContainer />}
                    titleComponent={<ResourceDetailsContainer />}
                />

                <Tabs
                    activeKey={tab}
                    onChange={handleTabChange}
                    tabPosition="top"
                    size="default"
                    tabBarStyle={{
                        fontWeight: '500', // same font-weight as selected tab
                    }}
                >
                    <Tabs.TabPane
                        tab="Return on Investment"
                        key="roi"
                        forceRender
                    >
                        <MetricSummaryPanel
                            loading={campaignAggregate.loading}
                            data={campaignAggregate.data}
                            category="roi"
                        />
                        <Row>
                            <Col span={24} className={styles['row-spacing']}>
                                <RoiChartContainer />
                            </Col>
                        </Row>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="Reach" key="reach" forceRender>
                        <MetricSummaryPanel
                            loading={campaignAggregate.loading}
                            data={campaignAggregate.data}
                            category="reach"
                        />
                        <Row className={styles['row-spacing']}>
                            <Col span={24}>
                                <ReachChartContainer />
                            </Col>
                        </Row>
                    </Tabs.TabPane>

                    <Tabs.TabPane
                        tab="Conversions"
                        key="conversions"
                        forceRender
                    >
                        <MetricSummaryPanel
                            loading={campaignAggregate.loading}
                            data={campaignAggregate.data}
                            category="conversions"
                        />
                        <Row className={styles['row-spacing']}>
                            <Col span={24}>
                                <ConversionsChartContainer />
                            </Col>
                        </Row>
                    </Tabs.TabPane>

                    {this.shouldDisplayKeywordsTab() && (
                        <Tabs.TabPane tab="Keywords" key="keywords">
                            {this.shouldShowDayparting() && (
                                <CampaignDayparting
                                    key={campaign.id}
                                    enabled={campaign.dayparting_enabled}
                                    utcMultipliers={hourlyMultipliers}
                                    timezone={brand.timezone}
                                    onDaypartingEnabledChange={
                                        this.handleDaypartingEnabledChange
                                    }
                                    onMultipliersChange={
                                        this.handleMultipliersChange
                                    }
                                />
                            )}

                            <KeywordsTableContainer />
                        </Tabs.TabPane>
                    )}

                    {this.shouldDisplayProductsTab() && (
                        <Tabs.TabPane tab="Product Ads" key="product-ads">
                            <ProductsTableContainer />
                        </Tabs.TabPane>
                    )}

                    <Tabs.TabPane tab="Automation" key="automation">
                        <CampaignAutomationContainer
                            key={campaign.id}
                            editable={this.hasAutomationPermission()}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </React.Fragment>
        )
    }
}

export default CampaignPage
