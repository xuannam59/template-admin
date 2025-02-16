import { Table, TableColumnsType, TableProps } from 'antd'
import TableTitle from './TableTitle';
import React, { useState } from 'react';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];


interface IProps {
    isLoading: boolean;
    api: string
    columns: TableColumnsType<any>;
    dataSource: any[];
    setFilterQuery: (value: string) => void,
    setCurrent: (value: number) => void;
    setSortQuery: (value: string) => void,
    current?: number;
    pageSize?: number;
    total?: number;
    onChange?: any;
    scrollY?: number
    dataExport?: any[]
    hiddenBtnAdd?: boolean
    openAddNew?: () => void;
    checkStrictly?: boolean; // chọn các phần tử con khi chọn phần tử cha
}


const TableData = (props: IProps) => {
    const { current, pageSize, total,
        columns, isLoading, dataSource,
        onChange, setFilterQuery, setSortQuery,
        dataExport, openAddNew, scrollY,
        hiddenBtnAdd, checkStrictly, setCurrent, api }
        = props
    const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedIds(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys: selectedIds,
        onChange: onSelectChange,
        checkStrictly: checkStrictly ? false : true
    };

    return (
        <Table
            title={() => <TableTitle
                api={api}
                setFilterQuery={setFilterQuery}
                setSortQuery={setSortQuery}
                setCurrent={setCurrent}
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
            rowKey="_id"
            pagination={{
                current: current,
                pageSize: pageSize,
                total: total,
                showSizeChanger: pageSize ? true : false,
                pageSizeOptions: [8, 15, 20, 50],
                showTotal: (total, range) => { return <div>{range[0]}-{range[1]} trên {total} rows</div> }
            }}
            scroll={{
                x: 'max-content',
                y: (scrollY ? scrollY : 55) * 8
            }}
        />
    )
}

export default TableData
