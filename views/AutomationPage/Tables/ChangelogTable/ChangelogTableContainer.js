import { connect } from 'react-redux'

import { AUTOMATION_PAGE } from 'constants/pages'
import { selectDomainValue as selectUiDomainValue } from 'selectors/ui'
import {
    updateTablePaginationForPageTable,
    updateTableSorterForPageTable,
    updateTableSettingsForPageTable,
    fetchAutomationPageChangelogTableRequest,
} from 'actions/ui'

import ChangelogTable from './ChangelogTable'

const mapStateToProps = state => ({
    tableData: selectUiDomainValue(state, [AUTOMATION_PAGE, 'changelogTable']),
})

const mapDispatchToProps = {
    updatePagination: updateTablePaginationForPageTable({
        tableName: 'changelogTable',
    }),
    updateSorter: updateTableSorterForPageTable({
        tableName: 'changelogTable',
    }),
    updateColumnSettings: updateTableSettingsForPageTable({
        tableName: 'changelogTable',
    }),
    reloadData: fetchAutomationPageChangelogTableRequest,
}

const ChangelogTableContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangelogTable)

export default ChangelogTableContainer
