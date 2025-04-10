export const AGGREGATION = 'aggregation'

export const BRANDS = 'brands'

export const CAMPAIGN_BUDGET = 'campaignBudget'
export const CAMPAIGN_DAYPARTINGS = 'campaignDaypartings'
export const CAMPAIGN_NAME = 'campaignName'
export const CAMPAIGN_STATES = 'campaignStates'
export const CAMPAIGN_TARGETING_TYPES = 'campaignTargetingTypes'
export const CAMPAIGNS = 'campaigns'

export const COUNTRIES = 'countries'
export const REGIONS = 'regions'

export const DATES = 'dates'

export const FACT_TYPES = 'factTypes'

export const KEYWORD_MATCH_TYPES = 'keywordMatchTypes'
export const KEYWORDS = 'keywords'

export const PRODUCT_ASINS = 'productAsins'
export const PRODUCT_TITLES = 'productTitles'

export const LABELS = 'labels'

export const SOV_AGGREGATION = 'sovAggregation'
export const SOV_COUNTRIES = 'sovCountries'
export const SOV_BRANDS = 'sovBrands'
export const SOV_FOLDS = 'sovFolds'
export const SOV_KEYWORDS = 'sovKeywords'
export const SOV_KEYWORD_CATEGORIES = 'sovKeywordCategories'
export const SOV_LANGUAGES = 'sovLanguages'
export const SOV_RESULT_TYPES = 'sovResultTypes'
export const SOV_SEARCH_TIMES = 'searchTimes'
export const SOV_STATES = 'sovStates'

export const GREATER_THAN = 'gt'
export const EQUALS = 'exact'
export const LESS_THAN = 'lt'
export const GREATER_THAN_OR_EQUAL = 'gte'
export const LESS_THAN_OR_EQUAL = 'lte'

export const NUMBER_RANGE_OPERATOR_OPTIONS = [
    { label: 'Greater Than', value: GREATER_THAN },
    { label: 'Equals', value: EQUALS },
    { label: 'Less Than', value: LESS_THAN },
    { label: 'Greater Than or Equal To', value: GREATER_THAN_OR_EQUAL },
    { label: 'Less Than or Equal To', value: LESS_THAN_OR_EQUAL },
]

export const NUMBER_RANGE_OPERATOR_DISPLAY = {
    [GREATER_THAN]: '>',
    [EQUALS]: '=',
    [LESS_THAN]: '<',
    [GREATER_THAN_OR_EQUAL]: '>=',
    [LESS_THAN_OR_EQUAL]: '<=',
}
