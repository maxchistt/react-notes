# React Notes App

## See demo

Open [mern-notesapp.herokuapp.com](https://mern-notesapp.herokuapp.com/) or [react-notes.std-1033.ist.mospolytech.ru](http://react-notes.std-1033.ist.mospolytech.ru/) to view working demo in the browser.

![Screenshot](https://i.postimg.cc/bJDKyz3s/719.png)

## Development

First of all, set up your project by creating .env file with next content:

```env
mongoUri = "<YOUR MONGO URI>"
```

Main available scripts in the project directory:

### `npm run full-install`

installs client and server packages

### `npm run dev`

starts client and server concurrently in dev mode

## Production

Use next scripts:

### `npm run deploy`

to install and build app before run it

### `npm run prod` or `npm start`

to run production app version

## Deployment on Ubuntu LVS

- Clone from GitHub
- Run `cd react-notes && npm run deploy && cd`
- Use PM2 with this ecosystem template:

```js
module.exports = {
  apps: [
    {
      name: "react-notes",
      script: "./react-notes/app.js",
      watch: "./react-notes/",
      "ignore-watch": [
        "node_modules",
        "./react-notes/node_modules",
        "./react-notes/client/node_modules",
      ],
      "max-memory-restart": "150MB",
      env: {
        NODE_ENV: "production",
        mongoUri: "<YOUR MONGO URI>",
      },
    },
  ],
};
```

## Deployment on Heroku

- Create Heroku app
- Connect to GitHub repo
- Add Node.js buildpack in settings
- Add config vars
- Click "Deploy branch" button
