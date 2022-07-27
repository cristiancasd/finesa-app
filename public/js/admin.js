


const fileuploadP       = document.querySelector('#fileuploadP');
const upload_buttonP       = document.querySelector('#upload_buttonP');
selectProductoHTML= document.querySelector('#selectProductoHTML');

let usuario = null;

const enlaceAuth='/api/auth/' 
const enlaceProducto='/api/products/'      
const enlaceSubirPC='/api/uploads/' 
const enlaceCarrito='/api/shopingCarts/' 




const validarJWT = async() => {


    const token = localStorage.getItem('token')||'';

    if (token.length <= 10){ //No hay token
        window.location='index.html' //redireccionamiento
        throw new Error('No hay token en el servidor') 
    }

    const resp = await fetch(enlaceAuth,{ headers:{'c-token':token}});

    //la respuesta de la petición tiene estos dos valores y los clono
    const {user: userDb, token:tokenDB}= await resp.json(); 
    localStorage.setItem('token',tokenDB) //Renuevo el JWT
    usuario=userDb;
    console.log('userDb', userDb)
    if(userDb.rol!='ADMIN_ROLE') window.location='index.html'
    
    document.title = 'ADMIN '+usuario.nombre; //El texto de la pestaña de chat.html

    parametrosIniciales(seleccion.value) //parametrosUsuario();
} 

//Selector de función
seleccion.addEventListener("change", async ev=>{
    parametrosIniciales(seleccion.value)
})

//submit Funcion (editar con ID)
 formFuncion.addEventListener('submit',  async (ev)=>{
    ev.preventDefault();
    parametrosIniciales(seleccion.value)
})



const parametrosIniciales=async(accion)=>{

    console.log('accion es ',accion)

    divBuscar.style.display='none';
    

    //Productos
    divCateProd.style.display='none';
    divEditarProductos.style.display='none';

    divMostrarBusqueda.style.display='none';

    upload_buttonP.style.display='none';

    await actualizarProductos()
    await actualizarCarritos()

    switch(accion){        

        case 'verProduct'  :
            estoyEn.innerHTML= 'CREAR NUEVO PRODUCTO';
            funcionActual='verProduct';   
            divCateProd.style.display='block';
            mostrarProductos();

        break

        case 'nuevoProd'  :        

            estoyEn.innerHTML= 'CREAR NUEVO PRODUCTO';
            funcionActual='nuevoProd';                          
            divEditarProductos.style.display='block';
            id_user.value='';
            id_user.disabled=true; 
            divFormImgP.style.display='none';
            nombreProducto.required=true;
            precio.required=true;
            change_buttonP.innerHTML='Crear Producto';
            divFormDatosP.style.display ='block';
        break;      
        
        case 'editarProd'  :        

            estoyEn.innerHTML= 'EDITAR PRODUCTO';
            funcionActual='editarProd';                          
            divEditarProductos.style.display='block';
            id_user.value=prodObj[selectProductoHTML.value]._id ;
            id_user.disabled=true; 
            divFormImgP.style.display='block';
            nombreProducto.required=true;
            precio.required=true;
            divFormDatosP.style.display ='block';
            change_buttonP.innerHTML='Editar Producto';
            organizarEproducto()
        break;  
        case 'eliminarProd'  : 
            estoyEn.innerHTML= 'Eliminar PRODUCTO';
            change_buttonP.innerHTML='Eliminar Producto';
            funcionActual='eliminarProd';                          
            divEditarProductos.style.display='block';
            id_user.value=prodObj[selectProductoHTML.value]._id ;
            id_user.disabled=true; 
            divFormImgP.style.display='block';
           
            nombreProducto.required=false;
            precio.required=false;
           
           
            divFormDatosP.style.display ='block';
            organizarEproducto()
            nombreProducto.disabled=true;
            precio.disabled=true;
            disponible.disabled=true;
            descripcion.disabled=true;            

        break;  

        case 'verCarritos':
            estoyEn.innerHTML= 'Mostrar Todos los Carritos';
            mostrarCarritosCompras(ventasCarrito);
        break;

        


        case 'buscarFecha'  : 
            divBuscar.style.display='block';
            estoyEn.innerHTML= 'Buscar Carrito FECHAS';
            funcionActual='buscarFecha';                         
        break;  

        default:
            estoyEn.innerHTML= 'FUNCIÓN NO ESTABLECIDA';
            return console.log('accion es ',accion);
      }
    
}




