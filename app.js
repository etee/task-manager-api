const express = require('express');
const tasksData = require('./task.json');
const Validator = require('./helpers/validator');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).send("Task Manager API");
});

app.get("/tasks", (req, res) => {
    res.status(200).json(tasksData);
});

app.get("/tasks/:id", (req, res) => {
    const tasks = tasksData.tasks;
    const filteredTask = tasks.filter(task => task.id === parseInt(req.params.id));
    if(filteredTask.length === 0) {
        return res.status(404).send("The task you are looking for is not found!");
    }
    res.status(200).json(filteredTask);
});

app.post("/tasks", (req, res) => { // add logic for duplicate id
    const newTaskDetails = req.body;
    if(!Validator.validateTaskInfo(newTaskDetails).status) {
        return res.status(400).json(Validator.validateTaskInfo(newTaskDetails));
    } else if(!Validator.validateTaskInfoValues(newTaskDetails).status) {
        return res.status(400).json(Validator.validateTaskInfo(newTaskDetails));
    } else {
        let modifiedTaskData = tasksData;
        newTaskDetails['id'] = modifiedTaskData.tasks.length + 1;
        modifiedTaskData.tasks.push(newTaskDetails);
        fs.writeFile('./task.json', JSON.stringify(modifiedTaskData), {encoding: 'utf8', flag: 'w'}, (err, data) => {
            if(err) {
                return res.status(500).send("Something went wrong while adding a task, please try again!!");
            } else {
                res.status(200).send("Task has been successfully validated and created")
            }
        })
    }
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;