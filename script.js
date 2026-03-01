let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}
function addTask(){
    const text = document.getElementById("taskInput").value;
    const subject =document.getElementById("taskSubject").value;
    const date = document.getElementById("taskDate").value;
    const time = document.getElementById("taskTime").value;
    if (!text || !subject || !date || !time){
        alert("Please fill all details!");
        return;
        }
        const deadline = new Date(date + "T"+ time); 
    tasks.push({
        id: Date.now(), 
        text: text,
        subject: subject,
        date: date,
        time: time, 
        deadline: deadline, 
        completed: false
    });
    document.getElementById("taskInput").value="";
    document.getElementById("taskSubject").value="";
    document.getElementById("taskDate").value="";
    document.getElementById("taskTime").value="";
    saveTasks();
    displayTask();
    displayCharts();

}
function removeTask(id){
    tasks = tasks.filter(task => task.id !==id);
    saveTasks();
    displayTask();
    displayCharts();
}
function renameTask(id){
    const newName = prompt("Enter new task name:");
    if(!newName) return;
    tasks = tasks.map(task =>{
        if (task.id === id){
            task.text = newName;
        }
        return task;
    });
    saveTasks();
    displayTask();
}
function ifcompleted(id){
    const now = new Date();
    tasks = tasks.map(task =>{
        if (task.id ===id){
            const deadline = new Date(task.deadline);
        
            if(now>deadline){
                alert("Deadline Exceeded, Can't Mark As Compeleted");
                return task;
            }
            task.completed = true;    
    }
    return task;
});
    saveTasks();
    displayTask();
    displayCharts();
}
function remainingTime(deadline){
    const now =new Date();
    const end = new Date(deadline);
    const diff = end - now;
    const days = Math.floor(diff/(1000*60*60*24));
    const hours = Math.floor((diff/(1000*60*60))%24);
    const minutes = Math.floor((diff/(1000*60))%60);
    return days + "d " + hours + "h " + minutes + "m left"
}
function displayCharts(){
    const chartsContainer = document.getElementById("chartsContainer");
    chartsContainer.innerHTML = "";

    const subjects = {};

    tasks.forEach(task => {
        if (!subjects[task.subject]) {
            subjects[task.subject] = { completed: 0, pending: 0 };
        }

        if (task.completed) {
            subjects[task.subject].completed++;
        } else {
            subjects[task.subject].pending++;
        }
    });

    for (let subject in subjects){
        const canvas = document.createElement("canvas");
        chartsContainer.appendChild(canvas);

        const data = subjects[subject];

        new Chart(canvas, {
            type: "pie",
            data: {
                labels: ["Completed", "Pending"],
                datasets: [{
                    data: [data.completed, data.pending]
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: subject + " Progress"
                    }
                }
            }
        });
    }
}

function displayTask(){
    
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach(task=>{
        const now = new Date();
        const deadline = new Date(task.deadline);
        
        const li =document.createElement("li");

        li.innerHTML = `
${task.subject} - ${task.text}
(${task.date} ${task.time}) - ${remainingTime(task.deadline)}
<button onclick="ifcompleted(${task.id})">✔</button>
<button onclick="renameTask(${task.id})">Rename</button>
<button onclick="removeTask(${task.id})">Delete</button>
`;
    if (task.completed){
        li.style.textDecoration = "line-through";
       }
    if (now > deadline && !task.completed){
            li.style.backgroundColor = "#5a1a1a";
    }
    taskList.appendChild(li);
    });
 
}
window.onload = function(){
    displayTask();
    displayCharts();
};
setInterval(displayTask,60000);
