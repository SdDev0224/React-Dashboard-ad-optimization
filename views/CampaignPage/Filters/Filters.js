import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import { AGGREGATION, DATES } from 'constants/filters'
import { AggregationFilter, DateRangeFilter } from 'components/Filters'
import { FilterGroup } from 'components/FilterGroup'

class Filters extends React.Component {
    static propTypes = {
        filterSettings: PropTypes.shape().isRequired,
        selectedFilterValues: PropTypes.shape().isRequired,

        // actions
        resetFilters: PropTypes.func.isRequired,
        updatePageFilter: PropTypes.func.isRequired,
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
                <AggregationFilter
                    value={selectedFilterValues[AGGREGATION]}
                    onApply={this.handleApply}
                />
            </FilterGroup>
        )
    }
}

export default Filters
