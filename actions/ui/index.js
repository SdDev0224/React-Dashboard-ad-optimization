import {
    AUTOMATION_PAGE,
    BRAND_PAGE,
    BRAND_CAMPAIGN_KEYWORD_PAGE,
    BRAND_CAMPAIGN_PRODUCT_AD_PAGE,
    BRANDS_SUMMARY_PAGE,
    CAMPAIGN_PAGE,
    CAMPAIGN_KEYWORD_PAGE,
    CAMPAIGN_PRODUCT_AD_PAGE,
    CAMPAIGNS_SUMMARY_PAGE,
    HOME_PAGE,
    KEYWORD_PAGE,
    KEYWORDS_SUMMARY_PAGE,
    LABELS_SUMMARY_PAGE,
    ORGANIZATION_PAGE,
    ORGANIZATION_GROUP_PAGE,
    PRODUCT_PAGE,
    PRODUCTS_SUMMARY_PAGE,
    PRODUCT_PRODUCT_AD_PAGE,
    SOV_KEYWORD_PAGE,
    SOV_KEYWORD_SEARCH_RESULT_PAGE,
    SOV_KEYWORDS_SUMMARY_PAGE,
} from 'constants/pages'

import {
    updateTablePaginationForPageTable,
    updateTreemapPaginationForPageTreemap,
} from './shared'
import { fetchHomePageDataRequest } from './homePage'
import { fetchBrandsSummaryPageDataRequest } from './brandsSummaryPage'
import { fetchBrandPageDataRequest } from './brandPage'
import { fetchCampaignsSummaryPageDataRequest } from './campaignsSummaryPage'
import { fetchCampaignPageDataRequest } from './campaignPage'
import { fetchProductsSummaryPageDataRequest } from './productsSummaryPage'
import { fetchProductPageDataRequest } from './productPage'
import { fetchProductAdPageDataRequest } from './productAdPage'
import { fetchKeywordsSummaryPageDataRequest } from './keywordsSummaryPage'
import { fetchKeywordPageDataRequest } from './keywordPage'
import { fetchSovKeywordsSummaryPageDataRequest } from './sovKeywordsSummaryPage'
import { fetchSovKeywordPageDataRequest } from './sovKeywordPage'
import { fetchSovKeywordSearchResultPageDataRequest } from './sovKeywordSearchResultPage'
import { fetchOrganizationPageDataRequest } from './organizationPage'
import { fetchOrganizationGroupPageDataRequest } from './organizationGroupPage'
import { fetchLabelsSummaryPageDataRequest } from './labelsSummaryPage'
import { fetchAutomationPageDataRequest } from './automationPage'

export * from './app'
export * from './automationPage'
export * from './brandPage'
export * from './brandsSummaryPage'
export * from './campaignPage'
export * from './campaignsSummaryPage'
export * from './homePage'
export * from './keywordPage'
export * from './keywordsSummaryPage'
export * from './labelsSummaryPage'
export * from './organizationPage'
export * from './organizationGroupPage'
export * from './productAdPage'
export * from './productPage'
export * from './productsSummaryPage'
export * from './profilePage'
export * from './shared'
export * from './sovKeywordPage'
export * from './sovKeywordSearchResultPage'
export * from './sovKeywordsSummaryPage'

export const fetchPageDataActions = {
    [AUTOMATION_PAGE]: fetchAutomationPageDataRequest,
    [BRAND_PAGE]: fetchBrandPageDataRequest,
    [BRAND_CAMPAIGN_KEYWORD_PAGE]: fetchKeywordPageDataRequest,
    [BRAND_CAMPAIGN_PRODUCT_AD_PAGE]: fetchProductAdPageDataRequest,
    [BRANDS_SUMMARY_PAGE]: fetchBrandsSummaryPageDataRequest,
    [CAMPAIGN_PAGE]: fetchCampaignPageDataRequest,
    [CAMPAIGN_KEYWORD_PAGE]: fetchKeywordPageDataRequest,
    [CAMPAIGN_PRODUCT_AD_PAGE]: fetchProductAdPageDataRequest,
    [CAMPAIGNS_SUMMARY_PAGE]: fetchCampaignsSummaryPageDataRequest,
    [HOME_PAGE]: fetchHomePageDataRequest,
    [KEYWORD_PAGE]: fetchKeywordPageDataRequest,
    [KEYWORDS_SUMMARY_PAGE]: fetchKeywordsSummaryPageDataRequest,
    [LABELS_SUMMARY_PAGE]: fetchLabelsSummaryPageDataRequest,
    [ORGANIZATION_PAGE]: fetchOrganizationPageDataRequest,
    [ORGANIZATION_GROUP_PAGE]: fetchOrganizationGroupPageDataRequest,
    [PRODUCT_PRODUCT_AD_PAGE]: fetchProductAdPageDataRequest,
    [PRODUCT_PAGE]: fetchProductPageDataRequest,
    [PRODUCTS_SUMMARY_PAGE]: fetchProductsSummaryPageDataRequest,
    [SOV_KEYWORD_PAGE]: fetchSovKeywordPageDataRequest,
    [SOV_KEYWORD_SEARCH_RESULT_PAGE]: fetchSovKeywordSearchResultPageDataRequest,
    [SOV_KEYWORDS_SUMMARY_PAGE]: fetchSovKeywordsSummaryPageDataRequest,
}

