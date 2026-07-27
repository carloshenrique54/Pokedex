import { useEffect, useState } from "react";
import supabase from "../services/supabase";

function Relatorio() {
  const [pokemon, setPokemon] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      const { data } = await supabase.from("pokemon").select("*");
      setPokemon(data || []);
      setCarregando(false);
    }
    carregar();
  }, []);

  if (carregando) {
    return (
      <div className="loading-state">
        <div className="pokeball-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className="empty-state">
        <i className="fa-solid fa-chart-pie"></i>
        <p>Nenhum dado para exibir</p>
      </div>
    );
  }

  const total = pokemon.length;
  const avgHp = Math.round(pokemon.reduce((s, p) => s + Number(p.vida || 0), 0) / total);
  const avgDef = Math.round(pokemon.reduce((s, p) => s + Number(p.defesa || 0), 0) / total);
  const avgAtk = Math.round(pokemon.reduce((s, p) => s + Number(p.ataque || 0), 0) / total);

  const maxHp = Math.max(...pokemon.map((p) => Number(p.vida || 0)));
  const maxAtk = Math.max(...pokemon.map((p) => Number(p.ataque || 0)));
  const maxDef = Math.max(...pokemon.map((p) => Number(p.defesa || 0)));

  const tipoCount = {};
  pokemon.forEach((p) => {
    const t = p.tipo || "Desconhecido";
    tipoCount[t] = (tipoCount[t] || 0) + 1;
  });
  const tiposSorted = Object.entries(tipoCount).sort((a, b) => b[1] - a[1]);
  const maxTipoCount = tiposSorted[0]?.[1] || 1;

  const obterImagem = (nomeArquivo) => {
    if (!nomeArquivo) return "";
    const { data } = supabase.storage.from("Imagens").getPublicUrl(nomeArquivo);
    return data.publicUrl;
  };

  const topHp = [...pokemon].sort((a, b) => Number(b.vida || 0) - Number(a.vida || 0)).slice(0, 3);
  const topAtk = [...pokemon].sort((a, b) => Number(b.ataque || 0) - Number(a.ataque || 0)).slice(0, 3);

  return (
    <div className="report-container">
      <div className="right-panel-title">
        <i className="fa-solid fa-chart-bar"></i>
        Relatorio de Estatisticas
      </div>

      <div className="report-grid">
        <div className="report-card">
          <i className="fa-solid fa-database report-card-icon blue"></i>
          <div className="report-card-value">{total}</div>
          <div className="report-card-label">Total</div>
        </div>
        <div className="report-card">
          <i className="fa-solid fa-heart report-card-icon green"></i>
          <div className="report-card-value">{avgHp}</div>
          <div className="report-card-label">Media HP</div>
        </div>
        <div className="report-card">
          <i className="fa-solid fa-shield-halved report-card-icon blue"></i>
          <div className="report-card-value">{avgDef}</div>
          <div className="report-card-label">Media DEF</div>
        </div>
        <div className="report-card">
          <i className="fa-solid fa-fire report-card-icon orange"></i>
          <div className="report-card-value">{avgAtk}</div>
          <div className="report-card-label">Media ATK</div>
        </div>
        <div className="report-card">
          <i className="fa-solid fa-heart-circle-bolt report-card-icon green"></i>
          <div className="report-card-value">{maxHp}</div>
          <div className="report-card-label">Maior HP</div>
        </div>
        <div className="report-card">
          <i className="fa-solid fa-burst report-card-icon red"></i>
          <div className="report-card-value">{maxAtk}</div>
          <div className="report-card-label">Maior ATK</div>
        </div>
        <div className="report-card">
          <i className="fa-solid fa-shield report-card-icon blue"></i>
          <div className="report-card-value">{maxDef}</div>
          <div className="report-card-label">Maior DEF</div>
        </div>
        <div className="report-card">
          <i className="fa-solid fa-tags report-card-icon yellow"></i>
          <div className="report-card-value">{tiposSorted.length}</div>
          <div className="report-card-label">Tipos</div>
        </div>
      </div>

      <div className="report-section-title">
        <i className="fa-solid fa-chart-simple"></i>
        Pokemon por Tipo
      </div>
      <div className="type-chart">
        {tiposSorted.map(([tipo, count]) => (
          <div key={tipo} className="type-bar-row">
            <span className="type-bar-label">{tipo}</span>
            <div className="type-bar-track">
              <div
                className="type-bar-fill"
                style={{ width: `${(count / maxTipoCount) * 100}%` }}
              >
                <span className="type-bar-count">{count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="report-section-title">
        <i className="fa-solid fa-ranking-star"></i>
        Top HP
      </div>
      <div className="top-pokemon-list">
        {topHp.map((p, i) => (
          <div key={p.id} className="top-pokemon-item">
            <span className="top-rank">#{i + 1}</span>
            <img src={obterImagem(p.imagem)} alt={p.nome} onError={(e) => { e.target.style.display = "none"; }} />
            <span className="top-pokemon-name">{p.nome}</span>
            <span className="top-pokemon-stat">{p.vida} HP</span>
          </div>
        ))}
      </div>

      <div className="report-section-title">
        <i className="fa-solid fa-ranking-star"></i>
        Top Ataque
      </div>
      <div className="top-pokemon-list">
        {topAtk.map((p, i) => (
          <div key={p.id} className="top-pokemon-item">
            <span className="top-rank">#{i + 1}</span>
            <img src={obterImagem(p.imagem)} alt={p.nome} onError={(e) => { e.target.style.display = "none"; }} />
            <span className="top-pokemon-name">{p.nome}</span>
            <span className="top-pokemon-stat">{p.ataque} ATK</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Relatorio;
