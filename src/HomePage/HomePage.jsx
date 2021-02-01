import React from 'react';

import { userService, authenticationService } from '@/_services';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            userFromApi: null
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
    }

    render() {
        const { currentUser, userFromApi } = this.state;
        return (
            <div>
                <h1>Home</h1>
                <div> 
                    {userFromApi &&
                        <p>Welcome {userFromApi.firstName} {userFromApi.lastName}!</p>
                    }
                </div>
                <p>Your role is: <strong>{currentUser.role}</strong>.</p>
                <p>If you are and Administrator, click 'Admin' in header to see user options.</p>
            </div>
        );
    }
}

export { HomePage };