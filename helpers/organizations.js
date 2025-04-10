import includes from 'lodash/includes'

import {
    RESOURCE_TYPE_BRANDS,
    RESOURCE_TYPE_COUNTRIES,
    RESOURCE_TYPE_REGIONS,
} from 'constants/organizations'

export const resourcesRequired = resourceType =>
    includes(
        [RESOURCE_TYPE_REGIONS, RESOURCE_TYPE_COUNTRIES, RESOURCE_TYPE_BRANDS],
        resourceType
    )
