import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Row, Col, Switch, Icon, Button } from 'antd'
import autobind from 'autobind-decorator'
import isEqual from 'lodash/isEqual'

import { localizeMultipliers, makeChartConfig } from 'helpers/dayparting'
import { ToolTip } from 'components/ToolTip'
import { HighCharts } from 'components/HighCharts'

import MultiplierEditor from './MultiplierEditor'
import styles from './styles.scss'

class CampaignDayparting extends Component {
    static propTypes = {
        enabled: PropTypes.bool.isRequired,
        utcMultipliers: PropTypes.arrayOf(
            PropTypes.shape({
                hour: PropTypes.number,
                multiplier: PropTypes.number,
            })
        ).isRequired,
        timezone: PropTypes.string.isRequired,
        onDaypartingEnabledChange: PropTypes.func.isRequired,
        onMultipliersChange: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
        const { enabled, utcMultipliers, timezone } = props

        this.state = {
            enabled,
            localizedMultipliers: localizeMultipliers(utcMultipliers, timezone),
        }
    }

    shouldShowButtons() {
        const { utcMultipliers, timezone, enabled: enabledProp } = this.props
        const { enabled: enabledState, localizedMultipliers } = this.state
        return (
            enabledState !== enabledProp ||
            !isEqual(
                localizedMultipliers,
                localizeMultipliers(utcMultipliers, timezone)
            )
        )
    }

    @autobind
    handleSwitchChange(enabled) {
        this.setState({ enabled })
    }

    @autobind
    handleMultiplierChange(hour, value) {
        const { localizedMultipliers } = this.state
        const newLocalizedMultipliers = localizedMultipliers.map(
            hourMultiplier => {
                const multiplier =
                    hourMultiplier.hour === hour
                        ? value || 0 // convert null multipliers to 0
                        : hourMultiplier.multiplier

                return {
                    ...hourMultiplier,
                    multiplier,
                }
            }
        )

        this.setState({
            localizedMultipliers: newLocalizedMultipliers,
        })
    }

    @autobind
    handleCancel() {
        const { utcMultipliers, timezone, enabled } = this.props

        this.setState({
            enabled,
            localizedMultipliers: localizeMultipliers(utcMultipliers, timezone),
        })
    }

    @autobind
    handleSave() {
        const { onMultipliersChange, onDaypartingEnabledChange } = this.props
        const { localizedMultipliers, enabled } = this.state

        onMultipliersChange(
            localizedMultipliers.map(({ hour, multiplier }) => ({
                hour,
                multiplier,
            }))
        )
        onDaypartingEnabledChange(enabled)
    }

    renderMultipliers() {
        const { localizedMultipliers } = this.state
        const { timezone } = this.props

        return (
            <div className={styles['multipliers-container']}>
                <div className={styles['multipliers-list']}>
                    {localizedMultipliers.map(({ hour, title, multiplier }) => (
                        <MultiplierEditor
                            key={hour}
                            hour={hour}
                            title={title}
                            value={multiplier}
                            timezone={timezone}
                            onChange={this.handleMultiplierChange}
                        />
                    ))}
                </div>
            </div>
        )
    }

    renderChart() {
        const { localizedMultipliers } = this.state
        const chartConfig = makeChartConfig(localizedMultipliers)

        return <HighCharts config={chartConfig} />
    }

    render() {
        const { enabled } = this.state
        return (
            <Card
                className={styles['campaign-dayparting-card']}
                title="Enable and configure dayparting"
            >
                <Row>
                    <Col xs={24} md={12}>
                        <div className={styles['switch-container']}>
                            <div>
                                <span>Enable dayparting</span>
                                &nbsp;
                                <ToolTip title="Dayparting allows you to adjust your base bid for each hour in the day to make your budget go further.">
                                    <Icon
                                        type="question-circle-o"
                                        className="fg-icon-xs"
                                    />
                                </ToolTip>
                                &nbsp;
                                <Switch
                                    checked={enabled}
                                    onChange={this.handleSwitchChange}
                                />
                            </div>
                            {this.shouldShowButtons() && (
                                <div className={styles['multipliers-buttons']}>
                                    <Button
                                        type="primary"
                                        onClick={this.handleSave}
                                    >
                                        Save
                                    </Button>
                                    <Button onClick={this.handleCancel}>
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                        {enabled && this.renderMultipliers()}
                    </Col>

                    <Col xs={24} md={12}>
                        {enabled && this.renderChart()}
                    </Col>
                </Row>
            </Card>
        )
    }
}

export default CampaignDayparting
