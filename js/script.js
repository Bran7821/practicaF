$(document).ready(function () {

    // MANEJADOR DEL FORMULARIO DE BÚSQUEDA
    $("#form-busqueda").submit(function (event) {
        event.preventDefault();

        // Obtener el valor ingresado y pasarlo a minúsculas para evitar errores en la API
        const pokemonInput = $("#pokemon-buscar").val().trim().toLowerCase();

        if (pokemonInput === "") {
            alert("Por favor, ingrese el nombre o ID de un Pokémon");
            return;
        }

        // PETICIÓN AJAX CON JQUERY
        $.ajax({
            url: "https://pokeapi.co/api/v2/pokemon/" + pokemonInput,
            type: "GET",
            dataType: "json",
            success: function (data) {
                // 1. Extraer los datos desde la API
                const nombre = data.name;
                const id = data.id;
                const altura = data.height / 10; // Convierte decímetros a metros
                const peso = data.weight / 10;   // Convierte hectogramos a kilogramos
                const experiencia = data.base_experience ? data.base_experience : "N/A";
                const imagenUrl = data.sprites.front_default;

                // Mapear todos los tipos del Pokémon
                const tiposArray = data.types.map(t => t.type.name);
                const tipoPrincipal = tiposArray[0]; // Primer tipo para la tabla historial
                const todosLosTipos = tiposArray.join(", ");

                // Mapear todas las habilidades
                const habilidades = data.abilities.map(a => a.ability.name).join(", ");

                // 2. Actualizar la interfaz (Tarjeta de información)
                $("#poke-nombre").text(nombre);
                $("#poke-img").attr("src", imagenUrl);
                $("#poke-id").text(id);
                $("#poke-altura").text(altura);
                $("#poke-peso").text(peso);
                $("#poke-experiencia").text(experiencia);
                $("#poke-tipo").text(todosLosTipos);
                $("#poke-habilidades").text(habilidades); // CORREGIDO: Antes decía habilities

                // Mostrar la sección de resultados
                $("#resultado-pokemon").fadeIn(400);

                // 3. Agregar el registro a la tabla de Historial de búsqueda
                const tabla = document.getElementById("tabla-historial");
                const fila = tabla.insertRow();

                const celda1 = fila.insertCell(0);
                const celda2 = fila.insertCell(1);
                const celda3 = fila.insertCell(2);

                // Aplicar estilo de mayúscula inicial para presentación limpia
                celda1.textContent = nombre.toUpperCase();
                celda2.textContent = tipoPrincipal.toUpperCase();
                celda3.textContent = peso + " kg";
            },
            error: function () {
                // Alerta en caso de escribir mal el Pokémon o que no exista
                alert("No se encontró el Pokémon especificado. Verifique el nombre o ID.");
            }
        });
    });

    // BOTÓN LIMPIAR: Limpia el formulario y oculta los resultados actuales
    $("#btn-limpiar").click(function () {
        $("#pokemon-buscar").val("");       // Limpia el input
        $("#resultado-pokemon").fadeOut(300); // Oculta la tarjeta con efecto visual
    });
});
