import { deepFreeze } from 'helpers/deepFreeze'
import { BY_ID, ALL_IDS } from 'constants/reducerKeys'
import {
    fetchBrandSuccess,
    fetchCampaignSuccess,
    updateCampaignSuccess,
    fetchKeywordSuccess,
    fetchProductSuccess,
    updateKeywordSuccess,
    deleteKeywordSuccess,
    updateBrandSuccess,
} from 'actions/entities'

import reducer from '../entities'
import * as testData from '../__data__/testData'

const defaultState = reducer(undefined, { type: undefined })

deepFreeze(defaultState)

describe('[Reducers] entities', () => {
    let initialState

    beforeAll(() => {
        initialState = {
            ...defaultState,
            brands: {
                [BY_ID]: {
                    '1144702873357201': {
                        id: '1144702873357201',
                        brand_name: 'Brand 9532416',
                        region: 'EU',
                        country_code: 'ES',
                    },
                    '2041797958922678': {
                        id: '2041797958922678',
                        brand_name: 'Brand 9532416',
                        region: 'EU',
                        country_code: 'FR',
                    },
                    '1558953906548839': {
                        id: '1558953906548839',
                        brand_name: 'Brand 9532416',
                        region: 'EU',
                        country_code: 'DE',
                    },
                },
                [ALL_IDS]: [
                    '1144702873357201',
                    '2041797958922678',
                    '1558953906548839',
                ],
            },
        }

        deepFreeze(initialState)
    })

    describe('fetchBrandSuccess', () => {
        it('merges fields when fetching an existing brand', () => {
            const { existingBrandPayload: payload } = testData.fetchBrand
            const { id: payloadId } = payload

            const action = fetchBrandSuccess(payload)
            const nextState = reducer(initialState, action)

            expect(nextState.brands[BY_ID][payloadId]).toEqual({
                id: '1558953906548839',
                brand_name: 'Brand 32416',
                region: 'EU',
                country_code: 'DE',
                brand_entity_id: 'ENTITYSO2H848C8H0B',
                marketplace_string_id: 'A1F83G8C2ARO7Z',
                currency_code: 'NotGBP',
                timezone: 'Europe/NotLondon',
                labels: ['af999e82-81b6-47b2-8dd0-377249128364'],
            })
        })

        it('creates a new entry in byId and allIds for a non-existing brand', () => {
            const { nonExistingBrandPayload: payload } = testData.fetchBrand
            const { id: payloadId } = payload

            const action = fetchBrandSuccess(payload)
            const nextState = reducer(initialState, action)

            expect(nextState.brands[BY_ID]).toEqual({
                ...initialState.brands[BY_ID],
                [payloadId]: payload,
            })

            expect(nextState.brands[ALL_IDS]).toEqual([
                ...initialState.brands[ALL_IDS],
                payloadId,
            ])
        })
    })

    describe('updateBrandSuccess', () => {
        it('adds a label to an existing brand', () => {
            const { existingBrandPayload: payload } = testData.fetchBrand

            const action = updateBrandSuccess({
                ...payload,
                labels: [
                    ...payload.labels,
                    {
                        color: '#009688',
                        description: 'non-branded keywords',
                        id: '4825ae20-e292-4116-be3b-a21dafc1fa56',
                        name: 'non-branded',
                        organization_id: '2',
                    },
                ],
            })
            const nextState = reducer(initialState, action)

            // new label id is added to labels array on brand
            expect(nextState.brands[BY_ID][payload.id].labels).toEqual([
                'af999e82-81b6-47b2-8dd0-377249128364',
                '4825ae20-e292-4116-be3b-a21dafc1fa56',
            ])

            // labels are normalized and labels store is updated
            expect(Object.keys(nextState.labels[BY_ID])).toHaveLength(2)
            expect(nextState.labels[ALL_IDS]).toHaveLength(2)
        })

        it('removes a label from an existing brand', () => {
            const { existingBrandPayload: payload } = testData.fetchBrand

            const action = updateBrandSuccess({
                ...payload,
                labels: [],
            })
            const nextState = reducer(initialState, action)

            // label id is removed from labels array on brand
            expect(nextState.brands[BY_ID][payload.id].labels).toHaveLength(0)

            // labels are normalized and labels store is updated
            expect(Object.keys(nextState.labels[BY_ID])).toHaveLength(0)
            expect(nextState.labels[ALL_IDS]).toHaveLength(0)
        })
    })

    describe('fetchCampaignSuccess', () => {
        describe('without existing campaign', () => {
            const { singleCampaignPayloadA: payload } = testData.fetchCampaign
            const { id: campaignId } = payload

            const action = fetchCampaignSuccess(payload)
            const nextState = reducer(initialState, action)

            it('adds retrieved campaign id to CAMPAIGN root key allIds array', () => {
                expect(nextState.campaigns[ALL_IDS]).toEqual([campaignId])
            })

            it('adds properly normalized data to CAMPAIGN root key byIds obj', () => {
                expect(nextState.campaigns[BY_ID]).toEqual({
                    [campaignId]: payload,
                })
            })
        })

        describe('with existing campaign', () => {
            const {
                singleCampaignPayloadA: payloadA,
                singleCampaignPayloadB: payloadB,
            } = testData.fetchCampaign
            const { id: idA } = payloadA
            const { id: idB } = payloadB

            const actionA = fetchCampaignSuccess(payloadA)
            const intermediateState = reducer(initialState, actionA)
            deepFreeze(intermediateState)

            const actionB = fetchCampaignSuccess(payloadB)
            const nextState = reducer(intermediateState, actionB)

            it('merges retrieved campaign id into CAMPAIGN root key allIds array', () => {
                expect(nextState.campaigns[ALL_IDS]).toEqual(
                    expect.arrayContaining([idA, idB])
                )
            })

            it('merges properly normalized payload into CAMPAIGN root key byIds obj', () => {
                expect(nextState.campaigns[BY_ID]).toEqual(
                    expect.objectContaining({
                        [idA]: payloadA,
                        [idB]: payloadB,
                    })
                )
            })
        })
    })

    describe('updateCampaignSuccess', () => {
        describe('without existing campaign', () => {
            const payload = testData.updateCampaign
            const { id: campaignId } = payload

            const action = updateCampaignSuccess(payload)
            const nextState = reducer(initialState, action)

            it('adds updated campaign to allIds array', () => {
                expect(nextState.campaigns[ALL_IDS]).toEqual([campaignId])
            })

            it('adds campaign to BY_ID object', () => {
                expect(nextState.campaigns[BY_ID]).toEqual({
                    '135381972560285': {
                        budget: 16,
                        budget_type: 'daily',
                        campaign_type: 'sponsoredProducts',
                        created_date: '2018-10-10T23:43:01.833076Z',
                        dayparting_enabled: false,
                        end_date: null,
                        id: '135381972560285',
                        name: 'Marking SP Manual June 2016 (1)',
                        premium_bid_adjustment: true,
                        profile: 2267480161047622,
                        profile_id: '2267480161047622',
                        start_date: '2016-06-20T00:00:00Z',
                        state: 'paused',
                        synced_date: '2018-10-19T03:52:18.313990Z',
                        targeting_type: 'manual',
                        updated_date: '2018-10-19T04:54:58.264816Z',
                    },
                })
            })
        })
    })

    describe('fetchProductSuccess', () => {
        describe('without existing product', () => {
            const { singleProduct: payload } = testData.fetchProduct
            const { id: productId } = payload

            const action = fetchProductSuccess(payload)
            const nextState = reducer(initialState, action)

            it('adds productId to ALL_IDS array', () => {
                expect(nextState.products[ALL_IDS]).toEqual([productId])
            })

            it('adds product to BY_ID object', () => {
                expect(nextState.products[BY_ID]).toEqual({
                    '26705868846260': {
                        ad_group_id: '149460025322222',
                        asin: 'B000OZMSYC',
                        campaign: '135381972560285',
                        campaign_id: '135381972560285',
                        created_date: '2018-10-10T23:43:13.187930Z',
                        id: '26705868846260',
                        sku: null,
                        state: 'paused',
                        updated_date: '2018-10-19T02:41:27.646774Z',
                    },
                })
            })

            it('adds campaign data to byIds obj', () => {
                expect(nextState.campaigns[BY_ID]).toHaveProperty(
                    '135381972560285'
                )
            })
        })
    })

    describe('fetchKeywordSuccess', () => {
        describe('without existing keyword', () => {
            const { singleKeywordA: payload } = testData.fetchKeyword
            const { id: keywordId } = payload

            const action = fetchKeywordSuccess(payload)
            const nextState = reducer(initialState, action)

            it('adds keywordId to ALL_IDS array', () => {
                expect(nextState.keywords[ALL_IDS]).toEqual([keywordId])
            })

            it('adds keyword to BY_ID object', () => {
                expect(nextState.keywords[BY_ID]).toEqual({
                    [keywordId]: {
                        ad_group: '205354846279036',
                        bid: 0.5,
                        campaign: '182729361125729',
                        id: '244301367846641',
                        match_type: 'broad',
                        profile: '3931123856677272',
                        state: 'enabled',
                        text: 'drums and percussion',
                    },
                })
            })

            it('adds brand data to byIds obj', () => {
                expect(nextState.brands[BY_ID]).toHaveProperty(
                    '3931123856677272'
                )
            })

            it('adds campaign data to byIds obj', () => {
                expect(nextState.campaigns[BY_ID]).toHaveProperty(
                    '182729361125729'
                )
            })
        })
    })

    describe('updateKeywordSuccess', () => {
        describe('without existing keyword', () => {
            const updatePayload = testData.fetchKeyword.singleKeywordB
            const { id: keywordId } = updatePayload

            const updateAction = updateKeywordSuccess(updatePayload)
            const nextState = reducer(initialState, updateAction)

            it('adds keywordId to ALL_IDS array', () => {
                expect(nextState.keywords[ALL_IDS]).toEqual([keywordId])
            })

            it('adds keyword to BY_ID object', () => {
                expect(nextState.keywords[BY_ID]).toEqual({
                    [keywordId]: {
                        active_bid: 1,
                        ad_group: '42572474511714',
                        ad_group_id: '42572474511714',
                        base_bid: 1,
                        bid: 1,
                        campaign: '16460757201410',
                        campaign_id: '16460757201410',
                        created_date: '2018-10-10T23:43:02.098399Z',
                        id: '2986419562954',
                        match_type: 'broad',
                        profile: '2267480161047622',
                        state: 'enabled',
                        text: 'highlighter',
                        updated_date: '2018-10-16T22:18:31.497344Z',
                    },
                })
            })

            it('adds brand data to byIds obj', () => {
                expect(nextState.brands[BY_ID]).toHaveProperty(
                    '2267480161047622'
                )
            })

            it('adds campaign data to byIds obj', () => {
                expect(nextState.campaigns[BY_ID]).toHaveProperty(
                    '16460757201410'
                )
            })
        })
    })

    describe('deleteKeywordSuccess', () => {
        // add first keyword to state
        let fetchPayload = testData.fetchKeyword.singleKeywordA
        let updateAction = fetchKeywordSuccess(fetchPayload)
        let nextState = reducer(initialState, updateAction)

        // add second keyword to state
        fetchPayload = testData.fetchKeyword.singleKeywordB
        updateAction = fetchKeywordSuccess(fetchPayload)
        nextState = reducer(nextState, updateAction)

        // delete first keyword from state
        const deletePayload = testData.fetchKeyword.singleKeywordB
        const deleteAction = deleteKeywordSuccess(deletePayload)
        nextState = reducer(nextState, deleteAction)

        it('deletes keywordId from ALL_IDS array', () => {
            expect(nextState.keywords[ALL_IDS]).toEqual([
                '244301367846641',
                '2986419562954',
            ])
        })

        it('deletes keyword from BY_ID object', () => {
            expect(nextState.keywords[BY_ID]).toEqual({
                '244301367846641': {
                    id: '244301367846641',
                    text: 'drums and percussion',
                    match_type: 'broad',
                    state: 'enabled',
                    bid: 0.5,
                    campaign: '182729361125729',
                    ad_group: '205354846279036',
                    profile: '3931123856677272',
                },
                '2986419562954': {
                    active_bid: 1,
                    ad_group: '42572474511714',
                    ad_group_id: '42572474511714',
                    base_bid: 1,
                    bid: 1,
                    campaign: '16460757201410',
                    campaign_id: '16460757201410',
                    created_date: '2018-10-10T23:43:02.098399Z',
                    id: '2986419562954',
                    match_type: 'broad',
                    profile: '2267480161047622',
                    state: 'enabled',
                    text: 'highlighter',
                    updated_date: '2018-10-16T22:18:31.497344Z',
                },
            })
        })
    })
})
