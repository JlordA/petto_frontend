//------Sound ------//
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = 0.07;
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
 

function initialize() {
    let catJam = new sound("./src/assets/Neko atsume Original BGM.mp3")
    catJam.play()
}




//------State-----//

let petId = 0
let currentUser = false
let petCurrent = {}


//------elements------//
const username = document.querySelector("#username")
const userPets = document.querySelector("#pets-container")
const petHunger = document.querySelector("#hunger-progress")
const petCleanliness = document.querySelector("#clean-progress")
const petEnergy = document.querySelector("#energy-progress")
const petHappiness = document.querySelector("#happy-progress")
const petImg = document.querySelector(".petimg")
const petTitle = document.querySelector("#pet-title")
const actionsTitle = document.querySelector("#actions-title")
const friendList = document.querySelector("#friend-container")
const petList = document.querySelector("#pets-container")
const heartIcon = document.querySelector("#heart")
const logIn = document.querySelector("#log-in")
const petsContainerText = document.querySelector("#pets-container-text")
const statsList = document.querySelector("#stats-list")
const containerList = document.querySelector("#container-title")
let displayButton = document.querySelectorAll(".button_display")
const userDiv = document.querySelector("#user-div")
const htmlBody = document.querySelector("body")
const logOutBtn = document.querySelector("#log-out")
const statBtns = document.querySelector("#button-container")
const background = document.querySelector(".petbackground")
const notYourPets = document.querySelectorAll(".notyourpet")
const bio = document.querySelector("#bio")
const owner = document.querySelector("#user")
const deleteUser = document.querySelector('#delete')
const bioDiv = document.querySelector("#pet-bio")

//-------fetches-------//



const petFetch = (id) => {
    fetch(`https://pettodigital.herokuapp.com/api/pets/${id}`)
        .then(r => r.json())
        .then(petObject => {
            // console.log(petObject)
            renderPet(petObject)
        })
}

const allPetFetch = () => {
    fetch('https://pettodigital.herokuapp.com/api/pets')
        .then(r => r.json())
        .then(petArray => {
            
            const cleanArray = []
            petArray.forEach(pet =>{ 
                if(pet.user_id != userId){
                    cleanArray.push(pet)
                }
            })

          const randomPet = shuffle(cleanArray)
         
          friendList.innerHTML = ""
          randomPet.slice(0,6).forEach(pet => { 
                // debugger
                renderFriend(pet) 
                })
            
        })
} 

const userFetch = (name) => {    
    fetch(`https://pettodigital.herokuapp.com/api/users/${name}`)
    .then(r => r.json())
    .then(loginUser => {
        // console.log(loginUser)
        userId = loginUser.id
        currentUser = true
        renderUser(loginUser)
            userPets.innerHTML = ""
            loginUser.pets.forEach(pet =>{
                renderUserPet(pet)
                renderPet(loginUser.pets[0])
                allPetFetch()
            })
        } 
    )

}

//--------render functions----------//

function renderButtons(buttonflag) {


    if (!buttonflag) {
        displayButton.forEach((button) => {
            button.style.display = "none"
        })

    } else if (buttonflag) {
        displayButton.forEach((button) => {
            button.style.display = ""
        })
        btn.style.display = "none"
    }

}

const renderUser = (user) => {
    username.textContent = user.name
    currentUser = true
    logIn.innerHTML = ""
    renderButtons(currentUser)
    user.pets.forEach(pet => {renderUserPet(pet)})
}

const renderUserPet = (pet) => {
    petsContainerText.textContent = "Your Petto"
    let petLi = document.createElement("li")
    petLi.textContent = pet.name
    petLi.dataset.id = pet.id
    userPets.append(petLi)
}



