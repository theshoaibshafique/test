import React from 'react';
import './style.scss';
import ReactTable from "react-table";
import UserModal from '../../Modal/UserModal/UserModal';
import Button from '@material-ui/core/Button';
import Dialog from '../../ConfirmDialog/ConfirmDialog';

class UserList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="User-Global-View">
          <div className="right-align" style={{margin: '16px 0px'}}>
            <Button variant="contained" className="primary" onClick={this.props.openModal}>Add User</Button>
          </div>
          <ReactTable
            data={this.props.users}
            columns={this.props.columns}
            showPagination={false}
            minRows={2}
          />
          <UserModal
            open={this.props.open}
            enableField={this.props.enableField}
            userValue={this.props.userValue}
            closeModal={this.props.closeModal}
            addUser={this.props.addUser}
            handleFormChange={this.props.handleFormChange}
            updateUser={this.props.updateUser}
          />
          <Dialog
            dialogOpen={this.props.deleteDialogOpen}
            dialogTitle=""
            dialogText={`Are you sure you want to delete user ` + this.props.deleteUserName + `?`}
            cancelText="Cancel"
            confirmText="Delete"
            handleCancel={this.props.handleCancel}
            handleConfirm={this.props.handleConfirm}
          />
      </div>
    );
  }
}

export default UserList;
