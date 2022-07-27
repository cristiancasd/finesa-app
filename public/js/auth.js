
const categoriasTodas = document.querySelector('#categoriasTodas'); 
const cateProductos   = document.querySelector('#cateProductos'); 

const admin_rol   = document.querySelector('#admin_rol'); 
const ventas_rol   = document.querySelector('#ventas_rol'); 
const user_rol   = document.querySelector('#user_rol'); 
const userLog   = document.querySelector('#userLog'); 

const loginManual = document.querySelector('#loginManual'); //Formulario html

const enlace='/api/auth/'  
const enlaceCategoria='api/categorias'   
const enlaceProducto='api/products'      


const button=document.getElementById('google_signout')




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

        (valor.img)
                ? imgProducto=valor.img                     
                : imgProducto='/js/goku.png';

            (valor.available=="true")
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
                        </div>
                    </div>
                        
            `
        
    })
    productoHTML+=`</section>`
    cateProductos.innerHTML=productoHTML
}


// Validar el JWT en el frontEND
const validarJWT = async() => {
    console.log('entro  a validarJWT')
    //Traemos el token de localStorage
    const token = localStorage.getItem('token')||'';

    divUserLog.style.display='none'
    google_signout.style.display='inline-block'

    if (token.length <= 10){ //No hay token
        //throw new Error('No hay token en el eservidor')
        console.log('no hay Token')
        divUserLog.style.display='block'
        google_signout.style.display='none'
        return
    }

    //hago la petición get y para renovar token
    const resp = await fetch(enlace,{   
        headers:{'c-token':token}
    });

    //la respuesta de la petición tiene estos dos valores y los clono
    const {user: userDb, token:tokenDB}= await resp.json(); 

    if(!userDb){
        console.log('usuario no valido')
        divUserLog.style.display='block'
        google_signout.style.display='none'
        localStorage.clear();
        return;
    }  
    localStorage.setItem('token',tokenDB) //Renuevo el JWT
    usuario=userDb;
    myId=usuario.uid;
    document.title = usuario.name; //El texto de la pestaña de chat.html
    verRole(usuario.rol,usuario.name)  
} 


loginManual.addEventListener('submit', ev=>{
    ev.preventDefault();//Que en el submit no se recargue la pagina
    const formData={};

    //Creo un arreglo con los elementos del formulario
    for(let el of loginManual.elements){
        if(el.name.length>0) 
        formData[el.name]=el.value
    }    
    
    //Petición POST para loguear (REST-SERVER)
    fetch(enlace+'login',{
        method: 'POST',
        body: JSON.stringify(formData),//Contiene correo y password
        headers:{'Content-Type':'application/json'}
    })
    .then(resp =>resp.json()) //Extraemos el .json
    .then(data=>{

        console.log('data es ...data ', data)
        if(!data.msg||data.msg!='Login ok'){ //no pasó validaciones
            window.alert(data.msg)
            
            return console.error(data.msg);
        }
        divUserLog.style.display='none'
        google_signout.style.display='block'
        localStorage.setItem('token',data.token);//token al localstorage
        verRole(data.usuario.rol, data.usuario.name)
        

        //window.location='chat.html';//Redirecciono al chat
        //window.location='autenticado.html'
    })
    .catch(err=>{
        console.log(err)
    })
})


//Autenticación google
function handleCredentialResponse(response) {   
    console.log('voy a autenticar GOogle')
    const body={id_token: response.credential}; //obtengo el google Token
    fetch (enlace+'google',{ //hago la petición POST          
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(body) //escribo el id_token en el body
    })        
        .then(resp=>resp.json())
        //.then(({token})=>{ //Grabo el token en localstorage
            //localStorage.setItem('token',token);
            //window.location='chat.html'; //Redirecciono al chat

        .then((data)=>{ //Grabo el token en localstorage
            
            localStorage.setItem('token',data.token);
       
            divUserLog.style.display='none'
            google_signout.style.display='block'
            console.log('data es',data)
            verRole(data.user.rol,data.user.name)
        })
        .catch(console.warn);           
}


//Sign Out de google
button.onclick=()=>{     
    google.accounts.id.disableAutoSelect() //Se recomienda tenerlo desactivado
    google.accounts.id.revoke(localStorage.getItem('email'),done=>{ //funcion para hacer logout
        localStorage.clear(); //borro el token                                         
        location.reload();//Reecargo la página
    });
    divUserLog.style.display='block'
    google_signout.style.display='none'        
}

const verRole=(role,name) =>{
    userLog.innerHTML=`Usuario: ${name}     ROL:  ${role}`
    switch(role){
        case 'USER_ROLE':
            ventas_rol.style.visibility ='visible';
            admin_rol.style.visibility ='hidden';              break;              
        case 'ADMIN_ROLE':
            ventas_rol.style.visibility ='visible';
            admin_rol.style.visibility ='visible';              
            break;
        case 'SALE_ROLE':
            ventas_rol.style.visibility ='visible';
            admin_rol.style.visibility ='hidden';  
            break;            
        default:
            console.log('No existe role');
        }
}

const main = async () => {
   await actualizarProductos();
   await validarJWT();
}
main();