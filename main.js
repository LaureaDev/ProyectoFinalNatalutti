const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content

const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener ('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        agregarCarrito()
    }
})
cards.addEventListener('click', event =>{
    addCarrito(event)
})
items.addEventListener ('click', event => {
    btnAccion(event)
})
const fetchData = async () =>{
    try{
        const res = await fetch('api.json')
        const data = await res.json()
        
        generarCards(data)
    } catch (error) {
        console.log(error)
    }
    
}

const generarCards = data =>{
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.titile
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.url);
        templateCard.querySelector('.btn-outline-success').dataset.id = producto.id
        const clone = templateCard.cloneNode (true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = event => {
    if (event.target.classList.contains('btn-outline-success')){
        setCarrito(event.target.parentElement)

    }
    event.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-outline-success').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad:  1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito [producto.id] = { ...producto }
    agregarCarrito()
}

const agregarCarrito = () =>{
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    agregarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const agregarFooter = () =>{
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacio!</th>`
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce ((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnEliminar = document.getElementById('vaciar-carrito')
    btnEliminar.addEventListener('click', () =>{
        carrito = {}
        agregarCarrito()
    })
}

const btnAccion = event => {
    //BTN Aumentar
    if (event.target.classList.contains('btn-info')) {
        //console.log(carrito[event.target.dataset.id])
        carrito[event.target.dataset.id]

        const producto = carrito[event.target.dataset.id]
        producto.cantidad++
        
        carrito[event.target.dataset.id] = {...producto}
        agregarCarrito()
    }
    //BTN Restar
    if (event.target.classList.contains('btn-danger')){
        const producto = carrito[event.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0 ){
            delete carrito[event.target.dataset.id]
        }
        agregarCarrito()
    }

    event.stopPropagation()
}
