import { PAGE_SIZE_OPTIONS } from 'configuration/pagination'

export const getTablePaginationOptions = name => ({
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    showSizeChanger: true,
    showTotal: (total, range) =>
        `${range[0]} - ${range[1]} of ${total} Total ${name}`,
    position: 'bottom',
    style: {
        marginTop: '16px',
        marginBottom: '0',
    },
})

export const getTreemapPaginationOptions = name => ({
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    showSizeChanger: true,
    showTotal: (total, range) =>
        `${range[0]} - ${range[1]} of ${total} Total ${name}`,
    style: {
        marginTop: '16px',
        float: 'right',
    },
})
