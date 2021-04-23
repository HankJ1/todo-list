import {localStorageFunc, projArray} from "./main.js";
import {projects, allTasks} from "./sidebar.js";
import {taskButtons, populateDom, visibility, readTask } from "./dom.js";


//project constructor and adds project to project array
const buildArray = (() => {

    const makeProject = (title) => {
        return {
            title,
            selected: true,
            tasks: []
        }
    }

    //this is the function to call to make a new project
    const appendArray = (projTitle) => {
        let newProjectObject = makeProject(projTitle)
        projArray.push(newProjectObject);
    }

    return {
        appendArray
    }

})();

//task constructor
const addTask = (() => {

    const makeTask = (description, dueDate, timeFrame, extraDetails) => {
        return {
            description,
            dueDate,
            timeFrame,
            extraDetails,
            completionStatus: "incomplete"
        }
    }

    const appendTask = (description, dueDate, timeFrame, extraDetails) => {
        let newTask = makeTask(description, dueDate, timeFrame, extraDetails);
        let tempProj = logic.findSelectedArray();
        tempProj.tasks.push(newTask);
        return tempProj.tasks.length;
    }

    const deleteTask = (taskDescription) => {
        let taskList = logic.findSelectedArray().tasks
        taskList.some(element => {
            if (element.description == taskDescription) {
                taskList.splice(taskList.indexOf(element), 1);

            }
        })
    }

    return {
        appendTask,
        deleteTask

    }

})();

//logic to add tasks to associated projects
const logic = (() => {

    function popProjArray() {
        const proj = makeProject("Homework");
        const task1 = makeTask("eat the cheerios from the bowl", "21/12/12", "9:00am - 12:00pm", "", proj);
        proj.tasks[proj.tasks.length] = task1;
        projArray[projArray.length] = proj;
    }

    function findSelectedArray() {
        return projArray.find(element => element.selected == true);
        return //projArray.indexOf(selectedObj);

    }

    return {
        popProjArray,
        findSelectedArray
    }

})();

//add first project to array
//buildArray.appendArray("chicken dance");
//add second project to array
//buildArray.appendArray("proj 2");

//turn selectd = false to first proj
//projArray[0].selected = false;


//console.log(logic.findSelectedArray());

//adds three new tasks to the current project
//addTask.appendTask("walk the dog", "13/12/12", "9-10", "");
//addTask.appendTask("feed the goats", "13/12/12", "9-10", "");
//addTask.appendTask("laugh with the chickens", "13/12/12", "9-10", "");


export {logic, addTask, buildArray}; 



