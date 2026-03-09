import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.Biblioteca;

const owner = provider.wallet.publicKey;

// ---------------------
// PDA
// ---------------------
function pdaBiblioteca(ownerPk) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("biblioteca"),
      ownerPk.toBuffer()
    ],
    program.programId
  );
}

// ---------------------
// Crear biblioteca
// ---------------------
async function crearBiblioteca(nombre) {

  const [bibliotecaPDA] = pdaBiblioteca(owner);

  const tx = await program.methods
    .crearBiblioteca(nombre)
    .accounts({
      owner: owner,
      biblioteca: bibliotecaPDA,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("Biblioteca creada");
  console.log("TX:", tx);
}

// ---------------------
// Agregar libro
// ---------------------
async function agregarLibro(nombre, paginas) {

  const [bibliotecaPDA] = pdaBiblioteca(owner);

  const tx = await program.methods
    .agregarLibro(nombre, paginas)
    .accounts({
      owner,
      biblioteca: bibliotecaPDA
    })
    .rpc();

  console.log("Libro agregado:", nombre);
}

// ---------------------
// Eliminar libro
// ---------------------
async function eliminarLibro(nombre) {

  const [bibliotecaPDA] = pdaBiblioteca(owner);

  const tx = await program.methods
    .eliminarLibro(nombre)
    .accounts({
      owner,
      biblioteca: bibliotecaPDA
    })
    .rpc();

  console.log("Libro eliminado:", nombre);
}

// ---------------------
// Alternar estado
// ---------------------
async function alternarEstado(nombre) {

  const [bibliotecaPDA] = pdaBiblioteca(owner);

  await program.methods
    .alternarEstado(nombre)
    .accounts({
      owner,
      biblioteca: bibliotecaPDA
    })
    .rpc();

  console.log("Estado cambiado:", nombre);
}

// ---------------------
// Ver libros
// ---------------------
async function verLibros() {

  const [bibliotecaPDA] = pdaBiblioteca(owner);

  const cuenta = await program.account.biblioteca.fetch(bibliotecaPDA);

  console.log("Biblioteca:", cuenta.nombre);

  cuenta.libros.forEach((libro, i) => {
    console.log(
      `#${i} -> nombre=${libro.nombre}, paginas=${libro.paginas}, disponible=${libro.disponible}`
    );
  });
}

// ---------------------
// MAIN
// ---------------------
(async () => {

  //await crearBiblioteca("Alejandria");

  //await agregarLibro("Mistborn", 541);
  //await agregarLibro("Red Rising", 382);
  await verLibros();
  //await alternarEstado("Mistborn");
  //await eliminarLibro("Red Rising");
  //await verLibros();

})();
