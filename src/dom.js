import {localStorageFunc, projArray} from "./main.js";
import {logic, addTask, buildArray} from "./constructors.js";
import {projects, allTasks} from "./sidebar.js";
const datepicker = require ('js-datepicker');
import 'js-datepicker/dist/datepicker.min.css';

//console.log(projArray.find(element => element.selected == true));

//visibility of newtask form based on add tast button
const visibility = (() => {

    const newTaskContainer = document.querySelector(".newTask-container");
    const otherElements = document.querySelectorAll(".header, .sidebar, .task-container");
    document.querySelector(".addTask-button").onclick = makeAppear;
    document.querySelector(".exit").onclick = makeDisappear;


    function makeAppear() {
        if((projArray.find(element => element.selected == true)) == undefined) {
            alert("Must be in a project subfolder to add a task");
        } else {
        otherElements.forEach(element => element.style.opacity = "0.2");
        newTaskContainer.setAttribute('style', 'display: initial');
        console.log("apeared!");
        let newTaskBar = document.querySelector('.newTask-input');
        newTaskBar.focus();
        const picker = datepicker('.date');
        }
    }
    function makeDisappear() {
        otherElements.forEach(element => element.style.opacity = "1");
        newTaskContainer.setAttribute('style', 'display: none');
        console.log("dissapeared!");
        readTask.taskFields.forEach(element => element.value = "");
    }

    return {
        newTaskContainer,
        makeAppear,
        makeDisappear
    }

})();

//make new task object from fields and add it to active project
const readTask = (() => {

    const taskFields = document.querySelectorAll(".newTask-input");
    document.querySelector(".confirm").onclick = makeTaskFromFields;

    //creates a new task from user filled forms to selected array when confirm button is pressed
    function makeTaskFromFields() {
        console.log(taskFields[0].value);
        let taskLength = addTask.appendTask(taskFields[0].value, taskFields[1].value, taskFields[2].value, taskFields[3].value); //returns length of project task array
        populateDom.displayTask(taskLength - 1);
        visibility.makeDisappear();
        localStorageFunc.projectsToLocalStorage();
    }

    return {
        taskFields,
        makeTaskFromFields
    }

})();

const populateDom = (() => {

    let taskPrototype = document.querySelector(".task-cell");
    let taskContainer = document.querySelector(".task-container");

    //displays selected task of a project in the dom and assigns event listeners when confirm is clicked
    const displayTask = (index) => {
            let activeProject = logic.findSelectedArray();
            let newTaskDiv = taskPrototype.cloneNode(true);
            newTaskDiv.style.display = "inherit";
            newTaskDiv.childNodes[5].addEventListener("click", function() {
                let tempThis = this;
                console.log(tempThis);
                taskButtons.deleteButton(tempThis);
            })
            newTaskDiv.childNodes[1].addEventListener("click", function() {
                let tempThis = this;
                taskButtons.completeButton(tempThis);
            })
            newTaskDiv.childNodes[7].addEventListener("click", function() {
                let tempThis = this;
                taskButtons.editButton(tempThis);
            })
            newTaskDiv.childNodes[3].textContent = activeProject.tasks[index].description;
            newTaskDiv.childNodes[9].textContent = activeProject.tasks[index].dueDate;
            if(activeProject.tasks[index].completionStatus == "complete") {
                console.log("its incomplete");
                newTaskDiv.style.opacity = "0.3";
                newTaskDiv.childNodes[3].style.textDecoration = "line-through";
            }
            taskContainer.appendChild(newTaskDiv);

        }

    //displays all tasks of selected project in the DOM
    const displayAllTasks = () => {
        let length = logic.findSelectedArray().tasks.length;
        for (let i = 0; i < length; i++) {
            displayTask(i);
        }
    }


    const cloneTask = () => {
        let taskDiv = document.querySelector(".task-cell");
        let cloned = taskDiv.cloneNode(true);
        console.log(cloned);
        //console.log(cloned.childNodes);
        taskContainer.appendChild(cloned);
        cloned.childNodes[3].textContent = "fiesty";
        cloned.childNodes[9].textContent = "90/35/30";
    }

    return {
        //cloneTask,
        displayTask,
        displayAllTasks,
        taskPrototype
    }


})();

