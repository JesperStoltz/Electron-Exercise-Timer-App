const electron = require("electron");
const { ipcRenderer } = electron;

const form = document.querySelector("form");
form.addEventListener("submit", submitForm);

let exerciseArray = [];

function submitForm(e) {
    e.preventDefault();
    let exercise = document.querySelector("#exercise").value;
    exerciseArray.push({ type: "EXERCISE", name: exercise });
    const ul = document.querySelector("ul");
    if (document.querySelector("#restCheckbox").checked === true) {
        exerciseArray.push({ type: "REST", name: "REST" });
        const li = document.createElement("li");
        const exerciseName = document.createTextNode(exerciseArray[exerciseArray.length - 2].name);
        const li2 = document.createElement("li");
        const rest = document.createTextNode(exerciseArray[exerciseArray.length - 1].name);
        li.appendChild(exerciseName);
        ul.appendChild(li);
        li2.appendChild(rest);
        ul.appendChild(li2);

        //refocus on input:
        const input = document.querySelector("#exercise");
        input.focus();
    }
    else if (document.querySelector("#restCheckbox").checked === false) {
        const li = document.createElement("li");
        const exerciseName = document.createTextNode(exerciseArray[exerciseArray.length - 1].name);
        li.appendChild(exerciseName);
        ul.appendChild(li);
        
        //refocus on input:
        const input = document.querySelector("#exercise");
        input.focus();
    }
    document.querySelector("#exercise").value = "";
};

const closeAddButton = document.querySelector("#closeAddButton");
function closeWindow() {
    if (exerciseArray[exerciseArray.length - 1].type === "REST") {
        exerciseArray.pop();
    }
    ipcRenderer.send("exercise:add", exerciseArray);
};
closeAddButton.addEventListener("click", closeWindow)