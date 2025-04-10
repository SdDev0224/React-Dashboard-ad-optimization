import React from 'react'
import { generatePath } from 'react-router-dom'
import truncate from 'lodash/truncate'

import {
    BRANDS_SUMMARY_PAGE,
    BRAND_PAGE,
    BRAND_CAMPAIGN_PAGE,
    CAMPAIGNS_SUMMARY_PAGE,
    CAMPAIGN_PAGE,
    KEYWORDS_SUMMARY_PAGE,
    PRODUCTS_SUMMARY_PAGE,
    PRODUCT_PAGE,
} from 'constants/pages'
import { getPath } from 'helpers/pages'
import { ProductAdIcon } from 'components/Icons'

// campaign
export const getCampaignPageBreadcrumbs = campaign => [
    { name: 'All Campaigns', url: getPath(CAMPAIGNS_SUMMARY_PAGE) },
    { name: truncate(campaign.name), icon: 'notification' },
]

export const getBrandCampaignPageBreadcrumbs = (brand, campaign) => [
    { name: 'All Brands', url: getPath(BRANDS_SUMMARY_PAGE) },
    {
        name: brand.brand_name,
        url: generatePath(getPath(BRAND_PAGE), {
            brandId: brand.id,
        }),
        icon: 'shop',
    },
    { name: truncate(campaign.name), icon: 'notification' },
]

// product ad
export const getCampaignProductAdPageBreadcrumbs = (
    campaign,
    productAdName
) => [
    { name: 'All Campaigns', url: getPath(CAMPAIGNS_SUMMARY_PAGE) },
    {
        name: truncate(campaign.name),
        url: generatePath(getPath(CAMPAIGN_PAGE), {
            campaignId: campaign.id,
        }),
        icon: 'notification',
    },
    { name: truncate(productAdName), icon: <ProductAdIcon /> },
]

export const getBrandCampaignProductAdPageBreadcrumbs = (
    brand,
    campaign,
    productAdName
) => [
    { name: 'All Brands', url: getPath(BRANDS_SUMMARY_PAGE) },
    {
        name: brand.brand_name,
        url: generatePath(getPath(BRAND_PAGE), {
            brandId: brand.id,
        }),
        icon: 'shop',
    },
    {
        name: truncate(campaign.name),
        url: generatePath(getPath(BRAND_CAMPAIGN_PAGE), {
            brandId: brand.id,
            campaignId: campaign.id,
        }),
        icon: 'notification',
    },
    { name: truncate(productAdName), icon: <ProductAdIcon /> },
]

export const getProductProductAdPageBreadcrumbs = (
    metadata,
    asin,
    countryCode,
    productAdName
) => [
    {
        name: 'All Products',
        url: getPath(PRODUCTS_SUMMARY_PAGE),
    },
    {
        name: metadata.title
            ? truncate(metadata.title)
            : `${asin} (${countryCode})`,
        url: generatePath(getPath(PRODUCT_PAGE), {
            asin,
            countryCode,
        }),
        icon: 'barcode',
    },
    { name: truncate(productAdName), icon: <ProductAdIcon /> },
]

// keyword
export const getKeywordPageBreadcrumbs = keyword => [
    { name: 'All Keywords', url: getPath(KEYWORDS_SUMMARY_PAGE) },
    { name: keyword.text, icon: 'key' },
]

export const getCampaignKeywordPageBreadcrumbs = (campaign, keyword) => [
    { name: 'All Campaigns', url: getPath(CAMPAIGNS_SUMMARY_PAGE) },
    {
        name: truncate(campaign.name),
        url: generatePath(getPath(CAMPAIGN_PAGE), {
            campaignId: campaign.id,
        }),
        icon: 'notification',
    },
    { name: keyword.text, icon: 'key' },
]

export const getBrandCampaignKeywordPageBreadcrumbs = (
    brand,
    campaign,
    keyword
) => [
    { name: 'All Brands', url: getPath(BRANDS_SUMMARY_PAGE) },
    {
        name: brand.brand_name,
        url: generatePath(getPath(BRAND_PAGE), {
            brandId: brand.id,
        }),
        icon: 'shop',
    },
    {
        name: truncate(campaign.name),
        url: generatePath(getPath(BRAND_CAMPAIGN_PAGE), {
            brandId: brand.id,
            campaignId: campaign.id,
        }),
        icon: 'notification',
    },
    { name: keyword.text, icon: 'key' },
]
