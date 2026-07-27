import "../styles/PokeCadastro.css"

function PokeCadastro() {
  return (
    <form>
      <div className="inputBox">
        <label htmlFor="name">Nome:</label>
        <input placeholder="Ex: Pikachu..." />
      </div>
      <div className="inputBox">
        <label htmlFor="type">Tipagem:</label>
        <input placeholder="Ex: Fogo, Água..." />
      </div>
      <div className="inputBox">
        <label htmlFor="local">Localização encontrada:</label>
        <input placeholder="Rua/Bairro" />
      </div>
      <div className="inputBox">
        <label htmlFor="observations">Observações:</label>
        <textarea name="observations" />
      </div>
    </form>
  );
}

export default PokeCadastro;
