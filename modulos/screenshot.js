const screenshots = require('screenshot-desktop')
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const FormData = require('form-data')
const os = require('os')

async function screenshot(nome_arquivo = 'screenshot.png', url_webhook = null) {
  const pastatemp = os.tmpdir()
  const caminho = path.join(pastatemp, nome_arquivo)
  const imagem = await screenshots()
  fs.writeFileSync(caminho, imagem)
  if (!url_webhook) return caminho

  const form = new FormData()
  form.append('file', fs.createReadStream(caminho), nome_arquivo)
  await axios.post(url_webhook, form, { headers: form.getHeaders() })
  return caminho
}

module.exports = { screenshot }