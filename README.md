# Task Manager REST API using NodeJS and ExpressJS

## This project contains CRUD APIs for tasks using the REST principle

This project has a very basic level implementation of CRUD APIs using the REST architecture principle. The APIs implemented are listed as mentioned below:

* GET /api/task-manager/v1/tasks =>  To get all tasks

* GET /api/task-manager/v1/tasks?completed={true/false}&sort=created:{asc/desc} => To fetch all tasks that are either completed or not completed as well sorted by attribute created date in ascending or descending order. You can pass either completed query param or both created and sort.

* GET /api/task-manager/v1/tasks/:id => Returns a task if found in temporary schema or returns not found response

* POST /api/task-manager/v1/tasks => Validates and creates a new task if successfully created with return status as 201 or returns the 400 if provided attributes are not correct. Expected payload: 
{
    "title": "Title of the task",
    "description": "Description of the task",
    "completed": true/false,
    "created": "Date of creation",
    "priority": "Priority of the task"
}

* PUT /api/task-manager/v1/tasks => Validates and updates an existing task if successfully updated with return status as 200 or returns the 400 if provided attributes are not correct. Expected payload: 
{
    "title": "Title of the task that needs to be updated",
    "description": "Description of the task that needs to be updated",
    "completed": true/false,
    "created": "Date of creation to be updated",
    "priority": "Priority of the task to be updated"
}

* DELETE /api/task-manager/v1/tasks/:id => Deletes a task provided in the delete request, returns a successful response with status code 200 or 404 if id is not found.

* GET /api/task-manager/v1/tasks/priority/:level => Fetches all the tasks having the level provided by the user, values that can be provided are low/medium/high. If tasks are not found API returns 404 and 200 if records are found.
