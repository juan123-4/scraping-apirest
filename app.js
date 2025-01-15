const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();

const url = "https://elpais.com/ultimas-noticias/";

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const pageTitle = $("title").text();
            console.log(pageTitle);

            const enlaces = [];
            const datos = [];

            $("article a").each((index, element) => { 
                const link = $(element).attr("href");
                if (link && !link.startsWith('http')) {
                    enlaces.push(`https://elpais.com${link}`);
                } else {
                    enlaces.push(link);
                }
            });

            for (const enlace of enlaces) {
                try {
                    const enlaceResponse = await axios.get(enlace);
                    if (enlaceResponse.status === 200) {
                        const pageHtml = enlaceResponse.data;
                        const $$ = cheerio.load(pageHtml);
                        const titulo = $$("h1").text();
                        const imagenes = [];
                        const textos = [];

                        $$("img").each((index, element) => {
                            const img = $$(element).attr("src");
                            imagenes.push(img);
                        });

                        $$("p").each((index, element) => {
                            const texto = $$(element).text();
                            textos.push(texto);
                        });

                        datos.push({
                            titulo,
                            imagenes,
                            textos

                        });
                    }
                } catch (error) {
                    console.error(`Error accediendo a ${enlace}:`, error);
                }
            }

            res.send(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${pageTitle}</title>
                </head>
                <body>
                    <h1>${pageTitle}</h1>
                    ${datos.map(dato => `
                        <h2>${dato.titulo}</h2>
                        <h3>Imágenes</h3>
                        <ul>
                            ${dato.imagenes.map(img => `<li><img src="${img}" alt="${dato.titulo}"></li>`).join('')}
                        </ul>
                        <h3>Textos</h3>
                        <ul>
                            ${dato.textos.map(texto => `<li>${texto}</li>`).join('')}
                        </ul>`).join('')}
                        <ul>
                            ${enlaces.map(enlace=> `<li>${enlace}</li>`).join('')}
                        </ul>
                </body>
                </html>
            `);
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(404).send("Error al obtener los datos.");
    }
});

app.listen(3000, () => {
    console.log("El servidor está escuchando en http://localhost:3000");
});
