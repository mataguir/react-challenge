import React from 'react';
import LoginPage from './LoginPage';

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<LoginPage />, div)
});