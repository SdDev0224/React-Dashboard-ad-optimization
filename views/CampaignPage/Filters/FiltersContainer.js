import { connect } from 'react-redux'

import { selectPageFilters, selectPageFilterSettings } from 'selectors/ui'
import {
    updatePageFilterForPage,
    resetPageFiltersForPage,
    updatePageFilterSettingsForPage,
} from 'actions/ui'
import { CAMPAIGN_PAGE } from 'constants/pages'

import Filters from './Filters'

const mapStateToProps = state => ({
    filterSettings: selectPageFilterSettings(state, CAMPAIGN_PAGE),
    selectedFilterValues: selectPageFilters(state, CAMPAIGN_PAGE),
})

const mapDispatchToProps = {
    updatePageFilter: updatePageFilterForPage(),
    resetFilters: resetPageFiltersForPage(),
    updateFilterSettings: updatePageFilterSettingsForPage(),
}

const FiltersContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Filters)

export default FiltersContainer
