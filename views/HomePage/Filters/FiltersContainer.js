import { connect } from 'react-redux'

import { HOME_PAGE } from 'constants/pages'
import {
    selectDomainValue as selectUiDomainValue,
    selectPageFilters,
    selectPageFilterSettings,
} from 'selectors/ui'
import { selectBrandsForFilters } from 'selectors/entities'
import {
    updatePageFilterForPage,
    resetPageFiltersForPage,
    updatePageFilterSettingsForPage,
    changeBrandsFilterInput,
} from 'actions/ui'

import Filters from './Filters'

const mapStateToProps = state => ({
    filterSettings: selectPageFilterSettings(state, HOME_PAGE),
    selectedFilterValues: selectPageFilters(state, HOME_PAGE),
    brandsFilterOptions: selectBrandsForFilters(state),
    brandsFilterLoading: selectUiDomainValue(state, [
        'app',
        'brandsFilterLoading',
    ]),
})

const mapDispatchToProps = {
    updatePageFilter: updatePageFilterForPage(),
    resetFilters: resetPageFiltersForPage(),
    updateFilterSettings: updatePageFilterSettingsForPage(),
    changeBrandsFilterInput,
}

const FiltersContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Filters)

export default FiltersContainer
