/*
global
    CEREBRO_API_ENDPOINT,
    CEREBRO_OAUTH_CLIENT_ID,
    CEREBRO_OAUTH_CLIENT_SECRET
*/
import axios from 'axios'

import { ARCHIVED } from 'constants/resourceStates'
import {
  CEREBRO_ACCESS_TOKEN,
  CUSTOMER_SERVICE,
  ORGANIZATION_ID,
  ORGANIZATION_GROUP_ID,
} from 'constants/localStorage'

/**
 * Factory for Axios instances used to interact with Cerebro
 *
 * @returns {AxiosInstance}
 */
const createCerebroAxiosInstance = () =>
  axios.create({
    baseURL: CEREBRO_API_ENDPOINT,
    validateStatus: (status) => status >= 200 && status < 500,
    headers: {
      'Content-Type': 'application/json',
    },
  })

// create axios instance with organization headers
const axiosInstanceOrganizations = createCerebroAxiosInstance()
axiosInstanceOrganizations.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(CEREBRO_ACCESS_TOKEN)
  const customerService = JSON.parse(localStorage.getItem(CUSTOMER_SERVICE))
  const organizationId = localStorage.getItem(ORGANIZATION_ID)
  const organizationGroupId = localStorage.getItem(ORGANIZATION_GROUP_ID)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  if (organizationGroupId && customerService) {
    config.headers['x-dsi-org-group-id'] = organizationGroupId
  } else if (organizationId) {
    config.headers['x-dsi-org-id'] = organizationId
  }

  return config
})

// create axios instance without organization headers
const axiosInstance = createCerebroAxiosInstance()
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(CEREBRO_ACCESS_TOKEN)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

/**
 * Authenticate with Cerebro to get
 * access token and refresh token
 *
 * @param username
 * @param password
 *
 * @returns {AxiosPromise}
 */
export const loginWithCerebro = (username, password) =>
  axiosInstance.post(
    `/oauth/token/`,
    {
      grant_type: 'password',
      username,
      password,
    },
    {
      auth: {
        username: CEREBRO_OAUTH_CLIENT_ID,
        password: CEREBRO_OAUTH_CLIENT_SECRET,
      },
    }
  )

/**
 * Get organizations for authenticated user
 *
 * @returns {AxiosPromise}
 */
export const getUserOrganizations = () =>
  axiosInstance.get(`/api/user/organizations/`)

/**
 * Create an organization
 *
 * @returns {AxiosPromise}
 */
export const createOrganization = (data) =>
  axiosInstance.post(`/api/user/organizations/`, data)

/**
 * Get organization groups for authenticated user
 *
 * Note: this endpoint is only used for providing customer
 * success team with list of all user groups to assume
 *
 * @returns {AxiosPromise}
 */
export const getUserOrganizationGroups = () =>
  axiosInstance.get(`/api/user/organization_groups/`)

/**
 * Get user feature permissions for authenticated user
 *
 * @returns {AxiosPromise}
 */
export const getUserFeaturePermissions = () =>
  axiosInstance.get(`/api/user/feature_permissions/`)

/**
 * Get user feature permissions for authenticated user for
 * a specified organization
 *
 * @returns {AxiosPromise}
 */
export const getUserFeaturePermissionsForOrg = (organizationId) =>
  axiosInstance.get(`/api/user/feature_permissions/`, {
    headers: {
      'x-dsi-org-id': organizationId,
    },
  })

/**
 * Get organization feature permissions for authenticated user
 *
 * @returns {AxiosPromise}
 */
export const getUserOrganizationFeaturePermissions = () =>
  axiosInstanceOrganizations.get(`/api/user/feature_permissions/`)

/**
 * Returns a list of features the user is permitted to for the profile.
 *
 * If the organization id header is provided, the list will show permissions
 * the user has for that Organization.
 *
 * @param brandId
 * @returns {AxiosPromise<any>}
 */
export const getBrandFeaturePermissions = (brandId) =>
  axiosInstanceOrganizations.get(`/api/profile/${brandId}/feature_permissions/`)

/**
 * Get an organization by id
 *
 * @returns {AxiosPromise}
 */
export const getOrganization = (organizationId) =>
  axiosInstance.get(`/api/organization/${organizationId}/`)

