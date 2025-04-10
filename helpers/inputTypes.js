import has from 'lodash/has'

import { INPUT_TYPES_COMPONENTS } from 'configuration/inputTypes'
import { ACTIONS } from 'constants/inputTypes'

export const isEditable = type => has(INPUT_TYPES_COMPONENTS, type)

export const isActions = type => type === ACTIONS
