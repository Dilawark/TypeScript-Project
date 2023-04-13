type formData = {
    // active: HTMLSelectElement
    // vendor: HTMLSelectElement
    fName: string
    lName: string
    email: string
}

// const active = document.querySelector<HTMLSelectElement>(".select-value")
// const vendor = document.querySelector<HTMLSelectElement>(".vendor-value")
const form = document.querySelector<HTMLFormElement>(".form")
const firstName = document.querySelector<HTMLInputElement>("#firstName")
const lastName = document.querySelector<HTMLInputElement>("#lastName")
const email = document.querySelector<HTMLInputElement>("#email")
const saveButton = document.querySelector<HTMLButtonElement>(".save")
const leftCard = document.querySelector<HTMLDivElement>(".user-information-row")
// const userName = document.querySelector<HTMLHeadingElement>(".manage-user")

const users: formData[] = loadUsers()
users.forEach(addNewUserToList)

function handleSubmit(e: Event) {
    e.preventDefault();

    // if(active?.value=="" || active?.value==null) return
    // else if(vendor?.value=="" || vendor?.value==null) return
    if(firstName?.value=="" || firstName?.value==null) return
    if(lastName?.value=="" || lastName?.value==null) return
    if(email?.value=="" || email?.value==null) return

    const newUser: formData = {
        // active: active?.options,
        // vendor: vendor?.options,
        fName: firstName.value,
        lName: lastName.value,
        email: email.value
    }

    users.push(newUser)

    saveUsers()

    addNewUserToList(newUser)

    form!.reset();
}

form?.addEventListener("submit", handleSubmit)

function addNewUserToList(user: formData) {
    const columnDiv = document.createElement("div");
    const anchorDiv = document.createElement("div");
    const buttonDiv = document.createElement("div");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    const anchor = document.createElement("a");
    const hr = document.createElement("hr");

    // Set user data as data attribute on DOM elements
    columnDiv.dataset.userId = user.email; // Use a unique identifier for user, e.g., email
    columnDiv.dataset.userData = JSON.stringify(user); // Store user data as stringified JSON
    anchor.textContent = `${user.fName} | ${user.lName} | ${user.email}`;
    editBtn.textContent = "Edit";
    deleteBtn.textContent = "Delete";

    columnDiv.classList.add("user-information-col")
    anchorDiv.classList.add("anchor-div")
    buttonDiv.classList.add("edit-delete")
    editBtn.classList.add("edit")
    editBtn.classList.add("update-btn")
    deleteBtn.classList.add("delete")
    deleteBtn.classList.add("update-btn")

    editBtn.addEventListener("click", () => {
        const userId = columnDiv.dataset.userId;
        const userDataString = columnDiv.dataset.userData;
        if (userDataString) {
            const userData: formData = JSON.parse(userDataString);
            // Fill the form fields with the user data
            firstName!.value = userData.fName;
            lastName!.value = userData.lName;
            email!.value = userData.email;
    
            // Update the form submit event listener to handle the edit action
            form?.removeEventListener("submit", handleSubmit);
            form?.addEventListener("submit", (e) => {
                e.preventDefault();
    
                // Update the user data with the edited values
                userData.fName = firstName!.value;
                userData.lName = lastName!.value;
                userData.email = email!.value;
    
                // Find the index of the user in the users array
                const index = users.findIndex((user) => user.email === userId);
                if (index !== -1) {
                    // Update the user in the users array
                    users[index] = userData;
    
                    // Update the user information in the left card
                    anchor.textContent = `${userData.fName} | ${userData.lName} | ${userData.email}`;
                    saveUsers();
                }
    
                // Reset the form fields
                form.reset();
            });
        }
    });

    deleteBtn.addEventListener("click", () => {
        const userId = columnDiv.dataset.userId;
        const index = users.findIndex(user => user.email === userId);
        users.splice(index, 1);    
        saveUsers();    
        columnDiv.remove();
    });    

    buttonDiv.append(editBtn, deleteBtn)
    anchorDiv.append(anchor, buttonDiv)
    columnDiv.append(anchorDiv, hr)
    leftCard?.append(columnDiv)
}

function saveUsers () {
    localStorage.setItem("userDetail",  JSON.stringify(users))
}

function loadUsers (): formData[] {
    const userJSON = localStorage.getItem("userDetail")
    if (userJSON == null) return []
    return JSON.parse(userJSON)
}