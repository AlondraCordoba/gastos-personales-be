const { json } = require('express');
const express = require('express');
const router = express.Router();
const Gastos = require('../models/gastos');
const Categorias = require('../models/categorias');
const Users = require('../models/user');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Categorias

router.get('/categorias', async (req, res) => {
    try{
        Categorias.aggregate([
            {
                $lookup: {
                    from: "gastos",
                    localField: "name",
                    foreignField: "category",                
                    as: "gastos_por_categoria"
                }
            }
        ]).exec((err, result)=>{
            if (err) {
                console.log("error" ,err)
            }
            if (result) {
                res.send(result);
            }
        });
    }catch(error){
        res.status(500).send(error);
    }
})

router.post('/post-category', async (req, res) => {
    try{
        const find = await Categorias.find({name: req.body.name});
        if(find.length > 0){
            res.send("La categoria ya existe");
        }else{
            const modelg = new Categorias({
                name: req.body.name
            });
    
            const result = await modelg.save();
            res.json(result);
        }
    }catch(error){
        res.status(500).send(error);
    }
});

router.post('/post-gasto', async (req, res) => {
    try{
        const modelg = new Gastos({
            name: req.body.name,
            money: req.body.money,
            category: req.body.category
        });

        const result = await modelg.save();
        res.json(result);        
    }catch(error){
        res.status(500).send(error);
    }
});

// Autenticacion

router.get("/auth", async (req, res, next) => {
    try {
      const token = await req.headers.authorization.split(" ")[1];
      const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");
      const user = await decodedToken;
      request.user = user;
      next();    
    } catch (error) {
      response.status(401).json({
        error: new Error("Invalid request!"),
      });
    }
});

router.post('/login', async (req, res) => {
    try {
        const find = await Users.findOne({ email: req.body.email });
        if(find) {
            const result = bycrypt.compareSync(req.body.password, find.password);
            if(result == false){
                res.status(401).send("La contrasenia es incorrecta")
            }else{
                const token = jwt.sign(
                    {
                        user: req.body.email,
                        password: req.body.password,                 
                    },
                    "RANDOM-TOKEN",
                    { expiresIn: "24h" }
                );
    
                res.status(200).send({
                    message: "Bienvenido al sistema",
                    email: req.body.email,
                    token: token,
                    id: find && find._id
                });
            }
        }else{
            res.status(401).send("No existe el usuario");
        } 
    } catch(error) {
        res.status(500).send(error);
    }
});

router.post('/register', async (req, res) => {
    try {          
        var user = await Users.findOne({ email: req.body.email });
        if(user){
            res.status(400).send("El usuario ya existe");
        }else{
            if(req.body.password === req.body.confirmPassword){
                const modelo = new Users({
                    email: req.body.email,
                    password: bycrypt.hashSync(req.body.password, 10),
                });
                await modelo.save();
                res.send(modelo);
            }else{
                res.status(400).send("Las contrasenias no coinciden");
            }
        } 
    } catch(error) {
        res.status(500).send(error);
    }
});

module.exports = router;