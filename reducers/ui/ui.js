import { combineReducers } from 'redux'

import {
    AUTOMATION_PAGE,
    BRAND_PAGE,
    BRANDS_SUMMARY_PAGE,
    CAMPAIGN_PAGE,
    CAMPAIGNS_SUMMARY_PAGE,
    HOME_PAGE,
    KEYWORD_PAGE,
    KEYWORDS_SUMMARY_PAGE,
    LABELS_SUMMARY_PAGE,
    ORGANIZATION_PAGE,
    ORGANIZATION_GROUP_PAGE,
    PRODUCT_AD_PAGE,
    PRODUCT_PAGE,
    PRODUCTS_SUMMARY_PAGE,
    PROFILE_PAGE,
    SOV_KEYWORD_PAGE,
    SOV_KEYWORD_SEARCH_RESULT_PAGE,
    SOV_KEYWORDS_SUMMARY_PAGE,
} from 'constants/pages'

// Common UI reducer
import app from './app'

// Page specific reducers
import automationPage from './automationPage'
import brandPage from './brandPage'
import brandsSummary from './brandsSummary'
import campaignPage from './campaignPage'
import campaignsSummary from './campaignsSummary'
import homePage from './homePage'
import keywordPage from './keywordPage'
import keywordsSummary from './keywordsSummary'
import labelsSummaryPage from './labelsSummary'
import organizationPage from './organizationPage'
import organizationGroupPage from './organizationGroupPage'
import productAdPage from './productAdPage'
import productPage from './productPage'
import productsSummary from './productsSummary'
import profilePage from './profilePage'
import sovKeywordPage from './sovKeywordPage'
import sovKeywordSearchResultPage from './sovKeywordSearchResultPage'
import sovKeywordsSummary from './sovKeywordsSummary'

const reducer = combineReducers({
    app,
    [AUTOMATION_PAGE]: automationPage,
    [BRAND_PAGE]: brandPage,
    [BRANDS_SUMMARY_PAGE]: brandsSummary,
    [CAMPAIGN_PAGE]: campaignPage,
    [CAMPAIGNS_SUMMARY_PAGE]: campaignsSummary,
    [HOME_PAGE]: homePage,
    [KEYWORD_PAGE]: keywordPage,
    [KEYWORDS_SUMMARY_PAGE]: keywordsSummary,
    [LABELS_SUMMARY_PAGE]: labelsSummaryPage,
    [ORGANIZATION_PAGE]: organizationPage,
    [ORGANIZATION_GROUP_PAGE]: organizationGroupPage,
    [PRODUCT_AD_PAGE]: productAdPage,
    [PRODUCT_PAGE]: productPage,
    [PRODUCTS_SUMMARY_PAGE]: productsSummary,
    [PROFILE_PAGE]: profilePage,
    [SOV_KEYWORD_PAGE]: sovKeywordPage,
    [SOV_KEYWORD_SEARCH_RESULT_PAGE]: sovKeywordSearchResultPage,
    [SOV_KEYWORDS_SUMMARY_PAGE]: sovKeywordsSummary,
})

export const defaultState = reducer(undefined, {})

export default reducer
