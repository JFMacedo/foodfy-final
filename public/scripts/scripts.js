//Menu ativo
const currentPage = location.pathname
const menuItens = document.querySelectorAll('header nav a')

for(item of menuItens) {
  if(currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active')
  }
}

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input)
    
    let results = Validate[func](input.value)
    input.value = results.value

    if(results.error)
      Validate.displayError(input, results.error)
  },
  displayError(input, error) {
    const div = document.createElement('div')
    div.classList.add('error')
    div.innerHTML = error
    input.parentNode.appendChild(div)
    input.focus()
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector('.error')

    if(errorDiv)
      errorDiv.remove()
  },
  isEmail(value) {
    let error = null

    const mailFormat =/^\w+([\.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

    if(!value.match(mailFormat))
      error = "Email inválido"

    return {
      error,
      value
    }
  }
}

const PhotosUpload = {
  preview: document.querySelector('#photos-preview'),
  files: [],
  input: '',
  handleChefAvatar(event, uploadLimit) {
    const { files: fileList } = event.target
    const { preview } = PhotosUpload
    PhotosUpload.input = event.target

    if(fileList.length > uploadLimit) {
      if(uploadLimit == 1) {
        alert(`Envie apenas ${uploadLimit} foto!`)
      } else {
        alert(`Envie apenas ${uploadLimit} fotos!`)
      }
      event.preventDefault()
      return
    }

    const photosContainer = []
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == 'photo')
        photosContainer.push(item)
    })

    const totalPhotos = fileList.length + photosContainer.length
    if(totalPhotos > uploadLimit) {
      alert('Você atingiu o limite maximo de fotos')
      event.preventDefault()
      return
    }

    Array.from(fileList).forEach(file => {
      PhotosUpload.files.push(file)

      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.src = String(reader.result)

        const container = PhotosUpload.getContainer(image)
        PhotosUpload.preview.appendChild(container)
      }

      reader.readAsDataURL(file)
    })

    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  getContainer(image) {
    const container = document.createElement('div')
    container.classList.add('photo')
    container.onclick = PhotosUpload.removePhoto
    container.appendChild(image)
    container.appendChild(PhotosUpload.getRemoveButton())

    return container
  },
  getRemoveButton() {
    const button = document.createElement('span')
    button.innerHTML = 'X'
    return button
  },
  removePhoto(event) {
    const photoContainer = event.target.parentNode
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoContainer)

    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()

    photoContainer.remove()
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode

    if(photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]')
      if(removedFiles) {
        removedFiles.value += `${photoDiv.id}, `
      }
    }

    photoDiv.remove()
  }
}

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  lightbox: document.querySelector('.lightbox-target'),
  lightboxHighlight: document.querySelector('.lightbox-target > img'),
  closeLightboxButton: document.querySelector('.lightbox-close'),
  setImage(event) {
    const { target } = event

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

    ImageGallery.highlight.src = target.src
    console.log(ImageGallery.highlightLightbox)
    ImageGallery.lightboxHighlight.src = target.src

    target.classList.add('active')
  },
  openLightbox() {
    ImageGallery.lightbox.classList.add('active')
  },
  closeLightbox() {
    ImageGallery.lightbox.classList.remove('active')
  }
}

//Mostrar e ocultar informações
if(!currentPage.includes('admin')) {
  const informations = document.querySelectorAll('.information')
  
  for(const information of informations) {
    const hideShowButton = information.querySelector('.hideShow')
    hideShowButton.addEventListener('click', () => {
      information.classList.toggle('show')
      if(hideShowButton.innerHTML == 'Mostrar') {
        hideShowButton.innerHTML = 'Esconder'
      } else {
        hideShowButton.innerHTML = 'Mostrar'
      }
    })
  }
}

//Addicionar campos
function addIngredient() {
  const ingredients = document.querySelector("#ingredients")
  const fieldContainer = document.querySelectorAll('.ingredient')
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

  if(newField.children[0].value == '') return false

  newField.children[0].value = ''
  ingredients.appendChild(newField)
}
  
function addStep() {
  const preparation = document.querySelector("#preparation")
  const fieldContainer = document.querySelectorAll('.step')
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

  if(newField.children[0].value == '') return false

  newField.children[0].value = ''
  preparation.appendChild(newField)
}