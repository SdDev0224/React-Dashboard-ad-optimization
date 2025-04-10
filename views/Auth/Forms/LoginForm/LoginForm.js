import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Form, Input, Alert } from 'antd'
import autobind from 'autobind-decorator'
import isNull from 'lodash/isNull'

import { getPath } from 'helpers/pages'
import { AUTH_SIGNUP_PAGE, AUTH_FORGOT_PASSWORD_PAGE } from 'constants/pages'
import { AppLink } from 'components/AppLink'
import { ShowDetailsButton } from 'components/Buttons'

class LoginForm extends Component {
    static propTypes = {
        // Form
        form: PropTypes.shape({
            getFieldDecorator: PropTypes.func,
            validateFields: PropTypes.func,
        }).isRequired,

        // Redux state
        auth: PropTypes.shape({
            isFetching: PropTypes.bool,
            error: PropTypes.string,
        }).isRequired,

        // Redux actions
        resetAuth: PropTypes.func.isRequired,
        signInRequest: PropTypes.func.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props)
        this.state = {
            loginAlertVisible: false,
            showErrorDetails: false,
        }
    }

    static getDerivedStateFromProps(nextProps) {
        if (!isNull(nextProps.auth.error)) {
            return { loginAlertVisible: true }
        }
        return null
    }

    @autobind
    handleLoginAlertClose() {
        const { resetAuth } = this.props
        this.setState({
            loginAlertVisible: false,
        })
        resetAuth()
    }

    @autobind
    handleSubmit(e) {
        e.preventDefault()
        const { form, signInRequest } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                signInRequest(values)
            }
        })
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

    @autobind
    toggleShowErrorDetails() {
        this.setState(state => ({ showErrorDetails: !state.showErrorDetails }))
    }

    render() {
        const {
            auth: { isFetching, error },
        } = this.props
        const { loginAlertVisible, showErrorDetails } = this.state

        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item hasFeedback>
                    {this.emailFieldDecorator(<Input placeholder="Email" />)}
                </Form.Item>

                <Form.Item hasFeedback>
                    {this.passwordFieldDecorator(
                        <Input type="password" placeholder="Password" />
                    )}
                </Form.Item>

                <Row>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isFetching}
                    >
                        Sign in
                    </Button>
                    <p>
                        <AppLink to={getPath(AUTH_SIGNUP_PAGE)}>
                            <span>Sign Up</span>
                        </AppLink>
                        <AppLink to={getPath(AUTH_FORGOT_PASSWORD_PAGE)}>
                            <span>Forgot Password</span>
                        </AppLink>
                    </p>
                </Row>

                {loginAlertVisible && (
                    <Alert
                        message={
                            <div>
                                <div style={{ marginBottom: '12px' }}>
                                    Something went wrong. Please try again.
                                </div>
                                <div>
                                    See more details
                                    <ShowDetailsButton
                                        showDetails={showErrorDetails}
                                        onClick={this.toggleShowErrorDetails}
                                        style={{
                                            width: 'inherit',
                                            marginLeft: '5px',
                                        }}
                                    />
                                </div>
                                {showErrorDetails && <div>{error}</div>}
                            </div>
                        }
                        type="error"
                        closable
                        afterClose={this.handleLoginAlertClose}
                    />
                )}
            </Form>
        )
    }
}

export default Form.create()(LoginForm)
