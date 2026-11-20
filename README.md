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

1. **Hero** — "Home renovations done right", selo Licensed & Insured e formulário rápido (nome, telefone, serviço, ZIP)
2. **Faixa de confiança** — Licensed & Insured, orçamento grátis em casa, Philadelphia & NJ, preço fixo
3. **Serviços principais** (cartões com foto, mesmo peso): Bathroom Remodeling, Custom Stair Capping,
   Flooring Installation, Stucco & Exterior + **Also available**: drywall, pintura, framing/trim,
   masonry, subfloor, pressure washing
4. **Why Us** — Quality • Precision • Trust, 6 qualidades da empresa e processo em 3 passos
5. **Antes & Depois** — slider arrastável (banheiro, escada, quarto, sala, corredor)
6. **Galeria** em slides com todos os tipos de trabalho
7. **Formulário completo de leads** — serviço desejado, tipo de piso (só aparece se escolher Flooring),
   tamanho do projeto, quando quer começar + nome, telefone, e-mail, ZIP, observações
8. Rodapé (logo, contato, Instagram, área atendida) + barra fixa no celular (Ligar / Texto / Orçamento)

## Para onde vão os leads

Os formulários enviam um `POST` para o Google Apps Script configurado em `js/main.js`
(`LEAD_ENDPOINT` — a mesma URL que já era usada no formulário anterior). Campos enviados:

`name, phone, email, zip, service, flooring, size, timeline, notes, source, page, submitted_at, utm_source, utm_medium, utm_campaign, utm_content, fbclid, gclid`

Se precisar recriar o script, cole o código abaixo em **Extensões → Apps Script** de uma planilha
e publique como **App da Web** (Executar como: você / Acesso: qualquer pessoa):

```js
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads')
           || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Leads');
  var cols = ['submitted_at','name','phone','email','zip','service','flooring','size','timeline','notes',
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
