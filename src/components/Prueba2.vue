<template>
  <v-container grid-list-md text-center>
    <v-layout wrap>
      <v-flex xs12>
        <form enctype="multipart/form-data">
          <div class="field">
            <label for="file" class="label">Upload File</label>
            <input 
              style="display:none" 
              type="file"
              accept="application/pdf"
              multiple=""
              @change="onFileSelected($event.target.files)"
              ref="fileInput"/>
            <v-btn @click="$refs.fileInput.click()">Buscar PDF</v-btn>
            <v-btn @click="onUpload ">Cargar</v-btn>
          </div>
        </form> 
      </v-flex>
      <v-flex xs12>
        <div class="file">
          <label for="download" class="label">Download File
            <v-text-field 
              v-model="filename"
              >
            </v-text-field>          
            <v-btn @click="onDownload(filename)">Download</v-btn>
            <v-btn @click="onSaveAs(filename)">Save As</v-btn>
            <v-btn @click="onClear">Clear</v-btn>        
          </label>
        </div>
      </v-flex>
      <v-flex xs12>
        <div>       
          <h1>PDF: Viewer</h1>
          <canvas id="the-canvas" style="border:1px  solid black"></canvas>
        </div>
      </v-flex>
      <v-flex xs12>
        <div class="file">
          <label for="delete" class="label">Delete File
            <v-layout>
              <v-text-field 
                v-model="filedelete"
                >
              </v-text-field>          
            </v-layout>
            <v-btn @click="onDelete ">Delete</v-btn>        
          </label>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.487/pdf.min.js"></script>
<script>
  import axios from 'axios'
  import pdfjsLib from 'pdfjs-dist'
  import { saveAs } from 'file-saver';
  //const PDFJS: PDFJSStatic = require('pdfjs-dist');
  export default {
    /*
      Defines the data used by the component
    */
    data(){
      return {
        fd: new FormData,
        filename: '',
        filedelete: ''
      }
    },

    methods: {
      onFileSelected(fileList){
        for (let i = 0; i <fileList.length; i++){
          let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
          let guid = [u.substr(0,8), u.substr(8,4), u.substr(13,3), u.substr(16,12)].join('');
          this.fd.append("file", fileList[i], guid)
        }
      },
      async onUpload(){
        let configuracion= {headers : {"Authorization" : "Bearer " + this.$store.state.token, 'Content-Type': 'multipart/form-data'} };
        await axios.post('api/Express/UploadFiles',this.fd,configuracion)
        .then(res => {
          console.log(res.data);
          this.fd = new FormData;
        }).catch(error => {
          console.log(error);
        });
      },
      onDownload(file){
        let me=this;
        let header={"Authorization" : "Bearer " + this.$store.state.token};
        let configuracion= {headers : header};        
        axios.get('api/Express/DownloadFile/'+file,configuracion)
        .then(res => {
          //console.log(res.data)
          var pdfData = atob(res.data)
          var loadingTask = pdfjsLib.getDocument({data: pdfData});

          loadingTask.promise.then(function(pdf) {
              console.log('PDF loaded');
              
              // Fetch the first page
              var pageNumber = 1;
              pdf.getPage(pageNumber).then(function(page) {
                console.log('Page loaded');
                
                var scale = 1;
                var viewport = page.getViewport({scale: scale});

                // Prepare canvas using PDF page dimensions
                var canvas = document.getElementById('the-canvas');
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.promise.then(function () {
                  console.log('Page rendered');
                });
              });
            }, function (reason) {
              // PDF loading error
              console.error(reason);
            });
        }).catch(error => {
          console.log(error);
        });
      },
      onSaveAs(file){
        let me=this;
        let header={"Authorization" : "Bearer " + this.$store.state.token};
        let configuracion= {headers : header};        
        axios.get('api/Express/DownloadFile/'+file,configuracion)
        .then(res => {
          //console.log(res.data)
          var FileSaver = require('file-saver');
          var pdfData = atob(res.data)
          var byteNumbers = new Array(pdfData.length);
          for (var i = 0 ; i < pdfData.length; i++){
            byteNumbers[i] = pdfData.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          var blob = new Blob([byteArray],{type: "application/pdf" });
          FileSaver.saveAs(blob, 'Export.pdf');
        });          
      },
      onClear(){
        var canvas = document.getElementById('the-canvas');
        var context = canvas.getContext("2d");
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0,0, canvas.width, canvas.height);
      },      
      onDelete(){
        let me=this;
        let header={"Authorization" : "Bearer " + this.$store.state.token};
        let configuracion= {headers : header};        
        
        axios.delete('api/Express/DeleteFile/'+me.filedelete,configuracion)
        .then(res => {
          console.log(res.data);
        }).catch(error => {
          console.log(error);
        });
      },
     }
  }
</script>

