import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import { ResourceDetails } from 'components/ResourceDetails'
import { ToolTipWithHelpText } from 'components/ToolTip'
import { FACT_TYPE_LABELS } from 'configuration/factTypes'
import { formatDate, formatCurrency, titleCase } from 'helpers/formatting'
import {
    SELECT_INPUT,
    NUMBER_INPUT,
    DATE_INPUT,
    SWITCH_INPUT,
} from 'constants/inputTypes'
import { SPONSORED_PRODUCT } from 'constants/factTypes'
import { PAUSED, ENABLED, ARCHIVED } from 'constants/resourceStates'
import { DAY_FORMAT } from 'constants/formatting'
import {
    CAMPAIGN_BUDGET_MIN,
    CAMPAIGN_BUDGET_MAX,
    CAMPAIGN_BUDGET_STEP,
    CAMPAIGN_BUDGET_PRECISION,
} from 'constants/campaigns'
import { campaignAttributeTooltips } from 'configuration/attributes'
import { LabelsContainer } from '../Labels'

class CampaignResourceDetails extends React.Component {
    static propTypes = {
        brand: PropTypes.shape({
            country_code: PropTypes.string,
        }),
        campaign: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            campaign_type: PropTypes.string,
            targeting_type: PropTypes.string,
            state: PropTypes.string,
            budget_type: PropTypes.string,
            budget: PropTypes.number,
            start_date: PropTypes.string,
            end_date: PropTypes.string,
            premium_bid_adjustment: PropTypes.bool,
            profile: PropTypes.string,
            dayparting_enabled: PropTypes.bool,
        }),
        showDetails: PropTypes.bool.isRequired,
        campaignUpdating: PropTypes.bool.isRequired,

        // actions
        toggleCampaignPageDetails: PropTypes.func.isRequired,
        updateCampaignRequest: PropTypes.func.isRequired,
    }

    static defaultProps = {
        brand: {},
        campaign: {},
    }

    isSponsoredProductCampaign() {
        const { campaign } = this.props
        return campaign.campaign_type === SPONSORED_PRODUCT
    }

    editToolTip() {
        const { campaign } = this.props
        if (campaign.state === ARCHIVED) {
            return 'Archived campaigns cannot be modified.'
        }
        if (!this.isSponsoredProductCampaign()) {
            return 'Modifying Headline Search campaigns is not yet supported.'
        }
        return null
    }

    @autobind
    handleUpdateCampaignDetails(values) {
        const { updateCampaignRequest } = this.props
        updateCampaignRequest(values)
    }

    render() {
        const {
            brand,
            campaign,
            showDetails,
            campaignUpdating,
            toggleCampaignPageDetails,
        } = this.props
        return (
            <ResourceDetails
                name={campaign.name}
                showDetails={showDetails}
                allowEditing={
                    this.isSponsoredProductCampaign() &&
                    campaign.state !== ARCHIVED
                }
                editToolTip={this.editToolTip()}
                updating={campaignUpdating}
                onShowDetailsClick={toggleCampaignPageDetails}
                labelSection={<LabelsContainer />}
                onSave={this.handleUpdateCampaignDetails}
                details={[
                    {
                        label: 'State',
                        value: campaign.state,
                        toolTip: (
                            <ToolTipWithHelpText
                                info={campaignAttributeTooltips.state}
                            />
                        ),
                        formatValue: titleCase,
                        // input fields
                        fieldId: 'state',
                        type: SELECT_INPUT,
                        options: [
                            { value: PAUSED, label: 'Paused' },
                            { value: ENABLED, label: 'Enabled' },
                        ],
                    },
                    {
                        label: 'Campaign Type',
                        value: campaign.campaign_type,
                        toolTip: (
                            <ToolTipWithHelpText
                                info={campaignAttributeTooltips.campaign_type}
                            />
                        ),
                        formatValue: value => FACT_TYPE_LABELS[value],
                    },
                    {
                        label: 'Targeting Type',
                        value: campaign.targeting_type,
                        toolTip: (
                            <ToolTipWithHelpText
                                info={campaignAttributeTooltips.targeting_type}
                            />
                        ),
                        formatValue: titleCase,
                        show: this.isSponsoredProductCampaign(),
                    },
                    {
                        label: 'Budget Type',
                        value: campaign.budget_type,
                        toolTip: (
                            <ToolTipWithHelpText
                                info={campaignAttributeTooltips.budget_type}
                            />
                        ),
                        formatValue: titleCase,
                    },
                    {
                        label: 'Budget',
                        value: campaign.budget,
                        toolTip: (
                            <ToolTipWithHelpText
                                info={campaignAttributeTooltips.budget}
                            />
                        ),
                        formatValue: value =>
                            formatCurrency(value, {
                                currencyCode: brand.currency_code,
                                decimal: true,
                            }),
                        // input fields
                        fieldId: 'budget',
                        type: NUMBER_INPUT,
                        min: CAMPAIGN_BUDGET_MIN,
                        max: CAMPAIGN_BUDGET_MAX,
                        step: CAMPAIGN_BUDGET_STEP,
                        precision: CAMPAIGN_BUDGET_PRECISION,
                    },
                    {
                        label: 'Start Date',
                        value: campaign.start_date,
                        toolTip: (
                            <ToolTipWithHelpText
                                info={campaignAttributeTooltips.start_date}
                            />
                        ),
                        formatValue: formatDate,
                        show: this.isSponsoredProductCampaign(),
                    },
                    {
                        label: 'End Date',
                        value: campaign.end_date,
                        toolTip: (
                            <ToolTipWithHelpText
                                info={campaignAttributeTooltips.end_date}
                            />
                        ),
                        formatValue: formatDate,
                        show: this.isSponsoredProductCampaign(),
                        // input fields
                        fieldId: 'end_date',
                        type: DATE_INPUT,
                        format: DAY_FORMAT,
                    },
                    {
                        label: 'Bid Plus',
                        value: campaign.premium_bid_adjustment,
                        toolTip: (
                            <ToolTipWithHelpText
                                info={
                                    campaignAttributeTooltips.premium_bid_adjustment
                                }
                            />
                        ),
                        formatValue: value => (value ? 'Enabled' : 'Disabled'),
                        show: this.isSponsoredProductCampaign(),
                        // input fields
                        fieldId: 'premium_bid_adjustment',
                        type: SWITCH_INPUT,
                    },
                ]}
            />
        )
    }
}

export default CampaignResourceDetails
