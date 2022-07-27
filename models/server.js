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
        }
        
       
        this.conectarDB();                           
        this.middlewares();       
        this.routes();                           
    }

    async conectarDB(){
        await dbConnection();  
    }

    middlewares(){     

        this.app.use(cors());          //API solo ciertas páginas web pueden acceder a ellas, proteges tu servidor       
        this.app.use(express.json());        
        this.app.use(express.static('public'))  
        
       
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true 
        }));
    }

    routes(){       
        this.app.use(this.paths.auth,require('../routes/auth.routes'));      
        this.app.use(this.paths.users,require('../routes/user.routes'));  
        this.app.use(this.paths.products,require('../routes/product.routes'));
        this.app.use(this.paths.shopingCarts,require('../routes/shoppingCart.routes'));
        this.app.use(this.paths.uploads,require('../routes/upload.routes'));
        
    }

    listen(){       
        this.app.listen(this.port, ()=>{        
            console.log('servidor corriendo en port',this.port)
        });
    }
}
module.exports=Server