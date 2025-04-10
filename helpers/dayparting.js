import range from 'lodash/range'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import orderBy from 'lodash/fp/orderBy'

import moment from 'utilities/moment'

const HOUR_FORMAT = 'h:mm A'

const localizeHour = (hour, timezone) => {
    const from = moment({ hour }).tz(timezone)
    const to = from.clone().add(1, 'hour')

    const localHour = from.hour()
    const fromText = from.format(HOUR_FORMAT)
    const toText = to.format(HOUR_FORMAT)
    const title = `${fromText} - ${toText}`

    return {
        localHour,
        hourText: fromText,
        title,
    }
}

export const localizeMultipliers = (utcMultipliers, timezone) =>
    flow(
        map(utcHour => {
            const hourMultiplier = utcMultipliers.find(
                ({ hour }) => hour === utcHour
            ) || {
                hour: utcHour,
                multiplier: 1,
            }
            const localizedHour = localizeHour(utcHour, timezone)

            return {
                ...hourMultiplier,
                ...localizedHour,
            }
        }),
        orderBy(['localHour'], ['asc'])
    )(range(24))

export const makeChartConfig = multipliers => ({
    chart: {
        type: 'column',
    },

    title: {
        text: null,
    },

    credits: {
        enabled: false,
    },

    legend: {
        enabled: false,
    },

    xAxis: {
        categories: multipliers.map(hourMultiplier => hourMultiplier.hourText),
    },

    yAxis: {
        title: {
            text: null,
        },
        min: 0,
        max: 10,
        tickInterval: 1,
    },

    series: [
        {
            data: multipliers.map(hourMultiplier => hourMultiplier.multiplier),
        },
    ],
})
