import isEqual from 'lodash/isEqual'
import orderBy from 'lodash/orderBy'

export const hasAllOptionsSelected = (
    selectedOptions,
    allOptions,
    key = 'label'
) => isEqual(orderBy(selectedOptions, [key]), orderBy(allOptions, [key]))
