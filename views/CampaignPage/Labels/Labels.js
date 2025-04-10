import React from 'react'
import PropTypes from 'prop-types'

import { LabelSection } from 'components/LabelSection'

const propTypes = {
    orgLabels: PropTypes.array.isRequired,
    labels: PropTypes.array.isRequired,
    addingLabels: PropTypes.bool.isRequired,
    addLabelsRequest: PropTypes.func.isRequired,
    removeLabelRequest: PropTypes.func.isRequired,
    featurePermissions: PropTypes.array.isRequired,
}

const Labels = ({
    orgLabels,
    labels,
    addingLabels,
    addLabelsRequest,
    removeLabelRequest,
    featurePermissions,
}) => (
    <LabelSection
        orgLabels={orgLabels}
        labels={labels}
        addingLabels={addingLabels}
        addLabelsRequest={addLabelsRequest}
        removeLabelRequest={removeLabelRequest}
        featurePermissions={featurePermissions}
    />
)

Labels.propTypes = propTypes

export default Labels
