//REQUIRES
const electron = require("electron");
const { ipcRenderer } = electron;

//GGENERAL VARIABLES
let exercisesArray = [];
let amountOfExercisesAndRestsLeft = 0;
let amountOfRounds = 0;
let exerciseTime = 0;
let pause = false;
//GENERAL QUERYSELECTORS
const ul = document.querySelector("ul");
const startTimer = document.querySelector("#startTimer");
const stopTimer = document.querySelector("#stopTimer");
const pauseTimer = document.querySelector("#pauseTimer");
const timerInput = document.querySelector("#timerInput");
const roundRestTime = document.querySelector("#roundRestTime");

let timeinterval;
let count = 0;
//EVENTLISTENERS
startTimer.addEventListener("click", startTimerFunc)
stopTimer.addEventListener("click", stopTimerFunc);
pauseTimer.addEventListener("click", pauseTimerFunc);
//IPCRENDERS
//ipcRenderer to handle to sending of the exercise-array from the addWindow.
ipcRenderer.on("exercise:add", function (e, exercises) {
    exercisesArray = exercises;
    for (let i = 0; i < exercises.length; i++) {
        let li = document.createElement("li");
        li.setAttribute("id", exercises[i].name)
        const exerciseName = document.createTextNode(exercises[i].name);
        li.appendChild(exerciseName);
        ul.appendChild(li);
    }
});
//ipcRenderer handle the signals to clear the ul
ipcRenderer.on("item:clear", function () {
    ul.innerHTML = "";
});
//Remove exercise on click
ul.addEventListener("dblclick", removeItem);
function removeItem(e) {
    let index = exercisesArray.indexOf(e.target.id);
    exercisesArray.splice(index, 1);
    e.target.remove();
    console.log(exercisesArray)
}
//FUNCTIONS
function startClock() {
    console.log(amountOfRounds);
    if (pause !== true) {
        if (amountOfExercisesAndRestsLeft > 0) {
            if (count === 0) {
                amountOfExercisesAndRestsLeft--;
                if (exercisesArray[amountOfExercisesAndRestsLeft].type === "REST") {
                    handleRestTime();
                }
                else {
                    exerciseTime = document.querySelector("#exerciseTime").value;
                    count = exerciseTime;
                }
            }
            else {
                handleExercise();
            }
        }
        else if (amountOfExercisesAndRestsLeft === 0) {
            addAndEvaluateRounds();
        }
    }
}
function handleExercise() {
    timerInput.value = count;
    count--;
}
function handleRestTime() {
    let restTime = document.querySelector("#restTime").value;
    count = restTime;
    timerInput.value = count;
    count--;
}
function startTimerFunc() {
    exerciseTime = document.querySelector("#exerciseTime").value;
    count = exerciseTime;
    if (amountOfRounds === 0) {
        amountOfRounds = document.querySelector("#rounds").value;
    }
    if (exercisesArray.length > 0) {
        amountOfExercisesAndRestsLeft = exercisesArray.length;
        timeinterval = setInterval(startClock, 1000);
    }
}
function stopTimerFunc() {
    clearInterval(timeinterval);
}
function pauseTimerFunc() {
    pause = !pause;
}

function addAndEvaluateRounds() {
    amountOfRounds--;
    if (amountOfRounds > 0) {
        clearInterval(timeinterval);
        startTimerFunc();
    }
    else if (amountOfRounds === 0) {
        clearInterval(timeinterval);
    }
}
//Solve the pause between every round problem