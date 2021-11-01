import React, { forwardRef, useEffect, useState } from 'react';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';
import MaterialTable, { MTableBody, MTableCell, MTableToolbar } from 'material-table';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';
import './style.scss';
import { Button, MenuItem, Paper, TableHead, TableRow, TableSortLabel, Menu, ListItemText, ListItemIcon, Checkbox } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowDropDown } from '@material-ui/icons';
import Icon from '@mdi/react'
import { mdiCheckboxBlankOutline, mdiCheckBoxOutline, mdiLockOutline } from '@mdi/js';
import { selectAssignableRoles, selectFilters, selectUsers } from '../../App/store/UserManagement/um-selectors';
import { setFilters } from '../../App/store/UserManagement/um-actions';
import { mdiDeleteOutline, mdiPlaylistEdit } from '@mdi/js';
import { AddEditUserModal, DeleteUserModal, UMLearnMore } from './Modals';
import { LightTooltip } from '../../../components/SharedComponents/SharedComponents';
import { CD_PRODUCT_ID, EFF_PRODUCT_ID, EMM_PRODUCT_ID, SSC_PRODUCT_ID } from '../../../constants';


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
const areEqual = (prevProps, nextProps) => {
    return JSON.stringify(prevProps.columns) == JSON.stringify(nextProps.columns)
};
const MemoTable = React.memo(props => {
    const { columns } = props;
    const users = useSelector(selectUsers());
    const [USERS, setUsers] = useState(users);
    useEffect(() => {
        if (JSON.stringify(users) != JSON.stringify(USERS)) {
            setUsers(users);
        }
    }, [users, columns])
    if (!USERS) {
        return <LoadingIndicator />
    }
    //Force undefined with to prevent infinite loop
    return <MaterialTable {...props} columns={[...columns.map((c) => { return { ...c, tableDef: { width: undefined } } })]} data={USERS} />
}, areEqual)

export const SSTUsers = props => {
    const assignableRoles = useSelector(selectAssignableRoles());
    const [selectedUser, setSelectedUser] = useState(false);
    const [deleteUser, setDeleteUser] = useState(false);
    return (
        <div className="sst-user-management">
            <MemoTable
                title=""
                columns={[
                    { title: "User Name", field: 'userName', hidden: true },
                    { title: "Facility ID", field: 'facilityId', hidden: true },
                    { title: "User ID", field: 'userId', hidden: true },
                    { title: "Email", field: 'email', hidden: true },
                    { title: "Name", field: 'name', defaultSort: 'asc' },
                    { title: "Title", field: 'title' },
                    ...generateProductColumns(assignableRoles)
                ]}
                actions={[
                    {
                        icon: 'edit',
                        tooltip: 'Edit User',
                        onClick: (user) => setSelectedUser(JSON.parse(JSON.stringify(user)))
                    },
                    {
                        icon: 'delete',
                        tooltip: 'Delete User',
                        onClick: (user) => setDeleteUser(user)
                    },
                    {
                        icon: 'add',
                        tooltip: 'Add User',
                        isFreeAction: true,
                        onClick: (user) => setSelectedUser(true)
                    }
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
                        fontSize: 14,
                        width: 'unset'
                    },
                    maxBodyHeight: "calc(100vh - 250px)",
                    actionsColumnIndex: -1
                }}
                // data={USERS}
                icons={tableIcons}
                components={{
                    Container: props => <Paper {...props} elevation={0} className="table-container" />,
                    Body: props => <TableBody {...props} />,
                    Header: props => <TableHeader {...props} />,
                    Action: props => <TableActions {...props} />,
                    Toolbar: props => <MTableToolbar {...props} />,
                    Cell: props => <TableCell {...props} />

                }}
            />
            <AddEditUserModal
                open={Boolean(selectedUser)}
                user={selectedUser}
                toggleModal={setSelectedUser} />
            <DeleteUserModal
                open={Boolean(deleteUser)}
                user={deleteUser}
                toggleModal={setDeleteUser}
            />
        </div>
    )
}

const generateProductColumns = (productRoles) => {
    const result = []
    for (const [productId, product] of Object.entries(productRoles).sort((a, b) => a[1]?.productName?.localeCompare?.(b[1]?.productName))) {
        result.push(generateRoleColumn(product?.productName, productId))
    }
    return result;
}

