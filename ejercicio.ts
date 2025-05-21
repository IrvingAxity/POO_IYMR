// CLASE PADRE
class Dulce {
  constructor(
    public precio: number,
    public peso: number,
    public nombre: string,
    public sabor: string,
    public stock: number
  ) {}

  reducirStock(): void {
    if (this.stock > 0) {
      this.stock--;
    } else {
      throw new Error(`No hay stock de ${this.nombre}`);
    }
  }
}

// SUBCLASES
class DulceLeche extends Dulce {}
class DulceCitrico extends Dulce {}
class DulcePicante extends Dulce {}

class CarritoPago {
  private saldo: number = 0;

  insertarDinero(monto: number): void {
    if (monto <= 0) throw new Error("Debe ingresar una cantidad positiva.");
    this.saldo += monto;
    console.log(`Dinero ingresado: $${monto}. Saldo actual: $${this.saldo}`);
  }

  pagar(costo: number): boolean {
    if (this.saldo < costo) return false;
    this.saldo -= costo;
    return true;
  }

  obtenerSaldo(): number {
    return this.saldo;
  }

  devolverCambio(): number {
    const cambio = this.saldo;
    this.saldo = 0;
    return cambio;
  }
}

class RegistroVentas {
  public ventas: { nombre: string; cantidad: number }[] = [];

  registrar(nombre: string): void {
    for (let venta of this.ventas) {
      if (venta.nombre === nombre) {
        venta.cantidad++;
        return;
      }
    }
    this.ventas.push({ nombre, cantidad: 1 });
  }

  mostrarVentas(): void {
    console.log("Ventas:");
    for (let venta of this.ventas) {
      console.log(`${venta.nombre}: ${venta.cantidad} unidades`);
    }
  }
}

class MaquinaDeDulces {
  private productos: Dulce[] = [];
  private ventas = new RegistroVentas();
  private pago = new CarritoPago();

  constructor(productos: Dulce[]) {
    this.productos = productos;
  }

  insertarDinero(monto: number): void {
    try {
      this.pago.insertarDinero(monto);
    } catch (err: any) {
      alert(err.message);
    }
  }

  seleccionarProducto(nombre: string): void {
  let producto: Dulce | null = null;

  for (let i = 0; i < this.productos.length; i++) {
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
    alert(`No hay stock de ${producto.nombre}.`);
    return;
  }

  if (!this.pago.pagar(producto.precio)) {
    alert(`Saldo insuficiente. Precio: $${producto.precio}, disponible: $${this.pago.obtenerSaldo()}`);
    return;
  }

  producto.reducirStock();
  this.ventas.registrar(producto.nombre);
  alert(`¡Has comprado ${producto.nombre} correctamente!`);
}


  devolverCambio(): number {
    return this.pago.devolverCambio();
  }

  getProductos(): Dulce[] {
    return this.productos;
  }

  getVentas(): { nombre: string; cantidad: number }[] {
    return this.ventas.ventas;
  }

  getSaldo(): number {
    return this.pago.obtenerSaldo();
  }
}

// CREACIÓN DE LA MÁQUINA
const maquina = new MaquinaDeDulces([
  new DulceCitrico(20, 10, "Naranjito", "Naranja", 4),
  new DulceLeche(15, 15, "Dulce de Café Americano", "Café", 1),
  new DulcePicante(18, 10, "Mangomita", "Mango Picante", 3)
]);

// FUNCIONES HTML

function insertarDinero() {
  const input = document.getElementById("dineroInput") as HTMLInputElement;
  const monto = Number(input.value);
  maquina.insertarDinero(monto);
  actualizarSaldo();
  input.value = "";
}

function seleccionarProducto() {
  const input = document.getElementById("productoInput") as HTMLInputElement;
  const nombre = input.value.trim();
  maquina.seleccionarProducto(nombre);
  actualizarSaldo();
  actualizarStock();
  actualizarVentas();
  input.value = "";
}

function devolverCambio() {
  const cambio = maquina.devolverCambio();
  actualizarSaldo();
  const cambioEl = document.getElementById("cambioDevuelto")!;
  cambioEl.textContent = `Cambio devuelto: $${cambio}`;
}

function actualizarSaldo() {
  const saldo = maquina.getSaldo();
  document.getElementById("saldoActual")!.textContent = `Saldo: $${saldo}`;
}

function actualizarStock() {
  const ul = document.getElementById("listaStock")!;
  ul.innerHTML = "";
  maquina.getProductos().forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre}: ${p.stock}`;
    ul.appendChild(li);
  });
}

function actualizarVentas() {
  const ul = document.getElementById("listaVentas")!;
  ul.innerHTML = "";
  const ventas = maquina.getVentas();
  ventas.forEach((v) => {
    const li = document.createElement("li");
    li.textContent = `${v.nombre}: ${v.cantidad}`;
    ul.appendChild(li);
  });
}

function mostrarProductos() {
  const container = document.getElementById("listaProductos")!;
  container.innerHTML = "";
  maquina.getProductos().forEach((p) => {
    const div = document.createElement("div");
    div.className = "producto-card";
    div.innerHTML = `
      <strong>${p.nombre}</strong><br/>
      Sabor: ${p.sabor}<br/>
      Precio: $${p.precio}<br/>
      Stock: ${p.stock}
    `;
    container.appendChild(div);
  });
}

mostrarProductos();
actualizarStock();
actualizarVentas();
