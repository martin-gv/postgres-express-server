# Postgres Express Server

> A Postgres and Express server template with helper methods and middleware for setting up routes, handlers, and database queries.

## Models

Create a new model and pass in the name of the database table:

```
const Note = createModel({ collection: 'note' });
```

The returned model has the following configured methods:

- create
- find
- findById
- update
- updateById
- delete
- deleteById

The model can be used in route callbacks:

```
const results = await Note.create({ title: "yep", content: "hey" });
res.status(201).json(results);
```

## Handlers

Create a new handler by passing in a configured model;

```
const { Note } = require('../models');
const notesHandler = createHandler(Note);
```

The returned handler has the following configured middleware methods:

- get
- post
- put
- delete

It can be used like this:

```
app.get('/notes/:id', notesHandler.get);
```

## Sample Files

Sample files are included for a "notes app" with user accounts, notes, and tags. These files are found in the `handlers`, `models`, and `routes` folders.

## Methods Summary

```
HTTP     CRUD      Model     Handler
------------------------------------
GET      read      find      get
POST     create    create    post
PUT      update    update    put
DELETE   delete    delete    delete
```

## Scripts

    npm run test

Runs Jest in serial mode. Requires the environment variables prefixed with `TEST_` in `.env.example`.

---

    npm run start

Starts the app. Environment variables may need to be added depending on the server configuration.

---

    npm run dev

Starts the app in development mode. Requires `nodemon` to be installed. Environment variables are loaded from the `.env` file.

The app runs with the `--inspect` for attaching a debugger. In VS Code, a launch configuration can run this script and attach the debugger automatically.
