/*==================================================
 MotoFlow V2.0
 File : frontend/js/app.js
==================================================*/

window.onload = async function () {

    Header.render();

    Navbar.render();

    await Router.open("dashboard");

};