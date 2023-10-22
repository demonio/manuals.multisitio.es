// Definición del objeto Kumbia
const Kumbia = {
    publicPath: null,
    plugin: [],

    // Muestra un mensaje de confirmación
    cConfirm: function(event) {
        const el = event.target;
        if (!confirm(el.getAttribute("data-msg"))) {
            event.preventDefault();
        }
    },

    // Aplica un efecto a un elemento
    cFx: function(fx) {
        return function(event) {
            event.preventDefault();
            const el = event.target;
            const rel = document.getElementById(el.getAttribute("data-to"));
            if (rel) {
                rel.style.display = fx === "toggle" ? (rel.style.display === "none" ? "block" : "none") : fx;
            }
        };
    },

    // Carga contenido con AJAX
    cRemote: function(event) {
        event.preventDefault();
        const el = event.target;
        const rel = document.querySelector(el.getAttribute("data-ajax"));
        console.log(el.href);
        if (rel) {
            fetch(el.href, {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                })
                .then((response) => response.text())
                .then((data) => {
                    rel.innerHTML = data;
                });
        }
    },

    // Carga contenido con AJAX y confirmación
    cRemoteConfirm: function(event) {
        const el = event.target;
        if (confirm(el.getAttribute("data-msg"))) {
            Kumbia.cRemote(event);
        }
    },

    // Envia formularios de manera asíncrona via POST y los carga en un contenedor
    /*
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelector('.myForm').addEventListener('submit', function (event) {
                var data = this;
                fetch(data.getAttribute('action'), {
                method: data.getAttribute('method'),
                body: new FormData(data)
                }).then(res=>res.text())
                .then(function (data) {
                    
                });
                event.preventDefault();
            });
        });
    */
    cFRemote: function(event) {
        event.preventDefault();
        const el = event.target;
        const button = el.querySelector("[type=submit]");
        button.disabled = true;
        const url = el.getAttribute("action");
        const divId = el.getAttribute("data-to");
        const div = document.getElementById(divId);
        if (div) {
            fetch(url, {
                    method: "POST",
                    body: new FormData(el),
                })
                .then((response) => response.text())
                .then((data) => {
                    div.style.display = "none";
                    div.innerHTML = data;
                    div.style.display = "block";
                    button.disabled = false;
                });
        }
    },

    // Carga contenido con AJAX al cambiar un select
    cUpdaterSelect: function(event) {
        const select = event.target;
        const updateId = select.getAttribute("data-update");
        const updateElement = document.getElementById(updateId);
        if (updateElement) {
            updateElement.innerHTML = "";
            const url = select.getAttribute("data-url");
            fetch(url + "?id=" + select.value)
                .then((response) => response.json())
                .then((data) => {
                    for (const key in data) {
                        const option = document.createElement("option");
                        option.text = data[key];
                        option.value = key;
                        updateElement.appendChild(option);
                    }
                });
        }
    },

    // Enlaza a los métodos por defecto
    bind: function() {
        document.body.addEventListener("click", function(event) {
            const target = event.target;
            if (target.matches("a.js-confirm, input.js-confirm")) {
                Kumbia.cConfirm(event);
            } else if (target.matches("a[data-ajax]")) {
                Kumbia.cRemote(event);
            } else if (target.matches("a.js-remote-confirm")) {
                Kumbia.cRemoteConfirm(event);
            } else if (target.matches(".js-show")) {
                Kumbia.cFx("block")(event);
            } else if (target.matches(".js-hide")) {
                Kumbia.cFx("none")(event);
            } else if (target.matches(".js-toggle")) {
                Kumbia.cFx("toggle")(event);
            } else if (target.matches(".js-fade-in")) {
                Kumbia.cFx("block")(event);
            } else if (target.matches(".js-fade-out")) {
                Kumbia.cFx("none")(event);
            }
        });

        document.body.addEventListener("submit", function(event) {
            if (event.target.matches("form.js-remote")) {
                Kumbia.cFRemote(event);
            }
        });

        document.body.addEventListener("change", function(event) {
            if (event.target.matches("select.js-remote")) {
                Kumbia.cUpdaterSelect(event);
            }
        });
    },

    // Carga y enlaza Unobtrusive DatePicker en caso de ser necesario
    bindDatePicker: function() {
        const inputs = document.querySelectorAll("input.js-datepicker");

        const bindInputs = function() {
            inputs.forEach((input) => {
                const opts = { monthSelector: true, yearSelector: true };
                const dateMin = input.getAttribute("min");
                if (dateMin !== null) {
                    opts.dateMin = dateMin.split("-");
                }
                const dateMax = input.getAttribute("max");
                if (dateMax !== null) {
                    opts.dateMax = dateMax.split("-");
                }
                input.pickadate(opts);
            });
        };

        if (typeof pickadate !== "undefined") {
            return bindInputs();
        }

        const head = document.querySelector("head");
        head.innerHTML += '<link href="' + Kumbia.publicPath + 'css/pickadate.css" rel="stylesheet"/>';

        fetch(Kumbia.publicPath + 'javascript/jquery/pickadate.js')
            .then((response) => response.text())
            .then((data) => {
                bindInputs();
            });
    },

    // Inicializa el plugin
    initialize: function() {
        const script = document.currentScript;
        if (script) {
            const src = script.src;
            this.publicPath = src.slice(0, src.lastIndexOf('javascript/'));
        }

        Kumbia.bind();
    },
};

// Inicializa el plugin
Kumbia.initialize();