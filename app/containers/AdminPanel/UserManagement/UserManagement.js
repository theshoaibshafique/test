import React, { forwardRef, useEffect, useReducer, useState } from 'react';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';
import MaterialTable, { MTableBody, MTableFilterRow, MTableHeader } from 'material-table';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';
import './style.scss';
import { Button, MenuItem, Paper, TableCell, TableHead, TableRow, TableSortLabel, Menu, ListItemText, ListItemIcon, Checkbox, FormControlLabel } from '@material-ui/core';
import { makeSelectProductRoles } from '../../App/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowDropDown } from '@material-ui/icons';
import Icon from '@mdi/react'
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';
import { selectFilters, selectUsers } from '../../App/store/UserManagement/um-selectors';
import { setFilters } from '../../App/store/UserManagement/um-actions';
import { mdiDeleteOutline, mdiPlaylistEdit } from '@mdi/js';


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


export const UserManagement = props => {
    const { users, accessLevel, assignableRoles } = props;
    const productRoles = useSelector(makeSelectProductRoles());
    const USERS = users?.map((u) => {
        const { roles, firstName, lastName } = u;

        return { ...u, displayRoles: getRoleMapping(roles, Object.values(productRoles)), name: `${firstName} ${lastName}` }
    })


    if (!users) {
        return <LoadingIndicator />
    }


    return (
        <div className="user-management">
            <MaterialTable
                title=""
                columns={[
                    { title: "User Name", field: 'userName', hidden: true },
                    { title: "Facility ID", field: 'facilityId', hidden: true },
                    { title: "User ID", field: 'userId', hidden: true },
                    // { title: "Email", field: 'email' },
                    { title: "Name", field: 'name', defaultSort: 'asc' },
                    { title: "Title", field: 'title' },
                    generateRoleColumn("Efficiency"),
                    generateRoleColumn("eM&M"),
                    generateRoleColumn("Case Discovery"),
                    generateRoleColumn("Surgical Safety Checklist"),
                ]}
                actions={[
                    {
                        icon: 'edit',
                        tooltip: 'Edit User',
                        onClick: () => alert('edit')
                    },
                    {
                        icon: 'delete',
                        tooltop: 'Delete User',
                        onClick: () => alert('delete')
                    },
                ]}
                options={{
                    search: true,
                    paging: false,
                    searchFieldAlignment: 'left',
                    searchFieldStyle: { marginLeft: -40, height: 40, width: 307 },
                    thirdSortClick: false,
                    draggable: false,
                    searchFieldVariant: 'outlined',
                    rowStyle: {
                        fontFamily: "Noto Sans",
                        fontSize: 14
                    },
                    maxBodyHeight: "calc(100vh - 300px)",
                    actionsColumnIndex: -1
                }}
                data={USERS}
                icons={tableIcons}
                //   onRowClick={(e, rowData) => this.openModal(e, 'edit', rowData)}
                components={{
                    Container: props => <Paper {...props} elevation={0} className="table-container" />,
                    Body: props => <TableBody {...props} />,
                    Header: props => <TableHeader {...props} />,
                    Action: props => <TableActions {...props} />

                }}
            />
        </div>
    )
}
function getRoleMapping(roles, productRoles) {
    let result = {};
    for (var product of productRoles) {
        if (roles.hasOwnProperty(product.admin)) {
            result[product.name] = `Full Access`;
        } else if (roles.hasOwnProperty(product.reader)) {
            result[product.name] = `View Only`;
        } else {
            result[product.name] = "No Access";
        }
    }
    return result;
}
function generateRoleColumn(title) {

    return {
        title, field: title, render: rowData => RenderRoleIcon(rowData, title), sorting: false, filtering: false
    }
};
function RenderRoleIcon(rowData, field) {
    return (
        <span className={`role-cell ${rowData?.displayRoles[field]}`}>{rowData?.displayRoles[field]}</span>
    )
}
const TableActions = (props) => {
    const { action } = props;
    let icon = null;
    switch (action?.icon) {
        case 'edit':
            icon = mdiPlaylistEdit;
            break;
        case 'delete':
            icon = mdiDeleteOutline;
    }
    return <span className={`action-icon pointer`}>
        <Icon className={`${action?.icon}`} color="#828282" path={icon} size={'24px'} />
    </span>
}
const TableBody = (props) => {
    const filters = useSelector(selectFilters());
    const { renderData } = props;
    const [USERS, setUsers] = useState(renderData);

    useEffect(() => {
        if (filters && renderData) {
            setUsers(renderData?.filter((u) => Object.entries(u?.displayRoles)?.every(([k, v]) => {
                return filters[k]?.size > 0 ? filters[k]?.has(v) : true;;
            })))
        }
    }, [renderData, filters])

    return (
        <>
            <MTableBody {...props} renderData={USERS} />
        </>
    )
}
function TableHeader(props) {
    const { headerStyle, actions, scrollWidth, columns, orderBy, orderDirection, onOrderChange } = props;
    const headers = [...columns, { title: 'Actions', action: true }].filter((c) => !c?.hidden);
    return (
        <TableHead className="table-header">
            <TableRow >
                {headers?.map((c) => {

                    const index = columns?.findIndex((col) => col.title == c?.title);
                    const isSortable = c?.sorting ?? true;
                    const isAction = c?.action ?? false;
                    var width = scrollWidth / headers?.length;
                    var content = ''
                    if (isAction) {
                        content = c?.title;
                        width = 80
                    } else if (isSortable) {
                        content = <TableSortLabel
                            active={index == orderBy}
                            direction={index == orderBy ? orderDirection : 'asc'}
                            onClick={() => onOrderChange(index, orderBy == index && orderDirection == 'asc' ? 'desc' : 'asc')}
                        >
                            {c.title}
                        </TableSortLabel>
                    } else {
                        content = <FilterRole title={c.title} />
                    }
                    return (
                        <TableCell
                            style={{ ...headerStyle, backgroundColor: '#EEFAFF', width: width, whiteSpace: 'nowrap' }}
                        >
                            {content}
                        </TableCell>
                    )
                })}
            </TableRow>
        </TableHead>
    )
}

