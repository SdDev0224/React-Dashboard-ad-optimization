import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Button, Icon } from 'antd'
import autobind from 'autobind-decorator'
import uniqueId from 'lodash/uniqueId'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import omit from 'lodash/omit'
import { withRouter } from 'react-router-dom'

import { ENABLED } from 'constants/resourceStates'
import TextButton from 'components/TextButton/TextButton'

import AttachingTable from './AttachingTable'
import styles from './styles.scss'

const ROW_KEY = 'uid'
const MIN_ASIN_LENGTH = 10
const generateProductObject = asin => ({
    [ROW_KEY]: uniqueId(),
    asin,
    state: ENABLED,
})

class AttachingDetails extends Component {
    static propTypes = {
        // antd form
        form: PropTypes.shape({
            getFieldDecorator: PropTypes.func,
            validateFields: PropTypes.func,
            isFieldsTouched: PropTypes.func,
            resetFields: PropTypes.func,
        }).isRequired,

        attaching: PropTypes.bool.isRequired,
        onAttach: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    }

    state = {
        justAttached: false,
        products: [],
    }

    componentDidUpdate(prevProps) {
        const { attaching } = this.props
        const { justAttached } = this.state
        // set justAttached when attaching is complete
        if (prevProps.attaching && !attaching) {
            this.setJustAttached(true)
        } else if (justAttached) {
            // reset justAttached with timeout
            setTimeout(() => this.setJustAttached(false), 1000)
        }
    }

    setJustAttached(justAttached) {
        if (justAttached) {
            this.setState({ justAttached }, this.resetForm)
        } else {
            // only reset form when justAttached has been set to false
            this.setState({ justAttached })
        }
    }

    @autobind
    resetForm() {
        const { form } = this.props
        this.setState({ products: [] }, form.resetFields)
    }

    @autobind
    handleAddProduct(e) {
        e.preventDefault()
        const { form } = this.props
        const { products } = this.state
        form.validateFieldsAndScroll((errors, value) => {
            if (errors) {
                return
            }
            const { asins: formASINs } = value
            this.setState({
                products: [
                    ...products,
                    ...formASINs
                        .split(/[\r\n]+/)
                        .filter(asin => asin.length > 0)
                        .map(asin => generateProductObject(asin)),
                ],
            })
            form.resetFields()
        })
    }

    @autobind
    deleteProduct({ id: productId }) {
        const { products } = this.state
        this.setState({
            products: products.filter(
                product => get(product, [ROW_KEY]) !== productId
            ),
        })
    }

    @autobind
    changeProduct({ id: productId, fieldId, value }) {
        const { products } = this.state
        const index = products.findIndex(
            product => get(product, [ROW_KEY]) === productId
        )
        if (index > -1) {
            const product = products[index]
            products.splice(index, 1, {
                ...product,
                ...{ [fieldId]: value },
            })
            this.setState({ products })
        }
    }

    @autobind
    attachProducts() {
        const { onAttach } = this.props
        const { products } = this.state
        if (!isEmpty(products)) {
            onAttach(products.map(product => omit(product, ROW_KEY)))
        }
    }

    render() {
        const { form, attaching, onCancel } = this.props
        const { justAttached, products } = this.state

        const attachBtnProps = {
            type: 'primary',
            disabled: justAttached ? !justAttached : isEmpty(products),
            onClick: this.attachProducts,
            loading: attaching,
            ...(justAttached ? { icon: 'check' } : { icon: 'plus' }),
        }
        const cancelBtnProps = {
            onClick: event => {
                this.resetForm()
                onCancel(event)
            },
            disabled: attaching || justAttached,
        }

        return (
            <div className={styles['attaching-container']}>
                <p className={styles['attaching-title']}>Add New Products</p>
                <Row gutter={16}>
                    <Col xs={24} md={10}>
                        <p>
                            <strong>Enter ASINs</strong> (add one or multiple
                            ASINs)
                        </p>
                        <div className={styles['text-area-container']}>
                            <Form.Item className={styles['text-area']}>
                                {form.getFieldDecorator('asins', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'ASIN is required.',
                                        },
                                        {
                                            validator: (
                                                rule,
                                                value,
                                                callback
                                            ) => {
                                                const formASINs = value
                                                    .split(/[\r\n]+/)
                                                    .filter(
                                                        asin => asin.length > 0
                                                    )

                                                let error = formASINs.some(
                                                    asin => {
                                                        if (
                                                            asin.length <
                                                            MIN_ASIN_LENGTH
                                                        ) {
                                                            callback(
                                                                `ASIN must be at least ${MIN_ASIN_LENGTH} characters long`
                                                            )
                                                            return true
                                                        }
                                                        return false
                                                    }
                                                )

                                                if (!error) {
                                                    error =
                                                        formASINs.filter(
                                                            (
                                                                asin,
                                                                index,
                                                                array
                                                            ) =>
                                                                array.includes(
                                                                    asin,
                                                                    index + 1
                                                                )
                                                        ).length > 0
                                                    if (error) {
                                                        callback(
                                                            'An ASIN you are trying to add has already been entered'
                                                        )
                                                    }
                                                }

                                                if (!error) {
                                                    formASINs.some(asin => {
                                                        const index = products.findIndex(
                                                            product =>
                                                                get(
                                                                    product,
                                                                    'asin'
                                                                ) === asin
                                                        )
                                                        if (index > -1) {
                                                            callback(
                                                                'An ASIN you are trying to add has already been added'
                                                            )
                                                            return true
                                                        }
                                                        return false
                                                    })
                                                }

                                                callback()
                                            },
                                        },
                                    ],
                                    validateTrigger: '',
                                })(
                                    <Input.TextArea
                                        placeholder="Add ASINs"
                                        autosize={{ minRows: 3 }}
                                        disabled={attaching}
                                    />
                                )}
                            </Form.Item>
                            <TextButton
                                link
                                disabled={isEmpty(form.getFieldValue('asins'))}
                                onClick={this.handleAddProduct}
                            >
                                Add All <Icon type="right" />
                            </TextButton>
                        </div>
                    </Col>

                    <Col xs={24} md={14}>
                        <AttachingTable
                            rowKey={ROW_KEY}
                            data={products}
                            attaching={attaching}
                            deleteRecord={this.deleteProduct}
                            changeRecord={this.changeProduct}
                        />
                        <div className={styles['attaching-buttons']}>
                            <Button {...attachBtnProps}>Create Products</Button>
                            <Button {...cancelBtnProps}>Cancel</Button>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withRouter(Form.create()(AttachingDetails))
