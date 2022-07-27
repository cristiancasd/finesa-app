/** ----------------------------- APP gestor de ventas --------------------------------------
 * 
 * Los datos de los productos se encuentra en una base de datos, si estás autenticado con
 * el rol correcto te permite usar la app y hacer  las peticiones al back
 * 
 * La interfaz permite agregar la cantidad de productos que deseas y te dice el precio final
 * al montar el pedido, este se guarda en la base de datos y puedes proceder a hacer otro pedido
 * 
 * Puedes ver los pedidos generados y también marcarlos como anulados. 
 * 
 * Cada venta guarda el id del usuario que la generó
 * 
 * Si un usuario anula o reactiva una venta se le registra el id y se ve en la interfaz
 * 
 */

const div_tabla_pedidoActual = document.querySelector(`#div_tabla_pedidoActual`);
const button_montarPedido = document.querySelector(`#button_montarPedido`);


let usuario = null;
const enlace            =   '/api/auth/' 
const enlaceProducto    =   '/api/products/'  
const enlaceVentas      =   '/api/shopingCarts/'  


const d=new Date()          //Día de hoy
let diaHoy=d.getDate()+'-'+(Number(d.getMonth())+1 ) +'-'+ d.getFullYear()

let mostrarPedidosHoy=[]    //Arreglo con los pedidios de hoy
let pedidosHoy=[]           //Arreglo con los pedidios de hoy
let pedidoActualObj={}      //Objeto con información del pedido actual(temporal) generado
let valorTotal=0;           //Valor total $ del pedido actual(temporal) generado



let ventas=[]               //Arreglo de obejos de días (cada día contiene dia, arregloVentas, estado, id)
let pedidosObj={}           //Objeto de pedidos con indice de id
let pedidosFecha={}         //Objeto de pedidos con indice de fecha


let prodObj={}              //Objeto con indice de nombre de productos
let prod_idObj={}           //Objeto con indice de id de producto



// Validar el JWT en el frontEND
const validarJWT = async() => {

    //Traemos el token de localStorage
    const token = localStorage.getItem('token')||'';

    if (token.length <= 10){ //No hay token
        window.location='index.html' //redireccionamiento
        throw new Error('No hay token en el eservidor')
    }

    const resp = await fetch(enlace,{   
        headers:{'c-token':token}
    });

    //la respuesta de la petición tiene estos dos valores y los clono
    const {user: userDb, token:tokenDB}= await resp.json(); 
    localStorage.setItem('token',tokenDB) //Renuevo el JWT
    usuario=userDb;
    
    if(userDb.rol!='ADMIN_ROLE'&&userDb.rol!='SALE_ROLE') window.location='index.html'
    
    document.title = 'Shopping '+usuario.name; //El texto de la pestaña de chat.html

    actualizarProductos() //parametrosUsuario();

}  



//*******************************     MOSTRAR      ******************************************** */


