import { createAction } from 'redux-actions'

// mount profile page
export const mountProfilePageRequest = createAction(
    'MOUNT_PROFILE_PAGE_REQUEST'
)
export const mountProfilePageSuccess = createAction(
    'MOUNT_PROFILE_PAGE_SUCCESS'
)
export const mountProfilePageFailure = createAction(
    'MOUNT_PROFILE_PAGE_FAILURE'
)
export const unmountProfilePage = createAction('UNMOUNT_PROFILE_PAGE')

// toggle profile details
export const toggleProfilePageDetails = createAction(
    'TOGGLE_PROFILE_PAGE_DETAILS'
)

// org form
export const openProfilePageOrganizationForm = createAction(
    'OPEN_PROFILE_PAGE_ORGANIZATION_FORM'
)
export const closeProfilePageOrganizationForm = createAction(
    'CLOSE_PROFILE_PAGE_ORGANIZATION_FORM'
)

// create org
export const createProfilePageOrganizationRequest = createAction(
    'CREATE_PROFILE_PAGE_ORGANIZATION_REQUEST'
)
export const createProfilePageOrganizationSuccess = createAction(
    'CREATE_PROFILE_PAGE_ORGANIZATION_SUCCESS'
)
export const createProfilePageOrganizationFailure = createAction(
    'CREATE_PROFILE_PAGE_ORGANIZATION_FAILURE'
)

// invitations
export const fetchInvitationsProfilePageSuccess = createAction(
    'FETCH_INVITATIONS_PROFILE_PAGE_SUCCESS'
)
export const acceptInvitationProfilePageRequest = createAction(
    'ACCEPT_INVITATION_PROFILE_PAGE_REQUEST'
)
export const acceptInvitationProfilePageSuccess = createAction(
    'ACCEPT_INVITATION_PROFILE_PAGE_SUCCESS'
)
export const acceptInvitationProfilePageFailure = createAction(
    'ACCEPT_INVITATION_PROFILE_PAGE_FAILURE'
)
