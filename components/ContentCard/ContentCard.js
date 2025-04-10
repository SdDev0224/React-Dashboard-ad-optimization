import React from 'react'
import PropTypes from 'prop-types'
import { Card, Divider } from 'antd'
import isEmpty from 'lodash/isEmpty'
import isNull from 'lodash/isNull'
import classNames from 'classnames'

import { Collapse } from 'components/Collapse'

import styles from './styles.scss'

const propTypes = {
    title: PropTypes.string.isRequired,
    rowSpacing: PropTypes.bool,
    actions: PropTypes.arrayOf(PropTypes.node),
    children: PropTypes.node,
    subTitle: PropTypes.node,
    bodyStyle: PropTypes.shape(),
    collapseOpen: PropTypes.bool,
    collapseContent: PropTypes.node,
    loading: PropTypes.bool,
}

const defaultProps = {
    rowSpacing: false,
    actions: [],
    children: null,
    subTitle: null,
    bodyStyle: null,
    collapseOpen: false,
    collapseContent: null,
    loading: false,
}

const ContentCard = ({
    title,
    rowSpacing,
    actions,
    children,
    subTitle,
    bodyStyle,
    collapseOpen,
    collapseContent,
    loading,
}) => {
    const cardProps = {
        className: classNames({
            [styles.card]: true,
            [styles['row-spacing']]: rowSpacing,
        }),
        title: (
            <React.Fragment>
                <div className={styles['title-container']}>
                    <div>
                        <div>{title}</div>
                        {!isNull(subTitle) && (
                            <div className={styles['sub-title']}>
                                {subTitle}
                            </div>
                        )}
                    </div>
                    {!isEmpty(actions) && (
                        <div>
                            {actions.map((action, idx) => (
                                <span key={idx} className={styles.action}>
                                    {action}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                {collapseContent && (
                    <Collapse isOpened={collapseOpen}>
                        <Divider />
                        {collapseContent}
                    </Collapse>
                )}
            </React.Fragment>
        ),
        ...(bodyStyle ? { bodyStyle } : {}),
    }

    return (
        <Card loading={loading} {...cardProps}>
            {children}
        </Card>
    )
}

ContentCard.propTypes = propTypes
ContentCard.defaultProps = defaultProps

export default ContentCard
