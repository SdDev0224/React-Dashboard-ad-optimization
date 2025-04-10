import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Popover, Table } from 'antd'
import find from 'lodash/find'
import toInteger from 'lodash/toInteger'

import { formatCurrency, formatMultiplier, titleCase } from 'helpers/formatting'
import { localizeMultipliers } from 'helpers/dayparting'
import moment from 'utilities/moment'
import { ENABLED } from 'constants/resourceStates'

import styles from './styles.scss'

const propTypes = {
    brand: PropTypes.shape({
        brand_name: PropTypes.string,
        country_code: PropTypes.string,
        currency_code: PropTypes.string,
        id: PropTypes.string,
        region: PropTypes.string,
        timezone: PropTypes.string,
    }),
    campaign: PropTypes.shape({
        budget: PropTypes.number,
        budget_type: PropTypes.string,
        campaign_type: PropTypes.string,
        created_date: PropTypes.string,
        dayparting_enabled: PropTypes.bool,
        end_date: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
        premium_bid_adjustment: PropTypes.bool,
        profile_id: PropTypes.string,
        start_date: PropTypes.string,
        state: PropTypes.string,
        synced_date: PropTypes.string,
        targeting_type: PropTypes.string,
        updated_date: PropTypes.string,
    }),
    keyword: PropTypes.shape({
        id: PropTypes.string,
        text: PropTypes.string,
        match_type: PropTypes.string,
        state: PropTypes.string,
        bid: PropTypes.number,
        base_bid: PropTypes.number,
        active_bid: PropTypes.number,
    }),
    hourlyMultipliers: PropTypes.arrayOf(
        PropTypes.shape({
            hour: PropTypes.number,
            multiplier: PropTypes.number,
        })
    ),
}

const defaultProps = {
    brand: {},
    campaign: {},
    keyword: {},
    hourlyMultipliers: [{}],
}

const renderKeyColumn = text => {
    let asterisk
    switch (text) {
        case 'Target Bid':
            asterisk = <sup>*</sup>
            break
        case 'Active Bid':
            asterisk = <sup>**</sup>
            break
        default:
            asterisk = null
    }
    return (
        <span className={styles.key}>
            {text}
            {asterisk}
        </span>
    )
}

const renderNotes = () => (
    <div className={styles.notes}>
        <div>
            <sup>*</sup>
            Bid the dayparting system will eventually place.
        </div>
        <div>
            <sup>**</sup>
            Bid that is currently being placed. Due to system lag, the{' '}
            <strong>Active Bid</strong> may be different than{' '}
            <strong>Target Bid</strong>. These bids will converge to the{' '}
            <strong>Target Bid</strong> throughout the hour.
        </div>
    </div>
)

const isDaypartingActive = ({ dayparting_enabled, state: campaignState }) =>
    dayparting_enabled && campaignState === ENABLED

const ActiveBidCell = ({
    brand: { timezone, currency_code: currencyCode },
    campaign,
    keyword,
    hourlyMultipliers,
}) => {
    const localHour = toInteger(moment.tz(moment(), timezone).format('HH'))
    const localMultipliers = localizeMultipliers(hourlyMultipliers, timezone)
    const { hourText: localHourText, multiplier } = find(localMultipliers, {
        localHour,
    })

    const activeBidStr = isDaypartingActive(campaign)
        ? formatCurrency(keyword.active_bid, {
              decimal: true,
              currencyCode,
          })
        : formatCurrency(keyword.bid, {
              decimal: true,
              currencyCode,
          })

    const popoverContent = () => {
        if (isDaypartingActive(campaign)) {
            return (
                <div className={styles['popover-table-container']}>
                    <div className={styles.header}>Dayparting Bid Details</div>
                    <div className={styles.table}>
                        <Table
                            columns={[
                                {
                                    title: 'Key',
                                    dataIndex: 'key',
                                    key: 'key',
                                    render: renderKeyColumn,
                                },
                                {
                                    title: 'value',
                                    dataIndex: 'value',
                                    key: 'value',
                                },
                            ]}
                            dataSource={[
                                {
                                    key: 'Timezone',
                                    value: timezone,
                                },
                                {
                                    key: 'Effective Time',
                                    value: `${localHourText}`,
                                },
                                {
                                    key: 'Bid',
                                    value: formatCurrency(keyword.base_bid, {
                                        decimal: true,
                                        currencyCode,
                                    }),
                                },
                                {
                                    key: 'Current Multiplier',
                                    value: formatMultiplier(multiplier),
                                },
                                {
                                    key: 'Target Bid',
                                    value: formatCurrency(
                                        multiplier * keyword.base_bid,
                                        {
                                            decimal: true,
                                            currencyCode,
                                        }
                                    ),
                                },
                                {
                                    key: 'Active Bid',
                                    value: activeBidStr,
                                },
                            ]}
                            size="small"
                            bordered={false}
                            showHeader={false}
                            pagination={false}
                        />
                        {renderNotes()}
                    </div>
                </div>
            )
        }
        if (campaign.dayparting_enabled && campaign.state !== ENABLED) {
            return (
                <div className={styles['popover-text-container']}>
                    <strong>Active Bid</strong> is the same as{' '}
                    <strong>Bid</strong> when the Campaign is{' '}
                    <em>{titleCase(campaign.state)}</em>. The dayparting system
                    only makes bid changes for <em>Enabled</em> campaigns.
                </div>
            )
        }
        return (
            <div className={styles['popover-text-container']}>
                <strong>Active Bid</strong> is the same as <strong>Bid</strong>{' '}
                when Dayparting is <em>Disabled</em>.
            </div>
        )
    }

    return (
        <div className={styles['cell-container']}>
            <div>{activeBidStr}</div>
            <div>
                <Popover content={popoverContent()}>
                    <Icon type="question-circle-o" />
                </Popover>
            </div>
        </div>
    )
}

ActiveBidCell.propTypes = propTypes
ActiveBidCell.defaultProps = defaultProps

export default ActiveBidCell