/**
 * Get groups for an organization
 *
 * @returns {AxiosPromise}
 */
export const getOrganizationGroups = (organizationId, params) =>
  axiosInstance.get(`/api/organization/${organizationId}/groups/`, { params })

/**
 * Get members for an organization
 *
 * @returns {AxiosPromise}
 */
export const getOrganizationMembers = (organizationId, params) =>
  axiosInstance.get(`/api/organization/${organizationId}/members/`, {
    params,
  })

/**
 * Get members for an organization group
 *
 * @returns {AxiosPromise}
 */
export const getOrganizationGroupMembers = (organizationGroupId) =>
  axiosInstance.get(`/api/organization_group/${organizationGroupId}/members/`)

/**
 * Get automation description for an organization
 *
 * @returns {AxiosPromise}
 */
export const getAutomationDescription = () =>
  axiosInstanceOrganizations.get(`/api/automation_description/`)

/**
 * Get labels for an organization
 *
 * @returns {AxiosPromise}
 */
export const getLabels = (params) =>
  axiosInstanceOrganizations.get(`/api/labels/`, {
    params,
  })

/**
 * Create a new label
 *
 * @returns {AxiosPromise}
 */
export const createLabel = (data) =>
  axiosInstanceOrganizations.post(`/api/labels/`, data)

/**
 * Invite a member to an organization
 *
 * @returns {AxiosPromise}
 */
export const inviteMember = (data) =>
  axiosInstance.post('/api/invitations/', data)

/**
 * Get invitations
 *
 * @returns {AxiosPromise}
 */
export const getInvitations = (params) =>
  axiosInstance.get('/api/invitations/', { params })

/**
 * Patch an invitation
 *
 * @returns {AxiosPromise}
 */
export const patchInvitation = (invitationId, params) =>
  axiosInstance.patch(`/api/invitation/${invitationId}/`, params)

/**
 * Get integrations for an organization
 *
 * @returns {AxiosPromise}
 */
export const getOrganizationIntegrations = (organizationId, params) =>
  axiosInstance.get(`/api/organization/${organizationId}/integrations/`, {
    params,
  })

/**
 * Get organization group by id
 *
 * @returns {AxiosPromise}
 */
export const getOrganizationGroup = (organizationGroupId) =>
  axiosInstance.get(`/api/organization_group/${organizationGroupId}/`)

/**
 * Patch an organization group
 *
 * If countries are provided, all brands and regions with be removed. If brands
 * are provided, all countries and regions with be removed. If regions are
 * provided, all countries and brands with be removed.
 *
 * @returns {AxiosPromise}
 */
export const patchOrganizationGroup = (organizationGroupId, params) =>
  axiosInstance.patch(`/api/organization_group/${organizationGroupId}/`, params)

/**
 * Add member to an organization group
 *
 * @returns {AxiosPromise}
 */
export const addMemberToOrganizationGroup = (organizationGroupId, data) =>
  axiosInstance.post(
    `/api/organization_group/${organizationGroupId}/members/`,
    data
  )

/**
 * Remove a member from an organization group
 *
 * @returns {AxiosPromise}
 */
export const removeMemberFromOrganizationGroup = (
  organizationGroupId,
  memberId
) =>
  axiosInstance.delete(
    `/api/organization_group/${organizationGroupId}/member/${memberId}/`
  )

/**
 * Remove a member from an organization
 *
 * @returns {AxiosPromise}
 */
export const removeMemberFromOrganization = (organizationId, memberId) =>
  axiosInstance.delete(
    `/api/organization/${organizationId}/member/${memberId}/`
  )

/**
 * Get organization group by id
 *
 * @returns {AxiosPromise}
 */
export const createOrganizationGroup = (data) =>
  axiosInstance.post('/api/organization_groups/', data)

/**
 * Create a new AMS integration for a specific organization.
 *
 * @param accountAlias the name provided by the user for this integration
 * @returns {Promise<any>}
 */
export const loginWithAmazon = ({ alias, organizationId }) =>
  axiosInstance.post(
    `/api/lwa/`,
    { account_alias: alias },
    { headers: { 'x-dsi-org-id': organizationId } }
  )

