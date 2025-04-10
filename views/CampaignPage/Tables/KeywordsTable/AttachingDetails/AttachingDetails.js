import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Input, Button, Icon } from 'antd'
import autobind from 'autobind-decorator'
import uniqueId from 'lodash/uniqueId'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import omit from 'lodash/omit'
import { withRouter } from 'react-router-dom'

import { EXACT } from 'constants/matchTypes'
import { ENABLED } from 'constants/resourceStates'
import { TextButton } from 'components/TextButton'

import AttachingTable from './AttachingTable'
import styles from './styles.scss'

const ROW_KEY = 'uid'
const MIN_KEYWORD_LENGTH = 2
const generateKeywordObject = keyword => ({
    [ROW_KEY]: uniqueId(),
    text: keyword,
    match_type: EXACT,
    state: ENABLED,
    bid: 1.0,
})

class AttachingDetails extends Component {
    static propTypes = {
        brand: PropTypes.shape({
            currency_code: PropTypes.string,
        }),
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

    static defaultProps = {
        brand: {},
    }

    state = {
        justAttached: false,
        keywords: [],
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
        this.setState({ keywords: [] }, form.resetFields)
    }

    @autobind
    handleAddKeyword(e) {
        e.preventDefault()
        const { form } = this.props
        const { keywords } = this.state
        form.validateFieldsAndScroll((errors, value) => {
            if (errors) {
                return
            }
            const { keywords: formKeywords } = value
            this.setState({
                keywords: [
                    ...keywords,
                    ...formKeywords
                        .split(/[\r\n]+/)
                        .filter(kw => kw.length > 0)
                        .map(kw => generateKeywordObject(kw)),
                ],
            })
            form.resetFields()
        })
    }

    @autobind
    deleteKeyword({ id: keywordId }) {
        const { keywords } = this.state
        this.setState({
            keywords: keywords.filter(
                keyword => get(keyword, [ROW_KEY]) !== keywordId
            ),
        })
    }

    @autobind
    changeKeyword({ id: keywordId, fieldId, value }) {
        const { keywords } = this.state
        const index = keywords.findIndex(
            keyword => get(keyword, [ROW_KEY]) === keywordId
        )
        if (index > -1) {
            const keyword = keywords[index]
            keywords.splice(index, 1, {
                ...keyword,
                ...{ [fieldId]: value },
            })
            this.setState({ keywords })
        }
    }

    @autobind
    attachKeywords() {
        const { onAttach } = this.props
        const { keywords } = this.state
        if (!isEmpty(keywords)) {
            onAttach(keywords.map(keyword => omit(keyword, ROW_KEY)))
        }
    }

    render() {
        const { form, attaching, onCancel } = this.props
        const { justAttached, keywords } = this.state

        const attachBtnProps = {
            type: 'primary',
            disabled: justAttached ? !justAttached : isEmpty(keywords),
            onClick: this.attachKeywords,
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
                <Row gutter={16}>
                    <Col xs={24} md={10}>
                        <p>
                            <strong>Enter Keywords</strong> (add one or multiple
                            keywords)
                        </p>
                        <div className={styles['text-area-container']}>
                            <Form.Item className={styles['text-area']}>
                                {form.getFieldDecorator('keywords', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Keyword is required.',
                                        },
                                        {
                                            validator: (
                                                rule,
                                                value,
                                                callback
                                            ) => {
                                                const formKeywords = value
                                                    .split(/[\r\n]+/)
                                                    .filter(kw => kw.length > 0)

                                                let error = formKeywords.some(
                                                    keyword => {
                                                        if (
                                                            keyword.length <
                                                            MIN_KEYWORD_LENGTH
                                                        ) {
                                                            callback(
                                                                `Keyword must be at least ${MIN_KEYWORD_LENGTH} characters long`
                                                            )
                                                            return true
                                                        }
                                                        return false
                                                    }
                                                )

                                                if (!error) {
                                                    error =
                                                        formKeywords.filter(
                                                            (
                                                                keyword,
                                                                index,
                                                                array
                                                            ) =>
                                                                array.includes(
                                                                    keyword,
                                                                    index + 1
                                                                )
                                                        ).length > 0
                                                    if (error) {
                                                        callback(
                                                            'A keyword you are trying to add has already been entered'
                                                        )
                                                    }
                                                }

                                                if (!error) {
                                                    formKeywords.some(
                                                        keyword => {
                                                            const index = keywords.findIndex(
                                                                kw =>
                                                                    get(
                                                                        kw,
                                                                        'text'
                                                                    ) ===
                                                                    keyword
                                                            )
                                                            if (index > -1) {
                                                                callback(
                                                                    'A keyword you are trying to add has already been added'
                                                                )
                                                                return true
                                                            }
                                                            return false
                                                        }
                                                    )
                                                }
                                                callback()
                                            },
                                        },
                                    ],
                                    validateTrigger: '',
                                })(
                                    <Input.TextArea
                                        placeholder="Add keywords"
                                        autosize={{ minRows: 3 }}
                                        disabled={attaching}
                                    />
                                )}
                            </Form.Item>
                            <TextButton
                                link
                                disabled={isEmpty(
                                    form.getFieldValue('keywords')
                                )}
                                onClick={this.handleAddKeyword}
                            >
                                Add All <Icon type="right" />
                            </TextButton>
                        </div>
                    </Col>

                    <Col xs={24} md={14}>
                        <AttachingTable
                            rowKey={ROW_KEY}
                            data={keywords}
                            attaching={attaching}
                            deleteRecord={this.deleteKeyword}
                            changeRecord={this.changeKeyword}
                        />
                        <div className={styles['attaching-buttons']}>
                            <Button {...attachBtnProps}>Create Keywords</Button>
                            <Button {...cancelBtnProps}>Cancel</Button>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withRouter(Form.create()(AttachingDetails))
