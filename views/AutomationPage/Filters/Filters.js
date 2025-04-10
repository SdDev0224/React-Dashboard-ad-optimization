import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import { DATES, REGIONS, COUNTRIES } from 'constants/filters'
import {
    DateRangeFilter,
    RegionsFilter,
    CountriesFilter,
} from 'components/Filters'
import { FilterGroup } from 'components/FilterGroup'

class Filters extends React.Component {
    static propTypes = {
        filterSettings: PropTypes.shape().isRequired,
        selectedFilterValues: PropTypes.shape().isRequired,

        // actions
        updatePageFilter: PropTypes.func.isRequired,
        resetFilters: PropTypes.func.isRequired,
        updateFilterSettings: PropTypes.func.isRequired,
    }

    @autobind
    handleApply(key, value) {
        const { updatePageFilter } = this.props
        updatePageFilter({ key, value })
    }

    render() {
        const {
            filterSettings,
            selectedFilterValues,
            updateFilterSettings,
            resetFilters,
        } = this.props
        return (
            <FilterGroup
                filterSettings={filterSettings}
                updateFilterSettings={updateFilterSettings}
                resetFilters={resetFilters}
            >
                <DateRangeFilter
                    values={selectedFilterValues[DATES]}
                    onApply={this.handleApply}
                />
                <RegionsFilter
                    values={selectedFilterValues[REGIONS]}
                    onApply={this.handleApply}
                />
                <CountriesFilter
                    values={selectedFilterValues[COUNTRIES]}
                    onApply={this.handleApply}
                />
            </FilterGroup>
        )
    }
}

export default Filters
