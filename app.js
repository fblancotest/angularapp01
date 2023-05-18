const express = require("express");
const cors = require("cors");
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

writeENV();

app.use(express.static(__dirname.replace(/\\/g, "/") + '/view/dist'))

app.get("/", (req, res) => {
    res.send("Hello from NodeJS!");
});

app.get("/api/getName", (req, res) => {
    const gender = ['male', 'female'];
    const firstNames = fetchNames(pickRandom(gender));
    const lastNames = fetchNames('surnames');
    const firstName = pickRandom(firstNames.data);
    const lastName = pickRandom(lastNames.data);
    res.json({
        "name": `${firstName} ${lastName}`
    })
});

fetchNames = (nameType) => {
    let names = [];
    switch (nameType) {
        case 'female':
            names = ['Alyssa', 'Fauna', 'Jasmine', 'Lucy', 'Natalie', 'Sarah'];
            break;
        case 'male':
            names = ['Liam', 'Oliver', 'William', 'Benjamin', 'Lucas', 'James'];
            break;
        case 'surnames':
            names = ['Walsh', 'Jones', 'Thomas', 'Davies', 'Garcia', 'Taylor'];
            break;
    }
    return { data: names };
}

pickRandom = (list) => {
    return list[Math.floor(Math.random() * list.length)];
}

function writeENV() {
    if (process.env.NODE_ENV) {
        let content = "(function (window) {" +
            "window.__env = window.__env || {};" +
            "window.__env.SERVER_URL = '" + process.env.SERVER_URL + "';" +
            "}(this));"
        fs.writeFile(path.join(__dirname.replace(/\\/g, "/"), '/view/dist/assets/environments/env.js'), content, (err) => {
            if (err) throw err;
            console.log('SERVER_URL :', process.env.SERVER_URL)
            console.log('Successfully saved env.js file.');
        });
    }
}

app.use(sendSpaFileIfUnmatched);

function sendSpaFileIfUnmatched(req, res) {
    res.sendFile("/view/dist/index.html", { root: '.' });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});