/**
 * Define utility functions that format params to be sent to the api
 */

import { parsePhoneNumberFromString } from 'libphonenumber-js'
import isEmpty from 'lodash/isEmpty'
import set from 'lodash/set'
import compact from 'lodash/compact'

/**
 * Convert pagination into query params using DRF's LimitOffsetPagination format
 *
 * @param {object} pagination pagination object
 */
export const formatPagination = pagination => ({
    limit: pagination.pageSize,
    offset: (pagination.current - 1) * pagination.pageSize,
})

/**
 * Convert sorter into query params using DRF's OrderingFilter format
 *
 * @param {object} sorter sorter object
 */
export const formatSorter = sorter => {
    const { field, order, filterPositiveValues } = sorter
    const params = {}

    if (!field) {
        return params
    }

    // Cerebro uses '__' where our JS datasets use '.' for nesting separators
    const formattedField = field.replace(/\./g, '__')

    params.ordering =
        order === 'descend' ? `-${formattedField}` : formattedField

    // Filter only positive values if `filterPositiveValues` is true
    if (filterPositiveValues) {
        params[`${formattedField}__gt`] = 0
    }

    return params
}

export const formatMetrics = metrics =>
    isEmpty(metrics) ? {} : { metrics: metrics.join(',') }

export const formatCurrency = currency => (currency ? { currency } : {})

export const formatGroupBy = (groups, aggregation) => ({
    group_by: compact([...groups, aggregation]).join(','),
})

/**
 * Format sign up form values
 */
export const formatSignUpData = ({
    name,
    company,
    website,
    phone,
    how_did_you_hear,
    how_did_you_hear_other,
    email,
    password,
    terms_of_service,
}) => {
    const data = {
        username: email, // using email as username, per Cognito settings
        password,
        attributes: {
            email,
            name,
            'custom:company': company,
            'custom:terms_of_service': terms_of_service ? '1' : '0',
        },
    }

    if (website) {
        set(data, 'attributes.website', website)
    }

    if (phone) {
        const phoneParsed = parsePhoneNumberFromString(phone, 'US')
        set(data, 'attributes.phone_number', phoneParsed.format('E.164'))
    }

    if (how_did_you_hear_other) {
        set(data, 'attributes.custom:how_did_you_hear', how_did_you_hear_other)
    } else if (how_did_you_hear && how_did_you_hear !== 'other') {
        set(data, 'attributes.custom:how_did_you_hear', how_did_you_hear)
    }

    return data
}
