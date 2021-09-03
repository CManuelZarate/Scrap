

const puppeteer = require('puppeteer');
/**(async y await) al usar estos ultimos vamos a evitar muchas anidaciones */


/**Usamos la tecnica de funcion autoejecutada*/
(async()=>{
    /*metodo obtener el navegador con el que trabajar */
    /**en launch {headless: false}  para ver como ocurre */
    const browser = await puppeteer.launch({headless: true});


    const page = await browser.newPage() ;

    /**ejm si tienes una pagina en concreto llamo al metodo goto() y le paso la pagina */
    await page.goto('http://www.amazon.com');

    /**capturamos la pantalla y lo llevo auna img de mi server ;ponemos la ruta dondse se guardara el SS  */
    await page.screenshot({ path: 'amazon1.jpg' });


    await page.type('#twotabsearchtextbox','libros de JS');//escogemos el selector y eltxto
    await page.screenshot({ path: 'amazon2.jpg' });//ver si escribio


    await page.click('.nav-search-submit input');


    /**como la espera es sobre un atributo lo pongo entre corchetes */
    await page.waitForSelector('[data-component-type=s-search-result]')

    await page.waitFor(2000);//espero 3s
    await page.screenshot({ path: 'amazon3.jpg' });

    /**
     * recupero los elementos de selector data-...;;lo q recuperare es el enlace para navegar a ca uno de ellos q es <a> en un h2
     */

    const enlaces = await page.evaluate(() => {
        const elements =document.querySelectorAll('[data-component-type=s-search-result] h2 a');//esto me devuelve todos los elementos

        const links=[];//creo arr vacio para link

        for(let element of elements){
            links.push(element.href);
        }
        return links; 

    });

    console.log(enlaces.length);

    const books=[];
    /**recorremos enlaces y nos movemos a las paginas */
    for(let enlace of enlaces ){
        await page.goto(enlace);
        await page.waitForSelector('#productTitle');//espero el selector
       const book = await page.evaluate(() => {
            const tmp={};
            tmp.title=document.querySelector('#productTitle').innerText;
            /**el autor esta en un span y dentor una a */
            tmp.author = document.querySelector('.author a').innerText;
            return tmp;

        });
        books.push(book);
    }

    console.log(books);

    await browser.close();//cierro el browser

     

})();
