class LoadComments extends HTMLElement {
  constructor() {
    super()

    this.addEventListener('click', this.handleLoadCommentsClick)
  }

  handleLoadCommentsClick(_e) {
    const commento = document.createElement('div');
    commento.id = 'commento';
    this.parentNode.appendChild(commento);

    const commentoScript = document.createElement('script');
    commentoScript.src = 'https://cdn.commento.io/js/commento.js';
    this.parentNode.appendChild(commentoScript);

    return this.remove();
  }
}

customElements.define('load-comments', LoadComments)