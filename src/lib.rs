use anchor_lang::prelude::*;

declare_id!("");

#[program]
pub mod biblioteca{
    use super::*;

    pub fn crear_biblioteca() -> Result<()>{
        // Codigo....
    }
}

#[account]
#[derive(InitSpace)]
pub struct Biblioteca{
    owner: PubKey,
    #[max_len(60)]
    nombre: String,
    #[max_len(10)]
    libros: Vec<>,
} 

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Partialeq, Debug)]
pub struct Libro{
    #[max_len(60)]
    nombre: String,
    paginas: u16,
    disponible: bool,
}

#[derive(Accounts)]
pub struct NuevaBiblioteca{
    #[account(mut)]
    pub owner: Signer<'info>,
    
    #[account(
        init,
        payer = owner,
        space = Biblioteca::INITSPACE + 8,
        seeds = [b"biblioteca",owner.key().as_ref()],
        bump
    )]
    pub biblioteca: Account<'info, Biblioteca>,
    pub system_program: Program<'info, System>,
}

pub struct NuevoLibro{
    pub owner: Signer<'info>,
    #[account(mut)]
    pub biblioteca: Account<'info, Biblioteca>,    
}