const renderPet = (pet) => {
    petCurrent = pet
    const owner = document.querySelector("#user")
    console.log(pet)
    if (pet.user) {
        owner.textContent = `My Owner is: ${pet.user.name}`   
    } else {
        owner.textContent = `My Owner is: ${username.textContent}` 
    }
    const created_at = pet.created_at.substring(0,10)
    const updatedDate = changeDate(created_at)
    
    const bday = document.querySelector("#bday")
    const bio = document.querySelector("#bio")
    const happyLI = document.createElement("li")
    const hungerLI = document.createElement("li")
    const energyLI = document.createElement("li")
    const cleanLI = document.createElement("li")
    const collectPet = document.querySelector("#collect-petto")
    const poop = document.querySelector(".poop")
    const foodBowl = document.querySelector(".food-bowl")

    collectPet.textContent = ""

    const petHappiness = document.createElement("progress")
    petHappiness.id = "happy-progress"
    const petHunger = document.createElement("progress")
    petHunger.id = "hunger-progress"
    const petCleanliness = document.createElement("progress")
    petCleanliness.id = "clean-progress"
    const petEnergy = document.createElement("progress")
    petEnergy.id = "energy-progress"
    
    petHunger.value = 0
    petCleanliness.value = 0
    petEnergy.value = 0
    petHappiness.value = 0
    petHunger.max = 100
    petCleanliness.max = 100
    petEnergy.max = 100
    petHappiness.max = 100

        
    petId = pet.id
    petHunger.value = pet.hunger
    petCleanliness.value = pet.cleanliness
    petEnergy.value = pet.energy
    petHappiness.value = pet.happiness
    
    happyLI.textContent = "Happiness:"
    hungerLI.textContent = "Hunger:"
    energyLI.textContent = "Energy:"
    cleanLI.textContent = "Cleanliness:"
    
    
    happyLI.append(petHappiness)
    hungerLI.append(petHunger)
    energyLI.append(petEnergy)
    cleanLI.append(petCleanliness)
    
    statsList.innerHTML = ""
    statsList.append(happyLI, hungerLI, energyLI, cleanLI)
    
    if(pet.happiness >= 50 && pet.hunger <= 50){
        petImg.src = pet.happy_img
    } else {
        petImg.src = pet.sad_img
    }

    if(pet.hunger > 50){
        foodBowl.src = "https://i.imgur.com/VODcF31.png"
    } else {
        foodBowl.src = ""
    }

    if(pet.cleanliness < 50){
        poop.src = "https://i.imgur.com/7wnY7pc.png"
    } else{
        poop.src = ""
    }
    
    bio.textContent = `Bio: ${pet.bio}`
    bday.textContent = `I Was Born On: ${updatedDate}`
    petTitle.textContent = pet.name
    actionsTitle.textContent = `What Will You Do With ${pet.name}?`
    petCurrent = pet

    //debugger
    if(!pet.user){
        bioDiv.style.display = "none"
    } else {
        if (pet.user.name == username.textContent){
            bioDiv.style.display = "none"
        } else {
            bioDiv.style.display = ""
        }
    }       
    
}

const renderFriend = (pet) => {
    let friendLi = document.createElement("li")
    friendLi.textContent = pet.name
    friendLi.dataset.id = pet.id
    friendList.append(friendLi)
    // debugger
}


//Helper Functions

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function changeDate(str){
    let updatedDate = str.split("-")
    const bornYear = parseInt(updatedDate[0])
    const bornMonth = parseInt(updatedDate[1])-1
    const bornDate = parseInt(updatedDate[2])

  const options = {month: 'long', year:'numeric', day:'numeric'}

  const born  = new Date(bornYear,bornMonth,bornDate)
 return  born.toLocaleDateString('en-US',options)
}

//---------event handlers----------//


logOutBtn.addEventListener("click", () => {
    location.reload()
})

deleteUser.addEventListener("click", (event) =>{
    event.preventDefault()
    console.log(username.textContent)
    
    let r = confirm("Are you Sure you want to Delete your account?")
    if (r == true) {
    location.reload()
    fetch(`https://pettodigital.herokuapp.com/api/users/${username.textContent}`, {
        method: 'DELETE'
    })
    } else {
    }
})

