import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import mapValues from 'lodash/mapValues'

import { Flag } from 'components/Flag'
import { PaginatedTable } from 'components/PaginatedTable'
import { getTablePaginationOptions } from 'helpers/pagination'
import { ContentCard } from 'components/ContentCard'
import { SettingsButton } from 'components/Buttons'
import { SettingsModal } from 'components/SettingsModal'
import moment from 'utilities/moment'
import { AppLink } from 'components/AppLink'
import { changelogResourceUrl } from 'helpers/urls'
import { titleCase } from 'helpers/formatting'
import { formatChangeDescription } from 'helpers/ui/automationPage'
import { REGION_LABELS, COUNTRY_LABELS } from 'constants/codes'

const TABLE_CONFIG = {
  rowKey: 'history_id',
  actionColumns: [],
  columns: {
    resource_name: {
      title: 'Resource Name',
      dataIndex: 'object_name',
      align: 'left',
      sorter: true,
      render: (value, record) => (
        <AppLink
          to={changelogResourceUrl(record.link_object_type, record.link_id)}
        >
          {value}
        </AppLink>
      ),
    },
    resource_type: {
      title: 'Resource Type',
      dataIndex: 'link_object_type',
      align: 'left',
      sorter: true,
      render: (value) => titleCase(value),
    },
    change_description: {
      title: 'Change Description',
      dataIndex: 'changes',
      align: 'left',
      render: (value, record) => formatChangeDescription(record),
    },
    change_reason: {
      title: 'Change Reason',
      dataIndex: 'history_change_reason',
      align: 'left',
      sorter: true,
    },
    change_date: {
      title: 'Change Date',
      dataIndex: 'history_date',
      align: 'left',
      sorter: true,
      render: (utcDateString) =>
        moment(utcDateString).local().format('M/DD/YYYY h:mm:ss A'),
    },
    region: {
      title: 'Region',
      dataIndex: 'region',
      align: 'left',
      sorter: true,
      render: (value) => REGION_LABELS[value],
    },
    country: {
      title: 'Country',
      dataIndex: 'country_code',
      align: 'left',
      sorter: true,
      render: (value) => (
        <span className='flag-container'>
          <Flag country={value} />
          {COUNTRY_LABELS[value]}
        </span>
      ),
    },
  },
}

class ChangelogTable extends Component {
  static propTypes = {
    tableData: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.shape()),
      updating: PropTypes.bool,
      deleting: PropTypes.bool,
      loading: PropTypes.bool,
      pagination: PropTypes.shape({
        pageSize: PropTypes.number,
        current: PropTypes.number,
        total: PropTypes.number,
      }),
      sorter: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['descend', 'ascend']),
      }),
      columnSettings: PropTypes.shape({
        order: PropTypes.array,
        displayState: PropTypes.shape(),
      }),
    }).isRequired,

    // actions
    updatePagination: PropTypes.func.isRequired,
    updateSorter: PropTypes.func.isRequired,
    updateColumnSettings: PropTypes.func.isRequired,
    reloadData: PropTypes.func.isRequired,
  }

  state = {
    settingsModalVisible: false,
  }

  @autobind
  handleToggleSettingsModal() {
    this.setState((state) => ({
      settingsModalVisible: !state.settingsModalVisible,
    }))
  }

  @autobind
  handleUpdateColumnSettings(settings) {
    const { updateColumnSettings, reloadData } = this.props

    updateColumnSettings(settings)

    // Reload data
    reloadData()

    // Toggle settings modal
    this.handleToggleSettingsModal()
  }

  render() {
    const { tableData, updatePagination, updateSorter, reloadData } = this.props
    const { settingsModalVisible } = this.state
    const columnTitles = mapValues(TABLE_CONFIG.columns, 'title')

    return (
      <ContentCard
        title='Changelog Table'
        subTitle='View a log of all automated changes.'
        actions={[
          <SettingsButton
            onClick={this.handleToggleSettingsModal}
            tooltipTitle='Customize table columns'
          />,
        ]}
      >
        <PaginatedTable
          tableConfig={TABLE_CONFIG}
          data={tableData.data}
          loading={tableData.loading}
          updating={tableData.updating}
          deleting={tableData.deleting}
          pagination={{
            ...getTablePaginationOptions('Changes'),
            ...tableData.pagination,
          }}
          sorter={tableData.sorter}
          columnSettings={tableData.columnSettings}
          updatePagination={updatePagination}
          updateSorter={updateSorter}
          reloadData={reloadData}
        />
        <SettingsModal
          droppableId='paginatedTableSettingsModal'
          modalTitle='Customize Table Columns'
          visible={settingsModalVisible}
          settings={tableData.columnSettings}
          settingTitles={columnTitles}
          handleOk={this.handleUpdateColumnSettings}
          handleCancel={this.handleToggleSettingsModal}
        />
      </ContentCard>
    )
  }
}

export default ChangelogTable
