const { json } = require('express');
const express = require('express');
const router = express.Router();
const Gastos = require('../models/gastos');
const Categorias = require('../models/categorias');
const Users = require('../models/user');
const Ingresos = require('../models/ingresos');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Categorias

router.get('/categorias-gastos', async (req, res) => {
    try{
        Users.aggregate([
            { "$addFields": { "userId": { "$toString": "$_id" }}},
            {
                $lookup: {
                    from: "categorias",
                    localField: "userId",
                    foreignField: "idUser",                
                    as: "categorias_por_usuario"
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
});

router.get('/gastos', async (req, res) => {
    try{
        Categorias.aggregate([
            { "$addFields": { "cId": { "$toString": "$_id" }}},
            {
                $lookup: {
                    from: "gastos",
                    localField: "cId",
                    foreignField: "categoryId",                
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
});

router.get('/ingresos', async (req, res) => {
    try{
        Categorias.aggregate([
            { "$addFields": { "cId": { "$toString": "$_id" }}},
            {
                $lookup: {
                    from: "ingresos",
                    localField: "cId",
                    foreignField: "categoryId",                
                    as: "ingresos_por_categoria"
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
});

router.post('/post-category', async (req, res) => {
    try{
        const find = await Categorias.find({name: req.body.name});
        if(find.length > 0){
            res.send("La categoria ya existe");
        }else{
            const modelg = new Categorias({
                name: req.body.name,
                monto: req.body.monto,
                idUser: req.body.idUser,
                type: req.body.type
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
            categoryId: req.body.categoryId
        });

        const result = await modelg.save();
        res.json(result);        
    }catch(error){
        res.status(500).send(error);
    }
});

router.post('/post-ingreso', async (req, res) => {
    try{
        const modelg = new Ingresos({
            name: req.body.name,
            money: req.body.money,
            categoryId: req.body.categoryId
        });

        const result = await modelg.save();
        res.json(result);        
    }catch(error){
        res.status(500).send(error);
    }
});

router.put('/put-category', async (req, res) => {
    try{
        const modelc = {
            name: req.body.name,
            monto: req.body.monto
        };
        const find = await Categorias.findByIdAndUpdate({ _id: req.body.id }, modelc);
        res.status(201).send({
            message: "Se edito correctamente",
            find
        });        
    }catch(error){
        res.status(500).send(error);
    }
});

router.put('/put-gasto', async (req, res) => {
    try{
        const modelg = new Gastos({
            name: req.body.name,
            money: req.body.money,
            categoryId: req.body.categoryId
        });
        const find = await Gastos.findByIdAndUpdate({ _id: req.body.id }, modelg);
        res.status(201).send({
            message: "Se edito correctamente",
            find
        });        
    }catch(error){
        res.status(500).send(error);
    }
});

router.put('/put-ingreso', async (req, res) => {
    try{
        const modeli = new Ingresos({
            name: req.body.name,
            money: req.body.money,
            categoryId: req.body.categoryId
        });
        const find = await Ingresos.findByIdAndUpdate({ _id: req.body.id }, modeli);
        res.status(201).send({
            message: "Se edito correctamente",
            find
        });        
    }catch(error){
        res.status(500).send(error);
    }
});

router.delete('/delete-category/:id', async (req, res) => {
    try{
        const find = await Categorias.findByIdAndDelete(req.params.id);
        res.status(201).send({
            message: "Se elimino correctamente",
            find
        });        
    }catch(error){
        res.status(500).send(error);
    }
});

router.delete('/delete-ingreso', async (req, res) => {
    try{
        const find = await Ingresos.deleteOne({ _id: req.body.id });
        res.status(201).send({
            message: "Se elimino correctamente",
            find
        });        
    }catch(error){
        res.status(500).send(error);
    }
});

router.delete('/delete-gasto', async (req, res) => {
    try{
        const find = await Gastos.deleteOne({ _id: req.body.id });
        res.status(201).send({
            message: "Se elimino correctamente",
            find
        });        
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