import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import noop from 'lodash/noop'

import { ContentCard } from 'components/ContentCard'

import CampaignAutomationForm from './CampaignAutomationForm'

class CampaignAutomation extends Component {
    static propTypes = {
        editable: PropTypes.bool,
        loading: PropTypes.bool.isRequired,
        automation: PropTypes.object,

        mountComponent: PropTypes.func,
        createAutomation: PropTypes.func.isRequired,
        updateAutomation: PropTypes.func.isRequired,
    }

    static defaultProps = {
        editable: true,
        automation: null,
        mountComponent: noop,
    }

    componentDidMount() {
        const { mountComponent } = this.props

        mountComponent()
    }

    @autobind
    handleSubmit(values) {
        const { automation, createAutomation, updateAutomation } = this.props

        if (automation) {
            updateAutomation(values)
        } else {
            createAutomation(values)
        }
    }

    render() {
        const { editable, loading, automation } = this.props

        return (
            <ContentCard
                loading={loading}
                title="Automation"
                subTitle="Enable automation for this campaign."
            >
                <CampaignAutomationForm
                    editable={editable}
                    automation={automation}
                    onSubmit={this.handleSubmit}
                />
            </ContentCard>
        )
    }
}

export default CampaignAutomation
