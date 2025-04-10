import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch } from 'react-router-dom'
import { Layout, Menu, Icon, Dropdown } from 'antd'
import autobind from 'autobind-decorator'
import find from 'lodash/find'
import get from 'lodash/get'

import { HomePageContainer } from 'views/HomePage'
import { BrandsSummaryPageContainer } from 'views/BrandsSummaryPage'
import { BrandPageContainer } from 'views/BrandPage'
import { CampaignsSummaryPageContainer } from 'views/CampaignsSummaryPage'
import { CampaignPageContainer } from 'views/CampaignPage'
import { ProductsSummaryPageContainer } from 'views/ProductsSummaryPage'
import { ProductPageContainer } from 'views/ProductPage'
import { KeywordsSummaryPageContainer } from 'views/KeywordsSummaryPage'
import { KeywordPageContainer } from 'views/KeywordPage'
import { SovKeywordsSummaryPageContainer } from 'views/SovKeywordsSummaryPage'
import { SovKeywordPageContainer } from 'views/SovKeywordPage'
import { SovKeywordSearchResultPageContainer } from 'views/SovKeywordSearchResultPage'
import { ProfilePageContainer } from 'views/ProfilePage'
import { OrganizationPageContainer } from 'views/OrganizationPage'
import { OrganizationGroupPageContainer } from 'views/OrganizationGroupPage'
import { AutomationPageContainer } from 'views/AutomationPage'
import { LabelsSummaryPageContainer } from 'views/LabelsSummaryPage'
import { TextButton } from 'components/TextButton'
import { PrivateRouteContainer } from 'components/PrivateRoute'
import { AppLink } from 'components/AppLink'
import { availableCurrencies } from 'configuration/currency'
import { getPath, getPage } from 'helpers/pages'
import {
    HOME_PAGE,
    BRANDS_SUMMARY_PAGE,
    BRAND_PAGE,
    BRAND_CAMPAIGN_PAGE,
    BRAND_CAMPAIGN_KEYWORD_PAGE,
    BRAND_CAMPAIGN_PRODUCT_AD_PAGE,
    CAMPAIGNS_SUMMARY_PAGE,
    CAMPAIGN_PAGE,
    CAMPAIGN_KEYWORD_PAGE,
    CAMPAIGN_PRODUCT_AD_PAGE,
    PRODUCTS_SUMMARY_PAGE,
    PRODUCT_PAGE,
    KEYWORDS_SUMMARY_PAGE,
    KEYWORD_PAGE,
    LABELS_SUMMARY_PAGE,
    SOV_KEYWORDS_SUMMARY_PAGE,
    SOV_KEYWORD_PAGE,
    SOV_KEYWORD_SEARCH_RESULT_PAGE,
    PROFILE_PAGE,
    ORGANIZATION_PAGE,
    ORGANIZATION_GROUP_PAGE,
    AUTOMATION_PAGE,
    PRODUCT_PRODUCT_AD_PAGE,
} from 'constants/pages'
import {
    hasSovPermissions,
    hasCustomerServicePermissions,
    hasManageLabelsPermissions,
} from 'helpers/featurePermissions'
import logoIcon from 'images/logo-icon-white.svg'
import { showDriftSidebar } from 'helpers/drift'

import { RecentIntegrationBanner, GlobalNotificationBanner } from './Banners'
import styles from './styles.scss'
import { ProductAdPageContainer } from '../ProductAdPage'

