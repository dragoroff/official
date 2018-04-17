import { hash } from '../_helpers';

export const userService = {
    login,
    register
};


async function register(user) {
    user.password = hash(user.password);
    let response=await fetch("/api/manager", {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'content-type': 'application/json'
        }
    });
    return response;
}

async function login(username, password) {
    let hashUserInfo = hash(password)+username;
    let response= fetch("/api/manager", {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'xx-auth': hashUserInfo
        }
    });
    return response;
}



