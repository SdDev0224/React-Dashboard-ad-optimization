import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Button } from 'antd'
import ReactMarkdown from 'react-markdown'

import { PageHeader } from 'components/PageHeader'
import { LoadingIndicator } from 'components/LoadingIndicator'
import { ContentCard } from 'components/ContentCard'
import { showDriftSidebar } from 'helpers/drift'
import { TextButton } from 'components/TextButton'
import { hasPermissions } from 'helpers/featurePermissions'
import { AUTOMATION } from 'constants/featurePermissions'

import {
  ChangelogTableContainer,
  RecommendationsTableContainer,
} from './Tables'
import { FiltersContainer } from './Filters'
import styles from './styles.scss'

class AutomationPage extends Component {
  static propTypes = {
    // Redux state
    mounting: PropTypes.bool.isRequired,
    automationDescription: PropTypes.string,
    descriptionLoading: PropTypes.bool.isRequired,
    featurePermissions: PropTypes.array.isRequired,

    // tab state
    tab: PropTypes.oneOf(['overview', 'changelog', 'recommendations'])
      .isRequired,
    handleTabChange: PropTypes.func.isRequired,

    // Redux actions
    mountPage: PropTypes.func.isRequired,
    unmountPage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    automationDescription: null,
  }

  componentDidMount() {
    const { mountPage } = this.props
    mountPage()
  }

  componentWillUnmount() {
    const { unmountPage } = this.props
    unmountPage()
  }

  render() {
    const {
      mounting,
      automationDescription,
      descriptionLoading,
      tab,
      handleTabChange,
      featurePermissions,
    } = this.props

    if (mounting) {
      return (
        <div className={styles['empty-content']}>
          <LoadingIndicator size='small' />
        </div>
      )
    }

    return (
      <React.Fragment>
        <PageHeader
          breadcrumbs={[{ name: 'Automation' }]}
          filterGroupComponent={
            hasPermissions(featurePermissions, AUTOMATION) && (
              <FiltersContainer />
            )
          }
        />
        <Tabs
          activeKey={tab}
          tabPosition='top'
          size='default'
          tabBarStyle={{
            fontWeight: '500', // same font-weight as selected tab
          }}
          onChange={handleTabChange}
        >
          <Tabs.TabPane tab='Overview' key='overview' forceRender>
            <ContentCard
              title={
                automationDescription
                  ? 'Advertising Goals'
                  : 'Get started with customized machine learning and automation'
              }
              subTitle={
                automationDescription
                  ? "Based on discussions with you, we have captured the below summary of your organization's advertising goals."
                  : null
              }
              actions={[
                <Button type='primary' onClick={showDriftSidebar}>
                  Contact Us
                </Button>,
              ]}
              loading={descriptionLoading}
            >
              {automationDescription ? (
                <ReactMarkdown source={automationDescription} />
              ) : (
                <div>
                  It builds tailored machine learning and automation to achieve
                  your specific goals.{' '}
                  <TextButton link onClick={showDriftSidebar}>
                    Contact us
                  </TextButton>{' '}
                  to get started.
                </div>
              )}
            </ContentCard>
          </Tabs.TabPane>
          {hasPermissions(featurePermissions, AUTOMATION) && (
            <Tabs.TabPane tab='Changelog' key='changelog' forceRender>
              <ChangelogTableContainer />
            </Tabs.TabPane>
          )}
          {hasPermissions(featurePermissions, AUTOMATION) && (
            <Tabs.TabPane
              tab='Recommended Actions'
              key='recommendations'
              forceRender
            >
              <RecommendationsTableContainer />
            </Tabs.TabPane>
          )}
        </Tabs>
      </React.Fragment>
    )
  }
}

export default AutomationPage
