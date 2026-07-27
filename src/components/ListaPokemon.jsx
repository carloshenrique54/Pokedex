import supabase from "../services/supabase";
import { useEffect, useState } from "react";

function ListaPokemon({ onEdit, onDelete }) {
  const [pokemon, setPokemon] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  useEffect(() => {
    async function ListarPokemon() {
      setCarregando(true);

      const { data: info, error } = await supabase
        .from("pokemon")
        .select("*");

      if (error) {
        console.error(error);
        setCarregando(false);
        return;
      }

      setPokemon(info || []);
      setCarregando(false);
    }

    ListarPokemon();
  }, []);

  const obterImagem = (nomeArquivo) => {
    if (!nomeArquivo) return "";
    const { data } = supabase.storage.from("Imagens").getPublicUrl(nomeArquivo);
    return data.publicUrl;
  };

  const tipos = [...new Set(pokemon.map((p) => p.tipo).filter(Boolean))];

  const pokemonFiltrado = pokemon.filter((p) => {
    const matchNome = p.nome?.toLowerCase().includes(filtroNome.toLowerCase());
    const matchTipo = !filtroTipo || p.tipo?.toLowerCase() === filtroTipo.toLowerCase();
    return matchNome && matchTipo;
  });

  if (carregando) {
    return (
      <div className="loading-state">
        <div className="pokeball-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <div className="right-panel-title">
        <i className="fa-solid fa-database"></i>
        Pokemon Registrados
      </div>

      <div className="filter-bar">
        <div className="filter-wrapper">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            className="filter-input"
            type="text"
            placeholder="Buscar por nome..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          {tipos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="list-counter">
        <i className="fa-solid fa-hashtag"></i>
        {pokemonFiltrado.length} de {pokemon.length} pokemon
      </div>

      {pokemonFiltrado.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-box-open"></i>
          <p>{pokemon.length === 0 ? "Nenhum pokemon cadastrado" : "Nenhum pokemon encontrado"}</p>
        </div>
      ) : (
        <ul className="pokemon-list">
          {pokemonFiltrado.map((item) => (
            <li key={item.id} className="pokemon-card">
              <img
                className="pokemon-card-img"
                src={obterImagem(item.imagem)}
                alt={item.nome}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="pokemon-card-info">
                <div className="pokemon-card-name">{item.nome}</div>
                <span className="pokemon-card-type">{item.tipo}</span>
                <div className="pokemon-card-stats">
                  <span className="stat-hp">
                    <i className="fa-solid fa-heart"></i> {item.vida}
                  </span>
                  <span className="stat-def">
                    <i className="fa-solid fa-shield-halved"></i> {item.defesa}
                  </span>
                  <span className="stat-atk">
                    <i className="fa-solid fa-fire"></i> {item.ataque}
                  </span>
                </div>
                <div className="pokemon-card-location">
                  <i className="fa-solid fa-location-dot"></i>
                  {item.local}
                </div>
                <div className="pokemon-card-obs">{item.observações}</div>
              </div>
              <div className="pokemon-card-actions">
                <button
                  className="btn-action btn-edit"
                  title="Editar"
                  onClick={() => onEdit(item)}
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button
                  className="btn-action btn-delete"
                  title="Excluir"
                  onClick={() => onDelete(item)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default ListaPokemon;