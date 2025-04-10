import { connect } from 'react-redux'

import { AUTOMATION_PAGE } from 'constants/pages'
import { selectDomainValue as selectUiDomainValue } from 'selectors/ui'
import {
    updateTablePaginationForPageTable,
    updateTableSorterForPageTable,
    updateTableSettingsForPageTable,
    fetchAutomationPageRecommendationsTableRequest,
} from 'actions/ui'

import RecommendationsTable from './RecommendationsTable'

const mapStateToProps = state => ({
    tableData: selectUiDomainValue(state, [
        AUTOMATION_PAGE,
        'recommendationsTable',
    ]),
})

const mapDispatchToProps = {
    updatePagination: updateTablePaginationForPageTable({
        tableName: 'recommendationsTable',
    }),
    updateSorter: updateTableSorterForPageTable({
        tableName: 'recommendationsTable',
    }),
    updateColumnSettings: updateTableSettingsForPageTable({
        tableName: 'recommendationsTable',
    }),
    reloadData: fetchAutomationPageRecommendationsTableRequest,
}

const RecommendationsTableContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RecommendationsTable)

export default RecommendationsTableContainer
