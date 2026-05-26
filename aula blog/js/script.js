//js/script.js

async function carregarPagina(pagina)

   try{

    const resposta = await fetch(pagina);
   
    if(!resposta.ok){
        throw new Error("pagina não encontrada")
    }
   
     const html = await resposta.text();

     document.getElementById("conteudo").innerHTML = html;
    
}catch(erro){

    document.getElementById("conteudo").innerHTML =
       <h2>erro</h2>
       <p>Não foi possível carregar a pagina. </p>
    ; 

    console.error(erro);
  }
}

/* página inicial */

window.onload = () => {
    carregarPagina('pages/home.html');
}