//REQUIRES
const electron = require("electron");
const { ipcRenderer } = electron;
//GENERAL VARIABLES
//NUM
let count = 0;
let amountOfExercisesAndRestsLeft = 0;
let amountOfRounds = 0;
let exerciseTime = 0;
let restTime = 0;
//ARRAYS
let exercisesArray = [];
//BOOLEANS
let pause = false;
let firstRound = true;
//FUNCTIONS/INTERVALS
let timeinterval;
//GENERAL QUERYSELECTORS
const ul = document.querySelector("ul");
const startTimer = document.querySelector("#startTimer");
const stopTimer = document.querySelector("#stopTimer");
const pauseTimer = document.querySelector("#pauseTimer");
const timerInput = document.querySelector("#timerInput");
const roundRestTime = document.querySelector("#roundRestTime");
//EVENTLISTENERS
ul.addEventListener("dblclick", removeItem);
startTimer.addEventListener("click", startTimerFunc)
stopTimer.addEventListener("click", stopTimerFunc);
pauseTimer.addEventListener("click", pauseTimerFunc);
//IPCRENDERS
ipcRenderer.on("exercise:add", function (e, exercises) { //ipcRenderer to handle to sending of the exercise-array from the addWindow.
    exercisesArray = exercises; //Sets the array of exercises that was sent from the addWindow to a general variable.
    for (let i = 0; i < exercises.length; i++) { //Loop to create listItems and append them to the ul to show the athlete the added exercises.
        let li = document.createElement("li");
        li.setAttribute("id", exercises[i].name)
        const exerciseName = document.createTextNode(exercises[i].name);
        li.appendChild(exerciseName);
        ul.appendChild(li);
    }
    exercisesArray = exercisesArray.reverse();
    console.log(exercisesArray)
});
ipcRenderer.on("item:clear", function () { //ipcRenderer handle the signals to clear the ul from the File -> Clear List-button.
    ul.innerHTML = ""; //Empties the innerHTML of the list.
});
//FUNCTIONS
function startClock() { //1. The function that is run in the interval.
    if (pause !== true) { //2. First check that the interval isn't on pause.
        if (amountOfExercisesAndRestsLeft > 0) { //3. Then check if there's still exercises/rest left to do on the round.
        console.log(exercisesArray[amountOfExercisesAndRestsLeft].name)
            if (count === 0) { //4. If the current count has reached 0.
                console.log(amountOfExercisesAndRestsLeft);
                amountOfExercisesAndRestsLeft--; //Remove one exercise/rest-INT from the variable.
                console.log(amountOfExercisesAndRestsLeft)
                if (exercisesArray[amountOfExercisesAndRestsLeft].type === "REST") {
                    handleRestTime();
                }
                else if (exercisesArray[amountOfExercisesAndRestsLeft].type === "EXERCISE") {
                    handleExerciseTime();
                }
            }
            else { //If the count has not reached 0.
                continueCount(); //Run the continueCount();
            } //End of 4.
        }
        else if (amountOfExercisesAndRestsLeft === 0) { //If there's no exercises/rest left
            removeAndEvaluateRounds(); //Run the function to check if there's rounds left.
        } //End of 3.
    } //End of 2.
}// End of 1.
function continueCount() {
    timerInput.value = count;
    count--;
}
function handleRestTime() {
    restTime = document.querySelector("#restTime").value;
    count = restTime;
    timerInput.value = count;
    count--;
}
function handleExerciseTime() {
    exerciseTime = document.querySelector("#exerciseTime").value;
    count = exerciseTime;
    timerInput.value = count;
    count--;
}
function removeAndEvaluateRounds() {
    amountOfRounds--;
    if (amountOfRounds > 0) {
        if (firstRound) {
            clearInterval(timeinterval);
            startTimerFunc();
            firstRound = false;
        }
        else {
            clearInterval(timeinterval);
            count = roundRestTime.value;
            timerInput.value = count;
            setTimeout(() => {
                startTimerFunc();
            }, parseInt(count) );         
        }

    }
    else if (amountOfRounds === 0) {
        clearInterval(timeinterval);
    }
}
function stopTimerFunc() {
    clearInterval(timeinterval);
}
function pauseTimerFunc() {
    pause = !pause;
}
function startTimerFunc() {
    exerciseTime = document.querySelector("#exerciseTime").value;
    count = exerciseTime;
    if (amountOfRounds === 0) {
        amountOfRounds = document.querySelector("#rounds").value;
    }
    if (exercisesArray.length > 0) {
        amountOfExercisesAndRestsLeft = exercisesArray.length -1;
        timeinterval = setInterval(startClock, 1000);
    }
}
function removeItem(e) {
    let index = exercisesArray.indexOf(e.target.id);
    exercisesArray.splice(index, 1);
    e.target.remove();
    console.log(exercisesArray)
}