const actualizarProductos=async ()=>{

    let productoHTML='';


    productoHTML+=`<h5 id="fygfg"class="text-success" style="
    background-color:black; 
    ">Productos Tecnólogicos</h5>
                    
                    <section style="
                    background-color:black;
                    overflow:hidden; 
                    "
                    >   
    `;


    const resp = await fetch(enlaceProducto,{});
    
    const {productos}= await resp.json(); 
    console.log('productos',productos)
    
    productos.forEach((valor)=>{
        prod_idObj[valor._id]=valor;

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
                            `
                            

                            if(valor.available==true){
                                productoHTML+=`    
                                    <div class="input-group mb-3">
                                        <input id="input_${valor._id}"  type="number" class="form-control" placeholder="Cantidad" aria-label="a" aria-describedby="basic-addon2" 
                                            min="1"
                                            max="20"
                                        required>
                                        <div class="input-group-append">
                                            <button 
                                            id="buttonAdd_${valor._id}" 
                                            class="btn btn-primary" 
                                            name="${valor._id}" 
                                            onclick="agregar(input_${valor._id}.value,'${valor._id}')"
                                            type="button">Agregar</button>
                                        </div>
                                    </div>
                                `
                            }



        productoHTML+=`    
                        </div>
                    </div>
                        
            `

            

        
    })
    productoHTML+=`</section>`
    cateProductos.innerHTML=productoHTML
}





//***************************************   ACCIONES BUTTONS  **************************************************** */

// Button --- Función agregar producto al carrito de compras
const agregar = async(cantidad,nombreButton) =>{   


    
    const id_button = document.querySelector(`#buttonAdd_${nombreButton}`);
    const id_input = document.querySelector(`#input_${nombreButton}`);

    if(cantidad>0){
        let nombre=prod_idObj[nombreButton].nameProduct
        pedidoActualObj[nombre]={
            'cantidad':id_input.value,
            'valorParcial': id_input.value*prod_idObj[nombreButton].price ,
        }     
        
        
        id_input.value=0;        
        id_button.style.backgroundColor= "green";    
        id_button.style.color= 'white';
        id_button.disabled=true;
        setTimeout(function(){
            id_button.style.backgroundColor= "blue";    
            id_button.style.color= 'white';
            id_button.disabled=false;
            }, 700);
        verPedidoActual();
    }
}



const verPedidoActual = async() =>{       

    console.log(pedidoActualObj)

    let tabla_pedidoActual=`
        <table class="table table-dark">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Producto</th>
                <th scope="col">Cantidad</th>
                <th scope="col">V. Parcial</th>
            </tr>
            </thead>
            <tbody>`

    
    let nombres = Object.keys(pedidoActualObj); 
    valorTotal=0;
    for(let i=0; i< nombres.length; i++){
      let nombre = nombres[i];
      valorTotal+=pedidoActualObj[nombre].valorParcial;
      tabla_pedidoActual+=
        `<tr>
            <th scope="row">${i+1} </th>
            <td>${nombre}</td>
            <td>${pedidoActualObj[nombre].cantidad}</td>
            <td>${pedidoActualObj[nombre].valorParcial}</td>
        </tr>
        `
    }
         tabla_pedidoActual+=`             <tr>
                        <th scope="row">Total</th>
                        <td></td>
                        <td></td>
                        <td>$ ${valorTotal}</td>
                    </tr>
        </tbody>
        </table>
    `
    div_tabla_pedidoActual.innerHTML=tabla_pedidoActual
}




// Button ---  Función SUBIR pedido NUEVO db
const montarPedido = async() =>{


    if(!(Object.entries(pedidoActualObj).length === 0)){
        

        console.log('analisist')
        console.log(pedidoActualObj)
        console.log(valorTotal)
        console.log(usuario.uid)

                 
        let objPedido={
            'pedido':pedidoActualObj,
            'total': valorTotal,
            'creado': usuario.uid,
        }

        pedidosHoy=[objPedido]
        await editar_db(pedidosHoy);
    }
}



// CRUD MONTAR pedido o ANULAR pedido
const editar_db = async(arreglo) =>{
    let formData={};     
    let enlace='';
    let crud='POST';
    
    let fecha=d.getDate()+'-'+(Number(d.getMonth())+1 ) +'-'+ d.getFullYear()
    let hora=d.getHours()+':'+ d.getMinutes()+':'+d.getSeconds()

    enlace=enlaceVentas;
    formData['date']=fecha;
    formData['time']=hora;
    formData['arraySale']=arreglo;
    formData['rol']=usuario.rol;       


        await fetch(enlace,{
            method: crud,
            body: JSON.stringify(formData),
            headers:{
                'Content-Type':'application/json',
                'c-token':localStorage.getItem('token')
            }
        })
        .then(resp =>resp.json()) //Extraemos el .json
        .then( async (resp)=> {

            console.log('resp date ',resp)
            if(!resp.venta){
                if(!resp.date){
                    return console.error('error');
                }
            }           
            
            
            button_montarPedido.style.backgroundColor= "#89ff5c";    
            button_montarPedido.style.color= '#3d3d3d';
            button_montarPedido.disabled= true;
            estoyEn.innerHTML="PEDIDO REALIZADO"
            pedidoActualObj={}
            verPedidoActual()
            
            setTimeout(function(){
                //console.log('estoy en el temporizador')
                button_montarPedido.style.backgroundColor= "blue";    
                button_montarPedido.style.color= 'white';
                button_montarPedido.disabled= false;
                estoyEn.innerHTML="Carrito de Compras"
                

                }, 2200);

        })
        .catch(err=>{
            console.log(err) 
        })
}





const borrarCarrito = () => {
    pedidoActualObj={}
            verPedidoActual()
}


//Volver al index
const salir=()=>{
    window.location='index.html';
}

const main = async () => {

    
    
    await validarJWT();
}
main();
//const socket = io();

