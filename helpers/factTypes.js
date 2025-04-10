import { FACT_TYPE_LABELS } from 'configuration/factTypes'

export const getFactTypeObject = factType => ({
    value: factType,
    label: FACT_TYPE_LABELS[factType],
})
