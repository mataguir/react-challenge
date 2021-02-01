import React from 'react';
import AdminPage from './AdminPage';
import { setup } from '../../utils/enzyme';
import { shallow } from 'enzyme';

setup(); // Configuring enzyme

describe('List', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(<AdminPage />, div)
    })

    it('should render a list with the id, role, first name and last name of each user inside a li', () => {
        const usersArray = [{ id: 1, id: '1', role: 'Admin', firstName: 'Mateo', lastName: 'Aguirre' }, { id: 2, id: '2', role: 'User', firstName: 'Juan', lastName: 'Perez' }]
        const wrapper = shallow(<AdminPage users={usersArray} />)

        const users = wrapper.find('div[class="user"]')
        expect(users).toHaveLength(itemsArray.length)
        expect(users.first().text()).toEqual('1')
    })
});