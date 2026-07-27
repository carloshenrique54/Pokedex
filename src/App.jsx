import { useState, useCallback } from "react";
import PokeCadastro from "./components/PokeCadastro";
import ListaPokemon from "./components/ListaPokemon";
import Relatorio from "./components/Relatorio";
import EditModal from "./components/EditModal";
import ConfirmDelete from "./components/ConfirmDelete";
import Toast from "./components/Toast";

import "./styles/App.css";

function App() {
  const [activeTab, setActiveTab] = useState("cadastro");
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingPokemon, setEditingPokemon] = useState(null);
  const [deletingPokemon, setDeletingPokemon] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleCadastroSuccess = useCallback(() => {
    showToast("Pokemon cadastrado com sucesso!");
    triggerRefresh();
  }, [showToast, triggerRefresh]);

  const handleEditSave = useCallback(() => {
    setEditingPokemon(null);
    showToast("Pokemon atualizado com sucesso!");
    triggerRefresh();
  }, [showToast, triggerRefresh]);

  const handleDeleteConfirm = useCallback(() => {
    setDeletingPokemon(null);
    showToast("Pokemon excluido com sucesso!");
    triggerRefresh();
  }, [showToast, triggerRefresh]);

  return (
    <div className="pokedex-wrapper">
      <div className="pokedex-device">
        <div className="pokedex-top-bar">
          <div className="pokedex-lens"></div>
          <div className="header-lights">
            <div className="header-light red"></div>
            <div className="header-light yellow"></div>
            <div className="header-light green"></div>
          </div>
        </div>

        <div className="pokedex-tab-strip">
          <button
            className={`pokedex-tab ${activeTab === "cadastro" ? "active" : ""}`}
            onClick={() => setActiveTab("cadastro")}
          >
            <i className="fa-solid fa-plus"></i>
            Cadastrar
          </button>
          <button
            className={`pokedex-tab ${activeTab === "relatorio" ? "active" : ""}`}
            onClick={() => setActiveTab("relatorio")}
          >
            <i className="fa-solid fa-chart-bar"></i>
            Relatorio
          </button>
        </div>

        <div className="pokedex-body">
          <div className="pokedex-content">
            {activeTab === "cadastro" && (
              <>
                <div className="pokedex-left">
                  <PokeCadastro onSuccess={handleCadastroSuccess} showToast={showToast} />
                </div>
                <div className="pokedex-right">
                  <ListaPokemon
                    key={refreshKey}
                    onEdit={setEditingPokemon}
                    onDelete={setDeletingPokemon}
                  />
                </div>
              </>
            )}
            {activeTab === "relatorio" && (
              <div className="pokedex-full">
                <Relatorio key={refreshKey} />
              </div>
            )}
          </div>
        </div>

        <div className="pokedex-bottom-bar">
          <div className="dpad">
            <div className="dpad-h"></div>
            <div className="dpad-v"></div>
            <div className="dpad-center"></div>
          </div>
          <div className="bottom-deco-group">
            <div className="green-button"></div>
            <div className="bottom-deco-circles">
              <div className="circle-btn white"></div>
              <div className="circle-btn white-sm"></div>
            </div>
          </div>
          <div className="bottom-screen">
            <span className="bottom-screen-text">Pokedex v1.0</span>
          </div>
          <div className="circle-btn yellow-deco"></div>
        </div>
      </div>

      {editingPokemon && (
        <EditModal
          pokemon={editingPokemon}
          onClose={() => setEditingPokemon(null)}
          onSave={handleEditSave}
          showToast={showToast}
        />
      )}

      {deletingPokemon && (
        <ConfirmDelete
          pokemon={deletingPokemon}
          onClose={() => setDeletingPokemon(null)}
          onConfirm={handleDeleteConfirm}
          showToast={showToast}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;
