const express = require('express');
const app = express();
const port = 3000;
const tasksData = require('./task.json');
const Validator = require('./src/helpers/validator');
const Utils = require('./src/helpers/utils');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).send("Task Manager API");
});

app.get("/tasks", (req, res) => {
    let filteredTasks = tasksData.tasks;
    if(req.query) {
        for (let queryParams in req.query) {
            if(queryParams === 'completed') {
                filteredTasks = filteredTasks.filter(task => String(task.completed) == req.query[queryParams]);
                if(filteredTasks.length === 0) {
                    return res.status(404).send("No tasks are found that are completed");
                }
             
            }
            if(queryParams === 'sort') {
                const sortBy = req.query[queryParams].split(':')[0];
                const sortOrder = req.query[queryParams].split(':')[1];
                filteredTasks = Utils.sortTasks(filteredTasks, sortBy, sortOrder);
            }
            
        }
        res.status(200).json(filteredTasks);
    } else {
        res.status(200).json(tasksData);
    }
});

app.get("/tasks/:id", (req, res) => {
    const tasks = tasksData.tasks;
    const filteredTask = tasks.filter(task => task.id === parseInt(req.params.id));
    if(filteredTask.length === 0) {
        return res.status(404).send("The task you are looking for is not found!");
    }
    res.status(200).json(filteredTask);
});

app.post("/tasks", (req, res) => { 
    let newTaskDetails = req.body;
    if(!Validator.validateTaskInfo(newTaskDetails).status) {
        return res.status(400).json(Validator.validateTaskInfo(newTaskDetails));
    } else if(!Validator.validateTaskInfoValues(newTaskDetails).status) {
        return res.status(400).json(Validator.validateTaskInfoValues(newTaskDetails));
    } else {
        let modifiedTaskData = tasksData;
        newTaskDetails['id'] = modifiedTaskData.tasks.length + 1;
        modifiedTaskData.tasks.push(newTaskDetails);
        //Utils.writeToFile(modifiedTaskData, 'creation');
        res.status(201).send("Task has been successfully validated and created")
    }
});

app.put("/tasks/:id", (req, res) => {
    let newTaskDetails = req.body;
    const taskIdTobeUpdated = req.params.id;
    if(!Validator.validateTaskInfo(newTaskDetails).status) {
        return res.status(400).json(Validator.validateTaskInfo(newTaskDetails));
    } else if(!Validator.validateTaskInfoValues(newTaskDetails).status) {
        return res.status(400).json(Validator.validateTaskInfoValues(newTaskDetails));
    } else {
        const taskDataToBeUpdated = tasksData.tasks.find(task => task.id === parseInt(taskIdTobeUpdated));
        if(!taskDataToBeUpdated) {
            return res.status(404).send("Task with id provided is not found");
        }
        taskDataToBeUpdated.title = newTaskDetails.title;
        taskDataToBeUpdated.description = newTaskDetails.description;
        taskDataToBeUpdated.completed = newTaskDetails.completed;
        taskDataToBeUpdated.created = newTaskDetails.created;
        taskDataToBeUpdated.priority = newTaskDetails.priority;
        //Utils.writeToFile(tasksData, 'update');
        res.status(200).send("Task has been successfully validated and updated")
    }
});

app.delete("/tasks/:id", (req, res) => {
    const taskId = req.params.id;
    const taskDataToBeDeleted = tasksData.tasks.find(task => task.id === parseInt(taskId));
    if(!taskDataToBeDeleted) {
        return res.status(404).send("Can not delete task, there is no task associated with id provided");
    } else {
        const taskIdFromSchema = tasksData.tasks.indexOf(taskDataToBeDeleted);
        tasksData.tasks.splice(taskIdFromSchema, 1);
        //Utils.writeToFile(tasksData, 'deletion');
        res.status(201).send("Task has been successfully deleted")
    }
});

app.get("/tasks/priority/:level", (req, res) => {
    const level = req.params.level;
    const tasksDataWithLevel = tasksData.tasks.filter(task => task.priority === level);
    if(tasksDataWithLevel.length === 0) {
        return res.status(404).send(`Task with ${level} priority are not found!`);
    }
    res.status(200).json(tasksDataWithLevel);
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;