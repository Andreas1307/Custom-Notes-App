const searchBar = document.getElementById("search-bar");
const createNote = document.querySelector(".create-note");
const notesContainer = document.querySelector(".notes");
const body = document.querySelector("body");

let notesArr = [];



createNote.addEventListener("click", () => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("noteDiv");
    body.appendChild(noteDiv);
    
    const noteName = document.createElement("input");
    noteName.classList.add("noteName");
    noteName.setAttribute("placeholder", "Enter note name");
    noteDiv.appendChild(noteName);
    
    const textArea = document.createElement("textarea");
    textArea.classList.add("textArea");
    textArea.setAttribute("placeholder", "Enter note description");
    noteDiv.appendChild(textArea);
    
    const createButton = document.createElement("button");
    createButton.textContent = "Create Note";
    createButton.classList.add("createButton");
    noteDiv.appendChild(createButton);
    
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("cancelButton");
    noteDiv.appendChild(cancelButton);

    cancelButton.addEventListener("click", () => {
        if (noteName.value === "" && textArea.value === "") {
            noteDiv.remove();
            return;
        }
        const confirmed = confirm("Are you sure you want to delete the note?");
        if (confirmed) {
            noteDiv.remove();
        }
    });

    createButton.addEventListener("click", () => {
        if (noteName.value === "" && textArea.value === "") {
            alert("You must enter something before adding the note");
            return;
        }
        notesArr.push({
            name: noteName.value,
            description: textArea.value
        });

        renderTasks(notesArr);
        saveData();
        noteDiv.remove();
    });
});

const renderTasks = (arr) => {
    notesContainer.innerHTML = "";
    arr.forEach((elem, index) => {
        const { name, description } = elem;
        createTask(name, description, index);
    });
};

const createTask = (noteName, textArea, index) => {
    const divNote = document.createElement("div");
    divNote.classList.add("divNote");
    notesContainer.appendChild(divNote);
    
    const noteTitle = document.createElement("h2");
    divNote.appendChild(noteTitle);
    noteTitle.textContent = noteName;
    noteTitle.dataset.fullText = noteName;
    
    const noteDescription = document.createElement("textarea");
    noteDescription.setAttribute("readonly", "true");
    noteDescription.classList.add("noteDescription");
    noteDescription.dataset.fullText = textArea
    noteDescription.value = textArea;
    divNote.appendChild(noteDescription);

    const deleteNote = document.createElement("button");
    deleteNote.classList.add("deleteNote");
    divNote.appendChild(deleteNote)
    deleteNote.innerHTML = `<i class="fa-solid fa-dumpster"></i>`
    deleteNote.addEventListener("click", () => {
        const confirmed = confirm("Are you sure you want to delete the note?");
        if(confirmed) {
            notesArr.splice(index, 1); 
            saveData();  
            renderTasks(notesArr);
        }
    })
    const editNote = document.createElement("button");
    editNote.classList.add("editNote");
    editNote.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    divNote.appendChild(editNote);
    editNote.addEventListener("click", () => {
        editNoteButton(divNote, noteTitle, noteDescription, index)
    })
    checkTextLength(noteTitle, 10);
    checkTextLength(noteDescription, 140);
};


const editNoteButton = (divNote, noteTitle, noteDescription, index) => {
    divNote.innerHTML = "";
    divNote.classList.add("edit")
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = noteTitle.dataset.fullText;
    titleInput.classList.add("editTitle");
    divNote.appendChild(titleInput);
    
    const descriptionInput = document.createElement("textarea");
    descriptionInput.value = noteDescription.dataset.fullText;;
    descriptionInput.classList.add("editDescription");
    divNote.appendChild(descriptionInput);
    descriptionInput.removeAttribute("readonly");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("saveButton");
    divNote.appendChild(saveButton);

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("cancelButton");
    divNote.appendChild(cancelButton);


    saveButton.addEventListener("click", () => {
        notesArr[index].name = titleInput.value;
        notesArr[index].description = descriptionInput.value;
        renderTasks(notesArr);
        saveData();
        divNote.classList.remove("edit")
    });

    cancelButton.addEventListener("click", () => {
        renderTasks(notesArr);
        divNote.classList.remove("edit")
    });
    
};

const checkTextLength = (element, maxLenght) => {
    if (element.textContent.length > maxLenght) {
        const changedValue = element.textContent.slice(0, maxLenght) + "...";
        element.textContent = changedValue;
    }

    if (element.tagName === "TEXTAREA" && element.value.length > maxLenght) {
        const changedText = element.value.slice(0, maxLenght) + "...";
        element.value = changedText;
    }
};

const searchNotes = () => {
    const searchValue = searchBar.value.trim().toLowerCase();
    notesContainer.innerHTML = "";

    if (searchValue) {
        const matchedArr = notesArr.filter(note => note.name.toLowerCase().includes(searchValue));
        if (matchedArr.length > 0) {
            renderTasks(matchedArr);
        } else {
            notesContainer.innerHTML = `<p class="search-fail">No notes found</p>`;
        }
    } else {
        renderTasks(notesArr);
    }
};

searchBar.addEventListener("input", searchNotes);

const saveData = () => {
    localStorage.setItem("notes", JSON.stringify(notesArr));
};

const loadData = () => {
    const savedData = localStorage.getItem("notes");
    if (savedData) {
        notesArr = JSON.parse(savedData);
        renderTasks(notesArr);
    }
};

window.addEventListener("load", loadData);