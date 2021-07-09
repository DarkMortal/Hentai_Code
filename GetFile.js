const fs = require('fs');
const request = require('request');
const imgToPDF = require('image-to-pdf');
const nhentai = require('nhentai-js');
const HummusRecipe = require('hummus-recipe');

var directory=__dirname+"/page_images";
var image_name="";
const PDFpages = [];
var title="";

async function GetFile(code,pass){
   if(nhentai.exists(code)){
        PDFpages.length=0;
        const dojin = await nhentai.getDoujin(code);
        var pages_array = dojin.pages;
        if(pages_array.length>30) return Promise.reject("More than 30");
        title=dojin.title;
        for (let i = 0; i < pages_array.length; i++) {
            image_name = directory+`/image` + i + `.jpg`;
            await new Promise((resolve) => request(pages_array[i]).pipe(fs.createWriteStream(image_name)).on('finish', resolve));
            PDFpages.push(image_name);
        }
        imgToPDF(PDFpages, 'A4').pipe(fs.createWriteStream('Hentai.pdf'));
        for (let i = 0; i < pages_array.length; i++) {
            image_name = directory+`/image` + i + `.jpg`;
            fs.unlinkSync(image_name);
            PDFpages.pop();
        }
        if(pass!=""){
            setTimeout(function () {
                const pdfDoc = new HummusRecipe('Hentai.pdf','Encrypted.pdf');
                pdfDoc
                .encrypt({
                    userPassword: pass,
                    ownerPassword: pass,
                    userProtectionFlag: 4
                }).endPDF();
                fs.unlinkSync('Hentai.pdf');
            },1000);
        }  return Promise.resolve(title);
   }else return Promise.reject("Not Found");
}

module.exports= GetFile;
