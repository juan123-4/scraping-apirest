const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://elpais.com/ultimas-noticias/";

async function scrapeNoticias() {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);

            const noticias = [];
            $("article.c.c-d.c--m").each((index, element) => {
                const titulo = $(element).find("header.c_h").text().trim();
                const descripcion = $(element).find("p.c_d").text().trim();
                const enlace = $(element).find("a").attr("href");
                const imagen = $(element).find("img").attr("src");

                if (titulo && descripcion && enlace && imagen) {
                    noticias.push({
                        titulo,
                        imagen,
                        descripcion,
                        enlace: enlace.startsWith('http') ? enlace : `https://elpais.com${enlace}`
                    });
                }
            });

            fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
            console.log('Noticias guardadas en noticias.json');
        }
    } catch (error) {
        console.error('Error al obtener las noticias:', error);
    }
}



module.exports=(scrapeNoticias)