const mostrarProductos = () => {

    let productoHTML='';


    productoHTML+=`<h5 id="fygfg"class="text-success" style="
    background-color:blue; 
    ">Productos Tecnólogicos</h5>
                    
                    <section style="
                    border:1px solid green;   
                    background-color:black;
                    overflow:hidden; 
                    "
                    >   
    `;


    let datas = Object.keys(prodObj); // claves = ["nombre", "color", "macho", "edad"]


    for(let i=0; i< datas.length; i++){
        let data = datas[i];
        console.log(prodObj[data]);

        const valor=prodObj[data]
        console.log('valor ', valor);

            (valor.img)
                ? imgProducto=valor.img                     
                : imgProducto='/js/goku.png';

            (valor.available==true)
                ? disponibleP='Disponible: SI'                     
                : disponibleP='Disponible: NO';

                productoHTML+=`           
                
                    <div
                    style="                      
                    background-color:white;                                       
                    border:1px  solid black; 
                    width:30%;
                    min-width: 200px;

                    height:470px;
                    margin:0px auto;
                    float:left;
                    margin:10px
                    
                    "
                    >
                        <div class="d-grid" style="justify-content: center" >
                            <h5 >${valor.nameProduct}</h5> 
                            <img src="${imgProducto}" width="200" height="200" style="margin: 0 auto;"> 
                            <p>Descripcion:</p>
                            <p>${valor.description}</p>
                            <p>Precio: $${valor.price}</p>
                            <p>${disponibleP}</p> 
                            <p>Creado: ${valor.userProduct.name}</p>                       
                        
                        </div>
                    </div>
                        
            `
    }
    productoHTML+=`</section>`
    cateProductos.innerHTML=productoHTML

}


//************************************ Producto: Crear, editar, eliminar  ******************************************************** */



formCambiarDatosP.addEventListener('submit', ev=>{
    ev.preventDefault();        //No recargar página   
    crearCateProd(funcionActual, id_user.value); 
})

const crearCateProd=async (accion,id_editar)=>{
    let formData={};     
    let enlace='';
    let crud='POST'    
     
    if(accion=='nuevoProd'){        
        formData['nameProduct']=nombreProducto.value;
        if(descripcion.value)  formData['description']=descripcion.value;
        if(precio.value)  formData['price']=precio.value;
        enlace=enlaceProducto;
        crud='POST'
    }


    if(accion=='editarProd'){
        enlace=enlaceProducto+id_editar
        formData['nameProduct']=nombreProducto.value;
        formData['available']=disponible.value;
        if(descripcion.value)  formData['description']=descripcion.value;
        if(precio.value)  formData['price']=precio.value;
        crud='PUT';
        console.log('data editar formData',formData)
    }

    if(accion=='eliminarProd'){
        enlace=enlaceProducto+id_editar;
        crud='DELETE'
    }

   

    console.log(enlace)
    await fetch(enlace,{
        method: crud,
        body: JSON.stringify(formData),//Contiene correo y password
        headers:{
            'Content-Type':'application/json',
            'c-token':localStorage.getItem('token')
        }
    })
    .then(resp =>resp.json()) //Extraemos el .json
    .then( async (resp)=>{
        //console.log('la respuesta es');
        //console.log(resp)
        
        
        if(crud=='POST'){
            if(!resp.nameProduct){ 
                
                
                if(resp.errors[0].msg=='existente'){ //lo hago en el backend
                    //await actualizarProductos();
                    parametrosIniciales(accion);
                    console.error('restaurado');
                    window.alert(` ${formData['nameProduct']} ya existía, fue restaurado con datos anteriores`);
                    return;
                }
                return console.error('error');
            } 
        }
            

        if(crud=='DELETE'){
            id_user.value='';        
            change_buttonP.style.backgroundColor= "red";    
            change_buttonP.style.color= '#3d3d3d';
        }else{
            id_user.value=resp._id; 
            change_buttonP.style.backgroundColor= "#89ff5c";    
            change_buttonP.style.color= '#3d3d3d';
        }       
        

        
        
        

        setTimeout(function(){
            //console.log('estoy en el temporizador')
            change_buttonP.style.backgroundColor= "blue";    
            change_buttonP.style.color= 'white';
            }, 1200);

        if(accion=='nuevaCateg'||accion=='editarCateg') actualizarCategorias();    
        
        if(accion=='editarProd' || accion=='nuevoProd'){ 
            //actualizarProductos();
            
            if(accion=='nuevoProd'){
                fotoUserP.src='/js/goku.png';
                divFormDatosP.style.display ='none';
                divFormImgP.style.display='block';
                nombreProducto.value='';
                precio.value='';
                descripcion.value=''
            } 
        }

        if(accion=='eliminarProd'||accion=='eliminarCateg'){
            //await actualizarProductos();
            //id_user.value   =   prodObj[selectProductoHTML.value]._id
            parametrosIniciales(accion)
        }
    })
    .catch(err=>{
        console.log(err) 
    })
}



