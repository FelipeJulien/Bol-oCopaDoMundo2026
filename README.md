# ⚽ Bolão Copa do Mundo 2026

> Sistema completo de bolão para a Copa do Mundo FIFA 2026 — faça suas apostas, acompanhe os resultados e dispute com seus amigos!

---

## 📋 Sobre o Projeto

O **Bolão Copa do Mundo 2026** é uma aplicação web para gerenciar bolões de forma simples e divertida. Os participantes podem registrar seus palpites para os jogos da Copa do Mundo, e o sistema calcula automaticamente a pontuação com base nos resultados reais.

Tudo funciona direto no navegador, sem necessidade de backend próprio — os dados são armazenados no **Firebase Firestore**.

---

## 🚀 Deploy na Vercel

O deploy é super simples, já que o projeto é composto apenas por arquivos estáticos:

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub
2. Clique em **"Add New Project"**
3. Importe o repositório do projeto ou faça upload da pasta
4. A Vercel detectará automaticamente que se trata de um site estático
5. Clique em **"Deploy"** e pronto! 🎉

> [!TIP]
> O arquivo `vercel.json` já está configurado para redirecionar todas as rotas para o `index.html`, garantindo que a navegação funcione corretamente.

---

## 🔥 Configuração do Firebase

Para que o bolão funcione, é necessário criar um projeto no Firebase e conectar o Firestore. Siga os passos abaixo:

### 1. Criar o Projeto

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **"Adicionar projeto"** (ou "Add project")
3. Dê um nome ao projeto (ex: `bolao-copa-2026`)
4. Siga as etapas e finalize a criação

### 2. Ativar o Cloud Firestore

1. No painel lateral, vá em **"Firestore Database"** (ou "Cloud Firestore")
2. Clique em **"Criar banco de dados"**
3. Selecione **"Iniciar no modo de teste"** para permitir leituras e escritas
4. Escolha a região mais próxima (ex: `southamerica-east1` para o Brasil)
5. Clique em **"Ativar"**

### 3. Registrar o App Web

1. Vá em **⚙️ Configurações do Projeto > Geral**
2. Na seção **"Seus apps"**, clique em **"Adicionar app"** e selecione **Web** (`</>`)
3. Dê um apelido ao app (ex: `bolao-web`)
4. Copie as credenciais de configuração do Firebase que serão exibidas

### 4. Configurar no Site

1. Abra o site do bolão no navegador
2. Vá até a aba **"Configurar"** (ou **"⚙️"**)
3. Cole as credenciais do Firebase nos campos correspondentes
4. Clique em **"Salvar"** ✅

> [!IMPORTANT]
> Sem essa configuração, o site não conseguirá salvar ou carregar os dados dos palpites.

---

## 🔒 Regras de Segurança do Firestore (Recomendadas)

Para ambiente de desenvolvimento ou bolões entre amigos, você pode usar as regras abaixo, que permitem leitura e escrita livre:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Para aplicar essas regras:

1. No console do Firebase, vá em **"Firestore Database" > "Regras"**
2. Substitua o conteúdo pelas regras acima
3. Clique em **"Publicar"**

> [!WARNING]
> Essas regras permitem que **qualquer pessoa** leia e escreva no banco de dados. Para um ambiente de produção com muitos usuários, considere implementar regras mais restritivas com autenticação.

---

## 🏆 Sistema de Pontuação

| Tipo de Acerto | Pontos |
|---|---|
| ✅ Placar exato (ex: 2x1 e o jogo terminou 2x1) | **3 pontos** |
| 🎯 Resultado correto (acertou quem venceu ou se empatou) | **1 ponto** |
| ⭐ Apostas especiais (campeão, artilheiro, etc.) | **2 pontos cada** |

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura e semântica das páginas |
| **CSS3** | Estilização e layout responsivo |
| **JavaScript ES6+** | Lógica da aplicação e interatividade |
| **Firebase Firestore** | Banco de dados em tempo real na nuvem |

---

## 📁 Estrutura do Projeto

```
Bol-oCopaDoMundo2026/
├── index.html          # Página principal da aplicação
├── vercel.json         # Configuração de rotas para a Vercel
└── README.md           # Documentação do projeto
```

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** — veja abaixo:

```
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Feito com ❤️ para a Copa do Mundo 2026 🏆
</p>
