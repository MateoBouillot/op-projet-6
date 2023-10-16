const gallery = document.querySelector(".gallery")
const edition = document.querySelector(".edit")
const modif = document.querySelector(".modifier")  
let log = document.querySelector(".log")

let listWorks = ""
let listWorksAPI = ""



async function ajouterTravaux(){
    
    listWorks = localStorage.getItem("travaux")
    const data = await fetch("http://localhost:5678/api/works")
    listWorksAPI = await data.json()

    if (listWorks === data){
        listWorks = JSON.parse(listWorks)
    }else {
        listWorks=listWorksAPI
        localStorage.setItem("travaux", JSON.stringify(listWorks))
    }
    photoAcceuil ()
}
ajouterTravaux()

function photoAcceuil () {
    let photoHtml = " "
     for (let i=0; i<listWorks.length; i++) {
        let imgLink = listWorks[i].imageUrl
        let imgTitle = listWorks[i].title
   
        photoHtml += `
            <div>
                <img src="${imgLink}" alt="Travaux">
                <p>${imgTitle}</p>
            </div>    
            `
        }
        gallery.innerHTML = photoHtml
}

function affichageFiltres(){
    const filtre = document.querySelector(".filtres")
    filtre.innerHTML = `			
        <li class="filtre selected" id="tous" data-index="1">Tous</li>
        <li class="filtre" id="objets" data-index="2">Objets</li>
        <li class="filtre" id="appartements" data-index="3">Appartements</li>
        <li class="filtre" id="hotel-restaurants" data-index="4">Hôtels & restaurants</li>`
}

function connectionTest() {
    let token = localStorage.getItem("token")
    if (token === null) {
        affichageFiltres()
        log.innerHTML = 'login'
    } else {
        edition.innerHTML = '<i class="far fa-pen-to-square"></i><p>Mode édition</p>'
        edition.classList.add("edition")
        modif.innerHTML = '<i class="far fa-pen-to-square"></i><p>modifier</p>'
        log.innerHTML = 'logout'
    }
}
connectionTest()
console.log(log.href)
    if(log.innerHTML === "logout") {
        log.addEventListener("click", (event)=> {
            event.preventDefault()
            localStorage.removeItem("token")
            window.location.reload()
        })
    }

function filtres(filtre) {
    let listWorks = JSON.parse(localStorage.getItem("travaux"))
    let photoHtml = " "
    let filterList = listWorks.filter(function (work) {
        return work.category.name ==  filtre
    })
    
    for (let i=0; i<filterList.length; i++) {
        let imgLink = filterList[i].imageUrl
        let imgTitle = filterList[i].title
   
        photoHtml += `
            <div>
                <img src="${imgLink}" alt="Travaux">
                <p>${imgTitle}</p>
            </div>    
            `
        }
        gallery.innerHTML = photoHtml
}

const filtre = document.querySelectorAll(".filtre")
console.log(filtre)

for (let i=0; i<filtre.length; i++) {
    
    filtre[i].addEventListener("click", ()=> {
        filtre.forEach(function(item) {
            item.classList.remove("selected")
        })
        
        switch(filtre[i].dataset.index) {
            case "1" : 
                ajouterTravaux()
                filtre[0].classList.add("selected")
                break
            case "2" :
                filtres("Objets")
                filtre[1].classList.add("selected")
                break
            case "3" :
                filtres("Appartements")
                filtre[2].classList.add("selected")
                break
            case "4" :
                filtres("Hotels & restaurants") 
                filtre[3].classList.add("selected")           
                break
        }
    })
}

let modale = document.querySelector(".nomodale")

function modaleFirst () {
        if (modale.classList.length === 1) {
            modale.classList.add("modaleBG")
        }
        modale.innerHTML = 
        ` <div class="modale"> 
            <i class="fa-solid fa-xmark"></i>
            <h2 class="title-modale">Galerie photo</h2>
            <div class="photos-modale">  
            </div>
            <button class="btn-modale">Ajouter une photo</button>
        </div>`
        loadPhotoModale ()

        fermetureModale()
        modaleSecond ()
        workDelete()
    }

modif.addEventListener("click", ()=> {
    modaleFirst()
})

function loadPhotoModale () {
    let photos = document.querySelector(".photos-modale")
    photos.innerHTML = ''
    for (let i=0; i<listWorks.length; i++) {
        let imgLink = listWorks[i].imageUrl
        photos.innerHTML += `            
        <div class="photo-modale"> 
            <img src="${imgLink}" alt="Travaux">
            <i class="fas fa-trash-can" data-index="${i+1}"></i>
        </div>`
    }
}



