import React from 'react';
import { forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable from 'material-table';
import globalFuncs from '../../utils/global-functions';
import './style.scss';

import UserModal from '../../Components/Modal/UserModal/UserModal';
import DeleteModal from '../../Components/Modal/DeleteModal';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';
import Snackbar from '@material-ui/core/Snackbar';

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
      currentView: 'add',
      userValue: {
        currentUser: '',
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        department: '',
        country: '',
        preferredLanguage: 'en-US',
        active: true,
        permissions: ''
      },
      snackBarOpen: false,
      deleteDialogOpen: false
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

  openModal(e, view, rowData) {
    if (rowData) {
      //  get the user roles for edit
      globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API + rowData.userName, 'get', this.props.userToken, {})
      .then(result => {
        if (!result) {
          // send error to modal
        } else {
          const permission = []
          result.map(userRole => {
            if (userRole.roleNames && userRole.roleNames.length) {
              userRole.roleNames.map((role) => {
                permission.push(userRole.appName + '_' + role);
              })
            }
          });

          this.setState({
            userValue: {
              currentUser: rowData.userName,
              firstName: rowData.firstName,
              lastName: rowData.lastName,
              email: rowData.email,
              title: rowData.title,
              country: rowData.country,
              preferredLanguage: rowData.preferredLanguage,
              active: rowData.active,
              permissions: permission
            }
          });
        }
      });
    }

    this.setState({
      open: true,
      enableField: true,
      currentView: view,
    });
  }

  closeModal() {
    this.resetModal();
  }

  resetModal() {
    this.setState({
      open: false,
      currentView: 'add',
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
    let jsonBody = {
      "firstName": this.state.userValue.firstName,
      "lastName": this.state.userValue.lastName,
      "email": this.state.userValue.email,
      "title": this.state.userValue.title,
      "preferredLanguage": 'en-US',
      "active": true,
      "sendEmail": true
    }

    globalFuncs.genericFetch(process.env.USERMANAGEMENT_API, 'post', this.props.userToken, jsonBody)
    .then(result => {
      if (result.error) {
        // send error to modal
      } else {
        // add roles
        let jsonBody;
        if (this.state.userValue.permissions.indexOf("6AD12264-46FA-8440-52AD1846BDF1_Admin") >= 0) {
          jsonBody = {
            "userName": result,
            "appName": '6AD12264-46FA-8440-52AD1846BDF1',
            "roleNames": ['Admin']
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'post', this.props.userToken, jsonBody)
          .then(result => {
            if (!result) {
              // send error to modal
            } else {

            }
          });
        }
          
        let rolesNames = [];
        if (this.state.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_EnhancedM&MView") >= 0) {
          rolesNames.push('EnhancedM&MView');
        }

        if (this.state.userValue.permissions.indexOf("35840EC2-8FA4-4515-AF4F-D90BD2A303BA_Enhanced M&M Edit") >= 0) {
          rolesNames.push('Enhanced M&M Edit');
        }

        if (rolesNames.length > 0) {
          jsonBody = {
            "userName": result,
            "appName": '35840EC2-8FA4-4515-AF4F-D90BD2A303BA',
            "roleNames": rolesNames
          }

          globalFuncs.genericFetch(process.env.USERMANAGEMENTUSERROLES_API, 'post', this.props.userToken, jsonBody)
          .then(result => {
            if (!result) {
              // send error to modal
            } else {

            }
          });
        }
      }
    })

    this.setState({
      users: [...this.state.users, this.state.userValue],
      currentView: 'add',
      enableField: false,
      open: false
    })
  }

  handleFormChange(e) {
    let currentUserValue = {...this.state.userValue};
    if (e.target.type == 'checkbox') {
      let targetIndex = currentUserValue["permissions"].indexOf(e.target.value);
      if (targetIndex < 0) {
        currentUserValue["permissions"].push(e.target.value);
      } else {
        currentUserValue["permissions"].splice(targetIndex, 1);
      }
    } else {
      currentUserValue[e.target.name] = e.target.value;
    }
    this.setState({userValue: currentUserValue});
  }

  handleClose = () => {
    this.setState({ open: false, deleteDialogOpen: false });
  };

  passwordResetLink() {
    let jsonBody = {
      "userName": this.state.userValue.currentUser
    }

    globalFuncs.genericFetch(process.env.USERMANAGEMENTRESET_API, 'PATCH', this.props.userToken, jsonBody)
    .then(result => {
      if (!result) {
        // show toast for success
        this.setState({
          snackBarOpen: true
        })
      } else {
        // send error to modal
      }
    })
  }

  handleCloseSnackBar() {
    this.setState({
      snackBarOpen: false
    })
  };

  deleteUser() {
    // pop up modal asking to confirm
    this.setState({
      open: false,
      deleteDialogOpen: true
    })

  }

  render() {
    return (
      <section className="">
        <div>
          <p>User Management <Button variant="contained" className="primary" onClick={(e) => this.openModal(e, 'add', '')}>Add</Button> </p>
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
              { title: 'Title', field: 'title'}
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
            onRowClick={(e, rowData) => this.openModal(e, 'edit', rowData)}
          />
        </div>
        
        <UserModal
          open={this.state.open}
          enableField={this.state.enableField}
          userValue={this.state.userValue}
          closeModal={() => this.closeModal()}
          addUser={() => this.addUser()}
          handleFormChange={(e) => this.handleFormChange(e)}
          handleClose={() => this.handleClose()}
          currentView={this.state.currentView}
          passwordResetLink={() => this.passwordResetLink()}
          deleteUser={() => this.deleteUser()}
        />

        <DeleteModal
          deleteDialogOpen={this.state.deleteDialogOpen}
          handleClose={() => this.handleClose()}
          userValue={this.state.userValue}
        />

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={4000}
          onClose={() => this.handleCloseSnackBar()}
          message="Password Reset Email Sent"
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => this.handleCloseSnackBar()}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />

      </section>
    );
  }
}