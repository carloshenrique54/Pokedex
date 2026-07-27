import supabase from "../services/supabase";
import { useState } from "react";

function ConfirmDelete({ pokemon, onClose, onConfirm, showToast }) {
  const [excluindo, setExcluindo] = useState(false);

  async function handleDelete() {
    if (excluindo) return;
    setExcluindo(true);

    if (pokemon.imagem) {
      await supabase.storage.from("Imagens").remove([pokemon.imagem]);
    }

    const { error } = await supabase
      .from("pokemon")
      .delete()
      .eq("id", pokemon.id);

    if (error) {
      showToast("Erro ao excluir pokemon", "error");
      setExcluindo(false);
      return;
    }

    setExcluindo(false);
    onConfirm();
  }

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <i className="fa-solid fa-triangle-exclamation"></i>
        <p>Deseja excluir o pokemon</p>
        <p className="confirm-name">{pokemon.nome}?</p>
        <div className="confirm-actions">
          <button className="btn-confirm-no" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-confirm-yes" onClick={handleDelete} disabled={excluindo}>
            {excluindo ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <>
                <i className="fa-solid fa-trash"></i>
                Excluir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDelete;
