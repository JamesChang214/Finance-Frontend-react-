import React from 'react'
import { deepmergeAll, UIEvent, PhotoEditorSDKUI, LibraryProvider, LibraryCategory, LibraryImage } from 'photoeditorsdk'

class ImageProvider extends LibraryProvider {
  /**
   * This is a method explicitly created for this provider. It makes sure our data
   * JSON has been loaded from the server.
   * @return {Promise}
   * @private
   */
  loadData() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return this.loadJSON(
      'https://img.ly/static/libraries/unsplash/metadata.json',
    ).then(data => {
      this.data = data;
      return data;
    });
  }

  /**
   * Returns the categories
   * @return {Promise}
   * @resolve {LibraryCategory[]}
   * @abstract
   */
  getCategories() {
    return this.loadData().then(data => {
      // Create `Category` instances from our data
      return data.categories.map(categoryData => {
        return new LibraryCategory({
          name: categoryData.name,
          coverImageUrl: categoryData.coverImage,
        });
      });
    });
  }

  /**
   * Returns the images for the given search query
   * @param {String} query
   * @return {Promise}
   * @resolve {LibraryImage[]}
   * @abstract
   */
  searchImages(query) {
    return this.loadData().then(data => {
      return data.images
        .filter(image => {
          // Split query by spaces, make sure all words are present in image title
          // and escape special characters.
          const words = query
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .split(/\s+/);
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const regexp = new RegExp(word, 'i');
            if (!regexp.test(image.title)) {
              return false;
            }
          }

          return true;
        })
        .map(imageData => {
          return new LibraryImage(imageData);
        });
    });
  }
}

export class PhotoEditorSDK extends React.Component {
  config = {
    container: '#editor',
    image: '../../../../example.jpg',
    license: '',
    layout: 'basic',
    assetBaseUrl: '../../../../assets/',
    library: {
      enableWebcam: false, // Disables the webcam
      enableUpload: true, // Enables Image Uploads
      categoryHeaderType: 'text',
      provider: ImageProvider,
    },
    transform: {
      basicUIToolControlBarTabsOrder: ['flipRotate', 'resolution'],
    },
  }

  componentDidMount() {
    this.initEditor()
    window.initPesdk = this.initEditor.bind(this);
  }

  async initEditor(config = {}) {
    if (this.editor) {
      this.editor.dispose()
    }
    const editor = await PhotoEditorSDKUI.init(
      deepmergeAll([this.config, config])
    )
    this.editor = editor
    editor.on(UIEvent.EXPORT, (imageSrc) => {
      console.log('Exported ', imageSrc)
    })
    window.pesdkEditor = editor
    console.log('PhotoEditorSDK for Web is ready!')
  }

  render() {
    return (<div id="editor" style={{ width: '100%', height: '100vh' }} />)
  }
}