function modaleSecond () {
    const btnAddPhoto = document.querySelector(".btn-modale")
    btnAddPhoto.addEventListener("click", ()=> {
        modale.innerHTML = `<div class="modale"> 
        <i class="fa-solid fa-xmark" id="xmark"></i>
		<i class="fa-solid fa-arrow-left"></i>
        <h2 class="title-modale">Ajout photo</h2>
		<form class="ajout-photo" name="ajout-photo" enctype="multipart/form-data">
			<label for="ajout-photo" class="div-file">
				<input type="file" name="ajoutphoto" id="ajout-photo" accept=".jpg,.png" class="input-modale" >
				<i class="fa-regular fa-image"></i>
				<h3>+ Ajouter photo</h3>
				<p>jpg, png : 4mo max</p>
			</label>	
			<label for="title">Titre</label>
			<input type="text" name="titleIMG" id="title" class="input-modale" >
			<label for="categorie">Catégorie</label>
			<select name="category" id="categorie" class="input-modale" >
				<option value=""></option>
				<option value="1" id="Objets">Objets</option>
				<option value="2" id="Appartements">Appartements</option>
				<option value="3" id="Hôtels-restaurants">Hôtels & restaurants</option>
			</select>
            <div class="barre"></div>	
            <button class="valider-photo">Valider</button>
		</form>
    </div>` 
    arrowBack ()
    fermetureModale()
    previewImage ()
    newWork()
    isFormFull ()  

    })
 
}

function fermetureModale() {
    const closeModale = document.querySelector(".fa-xmark")
    closeModale.addEventListener("click", ()=> {
        modale.classList.remove("modaleBG")
        modale.innerHTML = '' 
    })
}



function arrowBack() {
    const arrow = document.querySelector(".fa-arrow-left")
    arrow.addEventListener("click", ()=> {
        modaleFirst()
    })
}

function workDelete() {
    const trashCan = document.querySelectorAll(".fa-trash-can")
    let token = localStorage.getItem("token")
    token = JSON.parse(token)
    for (let i=0; i<listWorks.length; i++) {
        trashCan[i].addEventListener("click", async ()=> {
            await fetch(`http://localhost:5678/api/works/${listWorks[i].id}`, {
                method: "DELETE",
                body: JSON.stringify(listWorks[i].id),
                headers: {'Authorization': `Bearer ${token.token}`} 
            })
            listWorks = await fetch("http://localhost:5678/api/works")
            listWorks = await listWorks.json()
            localStorage.setItem("travaux", JSON.stringify(listWorks))
            photoAcceuil ()
            loadPhotoModale ()  
        })
    }
      
}




function previewImage() {
    const inputFile = document.getElementById("ajout-photo")
    let div = document.querySelector(".div-file")
    inputFile.addEventListener("change", function(event) {
        const file = event.target.files[0]
        let url = URL.createObjectURL(file)
        div.innerHTML = ''
        div.innerHTML = `<img src="${url}" alt="preview" class="preview">
        <input type="file" name="ajout-photo" id="ajout-photo" accept=".jpg,.png" >`
    })   
}



function newWork() {
    const form = document.querySelector(".ajout-photo")
    const photoInput = document.getElementById("ajout-photo")
    const titleInput = document.getElementById("title")
    const categoryInput = document.getElementById("categorie")
    let btn = document.querySelector(".valider-photo")
    let token = localStorage.getItem("token")
    token = JSON.parse(token)

    form.addEventListener("submit", async (event)=> {
        event.preventDefault()        
        let formData = new FormData()
        formData.append("image", photoInput.files[0])
        formData.append("title", titleInput.value)
        formData.append("category", categoryInput.value)
        console.log(token)
        if (btn.classList.length === 2) {
            let reponse = await fetch('http://localhost:5678/api/works', {
                method: "POST",
                body: formData,
                headers: {'Authorization': `Bearer ${token.token}`}
            })  
            ajouterTravaux()
            modale.classList.remove("modaleBG")
            modale.innerHTML = '' 
        }  else {
            let error = document.querySelector(".barre")
            error.innerHTML = '<p class="error-modale">Informations Manquante!</p>'
        }
            
      
    })
} 

function isFormFull () {
    let inputs = document.querySelectorAll(".input-modale")
    let btn = document.querySelector(".valider-photo")
    let filled = 0
    for(let i=0; i<inputs.length; i++) {
        inputs[i].addEventListener("change", ()=> {
            switch (inputs[i].type) {
                case "file" : 
                    if(inputs[i].files[0] !== undefined) {
                        filled++
                    }
                    break
                case "text" :
                    if(inputs[i].value !== "") {
                        filled++
                    } 
                    break
                default : 
                    if(inputs[i].value !== "") {
                        filled++
                    } 
            }
            if (filled === 3) {
                btn.classList.add("green")
            } else {
                btn.classList.remove("green")
            }
        })
        
    }

}
//  FAIRE DES FONCTIONS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// create object url