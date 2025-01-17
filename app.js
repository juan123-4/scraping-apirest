const express=require("express");
const fs= require("fs")
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port=3000;

let noticias =[];
function leerDatos() {
    try {
      const data = fs.readFileSync('noticias.json', 'utf-8');
      noticias = JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo noticias.json:', error.message);
    }
  }
  function guardarDatos() {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
  }

  app.get("/noticias",(req,res)=>{
    leerDatos();
    res.json(noticias)
  })
  // Obtener una noticia por índice 
  app.get('/noticias/:indice', (req, res) => { leerDatos(); const indice =
     parseInt(req.params.indice); 
     if (indice >= 0 && indice < noticias.length) { res.json(noticias[indice]); }
      else { res.status(404).send('Noticia no encontrada'); } });

app.post("/noticias",(req,res)=>{
    leerDatos();
    const nuevanoticia=req.body;
    noticias.push(nuevanoticia);
    guardarDatos();
    res.status(201).send("noticia creada")
})

app.put('/noticias/:indice', (req, res) => { leerDatos(); const indice =
    parseInt(req.params.indice); 
    if (indice >= 0 && indice < noticias.length) {noticias[indice]=req.body;guardarDatos();
        res.send("noticia actualizada")
     }
     else { res.status(404).send('Noticia no encontrada'); } });

app.delete('/noticias/:indice', (req, res) => { leerDatos(); const indice =
    parseInt(req.params.indice); 
    if (indice >= 0 && indice < noticias.length) {noticias.splice(indice,1);guardarDatos();
            res.send("noticia eliminada")}
    else { res.status(404).send('Noticia no encontrada'); } });
    
    


app.listen(port, () => {
    console.log(`El servidor está escuchando en http://localhost:${port}`);
});

