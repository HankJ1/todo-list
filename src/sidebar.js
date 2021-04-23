import {localStorageFunc, projArray} from "./main.js";
import {logic, addTask, buildArray,} from "./constructors.js";
import {taskButtons, populateDom, visibility, readTask } from "./dom.js";

const projects = (() => {

    const deleteButton = document.querySelector('.delete-proj-button');
    const projectNameLabel = document.querySelector(".proj-name");
    const downArrow = document.querySelector(".down-arrow");
    const upArrow = document.querySelector(".arrow");
    const projList = document.querySelector(".project-list");

    const setListeners = (() => {

        const projectButton = document.querySelector(".projects-text");
        const dueTodayButton = document.querySelector(".due-today");
        const addProjectButton = document.querySelector(".add-project");
        
        console.log(projectButton.childNodes);
        console.log(projectButton.children);

        projectButton.addEventListener("click", () => {
            console.log("show me the money");
            showProjects();
        } );

        addProjectButton.addEventListener("click", () => {
            addProject();
        })

        deleteButton.onclick = deleteProject;
    })();

    //function body for togge project shows on event listeners
    function showProjects() {
        //show the projects
        if(getComputedStyle(downArrow).getPropertyValue("display") == "none"){
            upArrow.style.display = "none";
            downArrow.style.display = "initial";
            projList.style.display = "initial";
            console.log("arrow previously up so down area triggered");
        
            projArray.forEach(element => {
                let listItem = document.createElement("li"); 
                listItem.classList.add("list-items");
                listItem.textContent = element.title;
                projList.appendChild(listItem);
        })
            document.querySelectorAll(".list-items").forEach(element => {
                element.addEventListener("click", function() {
                    let someThis = this;
                    projects.popDomWithProjectTasks(someThis);
                })
            })
            projArray.forEach(element => {
                element.selected = false;
            })
        //hide the projects
        }  else {
                console.log("trigger me timbers")
                upArrow.style.display = "initial";
                downArrow.style.display = "none";
                projList.style.display = "none";
                let listItems = document.querySelectorAll(".list-items");
                console.log(listItems);

                listItems.forEach(element => {
                    element.remove();
                    console.log("for each baby");
                });
        }
    }

    //runs if the add project button gets pushed
    function addProject() {
        let newListItem = document.createElement("li");
        projList.appendChild(newListItem);
        newListItem.classList.add("list-items","pending-project");
        // newListItem.textContent = "placeHolder Project";
        newListItem.contentEditable = true;
        newListItem.focus();
        newListItem.addEventListener("keypress", function(e) {
            //newListItem.blur();
            if(e.key === "Enter") {
                console.log(e.key);
                newListItem.contentEditable = false;
                newListItem.classList.remove("pending-project");
                buildArray.appendArray(newListItem.textContent);
                localStorageFunc.projectsToLocalStorage();
                newListItem.addEventListener("click", function() {
                    let someThis = this;
                    console.log(this);
                    popDomWithProjectTasks(someThis);
                })
            } else {
                
                newListItem.focus();
                setTimeout(function(){ that.selectionStart = that.selectionEnd = 10000; }, 0);
                // this.selectionStart = this.selectionEnd = this.value.length;
            }
        
        });
        // newListItem.addEventListener("submit", function(e) {
        //     // newListItem.blur();
        //     // if(e.key === "Enter") {
        //         console.log(e.key);
        //         newListItem.contentEditable = false;
        //         newListItem.classList.remove("pending-project");
        //         buildArray.appendArray(newListItem.textContent);
        //         localStorageFunc.projectsToLocalStorage();
        //         newListItem.addEventListener("click", function() {
        //             let someThis = this;
        //             console.log(this);
        //             popDomWithProjectTasks(someThis);
        //         })
            // } else {
                // newListItem.onfocus="this.value = this.value";
                // newListItem.focus();
                // this.selectionStart = this.selectionEnd = this.value.length;
            // }
        
        // });
         
    }

    function deleteProject() {
        let actvProj = logic.findSelectedArray();
        console.log(actvProj);
        let indx = projArray.indexOf(actvProj);
        console.log(indx);
        console.log(typeof indx);
        if(indx > -1) {
            projArray.splice(indx, 1);
        } else {
            return;
        }
        showProjects();
        showProjects();
        localStorageFunc.projectsToLocalStorage();
        projArray[projArray.length - 1].selected = true;
        let displayedProjects = document.querySelectorAll('.list-items');
        let lastProj = displayedProjects[displayedProjects.length - 1];
        console.log(lastProj);
        popDomWithProjectTasks(lastProj);

        
    }

    //function that occurs when you click on a project name in sidebar
    function popDomWithProjectTasks(someThis) {
        let domTasks = document.querySelectorAll(".task-cell");
        for(let i = 1; i < domTasks.length; i++ ) {
            domTasks[i].remove();
        }
        projArray.forEach(element => {
            element.selected = false;
        })

        let currentProj = projArray.find(element => {
            if(element.title == someThis.textContent) {
                element.selected = true;
            }
        })

        populateDom.displayAllTasks();
        projectNameLabel.textContent = someThis.textContent;

    }

    return {
        projectNameLabel,
        showProjects,
        popDomWithProjectTasks
    }

})()

const allTasks = (() => {

    const allTasksButton = document.querySelector(".todo");
    allTasksButton.addEventListener("click", function() {
        ShowEveryProjectInDom();
    });
    

    function ShowEveryProjectInDom() {
        let domTasks = document.querySelectorAll(".task-cell");
        for(let i = 1; i < domTasks.length; i++ ) {
            domTasks[i].remove();
        }

        projArray.forEach(element => {
           element.selected = true;
           populateDom.displayAllTasks();
           element.selected = false;
        })

        projects.projectNameLabel.textContent = "All Tasks";

    }

    // return {
    //     allTasksButton
    // }
    

})();

const dueToday = (() => {
    const todayButton = document.querySelector('.due-today');
    todayButton.addEventListener("click", function() {
        showAllDueToday();
    })

    function showAllDueToday() {
        let domTasks = document.querySelectorAll(".task-cell");
        for(let i = 1; i < domTasks.length; i++ ) {
            domTasks[i].remove();
        }

        let today = new Date();
        today = String(today);
        let todayParse = today.substring(0, 15);
        console.log(todayParse);

        projArray.forEach(element => {
            element.selected = true;
            element.tasks.forEach(taskElement => {
                if(taskElement.dueDate == todayParse) {
                    console.log(taskElement.dueDate);
                    populateDom.displayTask(element.tasks.indexOf(taskElement));
                }
            })
            element.selected = false;
        })

        projects.projectNameLabel.textContent = "Due Today";
    }

})()

//localStorage.setItem("test to stringify", JSON.stringify(projArray[1]));
//let testProj = JSON.parse(localStorage.getItem("test to stringify"));
//console.log(testProj);

export {projects, allTasks, dueToday};