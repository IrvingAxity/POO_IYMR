var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// CLASE PADRE
var Dulce = /** @class */ (function () {
    function Dulce(precio, peso, nombre, sabor, stock) {
        this.precio = precio;
        this.peso = peso;
        this.nombre = nombre;
        this.sabor = sabor;
        this.stock = stock;
    }
    Dulce.prototype.reducirStock = function () {
        if (this.stock > 0) {
            this.stock--;
        }
        else {
            throw new Error("No hay stock de ".concat(this.nombre));
        }
    };
    return Dulce;
}());
// SUBCLASES
var DulceLeche = /** @class */ (function (_super) {
    __extends(DulceLeche, _super);
    function DulceLeche() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DulceLeche;
}(Dulce));
var DulceCitrico = /** @class */ (function (_super) {
    __extends(DulceCitrico, _super);
    function DulceCitrico() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DulceCitrico;
}(Dulce));
var DulcePicante = /** @class */ (function (_super) {
    __extends(DulcePicante, _super);
    function DulcePicante() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DulcePicante;
}(Dulce));
var CarritoPago = /** @class */ (function () {
    function CarritoPago() {
        this.saldo = 0;
    }
    CarritoPago.prototype.insertarDinero = function (monto) {
        if (monto <= 0)
            throw new Error("Debe ingresar una cantidad positiva.");
        this.saldo += monto;
        console.log("Dinero ingresado: $".concat(monto, ". Saldo actual: $").concat(this.saldo));
    };
    CarritoPago.prototype.pagar = function (costo) {
        if (this.saldo < costo)
            return false;
        this.saldo -= costo;
        return true;
    };
    CarritoPago.prototype.obtenerSaldo = function () {
        return this.saldo;
    };
    CarritoPago.prototype.devolverCambio = function () {
        var cambio = this.saldo;
        this.saldo = 0;
        return cambio;
    };
    return CarritoPago;
}());
var RegistroVentas = /** @class */ (function () {
    function RegistroVentas() {
        this.ventas = [];
    }
    RegistroVentas.prototype.registrar = function (nombre) {
        for (var _i = 0, _a = this.ventas; _i < _a.length; _i++) {
            var venta = _a[_i];
            if (venta.nombre === nombre) {
                venta.cantidad++;
                return;
            }
        }
        this.ventas.push({ nombre: nombre, cantidad: 1 });
    };
    RegistroVentas.prototype.mostrarVentas = function () {
        console.log("Ventas:");
        for (var _i = 0, _a = this.ventas; _i < _a.length; _i++) {
            var venta = _a[_i];
            console.log("".concat(venta.nombre, ": ").concat(venta.cantidad, " unidades"));
        }
    };
    return RegistroVentas;
}());
var MaquinaDeDulces = /** @class */ (function () {
    function MaquinaDeDulces(productos) {
        this.productos = [];
        this.ventas = new RegistroVentas();
        this.pago = new CarritoPago();
        this.productos = productos;
    }
    MaquinaDeDulces.prototype.insertarDinero = function (monto) {
        try {
            this.pago.insertarDinero(monto);
        }
        catch (err) {
            alert(err.message);
        }
    };
    MaquinaDeDulces.prototype.seleccionarProducto = function (nombre) {
        var producto = null;
        for (var i = 0; i < this.productos.length; i++) {
            if (this.productos[i].nombre.toLowerCase() === nombre.toLowerCase()) {
                producto = this.productos[i];
                break;
            }
        }
        if (!producto) {
            alert("Producto no encontrado.");
            return;
        }
        if (producto.stock === 0) {
            alert("No hay stock de ".concat(producto.nombre, "."));
            return;
        }
        if (!this.pago.pagar(producto.precio)) {
            alert("Saldo insuficiente. Precio: $".concat(producto.precio, ", disponible: $").concat(this.pago.obtenerSaldo()));
            return;
        }
        producto.reducirStock();
        this.ventas.registrar(producto.nombre);
        alert("\u00A1Has comprado ".concat(producto.nombre, " correctamente!"));
    };
    MaquinaDeDulces.prototype.devolverCambio = function () {
        return this.pago.devolverCambio();
    };
    MaquinaDeDulces.prototype.getProductos = function () {
        return this.productos;
    };
    MaquinaDeDulces.prototype.getVentas = function () {
        return this.ventas.ventas;
    };
    MaquinaDeDulces.prototype.getSaldo = function () {
        return this.pago.obtenerSaldo();
    };
    return MaquinaDeDulces;
}());
// CREACIÓN DE LA MÁQUINA
var maquina = new MaquinaDeDulces([
    new DulceCitrico(20, 10, "Naranjito", "Naranja", 4),
    new DulceLeche(15, 15, "Dulce de Café Americano", "Café", 1),
    new DulcePicante(18, 10, "Mangomita", "Mango Picante", 3)
]);
// FUNCIONES HTML
function insertarDinero() {
    var input = document.getElementById("dineroInput");
    var monto = Number(input.value);
    maquina.insertarDinero(monto);
    actualizarSaldo();
    input.value = "";
}
function seleccionarProducto() {
    var input = document.getElementById("productoInput");
    var nombre = input.value.trim();
    maquina.seleccionarProducto(nombre);
    actualizarSaldo();
    actualizarStock();
    actualizarVentas();
    input.value = "";
}
function devolverCambio() {
    var cambio = maquina.devolverCambio();
    actualizarSaldo();
    var cambioEl = document.getElementById("cambioDevuelto");
    cambioEl.textContent = "Cambio devuelto: $".concat(cambio);
}
function actualizarSaldo() {
    var saldo = maquina.getSaldo();
    document.getElementById("saldoActual").textContent = "Saldo: $".concat(saldo);
}
function actualizarStock() {
    var ul = document.getElementById("listaStock");
    ul.innerHTML = "";
    maquina.getProductos().forEach(function (p) {
        var li = document.createElement("li");
        li.textContent = "".concat(p.nombre, ": ").concat(p.stock);
        ul.appendChild(li);
    });
}
function actualizarVentas() {
    var ul = document.getElementById("listaVentas");
    ul.innerHTML = "";
    var ventas = maquina.getVentas();
    ventas.forEach(function (v) {
        var li = document.createElement("li");
        li.textContent = "".concat(v.nombre, ": ").concat(v.cantidad);
        ul.appendChild(li);
    });
}
function mostrarProductos() {
    var container = document.getElementById("listaProductos");
    container.innerHTML = "";
    maquina.getProductos().forEach(function (p) {
        var div = document.createElement("div");
        div.className = "producto-card";
        div.innerHTML = "\n      <strong>".concat(p.nombre, "</strong><br/>\n      Sabor: ").concat(p.sabor, "<br/>\n      Precio: $").concat(p.precio, "<br/>\n      Stock: ").concat(p.stock, "\n    ");
        container.appendChild(div);
    });
}
mostrarProductos();
actualizarStock();
actualizarVentas();
