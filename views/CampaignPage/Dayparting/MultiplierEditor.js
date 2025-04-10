import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Slider, InputNumber } from 'antd'
import autobind from 'autobind-decorator'
import isNaN from 'lodash/isNaN'

import styles from './styles.scss'

const MIN_MULTIPLIER = 0
const MAX_MULTIPLIER = 10
const DEFAULT_MULTIPLIER = 1

const MARK_STYLE = {
    fontSize: 12,
}
const MARKS = {
    [MIN_MULTIPLIER]: {
        style: MARK_STYLE,
        label: `${MIN_MULTIPLIER} X`,
    },
    [MAX_MULTIPLIER]: {
        style: MARK_STYLE,
        label: `${MAX_MULTIPLIER} X`,
    },
    [DEFAULT_MULTIPLIER]: {
        style: MARK_STYLE,
        label: `${DEFAULT_MULTIPLIER} X`,
    },
}

class MultiplierEditor extends PureComponent {
    static propTypes = {
        hour: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
        timezone: PropTypes.string.isRequired,
    }

    @autobind
    handleSliderChange(value) {
        const { hour, onChange } = this.props

        onChange(hour, value)
    }

    @autobind
    handleInputChange(value) {
        const { hour, onChange } = this.props

        if (!Number.isNaN(value)) {
            onChange(hour, parseFloat(value))
        }
    }

    render() {
        const { title, value, timezone } = this.props

        return (
            <Row type="flex">
                <Col
                    style={{
                        paddingTop: 8,
                        paddingRight: 10,
                        textAlign: 'right',
                    }}
                    span={8}
                >
                    <div className={styles['multiplier-label-container']}>
                        <div>{title}</div>
                        <div>{timezone}</div>
                    </div>
                </Col>

                <Col span={12}>
                    <Slider
                        min={MIN_MULTIPLIER}
                        max={MAX_MULTIPLIER}
                        step={0.1}
                        marks={MARKS}
                        value={isNaN(value) ? 0 : value}
                        onChange={this.handleSliderChange}
                    />
                </Col>

                <Col style={{ paddingTop: 8, textAlign: 'center' }} span={4}>
                    <InputNumber
                        style={{ width: 60 }}
                        size="small"
                        min={MIN_MULTIPLIER}
                        max={MAX_MULTIPLIER}
                        step={0.1}
                        value={isNaN(value) ? '' : value}
                        onChange={this.handleInputChange}
                        precision={2}
                    />
                </Col>
            </Row>
        )
    }
}

export default MultiplierEditor
