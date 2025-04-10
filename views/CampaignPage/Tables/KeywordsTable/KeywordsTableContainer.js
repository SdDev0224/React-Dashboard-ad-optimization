import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { CAMPAIGN_PAGE } from 'constants/pages'
import { selectBrand, selectCampaign } from 'selectors/entities'
import {
    selectDomainValue as selectUiDomainValue,
    selectPageDownloading,
} from 'selectors/ui'
import {
    updateTablePaginationForPageTable,
    updateTableSorterForPageTable,
    updateTableSettingsForPageTable,
    fetchCampaignPageKeywordsTableRequest,
    downloadCampaignPageKeywordsTableRequest,
    attachCampaignPageKeywordsTableKeywordsRequest,
    updateCampaignPageKeywordsTableKeywordRequest,
    deleteCampaignPageKeywordsTableKeywordRequest,
} from 'actions/ui'

import KeywordsTable from './KeywordsTable'

const mapStateToProps = (state, ownProps) => {
    const { brandId, campaignId } = ownProps.match.params
    const campaign = selectCampaign(state, campaignId)

    return {
        brandId,
        brand: campaign ? selectBrand(state, campaign.profile_id) : {},
        campaign,
        hourlyMultipliers: selectUiDomainValue(state, [
            CAMPAIGN_PAGE,
            'hourlyMultipliers',
        ]),
        tableData: selectUiDomainValue(state, [CAMPAIGN_PAGE, 'keywordsTable']),
        downloading: selectPageDownloading(state, CAMPAIGN_PAGE),
    }
}

const mapDispatchToProps = {
    updatePagination: updateTablePaginationForPageTable({
        tableName: 'keywordsTable',
    }),
    updateSorter: updateTableSorterForPageTable({
        tableName: 'keywordsTable',
    }),
    updateColumnSettings: updateTableSettingsForPageTable({
        tableName: 'keywordsTable',
    }),
    reloadData: fetchCampaignPageKeywordsTableRequest,
    downloadData: downloadCampaignPageKeywordsTableRequest,
    attachKeywordsRequest: attachCampaignPageKeywordsTableKeywordsRequest,
    updateKeywordRequest: updateCampaignPageKeywordsTableKeywordRequest,
    deleteKeywordRequest: deleteCampaignPageKeywordsTableKeywordRequest,
}

const KeywordsTableContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(KeywordsTable)

export default withRouter(KeywordsTableContainer)
