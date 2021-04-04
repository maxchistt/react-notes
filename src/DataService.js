const url = 'http://php-server-notes.std-1033.ist.mospolytech.ru/'
const user = fetch("https://l2.io/ip.json").then(response => response.json()['ip']) || "default" // parses JSON response into native JavaScript objects

export function loadData(after) {
    console.log("loadData");
    console.log("user " + user);
    fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'user': String(user)
        },
    })
        .then(response => response.json()) // parses JSON response into native JavaScript objects
        .then((data) => {
            data ? after(data) : console.log("not loaded")
            return data
        })
        .then(console.log)
}

export function saveData(data) {
    console.log("saveData"); console.log(data);
    console.log("user " + user);
    fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'user': String(user)
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
        .then(response => response.json()) // parses JSON response into native JavaScript objects
        .then(console.log)
}
