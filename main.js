
// function convertirFecha
function convertirFecha(fechaOriginal){
    fechaOriginal.setUTCHours(0, 0, 0, 0);
    const fechaConvertida = {
      dia: fechaOriginal.getUTCDate().toString(),
      mes: obtenerNombreMes(fechaOriginal.getUTCMonth()),
      year: fechaOriginal.getUTCFullYear().toString(),
    };
    function obtenerNombreMes(mes) {
      const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return nombresMeses[mes];
    }
    return fechaConvertida
  }
  
  // cards por cada charla
  function generarDivs(datos) {
      const contenedor = document.getElementById('contenedor-charlas');
      // Recorrer el array de charlas
      datos.forEach(charla => {
        // clase para estilo de color 
        function clase (){
          if (charla.modalidad === 'Virtual') {
            return('card-yellow')
          } else {
            return ('card-red')
          }
        }
  
        const nuevoDiv = document.createElement('div');
        nuevoDiv.classList.add('col-12', 'col-md-4', 'mb-3', 'mb-md-5')
        nuevoDiv.innerHTML = `
        <div class="card-charla py-4 ps-5 pe-4 ${clase()}">
          <a href="${charla.url}" class="card__data">
            <div class="">
              <h4 class="fuente-zizou size-20">${charla.name}</h4>
            </div>
            <hr class="${clase()}-line-separator">
            <div class="row">
              <div class="col-4">
                <p class="fuente-zizou mb-1 fecha-number">${convertirFecha(charla.fecha).dia}</p>
                <p class="fuente-zizou size-19 mb-1">${convertirFecha(charla.fecha).mes.slice(0,3)} ${convertirFecha(charla.fecha).year}</p>
              </div>
              <div class="col-8 ${clase()}-dates">
                <div class="d-flex flex-column justify-content-between h-100">
                  <div class="d-flex justify-content-start align-items-start">
                    <i class="fa fa-clock-o pt-1" aria-hidden="true"></i>
                    <p class="fuente-zizou ps-2 size-text"">${charla.ubicacion}</p>
                  </div>
                  <div class="d-flex justify-content-start align-items-start">
                    <i class="fa fa-map-marker pt-1" aria-hidden="true"></i>
                    <p class="fuente-zizou ps-2 mb-1">${charla.hora}</p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
        `;
  
        // AÃ±adir el nuevo div al contenedor
        contenedor.appendChild(nuevoDiv);
      });
  }
  generarDivs(datos);
  
  // filtros buttons
  document.getElementById('tipo').addEventListener('click', function() {
    document.getElementById('collapseExample').classList.add('d-none');
    document.getElementById('collapseExample1').classList.remove('d-none');
  });
  document.getElementById('fechas').addEventListener('click', function() {
    document.getElementById('collapseExample1').classList.add('d-none');
    document.getElementById('collapseExample').classList.remove('d-none');
  });
  
  //BUSCAR POR NOMBRE
  function filterData (charlas, busqueda) {
    return charlas.filter(charla => {
      const nombreSinFormato = charla.name.replace(/<br>/gi, '').replace(/\s+/g, ' ');
      return nombreSinFormato.toUpperCase().startsWith(busqueda.toUpperCase());
    });
  }
  const inputName = document.getElementById("inputName");
  inputName.addEventListener('input', event => {
    // let charlasFilteredByName = [ ]
    const contenedor = document.getElementById('contenedor-charlas');
    contenedor.innerHTML= ''
    const nameFiltered = filterData(datos, event.target.value.toUpperCase());
    console.log(nameFiltered)
    if (nameFiltered.length < 1){
      // console.log('vacio')
      const contenedor = document.getElementById('contenedor-charlas');
      return contenedor.innerHTML='<p class="fuente-zizou text-dark ps-3">No hay eventos con ese nombre.</p>'
    } else {generarDivs(nameFiltered);};
  });
  
  // filtrar por dÃ­a actual : hoy, esta semana, prox semana
  function filterByDateToday(dataArray, date ) {
    return dataArray.filter(item => item.fecha === date);
  }
  function filterByDateThisWeek(dataArray, dateStart, dateEnd ) {
    return dataArray.filter(item => item.fecha >= dateStart && item.fecha <= dateEnd);
  }
  
  const fechaActual = new Date();
  
  function mostrarFechaSeleccionadaHoy() {
    if (filterByDateToday(datos, fechaActual).length < 1){
      const contenedor = document.getElementById('contenedor-charlas');
      return contenedor.innerHTML='<p class="fuente-zizou text-dark ps-3">No hay eventos en esa fecha.</p>'
    } else {
      const contenedor = document.getElementById('contenedor-charlas');
      contenedor.innerHTML= ''
      generarDivs(filterByDate(datos, fechaActual))
    };
  }
  function mostrarFechaSeleccionadaEstaSemana() {
    // Calcula el primer dÃ­a de la semana (domingo)
    const primerDiaSemana = new Date(fechaActual);
    primerDiaSemana.setDate(fechaActual.getDate() - fechaActual.getDay());
    // Calcula el Ãºltimo dÃ­a de la semana (sÃ¡bado de la prÃ³xima semana)
    const ultimoDiaSemana = new Date(fechaActual);
    ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);
    console.log(ultimoDiaSemana)
  
    if (filterByDateThisWeek(datos, primerDiaSemana, ultimoDiaSemana).length < 1){
      const contenedor = document.getElementById('contenedor-charlas');
      return contenedor.innerHTML='<p class="fuente-zizou text-dark ps-3">No hay eventos en esa fecha.</p>'
    } else {
      const contenedor = document.getElementById('contenedor-charlas');
      contenedor.innerHTML= ''
      generarDivs(filterByDateThisWeek(datos, primerDiaSemana, ultimoDiaSemana))
    };
  }
  
  function mostrarFechaSeleccionadaProxSemana() {
    // Calcula el primer dÃ­a de la semana (domingo)
    const primerDiaSemana = new Date(fechaActual);
    primerDiaSemana.setDate(fechaActual.getDate() - fechaActual.getDay() + 7);
    console.log(primerDiaSemana)
  
    // Calcula el Ãºltimo dÃ­a de la semana (sÃ¡bado)
    const ultimoDiaSemana = new Date(primerDiaSemana);
    ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);
    console.log(ultimoDiaSemana)
    
    if (filterByDateThisWeek(datos, primerDiaSemana, ultimoDiaSemana).length < 1){
      const contenedor = document.getElementById('contenedor-charlas');
      return contenedor.innerHTML='<p class="fuente-zizou text-dark ps-3">No hay eventos en esa fecha.</p>'
    } else {
      const contenedor = document.getElementById('contenedor-charlas');
      contenedor.innerHTML= ''
      generarDivs(filterByDateThisWeek(datos, primerDiaSemana, ultimoDiaSemana))
    };
  }
  
  // filtrar por fecha
  function filterByDate(dataArray, minDate, maxDate) {
    return dataArray.filter(item => item.fecha >= minDate && item.fecha <= maxDate);
  }
  
  function mostrarFechaSeleccionada() {
    var fechaInput1 = document.getElementById("fechaInicio").value;
    var fechaInput2 = document.getElementById("fechaFin").value;
    const dateFilters = document.getElementById("applyDateFilters")
    if (filterByDate(datos, new Date (fechaInput1), new Date (fechaInput2)).length < 1){
      const contenedor = document.getElementById('contenedor-charlas');
      return contenedor.innerHTML='<p class="fuente-zizou text-dark ps-3">No hay eventos en esa fecha.</p>'
    } else {
      const contenedor = document.getElementById('contenedor-charlas');
      contenedor.innerHTML= ''
      generarDivs(filterByDate(datos, new Date (fechaInput1), new Date (fechaInput2)))
    };
  }
  
  // filtrar por tipo
  function filterByTypeModalities (charlas, busqueda) {
    return charlas.filter(charla => charla.modalidad === busqueda)
  }
  function filterByType(argfilter, data){
    argfilter.forEach(element => {
      document.getElementById(element).addEventListener('click', (event) => {
        const newarrayTipo= filterByTypeModalities(data, element)
        const contenedor = document.getElementById('contenedor-charlas');
        contenedor.innerHTML= ''
        generarDivs(newarrayTipo)
      })
    });
  }
  const modalitiesData = [...new Set(datos.map(item => item.modalidad))];
  filterByType(modalitiesData, datos);
  
  // quitar filtros
  const btnNoFilters = document.querySelectorAll('.no-filters')
  btnNoFilters.forEach(element => {
      element.addEventListener('click', (event)=>{
        const contenedor = document.getElementById('contenedor-charlas');
        contenedor.innerHTML= ''
        generarDivs(datos);
        document.getElementById('collapseExample').classList.add('d-none');
        document.getElementById('collapseExample1').classList.add('d-none');
        
        console.log(document.querySelectorAll('.group-inputs-dates input')) 
  
      })
  });