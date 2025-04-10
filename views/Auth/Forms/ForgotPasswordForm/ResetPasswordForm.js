import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Alert, Row, Form, Input } from 'antd'
import autobind from 'autobind-decorator'

const propTypes = {
    // antd form
    form: PropTypes.shape({
        validateFields: PropTypes.func,
        resetFields: PropTypes.func,
        getFieldDecorator: PropTypes.func,
    }).isRequired,

    auth: PropTypes.shape({
        email: PropTypes.string,
        passwordResetEmailSent: PropTypes.bool,
        passwordResetSuccess: PropTypes.bool,
        isFetching: PropTypes.bool,
    }).isRequired,

    // actions
    resetPasswordRequest: PropTypes.func.isRequired,
}
const defaultProps = {}

class ResetPasswordForm extends Component {
    @autobind
    handlePasswordResetSubmit(e) {
        e.preventDefault()
        const { form, auth, resetPasswordRequest } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                resetPasswordRequest({
                    email: auth.email,
                    code: values.code,
                    newPassword: values.newPassword,
                })
                form.resetFields()
            }
        })
    }

    codeFieldDecorator(component) {
        const { form } = this.props
        return form.getFieldDecorator('code', {
            rules: [
                {
                    required: true,
                    message: 'Reset code is required',
                },
            ],
        })(component)
    }

    newPasswordFieldDecorator(component) {
        const { form } = this.props
        return form.getFieldDecorator('newPassword', {
            rules: [
                {
                    required: true,
                    message: 'New password is required',
                },
            ],
        })(component)
    }

    render() {
        const { auth } = this.props
        return (
            auth.passwordResetEmailSent && (
                <Form onSubmit={this.handlePasswordResetSubmit}>
                    <Form.Item hasFeedback>
                        {this.codeFieldDecorator(
                            <Input type="text" placeholder="Reset Code" />
                        )}
                    </Form.Item>

                    <Form.Item hasFeedback>
                        {this.newPasswordFieldDecorator(
                            <Input type="password" placeholder="New Password" />
                        )}
                    </Form.Item>

                    <Row>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={auth.isFetching}
                        >
                            Reset Password
                        </Button>

                        {auth.passwordResetSuccess && (
                            <div>
                                <br />
                                <Alert
                                    message="Password reset. Click link below to login."
                                    type="success"
                                />
                            </div>
                        )}
                    </Row>
                </Form>
            )
        )
    }
}

ResetPasswordForm.propTypes = propTypes
ResetPasswordForm.defaultProps = defaultProps

export default Form.create()(ResetPasswordForm)
