import React from 'react';
import { userService } from '@/_services';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authenticationService } from '@/_services';

let currentUser = authenticationService.currentUserValue;
let editedUser = {};

class AdminPage extends React.Component {

    showForm() {//When clicking on Create New user, hide the list and show the form
        document.getElementById('user-form-container').style.display = 'block';
        document.getElementById('admin-container').style.display = 'none';
    }

    editUser(e) {//When clicking on Edit user
        for (let i = 0; i < this.state.users.length; i++) {//Going through list of users
            if (this.state.users[i].id == e.target.parentElement.getAttribute("data-key")) {//If id is the same as the clicked one
                editedUser = this.state.users[i];//Save the user on a var
            }
        }
        //Hide list and new user form. Show edit user form
        document.getElementById('user-form-container').style.display = 'none';
        document.getElementById('admin-container').style.display = 'none';
        document.getElementById('edit-user-form-container').style.display = 'block';
    }

    deleteUser(e) {//When clicking on Delete user
        if (e.target.parentElement.getAttribute("data-key") == currentUser.id) {//If the id of the current user is the same as the clicked one
            alert('Cannot delete your own user.');//Show error message
        }
        else {
            for (let i = 0; i < this.state.users.length; i++) {//Go though list of users
                if (this.state.users[i].id == e.target.parentElement.getAttribute("data-key")) {//If the id of the user is the same as the clicked one
                    userService.setRemoveUser(this.state.users[i]);
                    userService.getAll().then(users => this.setState({ users }));
                    //this.state.users.splice(i,1);//Delete that user from the list
                }
            }
        }
    };

    cancelAddUser() {//Clicking on Cancel button in the New User form. Hide the form and show the list
        document.getElementById('user-form-container').style.display = 'none';
        document.getElementById('admin-container').style.display = 'block';
    }

    cancelEditUser() {//Clicking on Cancel button in the Edit user form. Hide the form and show the list
        document.getElementById('admin-container').style.display = 'block';
        document.getElementById('edit-user-form-container').style.display = 'none';
    }

    constructor(props) {
        super(props);

        this.state = {
            users: null
        };
    }

    componentDidMount() {//Get the users
        userService.getAll().then(users => this.setState({ users }));
        currentUser = authenticationService.currentUserValue;//Logged User
    }

    render() {
        const { users } = this.state;
        return (
            <div>
                <div id="admin-container">
                    <h1>Admin Page</h1>
                    <p>Create, edit or remove users and roles</p>
                    <div>
                        List of users:
                        {users &&
                            <ul>
                                {users.map(user =>
                                    <li className="user" key={user.id} data-key={user.id}><strong>{user.id} {user.role}:</strong> {user.firstName} {user.lastName} &emsp;
                                        <a href="#" className="navbar-brand" onClick={this.editUser.bind(this)}>Edit</a>&emsp; 
                                        <a href="#" className="navbar-brand" onClick={this.deleteUser.bind(this)}>Delete</a>
                                    </li>
                                    
                                )}
                            </ul>
                        }
                    </div>
                    <a href="#" className="btn btn-primary" onClick={this.showForm}>Create New</a><br/><br/>
                </div>
                
                <div id="user-form-container" style={{display: "none"}}>
                    <Formik

                    initialValues={{
                        username: '',
                        password: '',
                        firstName: '',
                        lastName: '',
                        email: ''

                    }}
                    validationSchema={Yup.object().shape({
                        username: Yup.string().required('Username is required'),
                        password: Yup.string().required('Password is required'),
                        firstName:Yup.string().required('First Name is required'),
                        lastName: Yup.string().required('Last Name is required'),
                        role: Yup.string(),
                        email: Yup.string().required('Email is required'),
                    })}
                    onSubmit={({ username, password, firstName, lastName, role, email}, actions) => {

                        let lastID = users[users.length-1].id;
                        const userRole = document.getElementById('new-user-role').value;
                        let newUser = { id: lastID + 1, username: username, password: password, firstName: firstName, lastName: lastName, role: userRole, email: email }
                        userService.setNewUser(newUser);
                        userService.getAll().then(users => this.setState({ users }));
                        document.getElementById('admin-container').style.display = 'block';
                        document.getElementById('user-form-container').style.display = 'none';
                        actions.resetForm();
                    }}
                    render={({ errors, status, touched, isSubmitting }) => (
                        <Form>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select id="new-user-role" name="role" className={'form-control' + (errors.role && touched.role ? ' is-invalid' : '')}>
                                    <option value="Admin" label="Admin" />
                                    <option value="User" label="User" />
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>&emsp;
                                {isSubmitting}
                                <button type="button" className="btn btn-secondary" onClick={this.cancelAddUser.bind(this)}>Cancel</button>
                            </div>
                            {status &&
                                <div className={'alert alert-danger'}>{status}</div>
                            }
                        </Form>
                    )}
                />
                </div>
                <div id="edit-user-form-container" style={{display: "none"}}>
                    <Formik

                    initialValues={{
                        password: '',
                        firstName: '',
                        lastName: '',
                        email: ''
                    }}
                    validationSchema={Yup.object().shape({
                        password: Yup.string().required('Password is required'),
                        firstName:Yup.string().required('First Name is required'),
                        lastName: Yup.string().required('Last Name is required'),
                        role: Yup.string(),
                        email: Yup.string().required('Email is required'),
                    })}
                    onSubmit={({password, firstName, lastName, role, email}, actions) => {
                        const userRole = document.getElementById('edit-user-form-container').querySelector('select').value;
                        let eUser = { id: editedUser.id, username: editedUser.username, password: password, firstName: firstName, lastName: lastName, role: userRole, email: email }
                        for (let i = 0; i < users.length; i++) {
                            if (users[i].id == editedUser.id) {
                                userService.setEditUser(eUser);
                                userService.getAll().then(users => this.setState({ users }));
                            }
                        }
                        document.getElementById('admin-container').style.display = 'block';
                        document.getElementById('edit-user-form-container').style.display = 'none';
                        actions.resetForm();
                    }}
                    render={({ errors, status, touched, isSubmitting }) => (
                        <Form>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Field disabled name="username" type="text" placeholder={editedUser.username} className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" placeholder={editedUser.password} className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <Field name="firstName" type="text" placeholder={editedUser.firstName} className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <Field name="lastName" type="text" placeholder={editedUser.lastName} className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select name="role" value={editedUser.role} className={'form-control' + (errors.role && touched.role ? ' is-invalid' : '')}>
                                    <option value="Admin" label="Admin" />
                                    <option value="User" label="User" />
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Field name="email" type="text" placeholder={editedUser.email} className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>&emsp;
                                {isSubmitting}
                                <button type="button" className="btn btn-secondary" onClick={this.cancelEditUser.bind(this)}>Cancel</button>
                            </div>
                            {status &&
                                <div className={'alert alert-danger'}>{status}</div>
                            }
                        </Form>
                    )}
                />
                </div>
            </div>
        );
    }
}

export { AdminPage };