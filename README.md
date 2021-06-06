# React Notes App

## See demo

Open [mern-notesapp.herokuapp.com](https://mern-notesapp.herokuapp.com/) or [react-notes.std-1033.ist.mospolytech.ru](http://react-notes.std-1033.ist.mospolytech.ru/) to view working demo in the browser.

![Screenshot](https://i.postimg.cc/bJDKyz3s/719.png)

## Development

First of all, set up your project by creating `.env` file with next content:

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

## MongoDb

Local `mongoUri` will be `"mongodb://localhost:27017/mydb"`

### Mongo installation on Windows 10

1. Download and install MongoDb server from [www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) (set it on "D:\Program Files\" to not edit the .bat file)

2. Edit [mongo_win_install.bat](./installMongo/Windows/mongo_win_install.bat) file and fix next variables (dont use spaces around "="):
    - set `MongoDb_ExePath` - path to mongod.exe
    - set `MongoDb_DataFolderPath` - path to db folder

3. To start Mongo database
    - run `mongo_win_install.bat` file 
    - or run `npm run mongo-windows:start` command with npm

### Mongo installation on Ubuntu 20.04

1. To prepare and setup mongo
    - run next in bash:
      - `sudo apt update && sudo apt upgrade`
      - `cd && cd react-notes/installMongo/Ubuntu && chmod +x mongo_ubuntu_setup.sh && chmod +x mongo_ubuntu_install.sh && cd`
      - `cd && ./react-notes/installMongo/Ubuntu/mongo_ubuntu_setup.sh`

    - or run next with npm: `npm run mongo-ubuntu:full-setup`

2. To start Mongo database 
    - run next in bash: `cd && ./react-notes/installMongo/Ubuntu/mongo_ubuntu_install.sh`
    - or run next with npm: `npm run mongo-ubuntu:start`

### Mongo on Heroku

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
        mongoUri: "<YOUR MONGO URI>" /*replace this*/,
        httpsRedirect: false /*true if enable*/,
      },
    },
  ],
};
```

## Deployment on Heroku

- Create Heroku app
- Connect to GitHub repo
- Add Node.js buildpack in settings
- Add config vars:
  - NODE_ENV: production
  - mongoUri: YOUR MONGO URI
  - httpsRedirect: true
- Click "Deploy branch" button
