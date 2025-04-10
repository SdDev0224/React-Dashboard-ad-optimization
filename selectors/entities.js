import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import uniqBy from 'lodash/uniqBy'
import find from 'lodash/find'

import { BY_ID, ALL_IDS } from 'constants/reducerKeys'
import { BRAND_PAGE } from 'constants/pages'

import { selectDomainValue as selectUiDomainValue } from './ui'

const selectBrands = state => state.entities.brands
const selectCampaigns = state => state.entities.campaigns
const selectCampaignAutomations = state => state.entities.campaignAutomations
const selectProducts = state => state.entities.products
const selectKeywords = state => state.entities.keywords
const selectSovBrands = state => state.entities.sovBrands
const selectSovKeywords = state => state.entities.sovKeywords
const selectSovKeywordCategories = state => state.entities.sovKeywordCategories
const selectProductMetadata = state => state.entities.productMetadata
const selectLabels = state => state.entities.labels

export const selectBrandsForFilters = createSelector(
    selectBrands,
    brands => {
        const options = Object.values(brands[BY_ID]).map(item => ({
            value: item.id,
            label: item.brand_name,
            metadata: item.country_code,
        }))
        return sortBy(options, 'label')
    }
)

export const selectCampaignsForFilters = createSelector(
    selectCampaigns,
    selectBrands,
    (campaigns, brands) => {
        const options = Object.values(campaigns[BY_ID]).map(item => {
            const brandName = get(brands, [BY_ID, item.profile, 'brand_name'])
            const brandCountry = get(brands, [
                BY_ID,
                item.profile,
                'country_code',
            ])
            return {
                value: item.id,
                label: item.name,
                ...(brandName &&
                    brandCountry && {
                        metadata: `${brandName} | ${brandCountry}`,
                    }),
            }
        })
        return sortBy(options, 'label')
    }
)

export const selectBrandPageCampaignsForFilters = createSelector(
    selectCampaigns,
    state => selectUiDomainValue(state, [BRAND_PAGE, 'brandId']),
    (campaigns, brandId) => {
        const options = Object.values(campaigns[BY_ID])
            .filter(campaign => campaign.profile_id === brandId)
            .map(item => ({
                value: item.id,
                label: item.name,
            }))
        return sortBy(options, 'label')
    }
)

export const selectKeywordsForFilters = createSelector(
    selectKeywords,
    selectCampaigns,
    selectBrands,
    (keywords, campaigns, brands) => {
        const options = Object.values(keywords[BY_ID]).map(item => {
            const campaignName = get(campaigns, [BY_ID, item.campaign, 'name'])
            const brandName = get(brands, [BY_ID, item.profile, 'brand_name'])
            return {
                value: item.id,
                label: item.text,
                ...(brandName &&
                    campaignName && {
                        metadata: `${brandName} | ${campaignName}`,
                    }),
            }
        })
        return sortBy(options, 'label')
    }
)

export const selectSovBrandsForFilters = createSelector(
    selectSovBrands,
    sovBrands =>
        sovBrands.map(item => ({
            value: item,
            label: item,
        }))
)

export const selectSovKeywordsForFilters = createSelector(
    selectSovKeywords,
    keywords => {
        const options = Object.values(keywords[BY_ID]).map(item => ({
            value: item.id,
            label: item.text,
            ...(item.country_code &&
                item.language_code && {
                    metadata: `${item.country_code} | ${item.language_code}`,
                }),
        }))
        return sortBy(options, 'label')
    }
)

export const selectProductsForAsinFilter = createSelector(
    selectProducts,
    selectProductMetadata,
    (products, metadata) => {
        const options = Object.values(products[BY_ID]).map(item => {
            const title = get(metadata, [BY_ID, item.product_metadata, 'title'])
            return {
                value: item.asin,
                label: item.asin,
                ...(title && { metadata: title }),
            }
        })
        return sortBy(uniqBy(options, 'value'), 'label')
    }
)

export const selectProductMetadataForTitleFilter = createSelector(
    selectProductMetadata,
    metadata => {
        const options = Object.values(metadata[BY_ID]).map(item => ({
            value: item.id,
            label: item.title,
            ...(item.marketplace && { metadata: item.marketplace }),
        }))
        return sortBy(options, 'label')
    }
)

export const selectSovKeywordCategoriesForFilter = createSelector(
    selectSovKeywordCategories,
    keywordCategories => {
        const options = keywordCategories[ALL_IDS].map(item => ({
            value: item,
            label: item,
        }))
        return sortBy(options, 'label')
    }
)

export const selectBrand = createCachedSelector(
    selectBrands,
    (state, brandId) => brandId,
    (brands, brandId) => get(brands, [BY_ID, brandId])
)((state, brandId) => brandId)

export const selectCampaign = createCachedSelector(
    selectCampaigns,
    (state, campaignId) => campaignId,
    (campaigns, campaignId) => get(campaigns, [BY_ID, campaignId])
)((state, campaignId) => campaignId)

export const selectCampaignAutomation = createCachedSelector(
    selectCampaignAutomations,
    (state, campaignId) => campaignId,
    (campaignAutomations, campaignId) =>
        get(campaignAutomations, [BY_ID, campaignId])
)((state, campaignId) => campaignId)

export const selectProduct = createCachedSelector(
    selectProducts,
    (state, productId) => productId,
    (products, productId) => get(products, [BY_ID, productId])
)((state, productId) => productId)

export const selectKeyword = createCachedSelector(
    selectKeywords,
    (state, keywordId) => keywordId,
    (keywords, keywordId) => get(keywords, [BY_ID, keywordId])
)((state, keywordId) => keywordId)

export const selectSovKeyword = createCachedSelector(
    selectSovKeywords,
    (state, sovKeywordId) => sovKeywordId,
    (sovKeywords, sovKeywordId) => get(sovKeywords, [BY_ID, sovKeywordId])
)((state, sovKeywordId) => sovKeywordId)

export const selectMetadata = createCachedSelector(
    selectProductMetadata,
    (state, metadataId) => metadataId,
    (metadata, metadataId) => get(metadata, [BY_ID, metadataId])
)((state, metadataId) => metadataId)

export const selectMetadataByAsinAndMarketplace = createCachedSelector(
    selectProductMetadata,
    (state, asin) => asin,
    (state, asin, marketplace) => marketplace,
    (metadata, asin, marketplace) =>
        find(Object.values(metadata[BY_ID]), { asin, marketplace })
)((state, asin, marketplace) => `${asin}|${marketplace}`)

// labels
export const selectBrandLabels = createCachedSelector(
    selectLabels,
    selectBrand,
    (labels, brand) =>
        brand ? brand.labels.map(labelId => labels[BY_ID][labelId]) : []
)((state, brandId) => brandId)

export const selectSovKeywordLabels = createCachedSelector(
    selectLabels,
    selectSovKeyword,
    (labels, sovKeyword) =>
        sovKeyword
            ? sovKeyword.labels.map(labelId => labels[BY_ID][labelId])
            : []
)((state, sovKeywordId) => sovKeywordId)

export const selectCampaignLabels = createCachedSelector(
    selectLabels,
    selectCampaign,
    (labels, campaign) =>
        campaign ? campaign.labels.map(labelId => labels[BY_ID][labelId]) : []
)((state, campaignId) => campaignId)