//************************************  Subir fotos ******************************************************** */


formSubirImagenP.addEventListener('submit', ev=>{
    ev.preventDefault();    
    
    const enlaceFuncion='products/';

    let formData = new FormData();    
    formData.append('archivo', fileuploadP.files[0]);
    console.log('formData es ',formData)
    console.log('formData.archivo es ',formData.archivo)
    console.log('enlace a subir ')
    console.log(enlaceSubirPC+enlaceFuncion + id_user.value)
    fetch(enlaceSubirPC+enlaceFuncion +id_user.value, { 
        method: "PUT", 
        body: formData
    })    
    .then(response => response.json())
    .then(response=>{ 
        if(!response.img){
            //console.log('está super malo todo')
            return console.error(response.msg);
        }

        if(funcionActual=='editarProd'|| funcionActual=='nuevoProd'){
            upload_buttonP.style.backgroundColor= "#89ff5c";    
            upload_buttonP.style.color= '#3d3d3d';
            fotoUserP.src=response.img ; 
            upload_buttonP.disabled=true;
            upload_buttonP.style.display='none';          

            setTimeout(function(){               
                
                    //console.log('estoy en el temporizador')
                    upload_buttonP.style.backgroundColor= "blue";    
                    upload_buttonP.style.color= 'white';
                    
                    upload_buttonP.disabled=false;
                    upload_buttonP.style.display='none';
                    
                    
                    if(funcionActual=='nuevoProd') parametrosIniciales(seleccion.value) ;//parametrosProducto();   
                    
                }, 1200);

            //             
                       
        }else{
            parametrosIniciales(seleccion.value)// parametrosProducto();
        }
        

        //console.log('Success:', response.img)
    })
    .catch(error =>  console.warn(error))
    //.then(response => console.log('Success:', response))
  

})



//************************************ Crear objetos Prod, Catg ******************************************************** */

let prodObj={}
const actualizarProductos=async ()=>{

    const resp = await fetch(enlaceProducto,{});
    
    const {productos}= await resp.json(); 
    console.log('productos',productos)

    let cateHtml=''
    productos.forEach((valor)=>{
        prodObj[valor.nameProduct]=valor;
        
        (valor.available)
            ? cateHtml+=`<option style=" color: black" value="${valor.nameProduct}"> ${valor.nameProduct}</option>`                               
            : cateHtml+=`<option style=" color: red" value="${valor.nameProduct}"> ${valor.nameProduct}</option>`        
    })        
    selectProductoHTML.innerHTML=cateHtml;
    console.log('prodObj ', prodObj)
}

let carritoObj={}
let ventasCarrito=[]
const actualizarCarritos=async ()=>{
    const resp = await fetch(enlaceCarrito,{
        headers:{
            'Content-Type':'application/json',
            'c-token':localStorage.getItem('token')
        }
    });    
    const {ventas}= await resp.json(); 
    ventas.forEach((valor)=>{
        carritoObj[valor.uid]=valor;
    })
    console.log('carritoObj ', carritoObj)
    ventasCarrito=[...ventas]

}

