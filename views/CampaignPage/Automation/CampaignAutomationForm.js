import React from 'react'
import PropTypes from 'prop-types'
import { withFormik, Form, Field, ErrorMessage } from 'formik'
import { Row, Col, Icon, Button } from 'antd'
import * as Yup from 'yup'
import pick from 'lodash/pick'

import moment from 'utilities/moment'

import { parsePercentage } from 'helpers/parsers'
import { ToolTip } from 'components/ToolTip'
import { Collapse } from 'components/Collapse'
import { OptionalFormLabel } from 'components/OptionalFormLabel'
import {
  FormikSwitch,
  FormikInputNumber,
  FormikDatePicker,
} from 'components/formik'

const DEFAULT_AUTOMATION = {
  target_type: 'acos',
  status: 'disabled',
  start_date: moment().format(),
  end_date: null, // i.e. not set
  target_value: null, // i.e. not set
  days_back: 14,
  epsilon: 0.3,
  bid_up_pace: 0.1,
}

const ALLOWED_FIELDS = [
  'target_type',
  'status',
  'start_date',
  'end_date',
  'target_value',
  'days_back',
  'epsilon',
  'bid_up_pace',
]

const NOW = moment()

const serializeAutomation = (automation) => {
  const { status, start_date, end_date, ...rest } = pick(
    automation,
    ALLOWED_FIELDS
  )

  return {
    ...rest,
    enabled: status === 'enabled',
    start_date: moment(start_date),
    end_date: end_date ? moment(end_date) : null,
  }
}

const deserializeAutomation = (automation) => {
  const { enabled, start_date, end_date, ...rest } = automation

  return {
    ...rest,
    status: enabled ? 'enabled' : 'disabled',
    start_date: start_date.format(),
    end_date: end_date ? end_date.format() : null,
  }
}

const CampaignAutomationForm = ({
  editable,
  handleSubmit,
  handleReset,
  values,
  dirty,
  isSubmitting,
}) => (
  <Form>
    <Row type='flex' align='middle' gutter={8} style={{ marginBottom: 20 }}>
      <Col xs={8}>
        <span>ACoS Optimization</span>
        &nbsp;
        <ToolTip title='It will automatically adjust your campaign bids to achieve better return on investment'>
          <Icon type='question-circle-o' className='fg-icon-xs' />
        </ToolTip>
        :&nbsp;
        <Field name='enabled' component={FormikSwitch} disabled={!editable} />
      </Col>

      {editable &&
        dirty && [
          <Col key='btn-submit'>
            <Button
              type='primary'
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Col>,

          <Col key='btn-cancel'>
            <Button onClick={handleReset}>Cancel</Button>
          </Col>,
        ]}
    </Row>

    <Collapse isOpened={values.enabled}>
      <Row type='flex' gutter={8} align='top'>
        <Col xs={4}>
          <div className='fg-form-control'>
            <div className='fg-control-label'>Start Date</div>

            <Field
              name='start_date'
              component={FormikDatePicker}
              minDate={NOW}
              maxDate={values.end_date}
              disabled={!editable}
            />

            <ErrorMessage
              name='start_date'
              component='div'
              className='fg-control-text is-error'
            />
          </div>
        </Col>

        <Col xs={4}>
          <div className='fg-form-control'>
            <div className='fg-control-label'>
              <OptionalFormLabel fieldName='End Date' />
            </div>

            <Field
              name='end_date'
              component={FormikDatePicker}
              minDate={values.start_date}
              disabled={!editable}
            />

            <ErrorMessage
              name='end_date'
              component='div'
              className='fg-control-text is-error'
            />
          </div>
        </Col>

        <Col xs={4}>
          <div className='fg-form-control'>
            <div className='fg-control-label'>ACoS Target</div>

            <Field
              style={{ width: '100%' }}
              name='target_value'
              component={FormikInputNumber}
              precision={2}
              disabled={!editable}
              formatter={(value) => `${value}%`}
              parser={parsePercentage}
            />
            <ErrorMessage
              name='target_value'
              component='div'
              className='fg-control-text is-error'
            />
          </div>
        </Col>
      </Row>
    </Collapse>
  </Form>
)

CampaignAutomationForm.propTypes = {
  editable: PropTypes.bool,
  // Formik props
  values: PropTypes.object.isRequired,
  dirty: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
}

CampaignAutomationForm.defaultProps = {
  editable: true,
}

export default withFormik({
  displayName: 'CampaignAutomationForm',

  // This triggers reset the form if the wrapped component props change.
  enableReinitialize: true,

  validationSchema: Yup.object().shape({
    target_value: Yup.number().label('ACoS Target').required().moreThan(0),
  }),

  mapPropsToValues({ automation }) {
    return serializeAutomation(automation || DEFAULT_AUTOMATION)
  },

  handleSubmit(values, { props: { onSubmit }, setSubmitting }) {
    onSubmit(deserializeAutomation(values))

    setSubmitting(false)
  },
})(CampaignAutomationForm)
