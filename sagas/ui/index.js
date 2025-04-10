import { all } from 'redux-saga/effects'

import appWorker from './app'

// Pages
import automationPageWorker from './automation'
import brandPageWorker from './brand'
import brandsSummaryPageWorker from './brandsSummary'
import campaignPageWorker from './campaign'
import campaignsSummaryPageWorker from './campaignsSummary'
import homePageWorker from './home'
import keywordPageWorker from './keyword'
import keywordsSummaryPageWorker from './keywordsSummary'
import labelsSummaryWorker from './labelsSummary'
import organizationPageWorker from './organization'
import organizationGroupPageWorker from './organizationGroup'
import productAdPageWorker from './productAd'
import productPageWorker from './product'
import productsSummaryPageWorker from './productsSummary'
import profilePageWorker from './profile'
import sharedWorker from './shared'
import sovKeywordPageWorker from './sovKeyword'
import sovKeywordSearchResultPageWorker from './sovKeywordSearchResult'
import sovKeywordsSummaryPageWorker from './sovKeywordsSummary'

export default function* uiSaga() {
    yield all([
        appWorker(),

        // Pages
        automationPageWorker(),
        brandPageWorker(),
        brandsSummaryPageWorker(),
        homePageWorker(),
        campaignPageWorker(),
        campaignsSummaryPageWorker(),
        keywordPageWorker(),
        keywordsSummaryPageWorker(),
        labelsSummaryWorker(),
        organizationPageWorker(),
        organizationGroupPageWorker(),
        productAdPageWorker(),
        productPageWorker(),
        productsSummaryPageWorker(),
        profilePageWorker(),
        sharedWorker(),
        sovKeywordPageWorker(),
        sovKeywordSearchResultPageWorker(),
        sovKeywordsSummaryPageWorker(),
    ])
}