let carritoBusqueda=[]
formBuscarFechas.addEventListener('submit', ev=>{
    carritoBusqueda=[]
    ev.preventDefault();   


    let datas = Object.keys(carritoObj); // claves = ["nombre", "color", "macho", "edad"]


    for(let i=0; i< datas.length; i++){
        let data = datas[i];
        const valor=carritoObj[data]

        estaEnRangoFecha(fechaForm1.value,fechaForm2.value,valor.date)            
            ? carritoBusqueda.push(valor)
            : console.log('NO está en el rango')         
    }
    console.log('carritoBusqueda ',carritoBusqueda)
    
    mostrarCarritosCompras(carritoBusqueda);

})



const mostrarCarritosCompras = async(arregloVentas) =>{
    divMostrarBusqueda.style.display='block';

    //console.log('estoy en mostrarPedidosCreados')
    let tabla_pedidoActual=`
    <table class="table table-dark" >
    <thead>
    <tr>
        <th scope="col">#</th>
        <th scope="col">No ID carrito</th>
        <th scope="col">Fecha</th>
        <th scope="col">Productos</th>
        <th scope="col">Cantidad</th>
        <th scope="col">Total</th>
        <th scope="col">Creado Por User</th>
    </tr>
    </thead>
    <tbody>  
    `
    arregloVentas.forEach((data,i)=>{

                data.arraySale.forEach((valorTemp,v)=>{

                    tabla_pedidoActual+=`
                    <tr>
                        <th scope="row">${i+1} </th>
                        <td>${data.uid}</td> 
                        <td>${data.date}</td>                                               `

                    let nombres = Object.keys(valorTemp.pedido); 
                    let prodHtml='';
                    let cantHtlm='';
                    for(let ii=0; ii< nombres.length; ii++){
                        let nombre = nombres[ii];
                        prodHtml+=
                        `
                            ${nombre}<br>                      
                        `
                        cantHtlm+=
                        `
                        ${valorTemp.pedido[nombre].cantidad}<br>                         
                        `
                    }

                    tabla_pedidoActual+=
                    '<td>' + prodHtml  +  '</td> ' +
                    '<td>' + cantHtlm +  '</td>'
                    
                    tabla_pedidoActual+=`
                        <td>${data.arraySale[v].total}</td>
                        <td>${data.userCart}</td>
                    `
                    tabla_pedidoActual+=`
                </tr>
                `
                })          
    })
    tabla_pedidoActual+=`
    </tbody>
    </table>`

    resultadoBusqueda.innerHTML=tabla_pedidoActual 

    
}





const estaEnRangoFecha = (fecha1='2020-10-23',fecha2='2022-10-22',fechaBusqueda='2021-10-22') => {
    const date1 = new Date(fecha1);
    const date2 = new Date(fecha2);
    const dateBusqueda = new Date(fechaBusqueda); 
    return (dateBusqueda>=date1 &&dateBusqueda<=date2 )
}


//Select de producto
selectProductoHTML.addEventListener("change", async ev=>{    
    organizarEproducto()
})  

const organizarEproducto = () => {
    nombreProducto.disabled=false;
    precio.disabled=false;
    descripcion.disabled=false;
    disponible.disabled=false;

    if(funcionActual=='editarProd' || funcionActual=='eliminarProd'){
        (prodObj[selectProductoHTML.value].img) 
                    ? fotoUserP.src= prodObj[selectProductoHTML.value].img
                    : fotoUserP.src='/js/goku.png';
        id_user.value=          prodObj[selectProductoHTML.value]._id;
        nombreProducto.value=   prodObj[selectProductoHTML.value].nameProduct;
        disponible.value=       prodObj[selectProductoHTML.value].available;
        descripcion.value=      prodObj[selectProductoHTML.value].description;
        precio.value=      prodObj[selectProductoHTML.value].price;
        
    } 
}


fileuploadP.onchange=()=>{
    upload_buttonP.style.display="none"
    if(fileuploadP.value!='')upload_buttonP.style.display="block"}

//Volver al index
const salir=()=>{
    window.location='index.html';
}


const main = async () => {await validarJWT();}
main();