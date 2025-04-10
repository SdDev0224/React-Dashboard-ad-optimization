import map from 'lodash/map'
import some from 'lodash/some'
import reduce from 'lodash/reduce'
import isEmpty from 'lodash/isEmpty'

import {
    SOV_COUNTRIES,
    AMS_COUNTRIES,
    REGION_COUNTRY_MAP,
    COUNTRY_LANGUAGE_MAP,
} from 'configuration/codes'
import { COUNTRY_LABELS, REGION_LABELS } from 'constants/codes'

const getRegionCountryMap = options => {
    const regionCountryMap = {}
    map(REGION_COUNTRY_MAP, (countries, region) => {
        const filteredCountries = countries.filter(country =>
            options.includes(country)
        )
        if (!isEmpty(filteredCountries)) {
            regionCountryMap[region] = filteredCountries
        }
    })
    return regionCountryMap
}

const getCountryLanguageMap = options => {
    const countryLanguageMap = {}
    map(COUNTRY_LANGUAGE_MAP, (languages, country) => {
        if (options.includes(country)) {
            countryLanguageMap[country] = languages
        }
    })
    return countryLanguageMap
}

const getCountryOptions = countries =>
    countries.map(country => ({
        value: country,
        label: COUNTRY_LABELS[country],
    }))

const getRegionOptions = filteredCountries =>
    reduce(
        REGION_COUNTRY_MAP,
        (accumulator, countries, region) => {
            const regionIncludesCountry = some(countries, country =>
                filteredCountries.includes(country)
            )
            if (regionIncludesCountry) {
                accumulator.push({
                    value: region,
                    label: REGION_LABELS[region],
                })
            }
            return accumulator
        },
        []
    )

export const getSovRegionCountryMap = () => getRegionCountryMap(SOV_COUNTRIES)

export const getAmsRegionCountryMap = () => getRegionCountryMap(AMS_COUNTRIES)

export const getSovCountryLanguageMap = () =>
    getCountryLanguageMap(SOV_COUNTRIES)

export const getAmsCountryLanguageMap = () =>
    getCountryLanguageMap(AMS_COUNTRIES)

export const getAmsCountryOptions = () => getCountryOptions(AMS_COUNTRIES)

export const getSovCountryOptions = () => getCountryOptions(SOV_COUNTRIES)

export const getAmsRegionOptions = () => getRegionOptions(AMS_COUNTRIES)
