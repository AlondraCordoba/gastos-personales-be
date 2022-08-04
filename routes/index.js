const { json } = require('express');
const express = require('express');
const router = express.Router();
const Gastos = require('../models/gastos');
const Categorias = require('../models/categorias');

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
        res.estatus(500).send(error);
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
        res.estatus(500).send(error);
    }
});

module.exports = router;