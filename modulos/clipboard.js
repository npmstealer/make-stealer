const fs = require('fs')
const os = require('os')
const path = require('path')
const { execSync } = require('child_process')

const arquivo_clipboard = path.join(__dirname, 'clipboard_salvo.txt')

function salvar_clipboard(texto) {
  if (!texto || typeof texto !== 'string') return
  let ja_salvos = []
  if (fs.existsSync(arquivo_clipboard)) {
    ja_salvos = fs.readFileSync(arquivo_clipboard, 'utf8')
      .split('\n')
      .map(linha => linha.trim())
      .filter(Boolean)
  }
  if (ja_salvos.includes(texto)) return
  fs.appendFileSync(arquivo_clipboard, texto + '\n')
}

function pegar_historico_clipboard() {
  try {
    const comando = 'Get-Clipboard -Format Text'
    const texto = execSync('powershell -command \'' + comando + '\'', { encoding: 'utf8' }).trim()
    if (texto) salvar_clipboard(texto)
  } catch (erro) {
  }

  try {
    const comando_hist = [
      '$itens = Get-ItemProperty -Path HKCU:\\Software\\Microsoft\\Clipboard\\History\\* 2>$null;',
      'if ($itens) { $itens | ForEach-Object { $_.Text } }'
    ].join(' ')
    const saida = execSync('powershell -command \'' + comando_hist + '\'', { encoding: 'utf8' })
    saida.split('\n')
      .map(linha => linha.trim())
      .filter(Boolean)
      .forEach(salvar_clipboard)
  } catch (erro) {
  }
}

function monitorar_clipboard() {
  let ultimo = ''
  setInterval(() => {
    try {
      const texto = execSync('powershell -command \'Get-Clipboard -Format Text\'', { encoding: 'utf8' }).trim()
      if (texto && texto !== ultimo) {
        salvar_clipboard(texto)
        ultimo = texto
      }
    } catch (erro) {
    }
  }, 1500)
}

if (os.platform() === 'win32') {
  pegar_historico_clipboard()
  monitorar_clipboard()
}

module.exports = { salvar_clipboard }