const taskButtons = (() => {

    let allTasksButton = document.querySelector(".todo");

    const setButtonsforCurrentTasks = (() => {
        let deleteButtons = document.querySelectorAll(".delete-symbol");
        let editButtons = document.querySelectorAll(".edit-symbol");
        let completeButtons = document.querySelectorAll(".task-checkbox");
        deleteButtons.forEach(button => {
            button.addEventListener("click", 
                function() {
                tempThis = this;
                deleteButton(tempThis);
            })
        });
        editButtons.forEach(button => {
            button.addEventListener("click", function() {
                tempThis = this;
                editButton(tempThis);
            })
        });
        completeButtons.forEach(button => {
            button.addEventListener("click", function() {
                tempThis = this;
                editButton(tempThis);
            })
        });
    })();

    //what happens when hit the delete button next to a task
    function deleteButton(someThis) {
        if(document.querySelector(".proj-name").textContent == "All Tasks") {
            projArray.find(element => {
                element.tasks.find(taskElement => {
                    if(taskElement.description == someThis.parentNode.childNodes[3].textContent){
                        element.selected = true;
                    }
                    
                })
            })
        }

        console.log(someThis.previousSibling.previousSibling.textContent);
        let taskDesc = someThis.previousSibling.previousSibling.textContent;
        someThis.parentNode.remove();
        addTask.deleteTask(taskDesc);

        if(document.querySelector(".proj-name").textContent == "All Tasks") {
            projArray.forEach(element => element.selected = false);
        }

        localStorageFunc.projectsToLocalStorage();

    }

    //behavior of the checkbox button left of task decription
    function completeButton(someThis) {
    //if the checkbock is checked already
        if(getComputedStyle(someThis.parentNode).getPropertyValue("opacity") >= 0.2 && 
        getComputedStyle(someThis.parentNode).getPropertyValue("opacity") <= 0.4) {
            console.log("if triggered");
            someThis.parentNode.style.opacity = "1";
            someThis.parentNode.childNodes[3].style.textDecoration = "none";

            //opening and closing the selected status when looking at all tasks outside of project view
            if(document.querySelector(".proj-name").textContent == "All Tasks") {
                projArray.find(element => {
                    element.tasks.find(taskElement => {
                        if(taskElement.description == someThis.parentNode.childNodes[3].textContent){
                            element.selected = true;
                        }
                        
                    })
                })
            }
            
            logic.findSelectedArray().tasks.find(element => {
                if(element.description == someThis.parentNode.childNodes[3].textContent) {
                    element.completionStatus = "incomplete";
                }
            })

            //the closing portion of the above comment
            if(document.querySelector(".proj-name").textContent == "All Tasks") {
                projArray.forEach(element => element.selected = false);
            }

        // if the checkbox has not been triggerd
        } else {
            someThis.parentNode.style.opacity = 0.3;
            someThis.parentNode.childNodes[3].style.textDecoration = "line-through";
            console.log(getComputedStyle(someThis.parentNode).getPropertyValue("opacity"));

            //opening and closing the selected status when looking at all tasks outside of project view
            if(document.querySelector(".proj-name").textContent == "All Tasks") {
                projArray.find(element => {
                    element.tasks.find(taskElement => {
                        if(taskElement.description == someThis.parentNode.childNodes[3].textContent){
                            element.selected = true;
                        }
                        
                    })
                })
            }

            logic.findSelectedArray().tasks.find(element => {
                if(element.description == someThis.parentNode.childNodes[3].textContent) {
                    element.completionStatus = "complete";
                }
            })

             //the closing portion of the above comment
             if(document.querySelector(".proj-name").textContent == "All Tasks") {
                projArray.forEach(element => element.selected = false);
            }

        }
        localStorageFunc.projectsToLocalStorage();
        
    }

    function editButton(someThis) {
        //if the edit button is currently on
        if(someThis.parentNode.childNodes[3].contentEditable == "true") {
            console.log("if triggered");
            for (let i = 3; i < 10; i += 6) {
                someThis.parentNode.childNodes[i].contentEditable = false;
                someThis.parentNode.childNodes[i].style.outline = "none";
                }
            someThis.style.opacity = "0.5";
            someThis.style.outline = "none";

            addTask.appendTask(someThis.parentNode.childNodes[3].textContent, someThis.parentNode.childNodes[9].textContent, "", "");

            if(document.querySelector(".proj-name").textContent == "All Tasks") {
                console.log(allTasksButton.textContent);
                projArray.find(element => {
                    element.tasks.find(taskElement => {
                        if(taskElement.description == someThis.parentNode.childNodes[3].textContent){
                            element.selected = false;
                        }
                        
                    })
                })
            }

            localStorageFunc.projectsToLocalStorage();
            //if the edit button is currently off:
        } else {
        
            if(document.querySelector(".proj-name").textContent == "All Tasks") {
                projArray.find(element => {
                    element.tasks.find(taskElement => {
                        if(taskElement.description == someThis.parentNode.childNodes[3].textContent){
                            element.selected = true;
                        }
                        
                    })
                })
            }

            someThis.style.opacity = "1";
            someThis.style.outline = "2px solid black";
            someThis.style.outlineOffset = "2px";

            for (let i = 3; i < 10; i += 6) {
                someThis.parentNode.childNodes[i].contentEditable = true;
                someThis.parentNode.childNodes[i].style.outline = "1px solid black";
                someThis.parentNode.childNodes[i].style.outlineOffset = "2px";
            }

            addTask.deleteTask(someThis.parentNode.childNodes[3].textContent);

        }
        
        
    }

    return {
        deleteButton,
        completeButton,
        editButton
    }

})();


//populateDom.displayAllTasks();


// const showMeThis = () => {
//     console.log(this);
// }

export {taskButtons, populateDom, visibility, readTask };

