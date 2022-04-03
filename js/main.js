// alert();


let totalNota = 0;
let contador = 0;

const alumnos = JSON.parse(localStorage.getItem("listaAlumnos")) || [];
const botonNuevo = document.querySelector("#btn-nuevo");
let nombreAlumnoNuevo = document.getElementById("nombreAlumnoNuevo");
let notaAlumnoNuevo = document.getElementById("notaAlumnoNuevo");
let imgAlumnoNuevo = document.getElementsByClassName("imagen-alumno");
let fuenteImagen = document.getElementById("fuente");

fuenteImagen.addEventListener('change', (event) => {
    const resultado = document.querySelector('.resultado');
    let objFile = document.querySelector('input[type=file]');
    let objText = document.getElementById("search");
    if (`${event.target.value}` === 'pc') {
        objFile.value = '';
        objFile.disabled = false;
        objText.value = '';
        objText.disabled = true;
    } else {
        objFile.value = '';
        objFile.disabled = true;
        objText.value = '';
        objText.disabled = false;
    }
});

const contenedorAlumnos = document.querySelector('.contenedor-alumnos');

alumnos.length != 0 && mostrarAlumnos();

//Selecciona la imagen y la carga en el preview
function previewFile() {
    const preview = document.querySelector('img');
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
        preview.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

async function getPokemon(id) {
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${id}/`
    );
    const data = await response.json();
    return data;
}

function updatePokemon(pokemon) {
    //console.log(pokemon.name);
    // window.pokemon.textContent = pokemon.name;
    const preview = document.querySelector('img');
    preview.setAttribute("src", pokemon.sprites.front_default);
}

window.search.addEventListener("change", async () => {
    const pokemon = await getPokemon(window.search.value);
    updatePokemon(pokemon);
});


//Presiona el botón de agregar alumno y lo guarda en el storage
botonNuevo.onclick = () => {
    let nombre = nombreAlumnoNuevo.value;
    let nota = notaAlumnoNuevo.value;
    let img = imgAlumnoNuevo[0].currentSrc;

    swal({
        title: "Alta de Alumno",
        text: "Se va a dar de alta un alumno",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                swal("Se dió de alta al alumno correctamente ", {
                    icon: "success",
                });
                let nuevoAlumno = { alumno: nombre, nota: nota, img: img };
                alumnos.push(nuevoAlumno);

                guardarLocal("listaAlumnos", JSON.stringify(alumnos));
                mostrarAlumnos();

                nombreAlumnoNuevo.value = "";
                notaAlumnoNuevo.value = "";
                const preview = document.querySelector('img');
                preview.src = "../images/person.jpg";
            }
        });


}

const guardarLocal = (clave, valor) => { localStorage.setItem(clave, valor) };

cuentaNota = parseInt(0);

//Crea la card para luego mostrar los alumnos en pantalla
function mostrarAlumnos() {
    contenedorAlumnos.innerHTML = "";
    for (const { img, alumno, nota } of alumnos) {
        const divAlumno = document.createElement('div');
        divAlumno.classList.add('card');

        const imgAlumno = document.createElement('img');
        imgAlumno.classList.add('imagen-alumno');
        imgAlumno.src = img;

        const tituloAlumno = document.createElement('h2');
        tituloAlumno.classList.add('titulo-alumno');
        tituloAlumno.textContent = "Nombre: " + alumno;
        const notaAlumno = document.createElement('h3');
        notaAlumno.classList.add('nota-alumno');
        notaAlumno.textContent = "Nota: " + nota;

        divAlumno.appendChild(imgAlumno);
        divAlumno.appendChild(tituloAlumno);
        divAlumno.appendChild(notaAlumno);

        contenedorAlumnos.appendChild(divAlumno);
    }
}

const contenedorNotas = document.getElementById('contenedor-notas');

const sacarPromedio = () => {
    let sumaNota = alumnos.reduce((totalNota, item) => totalNota + parseInt(item.nota), 0);
    return sumaNota / alumnos.length;
}

const botonPromedio = document.querySelector("#btn-PromedioNotas");
//Muestra el promedio de notas
botonPromedio.onclick = () => {
    contenedorNotas.innerHTML = "";
    let resultado = sacarPromedio();
    const promedioNotas = document.createElement('div');
    promedioNotas.classList.add('card');

    const notaPromedio = document.createElement('h2');
    notaPromedio.classList.add('nota-promedio');
    notaPromedio.textContent = "Promedio de notas";
    const nota = document.createElement('h3');
    nota.classList.add('nota');
    nota.textContent = resultado;

    promedioNotas.appendChild(notaPromedio);
    promedioNotas.appendChild(nota);
    contenedorNotas.appendChild(promedioNotas);
}

const botonMayor = document.querySelector("#btn-notaMayor");
const notaMayorMenor = (signo) => {
    let notas = alumnos.map(n => n.nota);
    let notaAnterior = (signo === ">") ? 0 : 100;
    notas.forEach(nota => {
        signo === ">" ? ((parseInt(nota) > notaAnterior) && (notaAnterior = nota)) : ((parseInt(nota) < notaAnterior) && (notaAnterior = nota));
    })
    return notaAnterior;
};
//Muestra la mayor nota
botonMayor.onclick = () => {
    contenedorNotas.innerHTML = "";
    let resultado = notaMayorMenor(">");
    const notaMayorClase = document.createElement('div');
    notaMayorClase.classList.add('card');

    const notaMayor = document.createElement('h2');
    notaMayor.classList.add('nota-mayor');
    notaMayor.textContent = "Mayor nota de clase";
    const nota = document.createElement('h3');
    nota.classList.add('nota');
    nota.textContent = resultado;

    notaMayorClase.appendChild(notaMayor);
    notaMayorClase.appendChild(nota);

    contenedorNotas.appendChild(notaMayorClase);
}

const botonMenor = document.querySelector("#btn-notaMenor");
//Muestra la menor nota
botonMenor.onclick = () => {
    contenedorNotas.innerHTML = "";
    let resultado = notaMayorMenor("<");
    const notaMenorClase = document.createElement('div');
    notaMenorClase.classList.add('card');

    const notaMenor = document.createElement('h2');
    notaMenor.classList.add('nota-menor');
    notaMenor.textContent = "Menor nota de clase";
    const nota = document.createElement('h3');
    nota.classList.add('nota');
    nota.textContent = resultado;

    notaMenorClase.appendChild(notaMenor);
    notaMenorClase.appendChild(nota);

    contenedorNotas.appendChild(notaMenorClase);
}
