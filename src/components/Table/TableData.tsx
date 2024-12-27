import { Table, TableColumnsType, TableProps } from 'antd'
import TableTitle from './TableTitle';
import { useState } from 'react';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];


interface IProps {
    columns: TableColumnsType<any>;
    isLoading: boolean;
    dataSource: any[];
    current: number;
    pageSize: number;
    total: number;
    onChange: any;
    setFilterQuery: any,
    setSortQuery: any,
    scrollY?: number
    dataExport?: any[]
    hiddenBtnAdd?: boolean
    openAddNew?: () => void;
}


const TableData = (props: IProps) => {
    const { current, pageSize, total,
        columns, isLoading, dataSource,
        onChange, setFilterQuery, setSortQuery,
        dataExport, openAddNew, scrollY, hiddenBtnAdd }
        = props
    const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedIds(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys: selectedIds,
        onChange: onSelectChange,
    };

    return (
        <Table
            title={() => <TableTitle
                setFilterQuery={setFilterQuery}
                setSortQuery={setSortQuery}
                dataExport={dataExport}
                openAddNew={openAddNew}
                hiddenBtnAdd={hiddenBtnAdd}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
            />}
            loading={isLoading}
            columns={columns}
            dataSource={dataSource}
            onChange={onChange}
            rowSelection={rowSelection}
            rowKey={"_id"}
            pagination={{
                current: current,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                pageSizeOptions: [8, 15, 20, 50],
                showTotal: (total, range) => { return <div>{range[0]}-{range[1]} trên {total}rows</div> }
            }}
            scroll={{
                x: 'max-content',
                y: (scrollY ? scrollY : 55) * 8
            }}
        />
    )
}

export default TableData