/**
 * Get aggregate fact data for all data associated with
 * the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getAllFactAggregate = (params) =>
  axiosInstanceOrganizations.get(`/api/facts/aggregate/`, {
    params,
  })

/**
 * Get aggregate fact data for sponsored product data associated with
 * the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getSponsoredProductFactAggregate = (params) =>
  axiosInstanceOrganizations.get('/api/sponsored_product/facts/aggregate/', {
    params,
  })

/**
 * Get aggregate fact data for headline search data associated with
 * the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getHeadlineSearchFactAggregate = (params) =>
  axiosInstanceOrganizations.get('/api/headline_search/facts/aggregate/', {
    params,
  })

/**
 * Get timeseries fact data for sponsored product data associated with
 * the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getSponsoredProductFactTimeseries = (params) =>
  axiosInstanceOrganizations.get('/api/sponsored_product/facts/timeseries/', {
    params,
  })

/**
 * Get timeseries fact data for headline search data associated with
 * the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getHeadlineSearchFactTimeseries = (params) =>
  axiosInstanceOrganizations.get('/api/headline_search/facts/timeseries/', {
    params,
  })

/**
 * Get a CSV export of the timeseries fact data for
 * all data associated with the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getAllFactTimeseriesExport = (params) =>
  axiosInstanceOrganizations.get(
    `/api/sponsored_product/facts/timeseries/export/csv/`,
    {
      headers: {
        Accept: 'text/csv',
      },
      params,
    }
  )

/**
 * Get aggregate fact data for all Brands associated with
 * the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getBrandsFactAggregates = (params) =>
  axiosInstanceOrganizations.get(`/api/profiles/facts/aggregate/`, {
    params,
  })

/**
 * Get aggregate fact data for sponsored product data for all Brands
 * associated with the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getBrandsSponsoredProductFactAggregates = (params) =>
  axiosInstanceOrganizations.get(
    `/api/profiles/sponsored_product/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get aggregate fact data for headline search data for all Brands
 * associated with the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getBrandsHeadlineSearchFactAggregates = (params) =>
  axiosInstanceOrganizations.get(
    `/api/profiles/headline_search/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get a CSV export of the aggregate fact data for
 * all Brands associated with the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getBrandsFactAggregatesExport = (params) =>
  axiosInstanceOrganizations.get(`/api/profiles/facts/aggregate/export/csv/`, {
    headers: {
      Accept: 'text/csv',
    },
    params,
  })

/**
 * Get aggregate fact data for all Campaigns associated with
 * the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignsFactAggregates = (params) =>
  axiosInstanceOrganizations.get(`/api/campaigns/facts/aggregate/`, {
    params,
  })

/**
 * Get aggregate fact data for sponsored product data for all Campaigns
 * associated with the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignsSponsoredProductFactAggregates = (params) =>
  axiosInstanceOrganizations.get(
    `/api/campaigns/sponsored_product/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get aggregate fact data for headline search data for all Campaigns
 * associated with the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignsHeadlineSearchFactAggregates = (params) =>
  axiosInstanceOrganizations.get(
    `/api/campaigns/headline_search/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get a CSV export of the aggregate fact data for
 * all Campaigns associated with the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignsFactAggregatesExport = (params) =>
  axiosInstanceOrganizations.get(`/api/campaigns/facts/aggregate/export/csv/`, {
    headers: {
      Accept: 'text/csv',
    },
    params,
  })

/**
 * Get aggregate fact data for all campaigns associated with
 * a specific brand
 *
 * @param brandId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignsForBrandFactAggregates = (brandId, params) =>
  axiosInstanceOrganizations.get(
    `/api/profile/${brandId}/campaigns/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get aggregate sponsored product fact data for all campaigns associated with
 * a specific brand
 *
 * @param brandId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignsForBrandSponsoredProductFactAggregates = (
  brandId,
  params
) =>
  axiosInstanceOrganizations.get(
    `/api/profile/${brandId}/campaigns/sponsored_product/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get aggregate headline search fact data for all campaigns associated with
 * a specific brand
 *
 * @param brandId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignsForBrandHeadlineSearchFactAggregates = (
  brandId,
  params
) =>
  axiosInstanceOrganizations.get(
    `/api/profile/${brandId}/campaigns/headline_search/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get a CSV export of aggregate fact data for
 * all campaigns associated with a specific brand
 *
 * @param brandId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignsForBrandFactAggregatesExport = (brandId, params) =>
  axiosInstanceOrganizations.get(
    `/api/profile/${brandId}/campaigns/facts/aggregate/export/csv/`,
    {
      headers: {
        Accept: 'text/csv',
      },
      params,
    }
  )

/**
 * Get aggregate fact data for all campaigns associated with
 * a specific brand
 *
 * @param brandId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getBrandFactAggregate = (brandId, params) =>
  axiosInstanceOrganizations.get(`/api/profile/${brandId}/facts/aggregate/`, {
    params,
  })

/**
 * Get aggregate sponsored product fact data for all campaigns associated with
 * a specific brand
 *
 * @param brandId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getBrandSponsoredProductFactAggregate = (brandId, params) =>
  axiosInstanceOrganizations.get(
    `/api/profile/${brandId}/sponsored_product/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get aggregate headline search fact data for all campaigns associated with
 * a specific brand
 *
 * @param brandId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getBrandHeadlineSearchFactAggregate = (brandId, params) =>
  axiosInstanceOrganizations.get(
    `/api/profile/${brandId}/headline_search/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get timeseries sponsored product fact data for all campaigns associated with
 * a specific brand
 *
 * @param brandId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getBrandSponsoredProductFactTimeseries = (brandId, params) =>
  axiosInstanceOrganizations.get(
    `/api/profile/${brandId}/sponsored_product/facts/timeseries/`,
    {
      params,
    }
  )

/**
 * Get timeseries headline search fact data for all campaigns associated with
 * a specific brand
 *
 * @param brandId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getBrandHeadlineSearchFactTimeseries = (brandId, params) =>
  axiosInstanceOrganizations.get(
    `/api/profile/${brandId}/headline_search/facts/timeseries/`,
    {
      params,
    }
  )

/**
 * Get a CSV of timeseries fact data for all campaigns associated with
 * a specific brand
 *
 * @param brandId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getBrandFactTimeseriesExport = (brandId, params) =>
  axiosInstanceOrganizations.get(
    `/api/profile/${brandId}/facts/timeseries/export/csv/`,
    {
      headers: {
        Accept: 'text/csv',
      },
      params,
    }
  )

/**
 * Get aggregate sponsored product fact data for a single campaign.
 *
 * @param campaignId the Campaign ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignSponsoredProductFactAggregate = (campaignId, params) =>
  axiosInstanceOrganizations.get(
    `/api/campaign/${campaignId}/sponsored_product/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get aggregate headline search fact data for a single campaign.
 *
 * @param campaignId the Campaign ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignHeadlineSearchFactAggregate = (campaignId, params) =>
  axiosInstanceOrganizations.get(
    `/api/campaign/${campaignId}/headline_search/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get timeseries sponsored product facts for a single campaign.
 *
 * @param campaignId the Campaign ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignSponsoredProductFactTimeseries = (campaignId, params) =>
  axiosInstanceOrganizations.get(
    `/api/campaign/${campaignId}/sponsored_product/facts/timeseries/`,
    { params }
  )

/**
 * Get timeseries headline search facts for a single campaign.
 *
 * @param campaignId the Campaign ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignHeadlineSearchFactTimeseries = (campaignId, params) =>
  axiosInstanceOrganizations.get(
    `/api/campaign/${campaignId}/headline_search/facts/timeseries/`,
    { params }
  )

/**
 * Get a CSV of timeseries facts for a single campaign.
 *
 * @param campaignId the Campaign ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getCampaignFactTimeseriesExport = (campaignId, params) =>
  axiosInstanceOrganizations.get(
    `/api/campaign/${campaignId}/facts/timeseries/export/csv/`,
    {
      headers: {
        Accept: 'text/csv',
      },
      params,
    }
  )

/**
 * Get aggregate sponsored product fact data for all keywords associated with
 * a specific campaign
 *
 * @param campaignId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getKeywordsForCampaignSponsoredProductFactAggregates = (
  campaignId,
  params
) =>
  axiosInstanceOrganizations.get(
    `/api/campaign/${campaignId}/keywords/sponsored_product/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get aggregate headline search fact data for all keywords associated with
 * a specific campaign
 *
 * @param campaignId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getKeywordsForCampaignHeadlineSearchFactAggregates = (
  campaignId,
  params
) =>
  axiosInstanceOrganizations.get(
    `/api/campaign/${campaignId}/keywords/headline_search/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get a  CSV of aggregate fact data for all keywords associated with
 * a specific campaign
 *
 * @param campaignId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getKeywordsForCampaignFactAggregatesExport = (
  campaignId,
  params
) =>
  axiosInstanceOrganizations.get(
    `/api/campaign/${campaignId}/keywords/facts/aggregate/export/csv/`,
    {
      headers: {
        Accept: 'text/csv',
      },
      params,
    }
  )

/**
 * Get aggregate sponsored product fact data for all products associated with
 * a specific campaign
 *
 * @param campaignId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getProductsForCampaignSponsoredProductFactAggregates = (
  campaignId,
  params
) =>
  axiosInstanceOrganizations.get(
    `/api/campaign/${campaignId}/product_ads/sponsored_product/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get aggregate headline search fact data for all products associated with
 * a specific campaign
 *
 * @param campaignId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getProductsForCampaignHeadlineSearchFactAggregates = (
  campaignId,
  params
) =>
  axiosInstanceOrganizations.get(
    `/api/campaign/${campaignId}/product_ads/headline_search/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get a CSV of aggregate fact data for all products associated with
 * a specific campaign
 *
 * @param campaignId
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getProductsForCampaignFactAggregatesExport = (
  campaignId,
  params
) =>
  axiosInstanceOrganizations.get(
    `/api/campaign/${campaignId}/product_ads/facts/aggregate/export/csv/`,
    {
      headers: {
        Accept: 'text/csv',
      },
      params,
    }
  )

/**
 * Get all Brands for the authenticated user.
 *
 * @returns {AxiosPromise}
 */
