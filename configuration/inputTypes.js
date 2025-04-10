import { InputNumber, Input, Select, DatePicker, Switch, Cascader } from 'antd'

import {
    NUMBER_INPUT,
    TEXT_INPUT,
    SELECT_INPUT,
    DATE_INPUT,
    SWITCH_INPUT,
    CASCADER_INPUT,
} from 'constants/inputTypes'

export const INPUT_TYPES_COMPONENTS = {
    [NUMBER_INPUT]: InputNumber,
    [TEXT_INPUT]: Input,
    [SELECT_INPUT]: Select,
    [DATE_INPUT]: DatePicker,
    [SWITCH_INPUT]: Switch,
    [CASCADER_INPUT]: Cascader,
}
