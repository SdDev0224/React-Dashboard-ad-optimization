import { REGION_CODES, COUNTRY_CODES, LANGUAGE_CODES } from 'constants/codes'

/**
 * All country codes that are available for SOV data
 *
 * Note: append countries to this array as SOV support becomes available
 */
export const SOV_COUNTRIES = [
    COUNTRY_CODES.CA,
    COUNTRY_CODES.DE,
    COUNTRY_CODES.FR,
    COUNTRY_CODES.IN,
    COUNTRY_CODES.IT,
    COUNTRY_CODES.JP,
    COUNTRY_CODES.UK,
    COUNTRY_CODES.US,
]

/**
 * All country codes that are available for AMS data
 *
 * Note: append countries to this array as AMS support becomes available
 */
export const AMS_COUNTRIES = [
    COUNTRY_CODES.CA,
    COUNTRY_CODES.DE,
    COUNTRY_CODES.ES,
    COUNTRY_CODES.FR,
    COUNTRY_CODES.IN,
    COUNTRY_CODES.IT,
    COUNTRY_CODES.JP,
    COUNTRY_CODES.MX,
    COUNTRY_CODES.UK,
    COUNTRY_CODES.US,
]

/**
 * Maps all regions to all countries
 */
export const REGION_COUNTRY_MAP = {
    [REGION_CODES.EU]: [
        COUNTRY_CODES.DE,
        COUNTRY_CODES.ES,
        COUNTRY_CODES.FR,
        COUNTRY_CODES.IN,
        COUNTRY_CODES.IT,
        COUNTRY_CODES.UK,
    ],
    [REGION_CODES.NA]: [COUNTRY_CODES.CA, COUNTRY_CODES.US, COUNTRY_CODES.MX],
    [REGION_CODES.JP]: [COUNTRY_CODES.JP],
}

/**
 * Maps all regions to all languages
 */
export const COUNTRY_LANGUAGE_MAP = {
    [COUNTRY_CODES.CA]: [LANGUAGE_CODES.ENG, LANGUAGE_CODES.FRA],
    [COUNTRY_CODES.DE]: [
        LANGUAGE_CODES.CES,
        LANGUAGE_CODES.ENG,
        LANGUAGE_CODES.GER,
        LANGUAGE_CODES.NLD,
        LANGUAGE_CODES.POL,
        LANGUAGE_CODES.TUR,
    ],
    [COUNTRY_CODES.FR]: [LANGUAGE_CODES.FRA],
    [COUNTRY_CODES.IN]: [LANGUAGE_CODES.ENG],
    [COUNTRY_CODES.IT]: [LANGUAGE_CODES.ITA],
    [COUNTRY_CODES.UK]: [LANGUAGE_CODES.ENG],
    [COUNTRY_CODES.US]: [LANGUAGE_CODES.ENG, LANGUAGE_CODES.SPA],
    [COUNTRY_CODES.JP]: [
        LANGUAGE_CODES.JPN,
        LANGUAGE_CODES.ENG,
        LANGUAGE_CODES.ZHO,
    ],
    [COUNTRY_CODES.MX]: [LANGUAGE_CODES.SPA],
    [COUNTRY_CODES.ES]: [LANGUAGE_CODES.SPA],
}
