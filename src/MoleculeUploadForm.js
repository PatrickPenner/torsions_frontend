/**
 * Upload component
 */
class MoleculeUploadForm {
  /**
   * Upload component
   * @param {String} element id of the root element of the upload component
   */
  constructor (element) {
    this.element = document.getElementById(element)
    this.initHtml()
    this.uploadForm = this.element.getElementsByTagName('form')[0]
    this.fileField = document.getElementById('mol-file')
    this.uploadButton = this.element.getElementsByTagName('button')[0]

    // 10 MB
    this.maxFileSize = 10 * 1000 * 1000
    this.fileField.addEventListener('change', (event) => {
      this.fileCheck(event)
    })
  }

  /**
   * generate the HTML
   */
  initHtml () {
    this.element.innerHTML =
`<form method="post">
    <div class="form-group">
        <label for="mol-file">Molecule File</label>
        <input type="file" id="mol-file" accept=".sdf">
    </div>
    <button type="submit" class="btn btn-primary">Load</button>
</form>`
  }

  /**
   * Check file size and extension
   * @param event file chosen/changed event
   */
  fileCheck (event) {
    const file = event.target.files[0]
    if (file.size > this.maxFileSize) {
      alert('Maximum file size is 10 MB')
      this.disableUpload()
      return
    }
    const splitFileName = file.name.split('.')
    if (splitFileName[splitFileName.length - 1] !== 'sdf') {
      alert('File with unsupported extension. (Supported: ".sdf")')
      this.disableUpload()
      return
    }
    this.enableUpload()
  }

  /**
   * Disable the upload button
   */
  disableUpload () {
    this.uploadButton.classList.add('disabled')
    this.uploadButton.setAttribute('disabled', 'disabled')
  }

  /**
   * Enable the upload button
   */
  enableUpload () {
    this.uploadButton.classList.remove('disabled')
    this.uploadButton.removeAttribute('disabled')
  }
}
