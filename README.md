# React Notes App

This is a MERN-based notes web-app with authorisation, live synchronization and functional user interface. Here you can edit notes text content, add some markdown elements, upload images for cards.

![Screenshot](https://i.postimg.cc/VN07rkNx/11.png)

## About

Project has "cliend and server" structure. You can find it in the corresponding subfolders.

The server with REST API was built with Node.js platform and Express library. It has three main API routes, additional route for WS addres check and default route for static client build. I used MongoDB and Mongoose lib to store and manage data. There are three entity types in database - Users, Notes and Media (images). For authorization, I used the JsonWebToken and Bcrypt libraries. I also used WebSocket to connect client and server for real-time synchronization.

The client was made with React framework. It was styled with Bootstrap 4. I used React Router DOM extension to route client pages - authorisation, main notes page and about page. I also used some libs to make interface more useful and pretty. The main one - React Stack Grid, used to conveniently arrange note cards on the screen. There are many custom hooks here to manage authorization, interface elements, user data, and their synchronization. Client was built with Progressiwe Web App technology. So it can be partially cached for offline use, or rather for faster loading.

I also tried to make unit tests and documentation based on code comments. You can see it below in this document.

## See demo

Open [mern-notesapp](https://mern-notesapp.herokuapp.com/) (here synchronization disabled) or [react-notes](http://react-notes.std-1033.ist.mospolytech.ru/) (here PWA disabled) to view working demo in the browser.

![Screenshot](https://i.postimg.cc/2jtfgVZW/10.png)

## Development

First of all, set up your project by creating `.env` file in `./server` folder with next content:

```env
mongoUri = "<YOUR MONGO URI>"
jwtSecret = "<SECRET KEY>"
```

Main available scripts in the project directory:

### `npm install`

installs packages for development

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

## Testing

### `npm test`

runs concurrently tests for client and server

## MongoDb

Local `mongoUri` will be `"mongodb://localhost:27017/mydb"`

### Mongo installation on Windows 10

1. Download and install MongoDb server from [www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) (set it on "D:\Program Files\" to not edit the .bat file)

2. Edit [mongo_win_install.bat](./mongo/Windows/mongo_win_install.bat) file and fix next variables (dont use spaces around "="):

   - set `MongoDb_ExePath` - path to mongod.exe
   - set `MongoDb_DataFolderPath` - path to db folder

3. To start Mongo database

   - run `mongo_win_install.bat` file
   - or run `npm run mongo-windows:start` command with npm

### Mongo installation on Ubuntu 20.04

Be careful, it's correct relative path in your commands

1. To prepare and setup mongo

   - run next in bash:

     - `sudo apt update && sudo apt upgrade`
     - `cd && cd react-notes/mongo/Ubuntu && chmod +x mongo_ubuntu_setup.sh && chmod +x mongo_ubuntu_install.sh && cd`
     - `cd && ./react-notes/mongo/Ubuntu/mongo_ubuntu_setup.sh`

   - or run next with npm: `npm run mongo-ubuntu:full-setup`

2. To start Mongo database

   - run next in bash: `cd && ./react-notes/mongo/Ubuntu/mongo_ubuntu_install.sh`
   - or run next with npm: `npm run mongo-ubuntu:start`

### Cloud Mongo connection

Can be also used with Heroku

Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Look video lesson [here](https://youtu.be/mTS0DH3lMNs)

## Deployment on Ubuntu LVS

- Clone from GitHub
- Run `cd react-notes && npm run deploy && cd`
- Use PM2 with this ecosystem template:

```js
module.exports = {
  apps: [
    {
      name: "react-notes",
      script: "./react-notes/server/app.js",
      watch: "./react-notes/",
      "ignore-watch": [
        "node_modules",
        "./react-notes/node_modules",
        "./react-notes/server/node_modules",
        "./react-notes/client/node_modules",
      ],
      "max-memory-restart": "150MB",
      env: {
        NODE_ENV: "production",
        mongoUri: "<YOUR MONGO URI>" /*replace this*/,
        httpsRedirect: false /*true if enable*/,
        jwtSecret: "<SECRET KEY>",
      },
    },
  ],
};
```

Be careful - bash start folder on your server may be located differently

## Deployment on Heroku

- Create Heroku app
- Connect to GitHub repo
- Add Node.js buildpack in settings
- Add config vars:
  - NODE_ENV: production
  - mongoUri: YOUR MONGO URI
  - httpsRedirect: true
  - jwtSecret: SECRET KEY
- Click "Deploy branch" button

## [JSDoc](https://jsdoc.app/) documentation

### `npm run doc`

use to generate docs

### [react-notes-docs](http://react-notes-docs.std-1033.ist.mospolytech.ru)

see exiting documentation
