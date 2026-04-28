// ===================== server.js =====================
// Backend com Node.js + Express - XSS Persistente (salva em arquivo)
// Para todos os usuários, o conteúdo hackeado permanece mesmo após reset

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Arquivo onde o conteúdo XSS será salvo permanentemente
const XSS_FILE = path.join(__dirname, 'xss_content.json');

// Middleware para parser de formulários e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Função para ler o conteúdo XSS salvo
function getXSSContent() {
    try {
        if (fs.existsSync(XSS_FILE)) {
            const data = fs.readFileSync(XSS_FILE, 'utf8');
            const parsed = JSON.parse(data);
            return parsed.content || '';
        }
    } catch (e) {
        console.error('Erro ao ler arquivo:', e);
    }
    return ''; // Retorna vazio se não existir
}

// Função para salvar o conteúdo XSS (persistente no servidor)
function saveXSSContent(content) {
    fs.writeFileSync(XSS_FILE, JSON.stringify({ content: content }), 'utf8');
}

// Rota principal - serve o HTML com o XSS injetado permanentemente
app.get('/', (req, res) => {
    const xssContent = getXSSContent();
    
    // HTML VULNERÁVEL que exibe o conteúdo salvo no servidor
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XSS PERSISTENTE | Hackeado Permanentemente</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Courier New', monospace;
            background: #0a0a0a;
            min-height: 100vh;
        }
        .site-normal {
            background: linear-gradient(135deg, #0a0f1e, #0a1a2a);
            color: white;
            padding: 30px;
            min-height: 100vh;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(0,0,0,0.75);
            border-radius: 20px;
            padding: 25px;
            border: 1px solid #ff4444;
        }
        h1 { color: #ff4444; text-align: center; margin-bottom: 10px; }
        .warning {
            background: #ff000022;
            border-left: 4px solid red;
            padding: 12px;
            margin: 20px 0;
            font-size: 14px;
        }
        .search-box {
            display: flex;
            gap: 10px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        #xssInput {
            flex: 1;
            padding: 12px;
            background: #111;
            border: 2px solid #ff4444;
            color: #0f0;
            font-family: monospace;
            border-radius: 8px;
            font-size: 14px;
        }
        button {
            padding: 12px 20px;
            background: #ff4444;
            border: none;
            color: white;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
        }
        button:hover { background: #ff6666; }
        .result-area {
            background: #0a0a0a;
            border: 2px solid #ff4444;
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            min-height: 150px;
        }
        .result-title {
            color: #ff8888;
            margin-bottom: 10px;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
        }
        #injectedContent {
            color: #0f0;
            word-wrap: break-word;
        }
        .admin-buttons {
            margin-top: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn-danger { background: #aa3333; }
        .btn-warning { background: #ffaa33; color: black; }
        .badge {
            display: inline-block;
            background: red;
            padding: 2px 10px;
            border-radius: 20px;
            font-size: 12px;
            margin-left: 10px;
        }
        .info {
            background: #1a1a2e;
            padding: 10px;
            border-radius: 8px;
            margin-top: 15px;
            font-size: 12px;
            color: #aaa;
        }
        footer {
            text-align: center;
            margin-top: 20px;
            font-size: 11px;
            color: #555;
        }
        code {
            background: #222;
            padding: 2px 6px;
            border-radius: 5px;
            color: #ff8888;
        }
    </style>
</head>
<body>
<div class="site-normal">
    <div class="container">
        <h1>
            🔓 XSS PERSISTENTE (BACKEND) 🔓
            <span class="badge">SALVA NO SERVIDOR</span>
        </h1>
        
        <div class="warning">
            ⚠️ ESTE SITE É VULNERÁVEL A XSS PERSISTENTE ⚠️<br>
            O conteúdo injetado é SALVO NO BACKEND e aparece para TODOS os usuários.<br>
            Mesmo resetando a página ou fechando o navegador, o hack CONTINUA.
        </div>

        <!-- CONTEÚDO INJETADO PERMANENTEMENTE (vindo do backend) -->
        <div class="result-area">
            <div class="result-title">
                💀 CONTEÚDO HACKEADO (persistente para todos os usuários) 💀
            </div>
            <div id="injectedContent">
                ${xssContent || '<i style="color:#666;">Nenhum código injetado ainda. Use o formulário abaixo para hackear permanentemente.</i>'}
            </div>
        </div>

        <!-- Formulário para INJETAR XSS PERSISTENTE -->
        <div class="search-box">
            <input type="text" id="xssInput" placeholder='Código XSS: <script>alert("Hackeado")</script> ou <h1 style="color:lime;">🔓 HACKEADO PERMANENTEMENTE 🔓</h1>' value='<div style="background:black;color:lime;font-size:32px;padding:20px;text-align:center;border:3px solid lime;">🔓 SITE HACKEADO PELO XSS PERSISTENTE 🔓<br><small>Esse texto vai aparecer para TODOS os usuários!</small></div>'>
            <button id="injectBtn">💀 INJETAR XSS (SALVAR NO SERVIDOR) 💀</button>
        </div>

        <div class="admin-buttons">
            <button id="resetBtn" class="btn-danger">🧹 LIMPAR CONTEÚDO (Remover Hack)</button>
            <button id="hackTotalBtn" class="btn-warning">🔥 HACKEAR PÁGINA COMPLETA 🔥</button>
        </div>

        <div class="info">
            📌 <strong>Como funciona:</strong> O código digitado é enviado ao servidor, salvo em um arquivo JSON, e então aparece para TODOS os usuários que acessarem o site.<br>
            💀 <strong>Exemplo de XSS para testar:</strong> <code>&lt;script&gt;alert('Hackeado todos os usuários!')&lt;/script&gt;</code><br>
            🔥 <strong>Para hackear a página inteira:</strong> Use o botão acima ou digite: <code>&lt;script&gt;document.body.innerHTML='&lt;div style="background:black;color:lime;font-size:48px;display:flex;height:100vh;align-items:center;justify-content:center;"&gt;🔓 HACKEADO PERMANENTEMENTE 🔓&lt;/div&gt;'&lt;/script&gt;</code>
        </div>

        <footer>
            🧪 XSS Persistente com backend - O conteúdo fica salvo para TODOS os usuários mesmo após reset
        </footer>
    </div>
</div>

<script>
    // Função para enviar o XSS ao backend (salva permanentemente)
    async function injectXSS(content) {
        try {
            const response = await fetch('/inject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: content })
            });
            const result = await response.json();
            if (result.success) {
                alert('✅ CÓDIGO XSS INJETADO COM SUCESSO!\nO conteúdo foi salvo no servidor e aparecerá para TODOS os usuários.');
                location.reload(); // Recarrega para mostrar o conteúdo injetado
            } else {
                alert('Erro ao injetar: ' + result.error);
            }
        } catch (err) {
            alert('Erro de conexão: ' + err);
        }
    }

    // Botão de injetar XSS
    document.getElementById('injectBtn').onclick = () => {
        const code = document.getElementById('xssInput').value;
        if (code.trim()) {
            injectXSS(code);
        } else {
            alert('Digite um código XSS primeiro!');
        }
    };

    // Botão de reset (limpar o hack)
    document.getElementById('resetBtn').onclick = async () => {
        if (confirm('⚠️ Isso vai REMOVER o conteúdo hackeado do servidor. Todos os usuários voltarão ao normal. Confirmar?')) {
            await fetch('/reset', { method: 'POST' });
            alert('Conteúdo removido! A página será recarregada.');
            location.reload();
        }
    };

    // Botão de hackear página completa (XSS que substitui todo o HTML)
    document.getElementById('hackTotalBtn').onclick = () => {
        const totalHack = `<script>document.body.innerHTML='<div style="background:black;color:lime;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;width:100vw;font-size:48px;font-weight:bold;position:fixed;top:0;left:0;z-index:99999;">🔓 HACKEADO PERMANENTEMENTE 🔓</div>';document.body.style.margin=0;document.body.style.padding=0;<\/script>`;
        injectXSS(totalHack);
    };
</script>
</body>
</html>`;
    
    res.send(html);
});

// Rota para INJETAR XSS (salva no servidor)
app.post('/inject', (req, res) => {
    const content = req.body.content;
    if (content !== undefined) {
        saveXSSContent(content);
        console.log('[XSS] Novo conteúdo injetado e salvo:', content.substring(0, 100));
        res.json({ success: true });
    } else {
        res.json({ success: false, error: 'Conteúdo vazio' });
    }
});

// Rota para resetar (limpar o hack)
app.post('/reset', (req, res) => {
    saveXSSContent('');
    console.log('[XSS] Conteúdo resetado (hack removido)');
    res.json({ success: true });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════════════════╗
    ║     🔓 XSS PERSISTENTE - BACKEND RODANDO 🔓          ║
    ╠══════════════════════════════════════════════════════╣
    ║  Servidor: http://localhost:${PORT}                    ║
    ║  Qualquer código XSS injetado fica SALVO no servidor ║
    ║  Todos os usuários verão o conteúdo hackeado!        ║
    ║                                                      ║
    ║  Para testar:                                        ║
    ║  - Abra o site em abas diferentes / navegadores      ║
    ║  - Injete um XSS em uma aba                         ║
    ║  - Recarregue as outras abas -> estarão hackeadas    ║
    ╚══════════════════════════════════════════════════════╝
    `);
});
