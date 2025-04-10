import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Form, Input, Alert } from 'antd'
import autobind from 'autobind-decorator'
import set from 'lodash/set'
import isEmpty from 'lodash/isEmpty'
import isNull from 'lodash/isNull'

const propTypes = {
    // Antd Form
    form: PropTypes.shape({
        getFieldDecorator: PropTypes.func,
        validateFields: PropTypes.func,
    }).isRequired,

    auth: PropTypes.shape({
        passwordResetEmailSent: PropTypes.bool,
        error: PropTypes.string,
        isFetching: PropTypes.bool,
    }).isRequired,

    // actions
    sendResetEmailRequest: PropTypes.func.isRequired,
    resetAuthErrors: PropTypes.func.isRequired,
}
const defaultProps = {}

class SendResetEmailForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            emailSentErrorAlertVisible: false,
        }
    }

    static getDerivedStateFromProps(nextProps) {
        const nextState = {}

        if (nextProps.auth.passwordResetEmailSent) {
            set(nextState, 'emailSentSuccessAlertVisible', true)
        }

        if (!isNull(nextProps.auth.error)) {
            set(nextState, 'emailSentErrorAlertVisible', true)
        }

        return isEmpty(nextState) ? null : nextState
    }

    @autobind
    handleEmailSentAlertClose() {
        const { resetAuthErrors } = this.props
        this.setState({
            emailSentErrorAlertVisible: false,
        })
        resetAuthErrors()
    }

    @autobind
    handleSendResetEmailSubmit(e) {
        e.preventDefault()
        const { form, sendResetEmailRequest } = this.props
        form.validateFields((err, values) => {
            const { email } = values

            if (!err) {
                sendResetEmailRequest({ email })
            }
        })
    }

    emailFieldDecorator(component) {
        const { form } = this.props
        return form.getFieldDecorator('email', {
            rules: [
                {
                    required: true,
                    message: 'Email is required',
                },
            ],
        })(component)
    }

    render() {
        const { auth } = this.props
        const { emailSentErrorAlertVisible } = this.state
        return (
            <Form onSubmit={this.handleSendResetEmailSubmit}>
                <Form.Item hasFeedback>
                    {this.emailFieldDecorator(<Input placeholder="Email" />)}
                </Form.Item>

                {auth.passwordResetEmailSent ? (
                    <Row>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={auth.isFetching}
                        >
                            Send Password Reset Email Again
                        </Button>
                        <br />
                        <br />
                        <Alert
                            message="Check your email for a reset code"
                            type="success"
                            closable
                        />
                    </Row>
                ) : (
                    <Row>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={auth.isFetching}
                        >
                            Send Password Reset Email
                        </Button>
                    </Row>
                )}

                {emailSentErrorAlertVisible && (
                    <div>
                        <br />
                        <Alert
                            message={auth.error}
                            type="error"
                            closable
                            afterClose={this.handleEmailSentAlertClose}
                        />
                    </div>
                )}
            </Form>
        )
    }
}

SendResetEmailForm.propTypes = propTypes
SendResetEmailForm.defaultProps = defaultProps

export default Form.create()(SendResetEmailForm)
