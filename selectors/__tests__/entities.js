import { fetchBrandSuccess, fetchCampaignSuccess } from 'actions/entities'

import reducer from '../../reducers'

import {
    selectBrand,
    selectCampaign,
    selectBrandsForFilters,
} from '../entities'

const BRANDS = [
    {
        id: 1144702873357201,
        brand_name: 'Akai Professional',
        region: 'EU',
        country_code: 'ES',
    },
    {
        id: 2041797958922678,
        brand_name: 'Akai Professional',
        region: 'EU',
        country_code: 'FR',
    },
    {
        id: 1558953906548839,
        brand_name: 'Akai Professional',
        region: 'EU',
        country_code: 'DE',
    },
    {
        id: 4558563906548839,
        brand_name: 'US Brand A',
        region: 'NA',
        country_code: 'US',
    },
    {
        id: 99585639065488,
        brand_name: 'CA Brand A',
        region: 'NA',
        country_code: 'CA',
    },
]

const CAMPAIGNS = [
    {
        id: 112898180360116,
        name: 'Air LP Manual',
        state: 'archived',
        start_date: '2017-06-14T00:00:00',
        end_date: null,
    },
    {
        id: 12684401502940,
        name: 'Digital LP Manual',
        state: 'enabled',
        start_date: '2018-02-02T00:00:00',
        end_date: null,
    },
]

describe('[Selectors] entities', () => {
    let state

    beforeEach(() => {
        state = reducer(undefined, {})
    })

    describe('selectBrandsForFilters', () => {
        it('can select state with no brands', () => {
            expect(selectBrandsForFilters(state)).toEqual([])
        })
    })

    describe('selectBrand', () => {
        const brandId = BRANDS[1].id

        beforeEach(() => {
            state = reducer(state, fetchBrandSuccess(BRANDS[1]))
        })

        it('selects brand by brand Id', () => {
            expect(selectBrand(state, brandId)).toEqual({
                id: 2041797958922678,
                brand_name: 'Akai Professional',
                region: 'EU',
                country_code: 'FR',
            })
        })

        it('memoizes the brand by brand Id with brands change', () => {
            const selector = selectBrand.getMatchingSelector(state, brandId)

            // Reset computations
            selector.resetRecomputations()

            // Repeat computations without state change
            selectBrand(state, brandId)
            selectBrand(state, brandId)
            expect(selector.recomputations()).toEqual(1)

            // Update state
            state = reducer(state, fetchBrandSuccess(BRANDS[2]))

            // Trigger computation after state change
            selectBrand(state, brandId)
            expect(selector.recomputations()).toEqual(2)
        })
    })

    describe('selectCampaign', () => {
        const campaignId = CAMPAIGNS[0].id

        beforeEach(() => {
            state = reducer(state, fetchCampaignSuccess(CAMPAIGNS[0]))
        })

        it('selects campaign by campaign Id', () => {
            expect(selectCampaign(state, campaignId)).toEqual({
                id: 112898180360116,
                name: 'Air LP Manual',
                state: 'archived',
                start_date: '2017-06-14T00:00:00',
                end_date: null,
            })
        })

        it('memoizes the campaign by campaign Id with campaigns change', () => {
            const selector = selectCampaign.getMatchingSelector(
                state,
                campaignId
            )

            // Reset computations
            selector.resetRecomputations()

            // Repeat computations without state change
            selectCampaign(state, campaignId)
            selectCampaign(state, campaignId)
            expect(selector.recomputations()).toEqual(1)

            // Update state
            state = reducer(state, fetchCampaignSuccess(CAMPAIGNS[1]))

            // Trigger computation after state change
            selectCampaign(state, campaignId)
            expect(selector.recomputations()).toEqual(2)
        })
    })
})