export const getBrands = (params = { ordering: 'brand_name,country_code' }) =>
  axiosInstanceOrganizations.get(`/api/profiles/`, {
    params,
  })

/**
 * Get brands for an organization.
 *
 * @returns {AxiosPromise}
 */
export const getBrandsForOrg = (
  organizationId,
  params = { ordering: 'brand_name,country_code' }
) =>
  axiosInstance.get(`/api/profiles/`, {
    params,
    headers: {
      'x-dsi-org-id': organizationId,
    },
  })

/**
 * Get a specific Brand
 *
 * @param brandId
 *
 * @returns {AxiosPromise}
 */
export const getBrand = (brandId) =>
  axiosInstanceOrganizations.get(`/api/profile/${brandId}/`)

/**
 * Update a brand
 *
 * @param brandId
 * @param data
 *
 * @returns {AxiosPromise}
 */
export const updateBrand = (brandId, data) =>
  axiosInstanceOrganizations.patch(`/api/profile/${brandId}/`, data)

/**
 * Get all Campaigns for the authenticated user.
 *
 * @returns {AxiosPromise}
 */
export const getCampaigns = (params = { ordering: 'name' }) =>
  axiosInstanceOrganizations.get('/api/campaigns/', { params })

/**
 * Get single campaign
 *
 * @param campaignId
 *
 * @returns {AxiosPromise}
 */
