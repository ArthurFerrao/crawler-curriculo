const puppeteer = require('puppeteer');

const urlControle = "https://pre.ufcg.edu.br:8443/ControleAcademicoOnline/";
const urlCurriculo = "https://pre.ufcg.edu.br:8443/ControleAcademicoOnline/Controlador?command=AlunoCurriculo";

getCurriculo = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(urlControle);

    const matricula = '';
    const senha = '';
    await page.type('#login', matricula);
    await page.type('#senha', senha);

    const form = await page.$('.form-horizontal');
    await form.evaluate(form => form.submit());
    await page.waitForNavigation({waitUntil: 'load'});
    console.log('FOUND!', page.url());

    await page.goto(urlCurriculo);
    console.log('FOUND!', page.url());

    const curriculo = await page.evaluate(() => {
      const table = document.querySelectorAll('tr.success');
      
      const getInfoRow = (row) => {
        const elements = row.querySelectorAll('td');
        const span = elements[2].querySelector('span');
        span.parentNode.removeChild(span);
        return {cod: elements[1].innerText,
               name: elements[2].innerText};
      }

      const data = [];

      table.forEach(element => {
        data.push(getInfoRow(element));
      });

      return data;
    })
    
    await browser.close();

    return curriculo;
  }catch (err){
    console.log(err);
  }
}

console.log(getCurriculo());