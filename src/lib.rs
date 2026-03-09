use anchor_lang::prelude::*;

declare_id!("4fbRFPrKfeosJ21nWoPJvdV1ZZzVwXQ6YjLc9JwR1dPC");

#[program]
pub mod restaurante {
    use super::*;

    // Crear el restaurante
    pub fn crear_restaurante(context: Context<NuevoRestaurante>, nombre: String) -> Result<()> {

        let owner = context.accounts.owner.key();
        let platillos: Vec<Platillo> = Vec::new();

        context.accounts.restaurante.set_inner(Restaurante{
            owner,
            nombre,
            platillos,
        });

        Ok(())
    }

    // Agregar platillo al menú
    pub fn agregar_platillo(
        context: Context<NuevoPlatillo>,
        nombre: String,
        precio: u16
    ) -> Result<()> {

        let platillo = Platillo{
            nombre,
            precio,
            disponible: true,
        };

        context.accounts.restaurante.platillos.push(platillo);

        Ok(())
    }

    // Eliminar platillo
    pub fn eliminar_platillo(context: Context<NuevoPlatillo>, nombre: String) -> Result<()> {

        let platillos = &mut context.accounts.restaurante.platillos;

        for i in 0..platillos.len(){

            if platillos[i].nombre == nombre{

                platillos.remove(i);

                msg!("Platillo {} eliminado del menú", nombre);

                return Ok(())
            }
        }

        Err(Errores::PlatilloNoExiste.into())
    }

    // Ver menú
    pub fn ver_menu(context: Context<NuevoPlatillo>) -> Result<()> {

        let platillos = &context.accounts.restaurante.platillos;

        msg!("Menú del restaurante: {:#?}", platillos);

        Ok(())
    }

    // Cambiar disponibilidad (si hay o no en existencia)
    pub fn cambiar_disponibilidad(
        context: Context<NuevoPlatillo>,
        nombre: String
    ) -> Result<()> {

        let platillos = &mut context.accounts.restaurante.platillos;

        for i in 0..platillos.len(){

            if platillos[i].nombre == nombre{

                let estado_actual = platillos[i].disponible;
                let nuevo_estado = !estado_actual;

                platillos[i].disponible = nuevo_estado;

                msg!(
                    "El platillo {} ahora está disponible: {}",
                    nombre,
                    nuevo_estado
                );

                return Ok(())
            }
        }

        Err(Errores::PlatilloNoExiste.into())
    }
}

#[error_code]
pub enum Errores{

    #[msg("Error, no eres el propietario.")]
    NoEresElOwner,

    #[msg("El platillo no existe.")]
    PlatilloNoExiste,
}

#[account]
#[derive(InitSpace)]
pub struct Restaurante{

    pub owner: Pubkey,

    #[max_len(60)]
    pub nombre: String,

    #[max_len(20)]
    pub platillos: Vec<Platillo>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Debug)]
pub struct Platillo{

    #[max_len(60)]
    pub nombre: String,

    pub precio: u16,

    pub disponible: bool,
}

#[derive(Accounts)]
pub struct NuevoRestaurante<'info>{

    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = Restaurante::INIT_SPACE + 8,
        seeds = [b"restaurante", owner.key().as_ref()],
        bump
    )]
    pub restaurante: Account<'info, Restaurante>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct NuevoPlatillo<'info>{

    pub owner: Signer<'info>,

    #[account(mut)]
    pub restaurante: Account<'info, Restaurante>,
}
