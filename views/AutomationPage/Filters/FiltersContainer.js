import { connect } from 'react-redux'

import { AUTOMATION_PAGE } from 'constants/pages'
import { selectPageFilters, selectPageFilterSettings } from 'selectors/ui'
import {
    updatePageFilterForPage,
    updatePageFilterSettingsForPage,
    resetPageFiltersForPage,
} from 'actions/ui'

import Filters from './Filters'

const mapStateToProps = state => ({
    filterSettings: selectPageFilterSettings(state, AUTOMATION_PAGE),
    selectedFilterValues: selectPageFilters(state, AUTOMATION_PAGE),
})

const mapDispatchToProps = {
    updatePageFilter: updatePageFilterForPage(),
    updateFilterSettings: updatePageFilterSettingsForPage(),
    resetFilters: resetPageFiltersForPage(),
}

const FiltersContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Filters)

export default FiltersContainer