function FilterRole(props) {
    const { title } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (e) => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <span
                className="pointer"
                onClick={handleClick}
            >
                {title}<ArrowDropDown />
            </span>
            <Menu
                anchorEl={anchorEl}
                open={open}
                keepMounted
                onClose={handleClose}
            >
                <RoleOption label="Full Access" parent={title} />
                <RoleOption label="View Only" parent={title} />
                <RoleOption label="No Access" parent={title} />
            </Menu>
        </React.Fragment>
    )
}
function RoleOption(props) {
    const dispatch = useDispatch();
    const { label, onClick, parent } = props;
    const filters = useSelector(selectFilters(parent)) || {};
    //We maintain an internal check state to help with rendering 
    const [check, setCheck] = useState(filters[parent]?.has(label) || false);
    const handleFilter = (e, v) => {
        const productFilter = filters[e] ?? new Set();
        if (productFilter.has(v)) {
            productFilter.delete(v);
        } else {
            productFilter.add(v);
        }
        filters[e] = productFilter;
        dispatch(setFilters(filters));
        setCheck(filters[parent]?.has(label));

    }
    return (
        <MenuItem key={parent + label} onClick={() => { handleFilter(parent, label) }} style={{ padding: "0px 14px 0 0 " }}>
            <ListItemIcon style={{ minWidth: 30 }}>
                <Checkbox
                    disableRipple
                    disabled
                    icon={<Icon path={mdiCheckboxBlankOutline} size={'18px'} />}
                    checkedIcon={<Icon path={mdiCheckBoxOutline} size={'18px'} />}
                    className="SST-Checkbox"
                    checked={check}
                />
            </ListItemIcon>
            <ListItemText>
                {label}
            </ListItemText>
        </MenuItem>
    )
}