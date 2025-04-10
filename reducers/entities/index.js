import { handleActions, combineActions } from 'redux-actions'
import { normalize } from 'normalizr'
import set from 'lodash/fp/set'
import mergeWith from 'lodash/fp/mergeWith'

import { mergeArray } from 'helpers/utilities'
import { BY_ID, ALL_IDS } from 'constants/reducerKeys'
import {
    // brands
    fetchBrandSuccess,
    updateBrandSuccess,

    // campaigns
    fetchCampaignSuccess,
    updateCampaignSuccess,
    deleteCampaignSuccess,

    // campaign automations
    createCampaignAutomationSuccess,
    fetchCampaignAutomationSuccess,
    updateCampaignAutomationSuccess,

    // products
    fetchProductSuccess,
    updateProductSuccess,
    deleteProductSuccess,

    // keywords
    fetchKeywordSuccess,
    updateKeywordSuccess,
    deleteKeywordSuccess,

    // sov keywords
    fetchSovKeywordSuccess,
    updateSovKeywordSuccess,
    deleteSovKeywordSuccess,

    // product metadata
    fetchProductMetadataSuccess,
} from 'actions/entities'
import {
    searchBrandsSuccess,
    searchCampaignsSuccess,
    searchKeywordsSuccess,
    searchProductAsinsSuccess,
    searchProductTitlesSuccess,
    searchSovBrandsSuccess,
    searchSovKeywordsSuccess,
    searchSovKeywordCategoriesSuccess,
    searchOrganizationPageBrandsSuccess,
    searchOrganizationGroupPageBrandsSuccess,
} from 'actions/ui'
import {
    brandListSchema,
    keywordSchema,
    productSchema,
    campaignListSchema,
    campaignSchema,
    campaignAutomationSchema,
    keywordListSchema,
    productListSchema,
    sovKeywordListSchema,
    sovKeywordSchema,
    brandSchema,
    productMetadataListSchema,
} from 'schemas'
import { signOutSuccess } from 'actions/auth'

const defaultState = {
    brands: {
        [BY_ID]: {},
        [ALL_IDS]: [],
    },
    campaigns: {
        [BY_ID]: {},
        [ALL_IDS]: [],
    },
    campaignAutomations: {
        [BY_ID]: {},
        [ALL_IDS]: [],
    },
    keywords: {
        [BY_ID]: {},
        [ALL_IDS]: [],
    },
    labels: {
        [BY_ID]: {},
        [ALL_IDS]: [],
    },
    products: {
        [BY_ID]: {},
        [ALL_IDS]: [],
    },
    productMetadata: {
        [BY_ID]: {},
        [ALL_IDS]: [],
    },
    sovBrands: [],
    sovKeywords: {
        [BY_ID]: {},
        [ALL_IDS]: [],
    },
    sovKeywordCategories: {
        [ALL_IDS]: [],
    },
}

