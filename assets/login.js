let baliseMail = document.querySelector(".email")
let balisePassword = document.querySelector(".password")
let connectBtn = document.querySelector(".connection")
let form = document.querySelector("form")
let errorDiv = document.querySelector(".error")

form.addEventListener("submit", (event)=> {
    event.preventDefault()
})

connectBtn.addEventListener("click", async ()=> {
    let email = baliseMail.value
    let password = balisePassword.value 
    let data = {
        email: email,
        password: password
    }
    let reponse = await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    })
    let token = await reponse.json()
    switch(reponse.status) {
        case 401 :
            errorDiv.innerHTML = '<p class="no-password">Mot de Passe incorrect!</p>' 
            break
        case 404 : 
            errorDiv.innerHTML = '<p class="user-unknown">Utilisateur inconnu!</p>'
            break   
        case 200 :
            localStorage.setItem("token", JSON.stringify(token))
            document.location.href='index.html'       
            break
    }

})