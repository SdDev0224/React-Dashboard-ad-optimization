/* global drift */
export const showDriftSidebar = e => {
    e.preventDefault()
    drift.on('ready', api => {
        api.sidebar.open()
    })
}
