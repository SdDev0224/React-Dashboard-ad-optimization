import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { CAMPAIGN_PAGE } from 'constants/pages'
import { selectCampaign } from 'selectors/entities'
import {
    selectDomainValue as selectUiDomainValue,
    selectPageDownloading,
} from 'selectors/ui'
import {
    updateTablePaginationForPageTable,
    updateTableSorterForPageTable,
    updateTableSettingsForPageTable,
    fetchCampaignPageProductsTableRequest,
    downloadCampaignPageProductsTableRequest,
    attachCampaignPageProductsTableProductsRequest,
    updateCampaignPageProductsTableProductRequest,
    deleteCampaignPageProductsTableProductRequest,
} from 'actions/ui'

import ProductsTable from './ProductsTable'

const mapStateToProps = (state, ownProps) => {
    const { brandId, campaignId } = ownProps.match.params
    const campaign = selectCampaign(state, campaignId)
    return {
        brandId,
        campaign,
        tableData: selectUiDomainValue(state, [CAMPAIGN_PAGE, 'productsTable']),
        downloading: selectPageDownloading(state, CAMPAIGN_PAGE),
    }
}

const mapDispatchToProps = {
    updatePagination: updateTablePaginationForPageTable({
        tableName: 'productsTable',
    }),
    updateSorter: updateTableSorterForPageTable({
        tableName: 'productsTable',
    }),
    updateColumnSettings: updateTableSettingsForPageTable({
        tableName: 'productsTable',
    }),
    reloadData: fetchCampaignPageProductsTableRequest,
    downloadData: downloadCampaignPageProductsTableRequest,
    attachProductsRequest: attachCampaignPageProductsTableProductsRequest,
    updateProductRequest: updateCampaignPageProductsTableProductRequest,
    deleteProductRequest: deleteCampaignPageProductsTableProductRequest,
}

const ProductsTableContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductsTable)

export default withRouter(ProductsTableContainer)
