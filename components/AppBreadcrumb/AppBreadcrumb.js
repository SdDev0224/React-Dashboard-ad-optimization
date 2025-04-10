import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'

import { AppLink } from 'components/AppLink'

const propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.node,
            url: PropTypes.string,
            icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        })
    ).isRequired,
}

const renderIcon = icon =>
    typeof icon === 'string' ? <Icon type={icon} /> : icon

const AppBreadcrumb = ({ items }) => {
    const breadcrumbs = items
        .filter(({ name }) => name)
        .map(({ name, url, icon }) => (
            <Breadcrumb.Item key={name}>
                {icon && renderIcon(icon)}

                <span>{url ? <AppLink to={url}>{name}</AppLink> : name}</span>
            </Breadcrumb.Item>
        ))

    return <Breadcrumb>{breadcrumbs}</Breadcrumb>
}

AppBreadcrumb.propTypes = propTypes

export default AppBreadcrumb
