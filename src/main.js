import { buildArray, addTask } from "./constructors.js";
import { projects } from "./sidebar.js";
import './styles.css';

let projArray = [];

const localStorageFunc = (()=> {


    const checkForProjectArray = (() => {
        console.log("i ran");
        //console.log(projArray);

        for(let i = 0; i < localStorage.length; i++) {
            if(localStorage.key(i) == "allProjectsStringified") {
                console.log("found projects in local storage");
                projArray = JSON.parse(localStorage.getItem("allProjectsStringified"));
            }
        }
        console.log(projArray);
        if(projArray.length > 0) {
            projects.showProjects();
            // document.querySelectorAll(".list-items").forEach(element => {
            //     console.log('iterate though and make them have the even listener');
            //     element.addEventListener("click", function() {
            //         let someThis = this;
            //         console.log('iterate though and make them have the even listener');
            //         projects.popDomWithProjectTasks(someThis);
            //     })
            // })
            // projArray.forEach(element => {
            //     element.selected = false;
            // })
        } else {
            buildArray.appendArray("Example Project");
            addTask.appendTask("Cook the Beans", "Thu Feb 18 2021");
            addTask.appendTask("Eat the Beans", "Thu Feb 18 2021");
            addTask.appendTask("...Dispose of the Beans", "Thu Feb 19 2021");
            projects.showProjects();

        }

    })();

    function projectsToLocalStorage() {
        for(let i = 0; i < localStorage.length; i++) {
            if(localStorage.key[i] == "allProjectsStringified") {
                localStorage.removeItem("allProjectsStringified");
            }
        }
        localStorage.setItem("allProjectsStringified", JSON.stringify(projArray));
        
    }

    return {
        projectsToLocalStorage
    }

})();

document.querySelector(".todo").click();

export {localStorageFunc, projArray};