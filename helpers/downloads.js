import fileDownload from 'js-file-download'

import moment from 'utilities/moment'

export const downloadFile = (data, filename) => fileDownload(data, filename)

export const downloadCsv = (data, filename_identifier) =>
  downloadFile(
    data,
    `files-${filename_identifier}-${moment().format('YYYY-MM-DD')}.csv`
  )
