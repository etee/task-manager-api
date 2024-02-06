const express = require("express");
const router = express.Router();
const tasksData = require('../../../task.json');
const Validator = require('../../helpers/validator');
const fs = require('fs');

router.get("/v1/tasks", (req, res) => {
    res.status(200).json(tasksData);
});

router.get("/v1/tasks/:id", (req, res) => {
    const tasks = tasksData.tasks;
    const filteredTask = tasks.filter(task => task.id === parseInt(req.params.id));
    if(filteredTask.length === 0) {
        return res.status(404).send("The task you are looking for is not found!");
    }
    res.status(200).json(filteredTask);
});

router.post("/v1/tasks", (req, res) => { 
    let newTaskDetails = req.body;
    if(!Validator.validateTaskInfo(newTaskDetails).status) {
        return res.status(400).json(Validator.validateTaskInfo(newTaskDetails));
    } else if(!Validator.validateTaskInfoValues(newTaskDetails).status) {
        return res.status(400).json(Validator.validateTaskInfoValues(newTaskDetails));
    } else {
        let modifiedTaskData = tasksData;
        newTaskDetails['id'] = modifiedTaskData.tasks.length + 1;
        modifiedTaskData.tasks.push(newTaskDetails);
        fs.writeFile('./task.json', JSON.stringify(modifiedTaskData), {encoding: 'utf8', flag: 'w'}, (err, data) => {
            if(err) {
                return res.status(500).send("Something went wrong while adding a task, please try again!!");
            } else {
                res.status(201).send("Task has been successfully validated and created")
            }
        })
    }
});

router.put("/v1/tasks/:id", (req, res) => {
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
        fs.writeFile('./task.json', JSON.stringify(tasksData), {encoding: 'utf8', flag: 'w'}, (err, data) => {
            if(err) {
                return res.status(500).send("Something went wrong while updating a task, please try again!!");
            } else {
                res.status(200).send("Task has been successfully validated and updated")
            }
        });
    }
});

router.delete("/v1/tasks/:id", (req, res) => {
    const taskId = req.params.id;
    const taskDataToBeDeleted = tasksData.tasks.find(task => task.id === parseInt(taskId));
    if(!taskDataToBeDeleted) {
        return res.status(404).send("Can not delete task, there is no task associated with id provided");
    } else {
        const taskIdFromSchema = tasksData.tasks.indexOf(taskDataToBeDeleted);
        tasksData.tasks.splice(taskIdFromSchema, 1);
        fs.writeFile('./task.json', JSON.stringify(tasksData), {encoding: 'utf8', flag: 'w'}, (err, data) => {
            if(err) {
                return res.status(500).send("Something went wrong while deleting a task, please try again!!");
            } else {
                res.status(200).send("Task has been successfully deleted")
            }
        });
    }
});

module.exports = router;