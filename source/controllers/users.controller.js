const {index,write} = require('../models/users.model');
const {join} = require ("path");
const{validationResult} = require("express-validator");
const {hashSync} = require("bcrypt");
module.exports = {
    login: (req, res) => {
        let file = join(__dirname, "../views/users/login")
        res.render(file);
    },
    register: (req, res) => {
        let file = join(__dirname, "../views/users/registro")
        res.render(file);
    },
    profile: (req, res) => {
        let file = join(__dirname, "../views/users/profile")
        res.render(file);
    },
    save: (req,res) => {
        const result = validationResult(req);
        if(!result.isEmpty()){
            let errores = result.mapped();
            return res.render("../views/users/registro", {
                style: "register",
                errores: errores,
                data: req.body
            })

        }

        let all = index();
        req.body.avatar = req.files && req.files[0] ? req.files[0].filename : null
        req.body.id = all.length > 0 ? all[all.length-1].id + 1 : 1
        req.body.password = hashSync(req.body.password, 10)
        let user = {...req.body};
        all.push(user)
        write(all)
        return res.redirect('/users/login')

    },
    access: (req, res) =>{
        const result = validationResult(req);
        if(!result.isEmpty()){
            let errores = result.mapped();
            return res.render("../views/users/login", {
                style: "login",
                errores: errores,
                data: req.body
            })
           

        }
        res.cookie("../views/users", req.body.email,{maxAge: 5000})
        let all = index()
        req.session.user = all.find(user => user.email == req.body.email)
        return res.redirect("/")
    },
    logout:(req, res)=>{
        delete req.session.user
        res.cookie("../views/users", null,{maxAge: -1})
        return res.redirect("/")
    }
}
