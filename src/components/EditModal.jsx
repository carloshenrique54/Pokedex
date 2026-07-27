import { useState } from "react";
import supabase from "../services/supabase";

function EditModal({ pokemon, onClose, onSave, showToast }) {
  const [nome, setNome] = useState(pokemon.nome || "");
  const [tipo, setTipo] = useState(pokemon.tipo || "");
  const [local, setLocal] = useState(pokemon.local || "");
  const [hp, setHp] = useState(pokemon.vida || 0);
  const [def, setDef] = useState(pokemon.defesa || 0);
  const [atk, setAtk] = useState(pokemon.ataque || 0);
  const [desc, setDesc] = useState(pokemon.observações || "");
  const [salvando, setSalvando] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    if (salvando) return;

    if (!nome) { showToast("Insira o nome", "error"); return; }
    if (!tipo) { showToast("Insira o tipo", "error"); return; }

    setSalvando(true);

    const { error } = await supabase
      .from("pokemon")
      .update({
        nome,
        tipo,
        local,
        observações: desc,
        vida: hp,
        defesa: def,
        ataque: atk,
      })
      .eq("id", pokemon.id);

    if (error) {
      showToast("Erro ao atualizar pokemon", "error");
      setSalvando(false);
      return;
    }

    setSalvando(false);
    onSave();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <i className="fa-solid fa-pen-to-square"></i>
            Editar Pokemon
          </div>
          <button className="modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input
              className="form-input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipagem</label>
            <input
              className="form-input"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
          </div>

          <div className="stats-row">
            <div className="form-group">
              <label className="form-label">
                <i className="fa-solid fa-heart" style={{ color: "#4caf50" }}></i> HP
              </label>
              <input
                className="form-input"
                type="number"
                min={0}
                value={hp}
                onChange={(e) => setHp(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <i className="fa-solid fa-shield-halved" style={{ color: "#3dc7ef" }}></i> DEF
              </label>
              <input
                className="form-input"
                type="number"
                min={0}
                value={def}
                onChange={(e) => setDef(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <i className="fa-solid fa-fire" style={{ color: "#ff7043" }}></i> ATK
              </label>
              <input
                className="form-input"
                type="number"
                min={0}
                value={atk}
                onChange={(e) => setAtk(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Localizacao</label>
            <input
              className="form-input"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Observacoes</label>
            <textarea
              className="form-input form-textarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-salvar" disabled={salvando}>
            {salvando ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Salvando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk"></i>
                Salvar Alteracoes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