export default handleActions(
    {
        // brands
        [combineActions(
            searchBrandsSuccess,
            searchOrganizationPageBrandsSuccess,
            searchOrganizationGroupPageBrandsSuccess
        )](state, action) {
            const { results } = action.payload
            const {
                entities: { brands },
                result: brandIds,
            } = normalize(results, brandListSchema)

            return mergeWith(mergeArray, state, {
                brands: {
                    [BY_ID]: brands,
                    [ALL_IDS]: brandIds,
                },
            })
        },

        // brand
        [combineActions(fetchBrandSuccess, updateBrandSuccess)](state, action) {
            const {
                entities: { brands, labels },
                result: brandId,
            } = normalize(action.payload, brandSchema)
            return mergeWith(mergeArray, state, {
                brands: {
                    [BY_ID]: brands,
                    [ALL_IDS]: [brandId],
                },
                labels: {
                    [BY_ID]: labels,
                    [ALL_IDS]: brands[brandId].labels,
                },
            })
        },

        // campaigns
        [combineActions(searchCampaignsSuccess)](state, action) {
            const { results } = action.payload
            const {
                entities: { campaigns, brands },
                result: campaignIds,
            } = normalize(results, campaignListSchema)

            return mergeWith(mergeArray, state, {
                campaigns: {
                    [BY_ID]: campaigns,
                    [ALL_IDS]: campaignIds,
                },
                ...(brands && {
                    brands: {
                        [BY_ID]: brands,
                        [ALL_IDS]: Object.keys(brands),
                    },
                }),
            })
        },

        // campaign
        [combineActions(
            fetchCampaignSuccess,
            updateCampaignSuccess,
            deleteCampaignSuccess
        )](state, action) {
            const {
                entities: { campaigns, brands, labels },
                result: campaignId,
            } = normalize(action.payload, campaignSchema)
            return mergeWith(mergeArray, state, {
                campaigns: {
                    [BY_ID]: campaigns,
                    [ALL_IDS]: [campaignId],
                },
                brands: {
                    [BY_ID]: brands,
                    [ALL_IDS]: [campaigns[campaignId].profile],
                },
                labels: {
                    [BY_ID]: labels,
                    [ALL_IDS]: campaigns[campaignId].labels,
                },
            })
        },

        // campaign automation
        [combineActions(
            createCampaignAutomationSuccess,
            fetchCampaignAutomationSuccess,
            updateCampaignAutomationSuccess
        )](state, action) {
            const {
                entities: { campaignAutomations },
                result: campaignAutomationId,
            } = normalize(action.payload, campaignAutomationSchema)

            return mergeWith(mergeArray, state, {
                campaignAutomations: {
                    [BY_ID]: campaignAutomations,
                    [ALL_IDS]: [campaignAutomationId],
                },
            })
        },

        // products
        [combineActions(searchProductAsinsSuccess, searchProductTitlesSuccess)](
            state,
            action
        ) {
            const {
                entities: { brands, campaigns, products, product_metadata },
                result: productIds,
            } = normalize(action.payload.results, productListSchema)
            return mergeWith(mergeArray, state, {
                products: {
                    [BY_ID]: products,
                    [ALL_IDS]: productIds,
                },
                ...(product_metadata && {
                    productMetadata: {
                        [BY_ID]: product_metadata,
                        [ALL_IDS]: Object.keys(product_metadata),
                    },
                }),
                ...(brands && {
                    brands: {
                        [BY_ID]: brands,
                        [ALL_IDS]: Object.keys(brands),
                    },
                }),
                ...(campaigns && {
                    campaigns: {
                        [BY_ID]: campaigns,
                        [ALL_IDS]: Object.keys(campaigns),
                    },
                }),
            })
        },

        // product
        [combineActions(
            fetchProductSuccess,
            updateProductSuccess,
            deleteProductSuccess
        )](state, action) {
            const productData = action.payload
            const {
                entities: { campaigns, products, brands, product_metadata },
                result: productId,
            } = normalize(productData, productSchema)
            return mergeWith(mergeArray, state, {
                products: {
                    [BY_ID]: products,
                    [ALL_IDS]: [productId],
                },
                campaigns: {
                    [BY_ID]: campaigns,
                    [ALL_IDS]: [products[productId].campaign],
                },
                brands: {
                    [BY_ID]: brands,
                    [ALL_IDS]: [products[productId].profile],
                },
                ...(product_metadata && {
                    productMetadata: {
                        [BY_ID]: product_metadata,
                        [ALL_IDS]: [products[productId].product_metadata],
                    },
                }),
            })
        },

        // keywords
        [combineActions(searchKeywordsSuccess)](state, action) {
            const {
                entities: { keywords, campaigns, brands },
                result: keywordIds,
            } = normalize(action.payload.results, keywordListSchema)
            return mergeWith(mergeArray, state, {
                keywords: {
                    [BY_ID]: keywords,
                    [ALL_IDS]: keywordIds,
                },
                campaigns: {
                    [BY_ID]: campaigns,
                    [ALL_IDS]: Object.keys(campaigns),
                },
                brands: {
                    [BY_ID]: brands,
                    [ALL_IDS]: Object.keys(brands),
                },
            })
        },

        // keyword
        [combineActions(
            fetchKeywordSuccess,
            updateKeywordSuccess,
            deleteKeywordSuccess
        )](state, action) {
            const keywordData = action.payload
            const {
                entities: {
                    brands: brand,
                    campaigns: campaign,
                    keywords: keyword,
                },
                result: keywordId,
            } = normalize(keywordData, keywordSchema)
            return mergeWith(mergeArray, state, {
                keywords: {
                    [BY_ID]: keyword,
                    [ALL_IDS]: [keywordId],
                },
                brands: {
                    [BY_ID]: brand,
                    [ALL_IDS]: [keyword[keywordId].profile],
                },
                campaigns: {
                    [BY_ID]: campaign,
                    [ALL_IDS]: [keyword[keywordId].campaign],
                },
            })
        },

        // sov brand
        [searchSovBrandsSuccess](state, action) {
            const { results } = action.payload

            return set(['sovBrands'], results, state)
        },

        // sov keyword
        [searchSovKeywordsSuccess](state, action) {
            const { results } = action.payload
            const {
                entities: { sovKeywords },
                result: keywordIds,
            } = normalize(results, sovKeywordListSchema)

            return mergeWith(mergeArray, state, {
                sovKeywords: {
                    [BY_ID]: sovKeywords,
                    [ALL_IDS]: keywordIds,
                },
            })
        },
        [combineActions(
            fetchSovKeywordSuccess,
            updateSovKeywordSuccess,
            deleteSovKeywordSuccess
        )](state, action) {
            const {
                entities: { sovKeywords, labels },
                result: sovKeywordId,
            } = normalize(action.payload, sovKeywordSchema)
            return mergeWith(mergeArray, state, {
                sovKeywords: {
                    [BY_ID]: sovKeywords,
                    [ALL_IDS]: [sovKeywordId],
                },
                labels: {
                    [BY_ID]: labels,
                    [ALL_IDS]: sovKeywords[sovKeywordId].labels,
                },
            })
        },

        // sov keyword categories
        [searchSovKeywordCategoriesSuccess](state, action) {
            const categories = action.payload
            return mergeWith(mergeArray, state, {
                sovKeywordCategories: {
                    [ALL_IDS]: categories,
                },
            })
        },

        // product metadata
        [fetchProductMetadataSuccess](state, action) {
            const {
                entities: { product_metadata },
                result: productMetadataId,
            } = normalize(action.payload.results, productMetadataListSchema)
            return mergeWith(mergeArray, state, {
                productMetadata: {
                    [BY_ID]: product_metadata,
                    [ALL_IDS]: [productMetadataId],
                },
            })
        },

        // sign out
        [signOutSuccess]() {
            return defaultState
        },
    },
    defaultState
)
