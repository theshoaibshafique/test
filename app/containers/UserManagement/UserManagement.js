import React from 'react';
import { forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import MaterialTable from "material-table";
import globalFuncs from '../../utils/global-functions';
import './style.scss';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';

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

export default class UserManagement extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userList: []
    }
  }

  async componentDidMount() {
    const departments = await globalFuncs.genericFetch(process.env.DEPARTMENTFACILITY_API + '/' + this.props.facilityName, 'get', this.props.userToken, {})

    await globalFuncs.genericFetch(process.env.USERMANAGEMENT_API, 'get', this.props.userToken, {})
    .then(result => {
        const users = [];
        result.map(function(user) {
          departments.map(function(department){
            if (department.departmentName === user.departmentName) {
              user.departmentName = department.departmentTitle;
              users.push(user);
            }
          });
        });
        
        this.setState({
          userList: users
        });
    });
    
  };

  handleClick() {
    alert('1');
  }

  render() {
    return (
      <section className="">
        <div>
          <p>User Management <Button color='primary' onClick={() => this.handleClick()}>Add</Button> </p>
        </div>

        <div>
          <MaterialTable
            title=""
            columns={[
              { title: 'User Name', field: 'userName', hidden: true },
              { title: 'First Name', field: 'firstName' },
              { title: 'Last Name', field: 'lastName' },
              { title: 'Email', field: 'email' },
              { title: 'Department', field: 'departmentName' },
              { title: 'Permissions', field: 'preferredLanguage' }
            ]}
            options={{ 
              pageSize: 10,
              pageSizeOptions: [ 5, 10, 25 ,50, 75, 100 ],
              search: true,
              paging: true,
              searchFieldAlignment: 'left'
            }}
            data={this.state.userList}
            icons={tableIcons}
          />
        </div>
      </section>
    );
  }
}