friendList.addEventListener("click", (event) => {
    if (event.target.tagName === 'LI') {
        const notYourPets = document.querySelectorAll(".notyourpet")
        background.src = "https://i.imgur.com/2IJwIpi.png"
        petImg.style.display = ""
        const id = event.target.dataset.id
        petFetch(id)
        
        notYourPets.forEach((button) => {
            button.style.display = "none"
        })
        actionsTitle.style.display = "none"
    }
})

petList.addEventListener("click", (event) => {
    if (event.target.tagName === 'LI') {
        background.src = "https://i.imgur.com/2IJwIpi.png"
        petImg.style.display = ""
        const id = event.target.dataset.id
        petFetch(id)

        notYourPets.forEach((button) => {
            button.style.display = ""
        })
        actionsTitle.style.display = ""
    }

})

heartIcon.addEventListener("click", () => {

    if (petCurrent.happiness < 100) {
    fetch(`https://pettodigital.herokuapp.com/api/pets/${petId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            happiness: petCurrent.happiness + 10
        }),
    })
        .then(response => response.json())
        .then(data => {
            renderPet(data)
        })
    }
})


logIn.addEventListener("submit", (e) => {
    e.preventDefault()
    const userName = e.target.name.value
    
    if (!userName) {
        alert("Enter Username")
    }
    else { 
        userFetch(userName)
        initialize()
        background.src = "https://i.imgur.com/2IJwIpi.png"
    }   
})
    

statBtns.addEventListener("click", (e) => {
    const petHunger = document.querySelector("#hunger-progress")
    const petCleanliness = document.querySelector("#clean-progress")
    const petEnergy = document.querySelector("#energy-progress")
    const petHappiness = document.querySelector("#happy-progress")
    const petImg = document.querySelector(".petimg")
    const foodBowl = document.querySelector(".food-bowl")

    let hunger = petHunger.value
    let energy = petEnergy.value
    let happiness = petHappiness.value
    let cleanliness = petCleanliness.value
    let petObject = {}

    if (e.target.dataset.id === "Feed") {
        background.src = "https://i.imgur.com/2IJwIpi.png"
        petImg.style.display = ""
        foodBowl.style.display = ""
        hunger = hunger - 10
        cleanliness = cleanliness - 10
        
        if(hunger < 0) hunger = 0
        if(cleanliness < 0) cleanliness = 0

        petObject = {
            hunger: hunger,
            cleanliness: cleanliness
        }
    } else if (e.target.dataset.id === "Play") {
        background.src = "https://i.imgur.com/2IJwIpi.png"
        petImg.style.display = ""
        foodBowl.style.display = ""

        energy = energy - 10
        cleanliness = cleanliness - 10
        hunger = hunger + 10

        if(energy < 0) energy = 0
        if(cleanliness < 0) cleanliness = 0
        if(hunger > 100) hunger = 100

        petObject = {
            energy: energy,
            cleanliness: cleanliness,
            hunger: hunger
        }

    } else if (e.target.dataset.id === "Clean") {
        background.src = "https://i.imgur.com/2IJwIpi.png"
        petImg.style.display = ""
        foodBowl.style.display = ""

        cleanliness = cleanliness + 10
        happiness = happiness - 10
            
        if(cleanliness > 100) cleanliness = 100
        if(happiness < 0) happiness = 0
        
        petObject = {
            cleanliness: cleanliness,
            happiness: happiness
        }
        
    } else if (e.target.dataset.id === "Rest") {
        background.src = "https://i.imgur.com/vvPEnOp.gif"
        foodBowl.style.display = "none"
        
        petImg.style.display = "none"
        
        energy = energy + 10
        
        if(energy > 100) energy = 100;

        petObject = {
            energy: energy,     
        }
    }
    // console.log(petId)
    //debugger
    fetch(`https://pettodigital.herokuapp.com/api/pets/${petId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(petObject),
    })
        .then(response => response.json())
        .then(newPetData => {
            console.log(newPetData)
            renderPet(newPetData);
        })
})
//-----initialize------//

// allPetFetch()
// // userFetch(2)
// petFetch(25)
renderButtons(currentUser)