export const updatePaginationActions = {
    [BRANDS_SUMMARY_PAGE]: [
        updateTablePaginationForPageTable({
            pageName: BRANDS_SUMMARY_PAGE,
            tableName: 'table',
        }),
        updateTreemapPaginationForPageTreemap({
            pageName: BRANDS_SUMMARY_PAGE,
            treemapName: 'treemap',
        }),
    ],
    [BRAND_PAGE]: [
        updateTablePaginationForPageTable({
            pageName: BRAND_PAGE,
            tableName: 'table',
        }),
        updateTreemapPaginationForPageTreemap({
            pageName: BRAND_PAGE,
            treemapName: 'treemap',
        }),
    ],
    [CAMPAIGNS_SUMMARY_PAGE]: [
        updateTablePaginationForPageTable({
            pageName: CAMPAIGNS_SUMMARY_PAGE,
            tableName: 'table',
        }),
        updateTreemapPaginationForPageTreemap({
            pageName: CAMPAIGNS_SUMMARY_PAGE,
            treemapName: 'treemap',
        }),
    ],
    [CAMPAIGN_PAGE]: [
        updateTablePaginationForPageTable({
            pageName: CAMPAIGN_PAGE,
            tableName: 'keywordsTable',
        }),
        updateTablePaginationForPageTable({
            pageName: CAMPAIGN_PAGE,
            tableName: 'productsTable',
        }),
    ],
    [PRODUCTS_SUMMARY_PAGE]: [
        updateTablePaginationForPageTable({
            pageName: PRODUCTS_SUMMARY_PAGE,
            tableName: 'table',
        }),
        updateTreemapPaginationForPageTreemap({
            pageName: PRODUCTS_SUMMARY_PAGE,
            treemapName: 'treemap',
        }),
    ],
    [KEYWORDS_SUMMARY_PAGE]: [
        updateTablePaginationForPageTable({
            pageName: KEYWORDS_SUMMARY_PAGE,
            tableName: 'table',
        }),
        updateTreemapPaginationForPageTreemap({
            pageName: KEYWORDS_SUMMARY_PAGE,
            treemapName: 'treemap',
        }),
    ],
    [SOV_KEYWORDS_SUMMARY_PAGE]: [
        updateTablePaginationForPageTable({
            pageName: SOV_KEYWORDS_SUMMARY_PAGE,
            tableName: 'table',
        }),
    ],
    [SOV_KEYWORD_PAGE]: [
        updateTablePaginationForPageTable({
            pageName: SOV_KEYWORD_PAGE,
            tableName: 'table',
        }),
    ],
    [SOV_KEYWORD_SEARCH_RESULT_PAGE]: [
        updateTablePaginationForPageTable({
            pageName: SOV_KEYWORD_SEARCH_RESULT_PAGE,
            tableName: 'table',
        }),
    ],
    [ORGANIZATION_PAGE]: [
        updateTablePaginationForPageTable({
            pageName: ORGANIZATION_PAGE,
            tableName: 'groupsTable',
        }),
        updateTablePaginationForPageTable({
            pageName: ORGANIZATION_PAGE,
            tableName: 'integrationsTable',
        }),
        updateTablePaginationForPageTable({
            pageName: ORGANIZATION_PAGE,
            tableName: 'invitationsTable',
        }),
        updateTablePaginationForPageTable({
            pageName: ORGANIZATION_PAGE,
            tableName: 'membersTable',
        }),
    ],
    [LABELS_SUMMARY_PAGE]: [
        updateTablePaginationForPageTable({
            pageName: LABELS_SUMMARY_PAGE,
            tableName: 'table',
        }),
    ],
    [AUTOMATION_PAGE]: [
        updateTablePaginationForPageTable({
            pageName: AUTOMATION_PAGE,
            tableName: 'changelogTable',
        }),
        updateTablePaginationForPageTable({
            pageName: AUTOMATION_PAGE,
            tableName: 'recommendationsTable',
        }),
    ],
    [PRODUCT_PAGE]: [
        updateTablePaginationForPageTable({
            pageNAme: PRODUCT_PAGE,
            tableName: 'productAdsTable',
        }),
    ],
}
