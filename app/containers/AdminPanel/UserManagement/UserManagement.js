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
import { Button, MenuItem, Paper, TableCell, TableHead, TableRow, TableSortLabel, Menu, ListItemText, ListItemIcon, Checkbox } from '@material-ui/core';
import { makeSelectProductRoles } from '../../App/selectors';
import { useSelector } from 'react-redux';
import { ArrowDropDown } from '@material-ui/icons';
import Icon from '@mdi/react'
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline } from '@mdi/js';


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

const filterReducer = (state, event) => {
    return {
        ...state,
        ...event
    }
}

export default function UserManagement(props) {
    const { users, accessLevel, assignableRoles } = props;
    const productRoles = useSelector(makeSelectProductRoles());
    const [filters, setFilters] = useReducer(filterReducer, {

    })
    const USERS = users?.map((u) => {
        const { roles, firstName, lastName } = u;

        return { ...u, displayRoles: getRoleMapping(roles, Object.values(productRoles)), name: `${firstName} ${lastName}` }
    }).filter((u) => Object.entries(u?.displayRoles)?.every((k, v) => filters[k + v] ?? true))
    console.log(USERS?.slice(0, 10));
    console.log(filters);
    if (!USERS) {
        return <LoadingIndicator />
    }
    const handleFilter = (e, v) => {
        setFilters({ [e + v]: !filters[e + v] })
    }

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
                }}
                data={USERS}
                icons={tableIcons}
                //   onRowClick={(e, rowData) => this.openModal(e, 'edit', rowData)}
                components={{
                    Container: props => <Paper {...props} elevation={0} className="table-container" />,
                    Body: props => <MTableBody {...props} />,
                    Header: props => <TableHeader {...props} filters={filters} handleFilter={handleFilter} />
                }}
            />
        </div>
    )
}
function getRoleMapping(roles, productRoles) {
    let result = {};
    for (var product of productRoles) {
        if (roles.hasOwnProperty(product.admin)) {
            result[product.name] = `Owner`;
        } else if (roles.hasOwnProperty(product.reader)) {
            result[product.name] = `Viewer`;
        } else {
            result[product.name] = "No Access";
        }
    }
    return result;
}
function generateRoleColumn(title) {
    return {
        title, field: title, render: rowData => RenderRoleIcon(rowData, title), sorting: false
    }
};
function RenderRoleIcon(rowData, field) {
    return (
        <span className={`role-cell ${rowData?.displayRoles[field]}`}>{rowData?.displayRoles[field]}</span>
    )
}

function TableHeader(props) {
    const { headerStyle, scrollWidth, columns, orderBy, orderDirection, onOrderChange, filters, handleFilter } = props;

    const headers = columns.filter((c) => !c.hidden);
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
                                <FilterRole title={c.title} handleFilter={handleFilter} filters={filters} />
                            )}
                        </TableCell>
                    )
                })}
            </TableRow>
        </TableHead>
    )
}

function FilterRole(props) {
    const { title, handleFilter, filters } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
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
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <RoleOption label="Owner" parent={title} filters={filters} onClick={handleClose} handleFilter={handleFilter} />
                <RoleOption label="Viewer" parent={title} filters={filters} onClick={handleClose} handleFilter={handleFilter} />
                <RoleOption label="No Access" parent={title} filters={filters} onClick={handleClose} handleFilter={handleFilter} />
            </Menu>
        </React.Fragment>
    )
}
function RoleOption(props) {
    const { label, handleFilter, filters, onClick, parent } = props;
    console.log("wow", parent, label, filters, filters[parent + label])
    return (
        <MenuItem onClick={() => { handleFilter(parent, label) }} style={{ padding: "0px 14px 0 0 " }}>
            <ListItemIcon style={{ minWidth: 30 }}>
                <Checkbox
                    disableRipple
                    disabled
                    icon={<Icon path={mdiCheckboxBlankOutline} size={'18px'} />}
                    checkedIcon={<Icon path={mdiCheckBoxOutline} size={'18px'} />}
                    className="SST-Checkbox"
                    checked={filters[parent + label]}
                />
            </ListItemIcon>
            <ListItemText>
                {label}
            </ListItemText>
        </MenuItem>
    )
}