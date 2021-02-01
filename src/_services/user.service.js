import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';
import {configureFakeBackend, handleResponseUser} from '../_helpers';
import { Role } from './'

export const userService = {
    getAll,
    getById,
    setNewUser,
    setRemoveUser,
    setEditUser
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function setNewUser(user) {
    const requestOptions = { method: 'POST', headers: authHeader(), body: user };
    fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponseUser(user));
}

function setEditUser(user) {
    const requestOptions = { method: 'PUT', headers: authHeader(), body: user };
    fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponseUser(user));
}

function setRemoveUser(user) {
    const requestOptions = { method: 'DELETE', headers: authHeader(), body: user };
    fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponseUser(user));
}