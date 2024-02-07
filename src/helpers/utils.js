const fs = require('fs');

sortTasks = (array, sortBy, order) => {
    array.sort(function (a, b) {
        if(a[sortBy] && b[sortBy]) {
            let date1 = new Date(a[sortBy]).getTime();
            let date2 = new Date(b[sortBy]).getTime();
            if (order === 'asc') {
                return date1 > date2 ? 1 : -1;
            } else {
                return date1 < date2 ? -1 : 1;
            }
        }
    });
    return array;
}

writeToFile = (dataTowrite, taskToBePerformed) => {
    fs.writeFile('./task.json', JSON.stringify(dataTowrite), {encoding: 'utf8', flag: 'w'}, (err, data) => {
        if(err) {
            return res.status(500).send(`Something went wrong while ${taskToBePerformed} of the task, please try again!!`);
        }
    })
}

module.exports = { sortTasks, writeToFile };