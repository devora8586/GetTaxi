const URL = "http://localhost:8080"

export function GET(route, onReady, onError) {
    fetch(`${URL}/${route}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
            'Origin': URL
        }
    }).then(response => {
        if (!response.ok)
            throw response;
        return response.json();
    }).then(json => {
        onReady(json);
    }).catch(error => onError(error))
}

export function PATCH(route, body, onReady, onError) {
    fetch(`${URL}/${route}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
            'Origin': URL
        }
    }).then(response => {
        if (!response.ok)
            throw response;
        return response.json();
    }).then(json => {
        onReady(json);
    }).catch(error => onError(error))
}

export function PUT(route, body, onReady, onError) {
    fetch(`${URL}/${route}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
            'Origin': URL
        }
    }).then(response => {
        if (!response.ok)
            throw response;
        return response.json();
    }).then(json => {
        onReady(json);
    }).catch(error => onError(error))
}

export function POST(route, body, onReady, onError) {
    fetch(`${URL}/${route}`, {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
            'Origin': URL
        }
    }).then(response => {
        if (!response.ok)
            throw response;
        return response.json();
    }).then(json => {
        onReady(json);
    }).catch(error => onError(error))
}

export function DELETE(route, onReady, onError) {
    fetch(`${URL}/${route}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json',
            'Origin': URL
        }
    }).then(response => {
        if (!response.ok)
            throw response;
        return response.json();
    }).then(json => {
        onReady(json);
    }).catch(error => onError(error))
}
