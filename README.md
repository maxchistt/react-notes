# React Notes App

## See demo

Open [react-notes.std-1033.ist.mospolytech.ru](http://react-notes.std-1033.ist.mospolytech.ru/) to view working demo in the browser.

## Start development

Main available scripts in the project directory:

### `npm run full-install`

installs client and server packages

### `npm run dev`

starts client and server concurrently in dev mode

### `npm run dev:serve`

serves client and server concurrently

## Production

Use next scripts:

### `npm run deploy`

to install and build app before run it

### `npm run prod` or `npm start`

to run prod

### `npm run prod:deploy`

to run prod with predeploy

## Deployment on Ubuntu

- Clone from GitHub
- Run `cd react-notes && npm run deploy && cd`
- Use PM2 with this ecosystem template:

```json
module.exports = {
apps : [
   {
        "name" : "react-notes",
        "script" : "./react-notes/app.js",
        "watch" : "./react-notes/",
        "ignore-watch" : [ "node_modules","./react-notes/node_modules","./react-notes/client/node_modules"],
        "max-memory-restart" : "150MB",
        "env" : {
          NODE_ENV: "production"
        }
    }
  ],
};
```
