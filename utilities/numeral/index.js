import numeral from 'numeral'

const delimiters = {
    thousands: ',',
    decimal: '.',
}
const abbreviations = {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't',
}
const ordinal = number => {
    const b = number % 10
    if ((number % 100) / 10 === 1) return 'th'
    if (b === 1) return 'st'
    if (b === 2) return 'nd'
    if (b === 3) return 'rd'
    return 'th'
}

numeral.register('locale', 'USD', {
    delimiters,
    abbreviations,
    ordinal,
    currency: {
        symbol: '$',
    },
})

numeral.register('locale', 'GBP', {
    delimiters,
    abbreviations,
    ordinal,
    currency: {
        symbol: '£',
    },
})

numeral.register('locale', 'EUR', {
    delimiters,
    abbreviations,
    ordinal,
    currency: {
        symbol: '€',
    },
})

numeral.register('locale', 'CAD', {
    delimiters,
    abbreviations,
    ordinal,
    currency: {
        symbol: 'C$',
    },
})

numeral.register('locale', 'INR', {
    delimiters,
    abbreviations,
    ordinal,
    currency: {
        symbol: '₹',
    },
})

numeral.register('locale', 'JPY', {
    delimiters,
    abbreviations,
    ordinal,
    currency: {
        symbol: '¥',
    },
})

numeral.register('locale', 'DKK', {
    delimiters,
    abbreviations,
    ordinal,
    currency: {
        symbol: 'Kr',
    },
})

numeral.register('locale', 'MXN', {
    delimiters,
    abbreviations,
    ordinal,
    currency: {
        symbol: 'Mex$',
    },
})

export default numeral
