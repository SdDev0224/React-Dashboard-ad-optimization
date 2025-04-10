import Typeahead from '../Typeahead'

describe('Typeahead', () => {
    describe('Typeahead.formatMatches', () => {
        const options = [
            {
                value: '280085012685802',
                label: 'pansdore',
                metadata: 'Brand 1 | Campaign 1',
            },
            {
                value: '172377120426228',
                label: 'sd sampler',
            },
            {
                value: '226152360250572',
                label: 'usb hub USBc sd Usb',
                metadata: 'Brand 3 | Campaign 3',
            },
            {
                value: '166687569790188',
                label: 'usb hub USB sd usb kartenleser',
                metadata: 'Brand 4 | Campaign 4',
            },
            {
                value: '166687569790188',
                label: 'usb hub USB',
                metadata: 'Brand 5 | Campaign 5',
            },
        ]

        it('decorates string with HTML for formatting query matches', () => {
            const searchQuery = 'usb'
            const formattedOptions = options.map(item =>
                Typeahead.formatMatches(item, searchQuery)
            )
            expect(formattedOptions).toMatchObject([
                {
                    html:
                        '<strong>pansdore</strong> (<em>Brand 1 | Campaign 1</em>)',
                    label: 'pansdore',
                    metadata: 'Brand 1 | Campaign 1',
                    value: '280085012685802',
                },
                {
                    html: '<strong>sd sampler</strong>',
                    label: 'sd sampler',
                    value: '172377120426228',
                },
                {
                    html:
                        '<strong><u>usb</u> hub <u>USB</u>c sd <u>Usb</u></strong> (<em>Brand 3 | Campaign 3</em>)',
                    label: 'usb hub USBc sd Usb',
                    metadata: 'Brand 3 | Campaign 3',
                    value: '226152360250572',
                },
                {
                    html:
                        '<strong><u>usb</u> hub <u>USB</u> sd <u>usb</u> kartenleser</strong> (<em>Brand 4 | Campaign 4</em>)',
                    label: 'usb hub USB sd usb kartenleser',
                    metadata: 'Brand 4 | Campaign 4',
                    value: '166687569790188',
                },
                {
                    html:
                        '<strong><u>usb</u> hub <u>USB</u></strong> (<em>Brand 5 | Campaign 5</em>)',
                    label: 'usb hub USB',
                    metadata: 'Brand 5 | Campaign 5',
                    value: '166687569790188',
                },
            ])
        })
    })
})
