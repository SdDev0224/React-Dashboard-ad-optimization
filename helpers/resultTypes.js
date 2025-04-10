import { RESULT_TYPE_LABELS } from 'configuration/resultTypes'

export const getResultTypeObject = resultType => ({
    value: resultType,
    label: RESULT_TYPE_LABELS[resultType],
})