export const getCampaign = (campaignId) =>
  axiosInstanceOrganizations.get(`/api/campaign/${campaignId}/`)

/**
 * Update campaign
 *
 * @param {string} campaignId - Campaign ID
 * @param {object} data - Campaign data to update with
 *
 * @returns {AxiosPromise}
 */
export const updateCampaign = (campaignId, data) =>
  axiosInstanceOrganizations.patch(`/api/campaign/${campaignId}/`, data)

/**
 * Delete campaign
 *
 * @param {string} campaignId - Campaign ID
 *
 * @returns {AxiosPromise}
 */
export const deleteCampaign = (campaignId) =>
  axiosInstanceOrganizations.patch(`/api/campaign/${campaignId}/`, {
    state: ARCHIVED,
  })

/**
 * Create campaign automation
 *
 * @returns {AxiosPromise}
 */
export const createCampaignAutomation = (data) =>
  axiosInstanceOrganizations.post(`/api/campaign_automations/`, data)

/**
 * Get campaign automation
 *
 * @param campaignId
 *
 * @returns {AxiosPromise}
 */
export const getCampaignAutomation = (campaignId) =>
  axiosInstanceOrganizations.get(`/api/campaign_automation/${campaignId}/`)

/**
 * Update campaign automation
 *
 * @param {string} campaignId - Campaign ID
 * @param {object} data - Campaign automation data
 *
 * @returns {AxiosPromise}
 */
