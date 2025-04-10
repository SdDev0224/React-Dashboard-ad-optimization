import { SPONSORED_PRODUCT, HEADLINE_SEARCH } from 'constants/factTypes'
import { NON_WEIGHTED } from 'constants/sovWeights'
import { getFactTypeObject } from 'helpers/factTypes'
import { ROI, REACH, CONVERSIONS } from 'constants/charts'
import moment from 'utilities/moment'
import { getChartDefaultMetrics } from 'helpers/charts'

export const defaultAmsCharts = {
    [ROI]: getChartDefaultMetrics(ROI),
    [REACH]: getChartDefaultMetrics(REACH),
    [CONVERSIONS]: getChartDefaultMetrics(CONVERSIONS),
}

export const defaultFactTypes = [
    getFactTypeObject(SPONSORED_PRODUCT),
    getFactTypeObject(HEADLINE_SEARCH),
]

export const defaultNumberRange = {
    value: null,
    operator: null,
}

export const defaultAggregate = {
    loading: false,
    data: {},
}

export const defaultTimeseries = {
    loading: false,
    [SPONSORED_PRODUCT]: [],
    [HEADLINE_SEARCH]: [],
}

export const defaultTreemap = {
    loading: false,
    data: [],
    pagination: {
        pageSize: 10,
        current: 1,
    },
    sorter: {
        // Order in descending order by default
        field: 'attributed_sales_14_day__sum',
        order: 'descend',
        filterPositiveValues: true,
    },
}

export const defaultDatesFilter = [
    moment().subtract(30, 'days'),
    moment().subtract(1, 'days'),
]

const localNow = () => moment.tz(moment.tz.guess())

const endOfLastWeek = localNow()
    .subtract(1, 'week')
    .endOf('week')
const startOfLastWeek = localNow()
    .subtract(1, 'week')
    .startOf('week')

export const defaultSearchTimesFilter = [startOfLastWeek, endOfLastWeek]

export const getDefaultTable = columnSettings => ({
    loading: false,
    attaching: false,
    updating: false,
    deleting: false,
    data: [],
    pagination: {
        pageSize: 10,
        current: 1,
    },
    sorter: {
        field: 'attributed_sales_14_day__sum',
        order: 'descend',
    },
    columnSettings,
})

export const defaultSovChart = {
    loading: false,
    data: [],
    pagination: {
        pageSize: 1000,
        current: 1,
    },
    sorter: {
        field: 'search_time_day',
        order: 'ascend',
    },
    groups: ['metadata__brand'],
    weight: NON_WEIGHTED,

    // Applied when no keyword is selected in filters
    // It will filter data for top x brands only
    autoFilter: {
        auto_filter: 'top_aggregate_filter',
        auto_filter_dimension: 'metadata__brand',
        auto_filter_limit: 20,
        auto_filter_metric: 'rank_weight__sum',
    },
}

export const defaultOrganicSearchPositionChart = {
    loading: false,
    data: [],
    selectedAsin: undefined,
}
