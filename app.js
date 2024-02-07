const express = require('express');
const taskManager = require("./src/v1/routes/tasks");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logger = (req, res, next) => {
    const {method, url} = req;
    console.log(`${method} ${url}`);
    next();
};

app.use(logger);

app.get("/", (req, res) => {
    res.status(200).send("Task Manager API");
});

app.use("/api/task-manager", taskManager);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;