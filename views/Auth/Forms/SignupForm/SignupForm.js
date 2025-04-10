/* global TERMS_OF_SERVICE */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Form, Input, Select, Alert, Checkbox } from 'antd'
import autobind from 'autobind-decorator'
import isNull from 'lodash/isNull'

import { AppLink } from 'components/AppLink'
import { getPath } from 'helpers/pages'
import { AUTH_PAGE, AUTH_FORGOT_PASSWORD_PAGE } from 'constants/pages'

import styles from './styles.scss'

class SignupForm extends Component {
  static propTypes = {
    // Redux state
    auth: PropTypes.shape({
      signedIn: PropTypes.bool,
      isFetching: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,

    // Antd form
    form: PropTypes.shape({
      validateFields: PropTypes.func,
      getFieldDecorator: PropTypes.func,
      getFieldsError: PropTypes.func,
    }).isRequired,

    // Actions
    signUpRequest: PropTypes.func.isRequired,
    resetAuth: PropTypes.func.isRequired,
  }

  static defaultProps = {}

  constructor(props) {
    super(props)

    this.state = {
      showOtherTextField: false,
      loginAlertVisible: false,
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if (!isNull(nextProps.auth.error)) {
      return { loginAlertVisible: true }
    }
    return null
  }

  @autobind
  handleSubmit(e) {
    e.preventDefault()
    const { form, signUpRequest } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        signUpRequest(values)
      }
    })
  }

  @autobind
  handleHowDidYouHearChange(value) {
    if (value === 'other') {
      this.setState({
        showOtherTextField: true,
      })
    } else {
      this.setState({
        showOtherTextField: false,
      })
    }
  }

  @autobind
  handleLoginAlertClose() {
    const { resetAuth } = this.props
    this.setState({
      loginAlertVisible: false,
    })
    resetAuth()
  }

  emailFieldDecorator(component) {
    const { form } = this.props
    return form.getFieldDecorator('email', {
      rules: [
        {
          required: true,
          message: 'Email is required.',
        },
        {
          type: 'email',
          message: 'The input is not valid email.',
        },
      ],
      validateTrigger: '',
    })(component)
  }

  nameFieldDecorator(component) {
    const { form } = this.props
    return form.getFieldDecorator('name', {
      rules: [
        {
          required: true,
          message: 'Name is required.',
        },
      ],
      validateTrigger: '',
    })(component)
  }

  companyFieldDecorator(component) {
    const { form } = this.props
    return form.getFieldDecorator('company', {
      rules: [
        {
          required: true,
          message: 'Company is required.',
        },
      ],
      validateTrigger: '',
    })(component)
  }

  websiteFieldDecorator(component) {
    const { form } = this.props
    return form.getFieldDecorator('website', {
      rules: [
        {
          required: false,
        },
      ],
      validateTrigger: '',
    })(component)
  }

  phoneFieldDecorator(component) {
    const { form } = this.props
    return form.getFieldDecorator('phone', {
      rules: [
        {
          required: false,
        },
      ],
      validateTrigger: '',
    })(component)
  }

  passwordFieldDecorator(component) {
    const { form } = this.props
    return form.getFieldDecorator('password', {
      rules: [
        {
          required: true,
          message: 'Password is required.',
        },
      ],
      validateTrigger: '',
    })(component)
  }

  howDidYouHearFieldDecorator(component) {
    const { form } = this.props
    return form.getFieldDecorator('how_did_you_hear', {
      rules: [
        {
          required: false,
        },
      ],
      validateTrigger: '',
    })(component)
  }

  howDidYouHearOtherFieldDecorator(component) {
    const { form } = this.props
    return form.getFieldDecorator('how_did_you_hear_other', {
      rules: [
        {
          required: false,
        },
      ],
      validateTrigger: '',
    })(component)
  }

  termsFieldDecorator(component) {
    const { form } = this.props
    return form.getFieldDecorator('terms_of_service', {
      rules: [
        {
          type: 'boolean',
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('Agreeing to the terms is required.'))
            }
            callback()
          },
        },
      ],
      valuePropName: 'checked',
      initialValue: false,
      validateTrigger: '',
    })(component)
  }

  render() {
    const { auth } = this.props
    const { showOtherTextField, loginAlertVisible } = this.state
    return (
      <Form onSubmit={this.handleSubmit}>
        <div className={styles.center}>
          <h3>Sign Up For Free!</h3>
        </div>

        <Form.Item hasFeedback>
          {this.nameFieldDecorator(<Input type='text' placeholder='Name' />)}
        </Form.Item>

        <Form.Item hasFeedback>
          {this.companyFieldDecorator(
            <Input type='text' placeholder='Company' />
          )}
        </Form.Item>

        <Form.Item hasFeedback>
          {this.websiteFieldDecorator(
            <Input type='text' placeholder='Website (Optional)' />
          )}
        </Form.Item>

        <Form.Item hasFeedback>
          {this.phoneFieldDecorator(
            <Input type='tel' placeholder='Phone (Optional)' />
          )}
        </Form.Item>

        <Form.Item hasFeedback>
          {this.emailFieldDecorator(<Input type='text' placeholder='Email' />)}
        </Form.Item>

        <Form.Item hasFeedback>
          {this.passwordFieldDecorator(
            <Input type='password' placeholder='Password' />
          )}
        </Form.Item>

        <Form.Item>
          {this.howDidYouHearFieldDecorator(
            <Select
              onSelect={this.handleHowDidYouHearChange}
              placeholder='How Did You Hear About Us? (Optional)'
            >
              <Select.Option value='moz'>Moz Podcast</Select.Option>
              <Select.Option value='google'>Google Search</Select.Option>
              <Select.Option value='referral'>
                Referral from Friend/Colleague
              </Select.Option>
              <Select.Option value='other'>Other Source</Select.Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item>
          {this.termsFieldDecorator(
            <Checkbox>
              I agree{' '}
              <a
                href={TERMS_OF_SERVICE}
                rel='noopener noreferrer'
                target='_blank'
              >
                Terms of Service
              </a>
              .
            </Checkbox>
          )}
        </Form.Item>

        {showOtherTextField && (
          <Form.Item hasFeedback>
            {this.howDidYouHearOtherFieldDecorator(
              <Input
                type='text'
                placeholder='How Did You Hear About Us? (Optional)'
              />
            )}
          </Form.Item>
        )}

        <Row>
          <Button type='primary' htmlType='submit' loading={auth.isFetching}>
            Sign Up
          </Button>
          <p>
            <AppLink to={getPath(AUTH_PAGE)}>
              <span>Login</span>
            </AppLink>
            <AppLink to={getPath(AUTH_FORGOT_PASSWORD_PAGE)}>
              <span>Forgot Password</span>
            </AppLink>
          </p>
        </Row>

        {loginAlertVisible && (
          <Alert
            message={auth.error}
            type='error'
            closable
            afterClose={this.handleLoginAlertClose}
          />
        )}
      </Form>
    )
  }
}

export default Form.create()(SignupForm)
