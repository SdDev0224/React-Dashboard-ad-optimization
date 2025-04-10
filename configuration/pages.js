import {
    AUTH_FORGOT_PASSWORD_PAGE,
    AUTH_PAGE,
    AUTH_SIGNUP_PAGE,
    AUTOMATION_PAGE,
    BRAND_CAMPAIGN_KEYWORD_PAGE,
    BRAND_CAMPAIGN_PAGE,
    BRAND_CAMPAIGN_PRODUCT_AD_PAGE,
    BRAND_PAGE,
    BRANDS_SUMMARY_PAGE,
    CAMPAIGN_KEYWORD_PAGE,
    CAMPAIGN_PAGE,
    CAMPAIGN_PRODUCT_AD_PAGE,
    CAMPAIGNS_SUMMARY_PAGE,
    HOME_PAGE,
    KEYWORD_PAGE,
    KEYWORDS_SUMMARY_PAGE,
    LABELS_SUMMARY_PAGE,
    PRODUCT_PAGE,
    PRODUCT_PRODUCT_AD_PAGE,
    PRODUCTS_SUMMARY_PAGE,
    PROFILE_PAGE,
    SOV_KEYWORD_PAGE,
    SOV_KEYWORD_SEARCH_RESULT_PAGE,
    SOV_KEYWORDS_SUMMARY_PAGE,
    ORGANIZATION_PAGE,
    ORGANIZATION_GROUP_PAGE,
} from 'constants/pages'

export const PAGES_AND_PATHS = [
    {
        page: BRANDS_SUMMARY_PAGE,
        path: '/brands',
    },
    {
        page: BRAND_PAGE,
        path: '/brands/:brandId',
    },
    {
        page: BRAND_CAMPAIGN_PAGE,
        path: '/brands/:brandId/campaigns/:campaignId',
    },
    {
        page: BRAND_CAMPAIGN_KEYWORD_PAGE,
        path: '/brands/:brandId/campaigns/:campaignId/keywords/:keywordId',
    },
    {
        page: BRAND_CAMPAIGN_PRODUCT_AD_PAGE,
        path: '/brands/:brandId/campaigns/:campaignId/product-ads/:productAdId',
    },
    {
        page: CAMPAIGNS_SUMMARY_PAGE,
        path: '/campaigns',
    },
    {
        page: CAMPAIGN_PAGE,
        path: '/campaigns/:campaignId',
    },
    {
        page: CAMPAIGN_KEYWORD_PAGE,
        path: '/campaigns/:campaignId/keywords/:keywordId',
    },
    {
        page: CAMPAIGN_PRODUCT_AD_PAGE,
        path: '/campaigns/:campaignId/product-ads/:productAdId',
    },
    {
        page: PRODUCTS_SUMMARY_PAGE,
        path: '/products',
    },
    {
        page: PRODUCT_PAGE,
        path: '/products/:asin/:countryCode',
    },
    {
        page: PRODUCT_PRODUCT_AD_PAGE,
        path: '/products/:asin/:countryCode/product-ads/:productAdId',
    },
    {
        page: KEYWORDS_SUMMARY_PAGE,
        path: '/keywords',
    },
    {
        page: KEYWORD_PAGE,
        path: '/keywords/:keywordId',
    },
    {
        page: LABELS_SUMMARY_PAGE,
        path: '/labels',
    },
    {
        page: SOV_KEYWORDS_SUMMARY_PAGE,
        path: '/sov',
    },
    {
        page: SOV_KEYWORD_PAGE,
        path: '/sov/:sovKeywordId',
    },
    {
        page: SOV_KEYWORD_SEARCH_RESULT_PAGE,
        path: '/sov/:sovKeywordId/search/:scheduledDate',
    },
    {
        page: PROFILE_PAGE,
        path: '/profile',
    },
    {
        page: AUTH_PAGE,
        path: '/auth',
    },
    {
        page: AUTH_SIGNUP_PAGE,
        path: '/auth/signup',
    },
    {
        page: AUTH_FORGOT_PASSWORD_PAGE,
        path: '/auth/forgot',
    },
    {
        page: ORGANIZATION_PAGE,
        path: '/profile/organizations/:organizationId',
    },
    {
        page: ORGANIZATION_GROUP_PAGE,
        path:
            '/profile/organizations/:organizationId/groups/:organizationGroupId',
    },
    {
        page: AUTOMATION_PAGE,
        path: '/automation',
    },
    {
        page: HOME_PAGE,
        path: '/',
    },
]
