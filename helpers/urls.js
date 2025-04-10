import { ASIN_DOMAINS } from 'configuration/urls'
import { generatePath } from 'react-router-dom'
import { getPath } from 'helpers/pages'
import { KEYWORD_PAGE } from 'constants/pages'
import { KEYWORD } from 'constants/resourceTypes'

export const asinUrl = (asin, countryCode = 'US') => {
    const domain = ASIN_DOMAINS[countryCode]
    return `https://${domain}/gp/product/${asin}`
}

export const changelogResourceUrl = (resourceType, resourceId) => {
    if (resourceType === KEYWORD) {
        return generatePath(getPath(KEYWORD_PAGE), {
            keywordId: resourceId,
        })
    }
    return null
}