export const updateCampaignAutomation = (campaignId, data) =>
  axiosInstanceOrganizations.patch(
    `/api/campaign_automation/${campaignId}/`,
    data
  )

/**
 * Get hourly multipliers of a campaign
 *
 * @param campaignId
 *
 * @returns {AxiosPromise}
 */
export const getCampaignHourlyMultipliers = (campaignId) =>
  axiosInstanceOrganizations.get(
    `/api/campaign/${campaignId}/hourly_multipliers/`
  )

/**
 * Get hourly multipliers of a campaign
 *
 * @param campaignId
 * @param multipliers
 *
 * @returns {AxiosPromise}
 */
export const updateCampaignHourlyMultipliers = (campaignId, multipliers) =>
  axiosInstanceOrganizations.patch(
    `/api/campaign/${campaignId}/hourly_multipliers/`,
    {
      hourly_multipliers: multipliers,
    }
  )

/**
 * Get all Products for the authenticated user.
 *
 * @returns {AxiosPromise}
 */
export const getProducts = (params = { ordering: 'asin' }) =>
  axiosInstanceOrganizations.get('/api/product_ads/', { params })

/**
 * Get product metadata
 *
 * @returns {AxiosPromise}
 */
export const getProductMetadata = (params) =>
  axiosInstanceOrganizations.get(`/api/product_metadata/`, { params })

/**
 * Get single Product
 *
 * @param productId the product ID
 *
 * @returns {AxiosPromise}
 */
export const getProduct = (productId) =>
  axiosInstanceOrganizations.get(`/api/product_ad/${productId}/`)

/**
 * Attach a single Product
 *
 * @param data the product data to attach
 *
 * @returns {AxiosPromise}
 */
export const attachProduct = (data) =>
  axiosInstanceOrganizations.post(`/api/product_ads/`, data)

/**
 * Update single Product
 *
 * @param productId the product ID
 * @param data the product data to update
 *
 * @returns {AxiosPromise}
 */
export const updateProduct = (productId, data) =>
  axiosInstanceOrganizations.patch(`/api/product_ad/${productId}/`, data)

/**
 * Update single Product
 *
 * @param productId the product ID
 *
 * @returns {AxiosPromise}
 */
export const deleteProduct = (productId) =>
  axiosInstanceOrganizations.patch(`/api/product_ad/${productId}/`, {
    state: ARCHIVED,
  })

/**
 * Get sponsored product facts for product ads
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getSponsoredProductProductAdFacts = (params) =>
  axiosInstanceOrganizations.get(
    `/api/product_ad_facts/sponsored_product/aggregate/`,
    {
      params,
    }
  )

/**
 * Get a CSV export of sponsored product facts for product ads
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getSponsoredProductProductAdFactsExport = (params) =>
  axiosInstanceOrganizations.get(
    `/api/product_ad_facts/sponsored_product/aggregate/export/csv/`,
    {
      headers: {
        Accept: 'text/csv',
      },
      params,
    }
  )

/**
 * Get all Keywords for the authenticated user.
 *
 * @returns {AxiosPromise}
 */
export const getKeywords = (params = { ordering: 'text' }) =>
  axiosInstanceOrganizations.get('/api/keywords/', { params })

/**
 * Get a specific Keyword
 *
 * @param keywordId the Keyword ID to get
 *
 * @returns {AxiosPromise}
 */
export const getKeyword = (keywordId) =>
  axiosInstanceOrganizations.get(`/api/keyword/${keywordId}/`)

/**
 * Attach a specific Keyword
 *
 * @param data object with Keyword data to attach
 *
 * @returns {AxiosPromise}
 */
export const attachKeyword = (data) =>
  axiosInstanceOrganizations.post(`/api/keywords/`, data)

/**
 * Update a specific Keyword
 *
 * @param keywordId the Keyword ID to update
 * @param data object with Keyword data to update
 *
 * @returns {AxiosPromise}
 */
export const updateKeyword = (keywordId, data) =>
  axiosInstanceOrganizations.patch(`/api/keyword/${keywordId}/`, data)

