import React from 'react';
import { forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import MaterialTable from "material-table";
import globalFuncs from '../../utils/global-functions';
import './style.scss';

import UserModal from '../../Components/Modal/UserModal/UserModal';

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
      userList: [],
      open: false,
      enableField: false,
      userValue: {
        currentUser: '',
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        department: '',
        permissions: []
      },
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
              if(user.roles) user.roles = user.roles.join(', ');
              users.push(user);
            }
          });
        });
        
        this.setState({
          userList: users
        });
    });
    
  };

  openModal() {
    this.setState({
      open: true,
      enableField: true
    });
  }

  closeModal() {
    this.resetModal();
  }

  resetModal() {
    this.setState({
      open: false,
      modalStage: 1,
      userValue: {
        currentUser: '',
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        department: '',
        permissions: []
      }
    })
  }

  addUser(){
    this.state.userValue["currentUser"] = this.state.users.length;
    this.setState({
      users: [...this.state.users, this.state.userValue],
      currentView: 'User',
      enableField: false,
      open: false
    })
  }

  handleFormChange(e) {
    let currentUserValue = {...this.state.userValue};
    if (e.target.type == 'checkbox') {
      currentUserValue[e.target.name] = e.target.checked;
    } else {
      currentUserValue[e.target.name] = e.target.value;
    }
    this.setState({userValue: currentUserValue});
  }

  updateUser() {
    this.setState({currentView: 'User'})
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <section className="">
        <div>
          <p>User Management <Button variant="contained" className="primary" onClick={() => this.openModal()}>Add</Button> </p>
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
              { title: 'Permissions', field: 'roles' }
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
        
        <UserModal
          open={this.state.open}
          enableField={this.state.enableField}
          userValue={this.state.userValue}
          closeModal={() => this.closeModal()}
          addUser={() => this.addUser()}
          handleFormChange={(e) => this.handleFormChange(e)}
          updateUser={() => this.updateUser()}
          handleClose={() => this.handleClose()}
        />
      </section>
    );
  }
}