const express = require('express')
const cors = require('cors');
const dbConnection = require('../database/config');
const fileUpload=require('express-fileUpload')

class Server{
    // Clase principal
    constructor(){                              //En el constructor van las propiedades
        this.app = express();                   //servir contenido estatico
        this.port = process.env.PORT;  
        
        this.paths={
            auth: '/api/auth',
            users:'/api/users',
            products:'/api/products',
            shopingCarts:'/api/shopingCarts',
            uploads:'/api/uploads'

            /*categorias: '/api/categorias',
            usuarios:'/api/usuarios',
            productos:'/api/productos',
            buscar:'/api/buscar',
            uploads:'/api/uploads'*/
        }
        
        //definir puerto de conexión
        //.authPath='/api/auth';              //path para autenticación
        //this.usuariosPath='/api/usuarios';      //path para interacción base de datos usuarios
        this.conectarDB();                      //conectar a base de datos     
        this.middlewares();                     //Funciión que siempre va a ejecuarse cuando levantemos nuestro servidor
        this.routes();                           
    }

    async conectarDB(){
        await dbConnection();   //conectar con la base de datos
    }

    middlewares(){      //(.use es la palabra para saber que es un middleware)

        this.app.use(cors());          //API solo ciertas páginas web pueden acceder a ellas, proteges tu servidor       
        this.app.use(express.json());  //Lectura y parseo del body (cualquier información en POST, PUT, DELATE, ls vs s intentar)        
        this.app.use(express.static('public'))  //Directorio publico  (busca el index)
        
       //Fileupload - carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //Si la carpeta no existe la creamos
        }));
    }

    routes(){       //Defino las rutas de mi aplicación
        this.app.use(this.paths.auth,require('../routes/auth.routes'));      // En el path ... ejecuto ...
        this.app.use(this.paths.users,require('../routes/user.routes'));  // En el path ... ejecuto ...
        this.app.use(this.paths.products,require('../routes/product.routes'));
        this.app.use(this.paths.shopingCarts,require('../routes/shoppingCart.routes'));
        this.app.use(this.paths.uploads,require('../routes/upload.routes'));
        /*this.app.use(this.paths.categorias,require('../routes/categorias')); 
        this.app.use(this.paths.buscar,require('../routes/buscar'));
        */
    }

    listen(){       //No está en el constructor
        this.app.listen(this.port, ()=>{                            // Metodo express ... escuchar en el puerto
            console.log('servidor corriendo en port',this.port)
        });
    }
}
module.exports=Server