/**
 * Delete a new Keyword
 *
 * @param keywordId object with Keyword data to delete
 *
 * @returns {AxiosPromise}
 */
export const deleteKeyword = (keywordId) =>
  axiosInstanceOrganizations.patch(`/api/keyword/${keywordId}/`, {
    state: ARCHIVED,
  })

/**
 * Get aggregate fact data for all Keywords associated with
 * the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getKeywordsFactAggregates = (params) =>
  axiosInstanceOrganizations.get(`/api/keywords/facts/aggregate/`, {
    params,
  })

/**
 * Get aggregate sponsored product fact data for all Keywords associated with
 * the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getKeywordsSponsoredProductFactAggregates = (params) =>
  axiosInstanceOrganizations.get(
    `/api/keywords/sponsored_product/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get aggregate headline search fact data for all Keywords associated with
 * the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getKeywordsHeadlineSearchFactAggregates = (params) =>
  axiosInstanceOrganizations.get(
    `/api/keywords/headline_search/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get a CSV export of the aggregate fact data for
 * all Brands associated with the authenticated user
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getKeywordsFactAggregatesExport = (params) =>
  axiosInstanceOrganizations.get(`/api/keywords/facts/aggregate/export/csv/`, {
    headers: {
      Accept: 'text/csv',
    },
    params,
  })

/**
 * Get timeseries sponsored product facts for a single keyword.
 *
 * @param keywordId the Keyword ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getKeywordSponsoredProductFactTimeseries = (keywordId, params) =>
  axiosInstanceOrganizations.get(
    `/api/keyword/${keywordId}/sponsored_product/facts/timeseries/`,
    {
      params,
    }
  )

/**
 * Get timeseries headline search facts for a single keyword.
 *
 * @param keywordId the Keyword ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getKeywordHeadlineSearchFactTimeseries = (keywordId, params) =>
  axiosInstanceOrganizations.get(
    `/api/keyword/${keywordId}/headline_search/facts/timeseries/`,
    {
      params,
    }
  )

/**
 * Get timeseries facts for a single keyword.
 *
 * @param keywordId the Keyword ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getKeywordFactTimeseriesExport = (keywordId, params) =>
  axiosInstanceOrganizations.get(
    `/api/keyword/${keywordId}/facts/timeseries/export/csv/`,
    {
      headers: {
        Accept: 'text/csv',
      },
      params,
    }
  )

/**
 * Get aggregate sponsored product fact data for a single keyword.
 *
 * @param keywordId the Keyword ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getKeywordSponsoredProductFactAggregate = (keywordId, params) =>
  axiosInstanceOrganizations.get(
    `/api/keyword/${keywordId}/sponsored_product/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get aggregate headline search fact data for a single keyword.
 *
 * @param keywordId the Keyword ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getKeywordHeadlineSearchFactAggregate = (keywordId, params) =>
  axiosInstanceOrganizations.get(
    `/api/keyword/${keywordId}/headline_search/facts/aggregate/`,
    {
      params,
    }
  )

/**
 * Get all SOV brands for the authenticated user.
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getSovBrands = (params = { ordering: 'brand' }) =>
  axiosInstanceOrganizations.get(`/api/product_metadata/brands/`, {
    params,
  })

/**
 * Get all SOV keywords for the authenticated user.
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getSovKeywords = (params) =>
  axiosInstanceOrganizations.get(`/api/sov/keywords/`, {
    params,
  })

/**
 * Get all SOV keyword categories for the authenticated user.
 *
 * @returns {AxiosPromise}
 */
export const getSovKeywordCategories = () =>
  axiosInstanceOrganizations.get(`/api/sov/categories/`)

/**
 * Get a CSV export of all SOV keywords for the authenticated user.
 *
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getSovKeywordsExport = (params) =>
  axiosInstanceOrganizations.get(`/api/sov/keywords/export/csv/`, {
    headers: {
      Accept: 'text/csv',
    },
    params,
  })

/**
 * Get a specific SOV keyword.
 *
 * @param keywordId the Keyword ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getSovKeyword = (keywordId, params) =>
  axiosInstanceOrganizations.get(`/api/sov/keyword/${keywordId}/`, {
    params,
  })

/**
 * Attach a specific SOV Keyword
 *
 * @param data object with Keyword data to attach
 *
 * @returns {AxiosPromise}
 */
