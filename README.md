# Alves Renovation — Landing Page + Captação de Leads

Site estático (HTML/CSS/JS puro, sem build) para a Alves Renovation.

## Estrutura

```
index.html          Landing page completa
css/styles.css      Estilos (paleta do logo: preto #0E0E10 + dourado #C9965F / #E8BE8A + branco)
js/main.js          Slider antes/depois, carrossel, menu mobile e envio dos leads
assets/logo*.png    Logo oficial (recortado em círculo) em vários tamanhos + favicon
assets/logo-full.jpg Logo completo usado na pré-visualização de links (redes sociais)
assets/img/*.jpg    Fotos da pasta "Muse" do Google Drive (convertidas de HEIC e otimizadas)
```

## Seções

1. **Hero** com formulário rápido (nome, telefone, tipo de projeto, ZIP)
2. **Faixa de confiança** (experiência em big-box, orçamento grátis, preço fixo, agilidade)
3. **Serviços** + oferta **$250 flat rate** para banheiros/closets (30–60 sq ft)
4. **Antes & Depois** — slider arrastável com 5 projetos reais (quarto, banheiro, sala, escada, corredor)
5. **Galeria** em slides (carrossel com autoplay)
6. **Por que nós** + processo em 3 passos
7. **Formulário completo de leads** — mesmas perguntas do formulário do Facebook/Instagram
   (tipo de piso, tamanho do projeto, quando quer começar) + nome, telefone, e-mail, ZIP, observações
8. Rodapé + barra fixa no celular (Ligar / Texto / Orçamento)

## Para onde vão os leads

Os formulários enviam um `POST` para o Google Apps Script configurado em `js/main.js`
(`LEAD_ENDPOINT` — a mesma URL que já era usada no formulário anterior). Campos enviados:

`name, phone, email, zip, flooring, size, timeline, notes, source, page, submitted_at, utm_source, utm_medium, utm_campaign, utm_content, fbclid, gclid`

Se precisar recriar o script, cole o código abaixo em **Extensões → Apps Script** de uma planilha
e publique como **App da Web** (Executar como: você / Acesso: qualquer pessoa):

```js
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads')
           || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Leads');
  var cols = ['submitted_at','name','phone','email','zip','flooring','size','timeline','notes',
              'source','page','utm_source','utm_medium','utm_campaign','utm_content','fbclid','gclid'];
  if (sheet.getLastRow() === 0) sheet.appendRow(cols);
  sheet.appendRow(cols.map(function (c) { return e.parameter[c] || ''; }));
  // Opcional: aviso por e-mail a cada lead
  // MailApp.sendEmail('SEU_EMAIL', 'Novo lead: ' + e.parameter.name, JSON.stringify(e.parameter, null, 2));
  return ContentService.createTextOutput('ok');
}
```

Depois de publicar, troque a URL em `LEAD_ENDPOINT` se ela mudar.

## Rastreamento (opcional)

Se você adicionar o Meta Pixel (`fbq`) ou Google Analytics (`gtag`) no `<head>`, o site já dispara
automaticamente o evento `Lead` / `generate_lead` quando um formulário é enviado.

## Publicação

Por ser um site estático, dá para publicar em GitHub Pages, Netlify, Vercel ou qualquer hospedagem:
basta enviar a pasta inteira. Para testar localmente, abra `index.html` no navegador.
