import mockAxios from 'axios'

import { getAllFactAggregate } from '../cerebroApi'

describe('[services] cerebroApi', () => {
    it('calls getAllFactAggregate works as expected', () => {
        getAllFactAggregate({
            report_date_min: '2018-01-03',
            report_date_max: '2018-05-03',
            profile__country_code__in: ['US', 'CA'],
        })

        expect(mockAxios.get).toHaveBeenCalledTimes(1)
        expect(mockAxios.get).toHaveBeenCalledWith('/api/facts/aggregate/', {
            params: {
                report_date_min: '2018-01-03',
                report_date_max: '2018-05-03',
                profile__country_code__in: ['US', 'CA'],
            },
        })
    })
})