function generateRoleColumn(title, productId) {

    return {
        title, field: title, render: rowData => <RenderRoleIcon rowData={rowData} field={title} productId={productId} />, sorting: false, filtering: false, productId
    }
};
const RenderRoleIcon = props => {
    const { rowData, field, productId } = props;
    const assignableRoles = useSelector(selectAssignableRoles());
    const disabled = !assignableRoles?.[productId]?.isSubscribed;
    if (disabled) {
        return (
            <span className="disabled-role"></span>
        )
    }
    const roles = Object.values(rowData?.sstDisplayRoles?.[field] || {}).join(", ")
    return (
        <span className={`role-list`} title={roles}>{roles || "No Access"}</span>
    )
}
const TableActions = (props) => {
    const { action, data } = props;
    let icon = null;
    switch (action?.icon) {
        case 'edit':
            icon = mdiPlaylistEdit;
            break;
        case 'delete':
            icon = mdiDeleteOutline;
            break;
        case 'add':
            return (
                <Button disableElevation disableRipple
                    variant="contained" className="primary add-user-button"
                    onClick={() => action?.onClick?.()}>
                    Add User
                </Button>
            )
        case 'learn-more':
            return (
                <span className="link learn-more underline" onClick={() => action?.onClick?.()}>
                    Learn more about user management
                </span>
            )
    }
    return (
        <span className={`action-icon pointer`} title={action?.tooltip} onClick={() => action?.onClick?.(data)}>
            <Icon className={`${action?.icon}`} color="#828282" path={icon} size={'24px'} />
        </span>
    )
}
const TableCell = (props) => {
    const { columnDef, scrollWidth } = props;
    const { tableData } = columnDef || {}
    //We need to manually override the width because theres an inherit bug where width is set on an infinite loop
    return (
        <MTableCell className="sst-admin-cell" {...props} columnDef={{ ...columnDef, tableData: { ...tableData, width: `${scrollWidth / 6}px` } }} />
    )
}
const TableBody = (props) => {
    const filters = useSelector(selectFilters());
    const { renderData } = props;
    const [USERS, setUsers] = useState(renderData);
    useEffect(() => {
        if (filters || renderData) {
            setUsers(renderData?.filter((u) => Object.entries(u?.sstDisplayRoles || {})?.every(([roleName, value]) => {
                return Object.values(value || {})?.every((v) => filters?.[roleName]?.has(v));
            })))
        }
    }, [renderData, filters])

    return (
        <>
            <MTableBody {...props} renderData={USERS} />
            <caption className="table-footer subtle-text">
                <div>
                    <span></span>
                    <span>End of List</span>
                    <span>{`${USERS?.length} of ${USERS?.length}`}</span>
                </div>
            </caption>
        </>
    )
}

function TableHeader(props) {
    const { headerStyle, scrollWidth, columns, orderBy, orderDirection, onOrderChange, dataCount } = props;
    const headers = [...columns, { title: 'Actions', action: true }].filter((c) => !c?.hidden);
    const assignableRoles = useSelector(selectAssignableRoles());
    const dispatch = useDispatch();
    useEffect(() => {
        if (assignableRoles) {
            const filters = {};
            Object.values(assignableRoles ?? {}).map((product) => {
                const { productName, productRoles } = product;
                filters[productName] = new Set([...Object.values(productRoles || {})?.map((role) => (
                    role?.roleName
                )), "No Access"])
            })
            dispatch(setFilters(filters))
        }
    }, [assignableRoles])


    return (
        <>
            <TableHead className="table-header subtext">
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
                            content = <FilterRole title={c.title} disabled={!assignableRoles?.[c?.productId]?.isSubscribed} productId={c?.productId} />
                        }
                        return (
                            <TableCell
                                className="header-cell"
                                style={{ ...headerStyle, backgroundColor: '#EEFAFF', width: width, whiteSpace: 'nowrap' }}
                            >
                                {content}
                            </TableCell>
                        )
                    })}
                </TableRow>
            </TableHead>
        </>
    )
}

function FilterRole(props) {
    const { title, disabled, productId } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const assignableRoles = useSelector(selectAssignableRoles());
    const productRoles = assignableRoles?.[productId]?.productRoles || {}
    const filterRoles = Object.values(productRoles)?.map((r) => r?.roleName).sort() || [];
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (e) => {
        setAnchorEl(null);
    };
    if (disabled) {
        return (

            <span className="disabled-header">
                <span>{title}</span>
                <LightTooltip
                    title={"Not subscribed"}
                    interactive arrow placement="top" fontSize="small">
                    <Icon path={mdiLockOutline} size={'22px'} />
                </LightTooltip>
            </span>


        )
    }
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
                {filterRoles?.map((r) => (
                    <RoleOption label={r} key={r} parent={title} />
                ))}
                <RoleOption label="No Access" parent={title} />
            </Menu>
        </React.Fragment>
    )
}
function RoleOption(props) {
    const dispatch = useDispatch();
    const { label, onClick, parent } = props;
    const filters = useSelector(selectFilters()) || {};
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