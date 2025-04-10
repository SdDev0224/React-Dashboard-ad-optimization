import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles.scss'

const ToolTipWithHelpText = ({ info }) =>
    info.map(item => {
        const { title, description } = item

        return (
            <div className={styles.tooltip} key={description}>
                {title && <span className={styles.title}>{title}</span>}
                <span className={styles.description}>{description}</span>
            </div>
        )
    })

ToolTipWithHelpText.propTypes = {
    info: PropTypes.array.isRequired,
}

export default ToolTipWithHelpText
