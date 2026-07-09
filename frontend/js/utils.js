const Utils = {

    qs(id){

        return document.querySelector(id);

    },

    qsa(id){

        return document.querySelectorAll(id);

    },

    byId(id){

        return document.getElementById(id);

    },

    today(){

        return new Date().toISOString().substring(0,10);

    },

    now(){

        return new Date().toLocaleString();

    },

    save(key,value){

        localStorage.setItem(key,JSON.stringify(value));

    },

    load(key){

        let d=localStorage.getItem(key);

        return d?JSON.parse(d):null;

    },

    toast(msg){

        console.log(msg);

    }

};