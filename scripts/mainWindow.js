//Requires
const electron = require("electron");
const { ipcRenderer } = electron;

//General Variables
let exercisesArray = [];
let amountOfExercisesAndRestsLeft = 0;
let amountOfRounds;
let exerciseTime;
//General QuerySelectors
const ul = document.querySelector("ul");
const startTimer = document.querySelector("#startTimer"); //Start button
const stopTimer = document.querySelector("#stopTimer");
const timerInput = document.querySelector("#timerInput"); //Input
let timeinterval; //TimeInterval-Variable
let count = 0;
let roundRestTime = document.querySelector("#roundRestTime").value; //Ska nog göras om till General Variable
//EventListeners
startTimer.addEventListener("click", startTimerFunc)
stopTimer.addEventListener("click", stopTimerFunc);
//ipcRenderer to handle to sending of the exercise-array from the addWindow.
ipcRenderer.on("exercise:add", function (e, exercises) {
    exercisesArray = exercises;
    amountOfExercisesAndRestsLeft = exercises.length;
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
//Functions
function startClock() {
    console.log(amountOfRounds);
    if (amountOfRounds > 0) {
        if (count === 0 && exercisesArray[amountOfExercisesAndRestsLeft - 1].type === "REST") {
            amountOfExercisesAndRestsLeft--;
            handleRestTime();
        }
        else {
            if (count === 0) {
                amountOfExercisesAndRestsLeft--;
                amountOfRounds--;
                exerciseTime = document.querySelector("#exerciseTime").value;
                count = exerciseTime;
            }
            handleExercise();
        }
    }
    else {
        stopTimerFunc();
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
    amountOfRounds = document.querySelector("#rounds").value;
    timeinterval = setInterval(startClock, 1000);
}
function stopTimerFunc() {
    clearInterval(timeinterval);
}

//Solve the pause between every round problem
//Add Pause-function to the timer? Typ boolean om true så körs intervallen, om false körs den inte. Den loopar ju dock ändå, men det kanske verkar vara bäst.