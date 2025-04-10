import map from 'lodash/map'

import { COUNTRY_CODES, LANGUAGE_CODES, REGION_CODES } from 'constants/codes'

import { REGION_COUNTRY_MAP, COUNTRY_LANGUAGE_MAP } from '../codes'

describe('[codes]', () => {
    describe('REGION_COUNTRY_MAP', () => {
        it('does not have duplicate codes', () => {
            const uniqueCodes = new Set()

            map(REGION_COUNTRY_MAP, countryCodes => {
                countryCodes.map(countryCode => uniqueCodes.add(countryCode))
            })

            expect(Object.keys(COUNTRY_CODES)).toHaveLength(uniqueCodes.size)
        })

        it('contains all the regions', () => {
            expect(Object.keys(REGION_COUNTRY_MAP)).toHaveLength(
                Object.keys(REGION_CODES).length
            )
        })
    })

    describe('COUNTRY_LANGUAGE_MAP', () => {
        it('does not have duplicate codes', () => {
            const uniqueCodes = new Set()

            map(COUNTRY_LANGUAGE_MAP, languageCodes => {
                languageCodes.map(languageCode => uniqueCodes.add(languageCode))
            })

            expect(uniqueCodes.size).toEqual(Object.keys(LANGUAGE_CODES).length)
        })

        it('contains all the countries', () => {
            expect(Object.keys(COUNTRY_LANGUAGE_MAP)).toHaveLength(
                Object.keys(COUNTRY_CODES).length
            )
        })
    })
})
