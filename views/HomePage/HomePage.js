import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Tabs } from 'antd'

import { PageHeader } from 'components/PageHeader'
import { MetricSummaryPanel } from 'components/MetricSummaryPanel'
import { LoadingIndicator } from 'components/LoadingIndicator'
import { getPath } from 'helpers/pages'
import { HOME_PAGE } from 'constants/pages'

import { FiltersContainer } from './Filters'
import {
    ConversionsChartContainer,
    ReachChartContainer,
    RoiChartContainer,
} from './Charts'
import styles from './styles.scss'

class HomePage extends Component {
    static propTypes = {
        // Redux state
        aggregate: PropTypes.shape({
            loading: PropTypes.bool,
            data: PropTypes.object,
        }).isRequired,
        mounting: PropTypes.bool.isRequired,

        // actions
        mountHomePage: PropTypes.func.isRequired,
        unmountHomePage: PropTypes.func.isRequired,

        // tab state
        tab: PropTypes.oneOf(['roi', 'reach', 'conversions']).isRequired,
        handleTabChange: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const { mountHomePage } = this.props
        mountHomePage()
    }

    componentWillUnmount() {
        const { unmountHomePage } = this.props
        unmountHomePage()
    }

    render() {
        const { aggregate, mounting, tab, handleTabChange } = this.props

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
                    breadcrumbs={[{ name: 'Home', url: getPath(HOME_PAGE) }]}
                    filterGroupComponent={<FiltersContainer />}
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
                            loading={aggregate.loading}
                            data={aggregate.data}
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
                            loading={aggregate.loading}
                            data={aggregate.data}
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
                            loading={aggregate.loading}
                            data={aggregate.data}
                            category="conversions"
                        />
                        <Row className={styles['row-spacing']}>
                            <Col span={24}>
                                <ConversionsChartContainer />
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                </Tabs>
            </React.Fragment>
        )
    }
}

export default HomePage
