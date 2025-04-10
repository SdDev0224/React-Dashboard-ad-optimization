import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import {
    FACT_TYPES,
    AGGREGATION,
    BRANDS,
    COUNTRIES,
    REGIONS,
    DATES,
} from 'constants/filters'
import {
    AggregationFilter,
    DateRangeFilter,
    AdTypeFilter,
    BrandsFilter,
    CountriesFilter,
    RegionsFilter,
} from 'components/Filters'
import { FilterGroup } from 'components/FilterGroup'

class Filters extends React.Component {
    static propTypes = {
        filterSettings: PropTypes.shape().isRequired,
        selectedFilterValues: PropTypes.shape().isRequired,
        brandsFilterOptions: PropTypes.array.isRequired,
        brandsFilterLoading: PropTypes.bool.isRequired,

        // actions
        updatePageFilter: PropTypes.func.isRequired,
        resetFilters: PropTypes.func.isRequired,
        updateFilterSettings: PropTypes.func.isRequired,
        changeBrandsFilterInput: PropTypes.func.isRequired,
    }

    @autobind
    handleApply(key, value) {
        const { updatePageFilter } = this.props
        updatePageFilter({ key, value })
    }

    render() {
        const {
            filterSettings,
            brandsFilterLoading,
            brandsFilterOptions,
            selectedFilterValues,
            changeBrandsFilterInput,
            updateFilterSettings,
            resetFilters,
        } = this.props
        return (
            <FilterGroup
                filterSettings={filterSettings}
                updateFilterSettings={updateFilterSettings}
                resetFilters={resetFilters}
            >
                <AggregationFilter
                    value={selectedFilterValues[AGGREGATION]}
                    onApply={this.handleApply}
                />
                <DateRangeFilter
                    values={selectedFilterValues[DATES]}
                    onApply={this.handleApply}
                />
                <AdTypeFilter
                    values={selectedFilterValues[FACT_TYPES]}
                    onApply={this.handleApply}
                />
                <BrandsFilter
                    values={selectedFilterValues[BRANDS]}
                    options={brandsFilterOptions}
                    loading={brandsFilterLoading}
                    onApply={this.handleApply}
                    onChangeInput={changeBrandsFilterInput}
                />
                <CountriesFilter
                    values={selectedFilterValues[COUNTRIES]}
                    onApply={this.handleApply}
                />
                <RegionsFilter
                    values={selectedFilterValues[REGIONS]}
                    onApply={this.handleApply}
                />
            </FilterGroup>
        )
    }
}

export default Filters