export const attachSovKeyword = (data) =>
  axiosInstanceOrganizations.post(`/api/sov/keywords/`, data)

/**
 * Update a specific SOV Keyword
 *
 * @param keywordId the Keyword ID to update
 * @param data object with Keyword data to update
 *
 * @returns {AxiosPromise}
 */
export const updateSovKeyword = (keywordId, data) =>
  axiosInstanceOrganizations.patch(`/api/sov/keyword/${keywordId}/`, data)

/**
 * Delete a specific SOV Keyword
 *
 * @param keywordId the Keyword ID to delete
 *
 * @returns {AxiosPromise}
 */
export const deleteSovKeyword = (keywordId) =>
  axiosInstanceOrganizations.patch(`/api/sov/keyword/${keywordId}/`, {
    state: ARCHIVED,
  })

/**
 * Get all SERP Data Points for a single SOV keyword.
 *
 * @param keywordId the Keyword ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getSovKeywordSerpDataPoints = (keywordId, params) =>
  axiosInstanceOrganizations.get(
    `/api/sov/keyword/${keywordId}/search_results/`,
    {
      params,
    }
  )

/**
 * Get a CSV export of all SERP Data Points for a single SOV keyword.
 *
 * @param keywordId the Keyword ID to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getSovKeywordSerpDataPointsExport = (keywordId, params) =>
  axiosInstanceOrganizations.get(
    `/api/sov/keyword/${keywordId}/search_results/export/csv/`,
    {
      headers: {
        Accept: 'text/csv',
      },
      params,
    }
  )

/**
 * Gets relevant facts for SOV search results, grouped and filtered
 * by specified parameters
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const getSovFactAggregates = (params) =>
  axiosInstanceOrganizations.get('/api/sov/search_results/facts/aggregate/', {
    params,
  })

/**
 * Get a CSV export for SOV search results, grouped and filtered
 * by specified parameters
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const getSovFactAggregatesExport = (params) =>
  axiosInstanceOrganizations.get(
    '/api/sov/search_results/facts/aggregate/export/csv/',
    {
      headers: {
        Accept: 'text/csv',
      },
      params,
    }
  )

/**
 * Get all of the Search Results for a single SOV keyword.
 *
 * @param keywordId the Keyword ID to filter to
 * @param scheduledDate the Scheduled Date to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getSovKeywordSearchResult = (keywordId, scheduledDate, params) =>
  axiosInstanceOrganizations.get(
    `/api/sov/keyword/${keywordId}/search_results/${scheduledDate}/`,
    {
      params,
    }
  )

/**
 * Get a CSV export of all of the Search Results for a single SOV keyword.
 *
 * @param keywordId the Keyword ID to filter to
 * @param scheduledDate the Scheduled Date to filter to
 * @param params an object with filters
 *
 * @returns {AxiosPromise}
 */
export const getSovKeywordSearchResultExport = (
  keywordId,
  scheduledDate,
  params
) =>
  axiosInstanceOrganizations.get(
    `/api/sov/keyword/${keywordId}/search_results/${scheduledDate}/export/csv/`,
    {
      headers: {
        Accept: 'text/csv',
      },
      params,
    }
  )

/**
 * Get screen shot for a SOV keyword search result
 *
 * @param keywordId
 * @param scheduledDate
 * @returns {AxiosPromise<any>}
 */
export const getSovKeywordSearchResultScreenshot = (keywordId, scheduledDate) =>
  axiosInstanceOrganizations.get(
    `/api/sov/keyword/${keywordId}/search_results/${scheduledDate}/screenshot/`
  )

/**
 * Request that campaign data is synced between AMS and Cerebro
 *
 * @param campaignId
 * @returns {AxiosPromise<any>}
 */
export const syncCampaign = (campaignId) =>
  axiosInstanceOrganizations.post(`/api/campaign/${campaignId}/sync/`)

/**
 * Get the full changelog for an organization
 *
 * @param {*} params
 */
export const getChangelog = (params) =>
  axiosInstanceOrganizations.get(`/api/changelog/`, {
    params,
  })

/**
 * Get recommendations for an organization
 *
 * @param {*} params
 */
export const getRecommendations = (params) =>
  axiosInstanceOrganizations.get(`/api/recommendations/`, {
    params,
  })