class AppLayout extends Component {
    static propTypes = {
        // React router
        location: PropTypes.shape({
            pathname: PropTypes.string,
            search: PropTypes.string,
        }).isRequired,

        // Redux state
        globalNotification: PropTypes.object,
        currencyCode: PropTypes.string,
        hasRecentIntegration: PropTypes.bool.isRequired,
        featurePermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
        organizations: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
                enabled: PropTypes.bool,
                website: PropTypes.string,
                image_url: PropTypes.string,
                permissions: PropTypes.arrayOf(PropTypes.string),
            })
        ),
        currentOrganizationId: PropTypes.string,
        currentOrganizationGroupId: PropTypes.string,
        organizationGroups: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
                enabled: PropTypes.bool,
                permissions: PropTypes.arrayOf(PropTypes.string),
                brands: PropTypes.arrayOf(PropTypes.object),
                regions: PropTypes.arrayOf(PropTypes.string),
                countries: PropTypes.arrayOf(PropTypes.string),
                organization: PropTypes.shape({
                    id: PropTypes.string,
                    permissions: PropTypes.arrayOf(PropTypes.string),
                    name: PropTypes.string,
                    enabled: PropTypes.bool,
                    website: PropTypes.string,
                    image_url: PropTypes.string,
                }),
            })
        ),

        // Redux actions
        mountApp: PropTypes.func.isRequired,
        changeCurrencyCode: PropTypes.func.isRequired,
        changeOrganization: PropTypes.func.isRequired,
        changeOrganizationGroup: PropTypes.func.isRequired,
    }

    static defaultProps = {
        globalNotification: null,
        currencyCode: null,
        currentOrganizationId: null,
        organizations: [],
        currentOrganizationGroupId: null,
        organizationGroups: [],
    }

    state = {
        sidebarCollapsed: false,
    }

    componentDidMount() {
        const { mountApp } = this.props
        mountApp()
    }

    getSideMenuSelectedKeys() {
        const {
            location: { pathname },
        } = this.props
        const { page } = getPage(pathname, false)
        return page ? [page] : []
    }

    @autobind
    handleSidebarCollapse(sidebarCollapsed) {
        this.setState({ sidebarCollapsed })
    }

    @autobind
    handleChangeCurrencyCode(event) {
        const { currencyCode, changeCurrencyCode } = this.props

        if (currencyCode !== event.key) {
            changeCurrencyCode({ currencyCode: event.key })
        }
    }

    @autobind
    handleChangeOrganization(event) {
        const { currentOrganizationId, changeOrganization } = this.props
        if (currentOrganizationId !== event.key)
            changeOrganization({
                organizationId: event.key,
            })
    }

    @autobind
    handleChangeOrganizationGroup(event) {
        const {
            currentOrganizationGroupId,
            changeOrganizationGroup,
        } = this.props
        const [organizationId, organizationGroupId] = event.key.split('|')
        if (currentOrganizationGroupId !== organizationGroupId)
            changeOrganizationGroup({
                organizationGroupId,
                organizationId,
            })
    }

    renderCurrencyMenu() {
        const { currencyCode } = this.props
        return (
            <Menu
                onClick={this.handleChangeCurrencyCode}
                selectedKeys={[currencyCode]}
                className={styles['menu-dropdown']}
            >
                <Menu.Item key="title" disabled>
                    Currencies
                </Menu.Item>
                <Menu.Divider />
                {Object.keys(availableCurrencies).map(code => (
                    <Menu.Item key={code}>
                        {code} | {availableCurrencies[code]}
                    </Menu.Item>
                ))}
            </Menu>
        )
    }

    renderOrganizationsMenu() {
        const { organizations, currentOrganizationId } = this.props
        return (
            <Menu
                onClick={this.handleChangeOrganization}
                selectedKeys={[`${currentOrganizationId}`]}
                className={styles['menu-dropdown']}
            >
                <Menu.Item key="title" disabled>
                    Organizations
                </Menu.Item>

                <Menu.Divider />

                {organizations.map(({ id, name }) => (
                    <Menu.Item key={id}>
                        <Icon type="solution" /> {name}
                    </Menu.Item>
                ))}
            </Menu>
        )
    }

    renderOrganizationGroupsMenu() {
        const {
            organizationGroups,
            currentOrganizationGroupId,
            currentOrganizationId,
        } = this.props
        return (
            <Menu
                onClick={this.handleChangeOrganizationGroup}
                selectedKeys={[
                    `${currentOrganizationId}|${currentOrganizationGroupId}`,
                ]}
                className={styles['menu-dropdown']}
            >
                <Menu.Item key="title" disabled>
                    Organization Groups
                </Menu.Item>

                <Menu.Divider />

                {organizationGroups.map(
                    ({
                        id,
                        organization_id,
                        name: organizationGroupName,
                        organization: { name: organizationName },
                    }) => (
                        <Menu.Item key={`${organization_id}|${id}`}>
                            <Icon type="solution" />{' '}
                            {`${organizationName} | ${organizationGroupName}`}
                        </Menu.Item>
                    )
                )}
            </Menu>
        )
    }

    renderUserRolesMenu() {
        const {
            featurePermissions,
            currentOrganizationId,
            organizations,
            currentOrganizationGroupId,
            organizationGroups,
        } = this.props

        if (
            currentOrganizationGroupId &&
            hasCustomerServicePermissions(featurePermissions)
        ) {
            const organizationGroup = find(organizationGroups, {
                id: currentOrganizationGroupId,
            })
            return (
                <Menu.Item key="organization">
                    <Dropdown
                        overlay={this.renderOrganizationGroupsMenu()}
                        trigger={['click']}
                        placement="bottomLeft"
                    >
                        <div>
                            <TextButton
                                icon="solution"
                                className={styles['organization-title']}
                            >
                                {`${get(organizationGroup, [
                                    'organization',
                                    'name',
                                ])} | ${organizationGroup.name}`}
                            </TextButton>
                        </div>
                    </Dropdown>
                </Menu.Item>
            )
        }

        if (currentOrganizationId && organizations.length > 0) {
            const organization = find(organizations, {
                id: currentOrganizationId,
            })
            return (
                <Menu.Item key="organization">
                    <Dropdown
                        overlay={this.renderOrganizationsMenu()}
                        trigger={['click']}
                        placement="bottomLeft"
                    >
                        <div>
                            <TextButton
                                icon="solution"
                                className={styles['organization-title']}
                            >
                                {organization.name}
                            </TextButton>
                        </div>
                    </Dropdown>
                </Menu.Item>
            )
        }

        return null
    }

    render() {
        const { sidebarCollapsed } = this.state
        const {
            globalNotification,
            currencyCode,
            hasRecentIntegration,
            featurePermissions,
        } = this.props
        const sideMenuSelectedKey = this.getSideMenuSelectedKeys()

        return (
            <Layout className={styles.layout}>
                <Layout.Sider
                    width={180}
                    collapsible
                    collapsed={sidebarCollapsed}
                    onCollapse={this.handleSidebarCollapse}
                >
                    <div className={styles['logo-container']}>
                        <AppLink to={getPath(HOME_PAGE)}>
                            <img
                                src={logoIcon}
                                className={styles.logo}
                                alt="icon"
                            />
                        </AppLink>
                    </div>
                    <Menu
                        mode="inline"
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        selectedKeys={sideMenuSelectedKey}
                        className={styles['side-nav']}
                    >
                        <Menu.Item key={HOME_PAGE}>
                            <AppLink to={getPath(HOME_PAGE)}>
                                <Icon type="home" />
                                <span>Home</span>
                            </AppLink>
                        </Menu.Item>

                        <Menu.Item key={BRANDS_SUMMARY_PAGE}>
                            <AppLink to={getPath(BRANDS_SUMMARY_PAGE)}>
                                <Icon type="shop" />
                                <span>Brands</span>
                            </AppLink>
                        </Menu.Item>

                        <Menu.Item key={CAMPAIGNS_SUMMARY_PAGE}>
                            <AppLink to={getPath(CAMPAIGNS_SUMMARY_PAGE)}>
                                <Icon type="notification" />
                                <span>Campaigns</span>
                            </AppLink>
                        </Menu.Item>

                        <Menu.Item key={PRODUCTS_SUMMARY_PAGE}>
                            <AppLink to={getPath(PRODUCTS_SUMMARY_PAGE)}>
                                <Icon type="barcode" />
                                <span>Products</span>
                            </AppLink>
                        </Menu.Item>

                        <Menu.Item key={KEYWORDS_SUMMARY_PAGE}>
                            <AppLink to={getPath(KEYWORDS_SUMMARY_PAGE)}>
                                <Icon type="key" />
                                <span>Keywords</span>
                            </AppLink>
                        </Menu.Item>

                        {hasManageLabelsPermissions(featurePermissions) && (
                            <Menu.Item key={LABELS_SUMMARY_PAGE}>
                                <AppLink to={getPath(LABELS_SUMMARY_PAGE)}>
                                    <Icon type="tag" />
                                    <span>Labels</span>
                                </AppLink>
                            </Menu.Item>
                        )}

                        {hasSovPermissions(featurePermissions) && (
                            <Menu.Item key={SOV_KEYWORDS_SUMMARY_PAGE}>
                                <AppLink
                                    to={getPath(SOV_KEYWORDS_SUMMARY_PAGE)}
                                >
                                    <Icon type="pie-chart" />
                                    <span>Share of Voice</span>
                                </AppLink>
                            </Menu.Item>
                        )}

                        <Menu.Item key={AUTOMATION_PAGE}>
                            <AppLink to={getPath(AUTOMATION_PAGE)}>
                                <Icon type="robot" />
                                <span>
                                    Automation <sup>BETA</sup>
                                </span>
                            </AppLink>
                        </Menu.Item>

                        <Menu.Item id="divider-container" key="divider">
                            <div className={styles.divider} />
                        </Menu.Item>

                        {currencyCode && (
                            <Menu.Item key="currency">
                                <Dropdown
                                    overlay={this.renderCurrencyMenu()}
                                    trigger={['click']}
                                    placement="bottomLeft"
                                >
                                    <div>
                                        <TextButton icon="global">
                                            {currencyCode}
                                        </TextButton>
                                    </div>
                                </Dropdown>
                            </Menu.Item>
                        )}

                        {this.renderUserRolesMenu()}

                        <Menu.Item key="contact">
                            <TextButton
                                icon="customer-service"
                                onClick={showDriftSidebar}
                            >
                                Contact Us
                            </TextButton>
                        </Menu.Item>
                    </Menu>
                </Layout.Sider>

                <Layout>
                    <Layout.Content className={styles.content}>
                        <GlobalNotificationBanner
                            globalNotification={globalNotification}
                        />
                        <RecentIntegrationBanner
                            hasRecentIntegration={hasRecentIntegration}
                        />

                        <Switch>
                            <PrivateRouteContainer
                                exact
                                path={getPath(HOME_PAGE)}
                                component={HomePageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(BRANDS_SUMMARY_PAGE)}
                                component={BrandsSummaryPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(BRAND_PAGE)}
                                component={BrandPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(BRAND_CAMPAIGN_PAGE)}
                                component={CampaignPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(BRAND_CAMPAIGN_KEYWORD_PAGE)}
                                component={KeywordPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(BRAND_CAMPAIGN_PRODUCT_AD_PAGE)}
                                component={ProductAdPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(CAMPAIGNS_SUMMARY_PAGE)}
                                component={CampaignsSummaryPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(CAMPAIGN_PAGE)}
                                component={CampaignPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(CAMPAIGN_KEYWORD_PAGE)}
                                component={KeywordPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(CAMPAIGN_PRODUCT_AD_PAGE)}
                                component={ProductAdPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(PRODUCTS_SUMMARY_PAGE)}
                                component={ProductsSummaryPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(PRODUCT_PAGE)}
                                component={ProductPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(PRODUCT_PRODUCT_AD_PAGE)}
                                component={ProductAdPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(KEYWORDS_SUMMARY_PAGE)}
                                component={KeywordsSummaryPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(KEYWORD_PAGE)}
                                component={KeywordPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                hasPermissions={hasSovPermissions}
                                path={getPath(SOV_KEYWORDS_SUMMARY_PAGE)}
                                component={SovKeywordsSummaryPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                hasPermissions={hasSovPermissions}
                                path={getPath(SOV_KEYWORD_PAGE)}
                                component={SovKeywordPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                hasPermissions={hasSovPermissions}
                                path={getPath(SOV_KEYWORD_SEARCH_RESULT_PAGE)}
                                component={SovKeywordSearchResultPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(ORGANIZATION_PAGE)}
                                component={OrganizationPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(ORGANIZATION_GROUP_PAGE)}
                                component={OrganizationGroupPageContainer}
                            />
                            <PrivateRouteContainer
                                path={getPath(PROFILE_PAGE)}
                                component={ProfilePageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(AUTOMATION_PAGE)}
                                component={AutomationPageContainer}
                            />
                            <PrivateRouteContainer
                                exact
                                path={getPath(LABELS_SUMMARY_PAGE)}
                                component={LabelsSummaryPageContainer}
                            />
                        </Switch>
                    </Layout.Content>
                </Layout>
            </Layout>
        )
    }
}

export default AppLayout
