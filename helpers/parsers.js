export const parseCurrency = value => value.replace(/\$\s?|(,*)/g, '')

export const parsePercentage = value => value.replace('%', '')
