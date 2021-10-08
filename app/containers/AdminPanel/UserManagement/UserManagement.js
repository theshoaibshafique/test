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
import { makeSelectProductRoles } from '../../App/selectors';
import { useSelector } from 'react-redux';

const tableIcons = {
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />)
};
function getRoleMapping(roles, productRoles) {
    let result = {};
    for (var product of productRoles) {
        if (roles.hasOwnProperty(product.admin)){
            result = { ...result, [product.name]: `Owner` };
        } else if (roles.hasOwnProperty(product.reader)){
            result = { ...result, [product.name]: `Viewer` };
        } else {
            result = { ...result, [product.name]: "No Access" }
        }
    }
    return result;

}

export default function UserManagement(props) {
    const { users, accessLevel, assignableRoles } = props;
    const productRoles = useSelector(makeSelectProductRoles());
    const USERS = users?.map((u) => {
        const { roles, firstName, lastName } = u;

        return { ...u, ...getRoleMapping(roles, Object.values(productRoles)), name: `${firstName} ${lastName}` }
    })
    
    if (!USERS) {
        return <LoadingIndicator />
    }
    const generateRoleColumn = (title) => {
        return {
            title, field: title, render: rowData => RenderRoleIcon(rowData, title), sorting:false
        }
    };
    return (
        <div className="user-management">
            <MaterialTable
                title=""
                columns={[
                    { title: "User Name", field: 'userName', hidden: true },
                    { title: "Facility ID", field: 'facilityId', hidden: true },
                    { title: "User ID", field: 'userId', hidden: true },
                    { title: "Email", field: 'email' },
                    { title: "Name", field: 'name', defaultSort: 'asc' },
                    { title: "Title", field: 'title' },
                    generateRoleColumn("Efficiency"),
                    generateRoleColumn("eM&M"),
                    generateRoleColumn("Case Discovery"),
                    generateRoleColumn("Surgical Safety Checklist"),
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
                icons={tableIcons}
                //   onRowClick={(e, rowData) => this.openModal(e, 'edit', rowData)}
                components={{
                    Container: props => <Paper {...props} elevation={0} className="table-container" />,
                    Body: props => <MTableBody {...props}  />,
                    Header: props => <TableHeader {...props} />
                }}
            />
        </div>
    )
}

function RenderRoleIcon(rowData, field) {
    return (
        <span className={`role-cell ${rowData[field]}`}>{rowData[field]}</span>
    )
}

function TableHeader(props) {
    const { headerStyle, scrollWidth, columns, orderBy, orderDirection, onOrderChange } = props;

    console.log()
    const headers = columns.filter((c) => !c.hidden);
    console.log(props)
    return (
        <TableHead className="table-header">
            <TableRow >
                {headers?.map((c) => {
                    const index = columns?.findIndex((col) => col.title == c.title);
                    const isSortable = c?.sorting ?? true;
                    return (
                        <TableCell
                            style={{ ...headerStyle, backgroundColor: '#EEFAFF', width: scrollWidth / headers?.length }}
                        >
                            {isSortable ? (
                                <TableSortLabel
                                active={index == orderBy}
                                direction={index == orderBy ? orderDirection : 'asc'}
                                onClick={() => onOrderChange(index, orderBy == index && orderDirection == 'asc' ? 'desc' : 'asc')}
                            >
                                {c.title}
                            </TableSortLabel>
                            ) : (
                                <span>{c.title}</span>
                            )}
                        </TableCell>
                    )
                })}
            </TableRow>
        </TableHead>
    )
}