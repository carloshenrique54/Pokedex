import ListaPokemon from "./components/ListaPokemon";
import PokeCadastro from "./components/PokeCadastro";

import "./styles/App.css"

function App() {
  return (
    <>
      <h1>Cadastre o seu pokemon</h1>
      <div className="pokedex">
        <div className="pag1">
          <PokeCadastro />
        </div>
        <div className="pag2">
          <ListaPokemon />
        </div>
      </div>
    </>
  );
}

export default App;
