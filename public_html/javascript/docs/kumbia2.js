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
        const container = el.getAttribute("data-ajax");
        console.log(el.href);
        history.pushState({ url: el.href, container: container }, '', el.href);
        if (container) {
            Kumbia.go(el.href, container);
        }
    },

    // Hace un fetch
    go: function(url, container) {
        const rel = document.querySelector(container);
        fetch(url, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            })
            .then((response) => response.text())
            .then((data) => {
                rel.innerHTML = data;
                document.title = url.split('#')[0].split('/').slice(4).join(' » ');
            });
    },

    // Método popstate para manejar eventos de cambio de estado del historial
    popstate: function() {
        window.addEventListener('popstate', function(event) {
            if (event.state && event.state.url) {
                // Carga el contenido correspondiente cuando se navega hacia atrás o adelante en el historial
                Kumbia.go(event.state.url, event.state.container);
            }
        });
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

    // Inicializa el plugin
    initialize: function() {
        const script = document.currentScript;
        if (script) {
            const src = script.src;
            this.publicPath = src.slice(0, src.lastIndexOf('javascript/'));
        }

        Kumbia.bind();
        Kumbia.popstate();
    },
};

// Inicializa el plugin
Kumbia.initialize();