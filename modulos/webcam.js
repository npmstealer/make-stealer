const path = require('path')
const fs = require('fs')
const axios = require('axios')
const NodeWebcam = require('node-webcam')
const FormData = require('form-data')

const options = {
  width: 640,
  height: 480,
  quality: 80,
  delay: 0,
  saveShots: true,
  output: 'jpeg',
  device: false,
  callbackReturn: 'location',
  verbose: false
}

async function webcam(nome_arquivo = 'foto_webcam.jpg', webhook = null) {
  const caminho = path.join(__dirname, nome_arquivo)
  return new Promise((resolve, rejeita) => {
    NodeWebcam.capture(caminho, options, async erro => {
      if (erro) return rejeita('[x] erro: ' + erro)
      if (webhook) {
        try {
          const imagem = fs.createReadStream(caminho)
          const form = new FormData()
          form.append('file', imagem, nome_arquivo)
          await axios.post(webhook, form, { headers: form.getHeaders() })
        } catch (erro) {
          return rejeita('[x] erro: ' + erro)
        }
      }
    })
  })
}

module.exports = { webcam }
