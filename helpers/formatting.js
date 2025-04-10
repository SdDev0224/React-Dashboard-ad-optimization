import pluralize from 'pluralize'
import startCase from 'lodash/startCase'

import { UNDEFINED_VALUE, DAY_FORMAT, MONTH_FORMAT } from 'constants/formatting'
import { SELLER_BRAND_TYPE } from 'constants/brands'
import moment from 'utilities/moment'
import numeral from 'utilities/numeral'

export const formatDate = (value, aggregation = null) => {
    if (value) {
        switch (aggregation) {
            case 'day':
            case 'week':
                return moment(value).format(DAY_FORMAT)
            case 'month':
                return moment(value).format(MONTH_FORMAT)
            default:
                return moment(value).format(DAY_FORMAT)
        }
    }
    return UNDEFINED_VALUE
}

export const formatCurrency = (
    value,
    { decimal = false, abbreviate = false, currencyCode = '' }
) => {
    const originalLocale = numeral.options.currentLocale
    if (currencyCode) {
        numeral.locale(currencyCode)
    }

    let returnValue = null
    if (decimal && abbreviate) {
        returnValue = numeral(value).format('$0.00a')
    } else if (decimal) {
        returnValue = numeral(value).format('$0,0.00')
    } else if (abbreviate) {
        returnValue = numeral(value).format('$0a')
    } else {
        returnValue = numeral(value).format('$0,0')
    }

    if (currencyCode) {
        numeral.locale(originalLocale)
    }

    return returnValue
}

export const formatNumber = (value, format = '0,0') =>
    numeral(value).format(format)

const abbreviationThreshold = 1000 // threshold value of abbreviation
export const formatAbbreviatedMetric = (value, format, shortFormat = '') => {
    if (
        numeral._.includes(format, '%') ||
        shortFormat === '' ||
        format === shortFormat
    ) {
        return formatNumber(value, format)
    }

    return numeral(value).format(
        Number(value) >= abbreviationThreshold ? shortFormat : format
    )
}

export const titleCase = value => (value ? startCase(value.toLowerCase()) : '')

export const formatCerebroDate = value =>
    value ? moment(value).format('YYYY-MM-DD') : ''

export const formatCerebroDateTime = value =>
    value
        ? moment(value)
              .local()
              .format('YYYY-MM-DD, h:mm a')
        : UNDEFINED_VALUE

export const formatFrequency = (value, unit = 'hour') =>
    value ? `Every ${value} ${pluralize(unit, value)}` : UNDEFINED_VALUE

export const formatMultiplier = multiplier => {
    const asString = numeral(multiplier).format('0.00')
    return `${asString}x`
}

export const formatBrandName = (
    {
        brand_name: brandName,
        country_code: countryCode,
        brand_entity_id: brandEntityId,
        type,
    },
    options = { appendCountry: true }
) => {
    let formattedBrandName
    if (type === SELLER_BRAND_TYPE) {
        formattedBrandName = `Seller Account ${brandEntityId}`
    } else {
        formattedBrandName = brandName
    }
    if (options.appendCountry && countryCode) {
        formattedBrandName = `${formattedBrandName} (${countryCode})`
    }
    return formattedBrandName
}

export const formatUrl = url => {
    if (!url.match(/^https?:\/\//)) {
        return `http://${url}`
    }
    return url
}
