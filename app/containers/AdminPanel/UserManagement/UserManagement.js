import React, { forwardRef, useEffect, useReducer, useState } from 'react';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';
import MaterialTable, { MTableBody, MTableHeader } from 'material-table';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';
import './style.scss';
import { Paper, TableCell, TableHead, TableRow, TableSortLabel } from '@material-ui/core';

export default function UserManagement(props) {
    const { users, accessLevel, assignableRoles } = props;
    const USERS = users?.map((u) => { return { ...u, name: `${u.firstName} ${u.lastName}` } })
    if (!USERS) {
        return <LoadingIndicator />
    }
    console.log(accessLevel, assignableRoles)
    return (
        <div className="user-management">
            <MaterialTable
                title=""
                columns={[
                    { title: "User Name", field: 'userName', hidden: true },
                    { title: "Name", field: 'name', defaultSort: 'asc' },
                    { title: "Email", field: 'email', hidden: true },
                    { title: "Title", field: 'title' }
                ]}
                options={{
                    search: true,
                    paging: false,
                    searchFieldAlignment: 'left',
                    searchFieldStyle: { marginLeft: -24, height: 40, width: 307 },
                    thirdSortClick: false,
                    draggable: false,
                    searchFieldVariant: 'outlined',
                    rowStyle: {
                        fontFamily: "Noto Sans",
                        fontSize: 14
                    },
                    maxBodyHeight: "calc(100vh - 300px)",
                    // headerStyle: {
                    //     position: "sticky",
                    //     top: "0"
                    // },
                }}
                data={USERS}
                icons={getTableIcons()}
                //   onRowClick={(e, rowData) => this.openModal(e, 'edit', rowData)}
                components={{
                    Container: props => <Paper {...props} elevation={0} />,
                    Body: props => <MTableBody {...props} style={{ background: 'black' }} />,
                    Header: props => <TableHeader {...props} />
                }}
            />
        </div>
    )
}
function getTableIcons() {
    const tableIcons = {
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} onClick={() => this.logClick('first-page')} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} onClick={() => this.logClick('last-page')} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} onClick={() => this.logClick('next-page')} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} onClick={() => this.logClick('previous-page')} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} onClick={() => this.logClick('clear-search')} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />)
    };
    return tableIcons
}

function TableHeader(props) {
    const { headerStyle, scrollWidth, columns, orderBy, orderDirection, onOrderChange } = props;
    const headers = columns.filter((c) => !c.hidden);
    return (
        <TableHead className="table-header">
            <TableRow >
                {headers?.map((c) => {
                    const index = columns?.findIndex((col) => col.title == c.title);
                    return (
                        <TableCell
                            style={{ ...headerStyle, backgroundColor: '#fff', width: scrollWidth / headers?.length }}
                        >
                            <TableSortLabel
                                active={index == orderBy}
                                direction={index == orderBy ? orderDirection : 'asc'}
                                onClick={() => onOrderChange(index, orderBy == index && orderDirection == 'asc' ? 'desc' : 'asc')}
                            >
                                {c.title}
                            </TableSortLabel>
                        </TableCell>
                    )
                })}
            </TableRow>
        </TableHead>
    )
}