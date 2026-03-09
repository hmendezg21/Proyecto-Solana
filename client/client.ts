import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

// ---------------------
// Provider
// ---------------------
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

// programa (nombre debe coincidir con el mod en Rust)
const program = anchor.workspace.Restaurante;

// wallet
const owner = provider.wallet.publicKey;

// ---------------------
// PDA del restaurante
// ---------------------
function pdaRestaurante(ownerPk: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("restaurante"),
      ownerPk.toBuffer()
    ],
    program.programId
  );
}

// ---------------------
// Crear restaurante
// ---------------------
async function crearRestaurante(nombre: string) {

  const [restaurantePDA] = pdaRestaurante(owner);

  const tx = await program.methods
    .crearRestaurante(nombre)
    .accounts({
      owner: owner,
      restaurante: restaurantePDA,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("Restaurante creado");
  console.log("TX:", tx);
}

// ---------------------
// Agregar platillo
// ---------------------
async function agregarPlatillo(nombre: string, precio: number) {

  const [restaurantePDA] = pdaRestaurante(owner);

  const tx = await program.methods
    .agregarPlatillo(nombre, precio)
    .accounts({
      owner,
      restaurante: restaurantePDA
    })
    .rpc();

  console.log("Platillo agregado:", nombre);
}

// ---------------------
// Eliminar platillo
// ---------------------
async function eliminarPlatillo(nombre: string) {

  const [restaurantePDA] = pdaRestaurante(owner);

  const tx = await program.methods
    .eliminarPlatillo(nombre)
    .accounts({
      owner,
      restaurante: restaurantePDA
    })
    .rpc();

  console.log("Platillo eliminado:", nombre);
}

// ---------------------
// Cambiar disponibilidad
// ---------------------
async function cambiarDisponibilidad(nombre: string) {

  const [restaurantePDA] = pdaRestaurante(owner);

  await program.methods
    .cambiarDisponibilidad(nombre)
    .accounts({
      owner,
      restaurante: restaurantePDA
    })
    .rpc();

  console.log("Disponibilidad cambiada:", nombre);
}

// ---------------------
// Ver menú
// ---------------------
async function verMenu() {

  const [restaurantePDA] = pdaRestaurante(owner);

  const cuenta = await program.account.restaurante.fetch(restaurantePDA);

  console.log("Restaurante:", cuenta.nombre);

  cuenta.platillos.forEach((platillo: any, i: number) => {
    console.log(
      `#${i} -> nombre=${platillo.nombre}, precio=${platillo.precio}, disponible=${platillo.disponible}`
    );
  });
}

// ---------------------
// MAIN
// ---------------------
(async () => {

  // crear restaurante
  await crearRestaurante("Santo Chilaquil");

  // agregar platillos
  //await agregarPlatillo("Tacos", 35);
  await agregarPlatillo("Quesadilla", 45);

  // ver menu
  await verMenu();

  // cambiar disponibilidad
  //await cambiarDisponibilidad("Tacos");

  // eliminar platillo
  //await eliminarPlatillo("Quesadilla");

})();
