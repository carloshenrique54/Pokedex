import { useState } from "react";
import supabase from "../services/supabase";

function PokeCadastro({ onSuccess, showToast }) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [hp, setHp] = useState(0);
  const [def, setDef] = useState(0);
  const [atk, setAtk] = useState(0);
  const [desc, setDesc] = useState("");
  const [foto, setFoto] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function Cadastro() {
    if (enviando) return;

    if (!nome) { showToast("Insira o nome", "error"); return; }
    if (!tipo) { showToast("Insira o tipo", "error"); return; }
    if (!local) { showToast("Insira o local", "error"); return; }
    if (!foto) { showToast("Insira uma imagem", "error"); return; }
    if (!desc) { showToast("Insira a observacao", "error"); return; }
    if (atk < 0) { showToast("Insira um ATAQUE valido", "error"); return; }
    if (def < 0) { showToast("Insira uma DEFESA valida", "error"); return; }
    if (hp < 0) { showToast("Insira uma VIDA valida", "error"); return; }

    setEnviando(true);
    const fotoName = `${Date.now()}_${foto.name}`;
    const bucketName = "Imagens";

    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .upload(fotoName, foto, {
        cacheControl: "3600",
        upsert: false,
      });

    if (storageError) {
      showToast(`Erro ao enviar imagem`, "error");
      setEnviando(false);
      return;
    }

    const { data: info, erro } = await supabase
      .from("pokemon")
      .insert([
        {
          nome: nome,
          tipo: tipo,
          local: local,
          observações: desc,
          imagem: fotoName,
          vida: hp,
          defesa: def,
          ataque: atk,
        },
      ])
      .select()
      .maybeSingle();

    if (erro) {
      showToast(`Erro ao cadastrar`, "error");
      setEnviando(false);
      return;
    }

    if (info) {
      onSuccess();
    }

    setNome("");
    setFoto(null);
    setDesc("");
    setTipo("");
    setLocal("");
    setAtk(0);
    setDef(0);
    setHp(0);
    setEnviando(false);
  }

  return (
    <>
      <div className="screen">
        <div className="screen-header">
          <div className="screen-dots">
            <div className="screen-dot"></div>
            <div className="screen-dot"></div>
            <div className="screen-dot"></div>
          </div>
          <span className="screen-title">Novo Pokemon</span>
        </div>

        <form action={Cadastro}>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input
              className="form-input"
              onChange={(e) => setNome(e.target.value)}
              value={nome}
              placeholder="Ex: Pikachu..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipagem</label>
            <input
              className="form-input"
              onChange={(e) => setTipo(e.target.value)}
              value={tipo}
              placeholder="Ex: Fogo, Agua..."
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
              onChange={(e) => setLocal(e.target.value)}
              value={local}
              placeholder="Rua/Bairro"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Imagem</label>
            <label className="form-file-label" htmlFor="upload-pokemon">
              <i className="fa-solid fa-cloud-arrow-up"></i>
              {foto ? foto.name : "Selecionar imagem..."}
            </label>
            <input
              className="form-file-input"
              type="file"
              id="upload-pokemon"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Observacoes</label>
            <textarea
              className="form-input form-textarea"
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              placeholder="Detalhes sobre o pokemon..."
            />
          </div>

          <button type="submit" className="btn-cadastrar" disabled={enviando}>
            {enviando ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Enviando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-pokeball"></i>
                Cadastrar
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default PokeCadastro;
