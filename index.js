import gallery from './gallery-items.js';

const refs = {
    galleryContainer: document.querySelector('.js-gallery'),
    modal: document.querySelector('.js-lightbox'),
    modalCloseBtn: document.querySelector('[data-action="close-lightbox"]'),
    modalImage: document.querySelector('.lightbox__image'),
    modalOverlay: document.querySelector('.lightbox__overlay'),
};

refs.galleryContainer.addEventListener('click', onImageClick);
refs.modalCloseBtn.addEventListener('click', closeModal);
refs.modalOverlay.addEventListener('click', onModalOverlayClick);

refs.galleryContainer.innerHTML = gallery.map((item, index) =>
    renderImageBlock(item, index)
).join('\n');

function renderImageBlock({preview, original, description}, index)
{
    return `<li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
      data-index="${index}"
    />
  </a>
</li>`;
}

function onImageClick(e)
{
    e.preventDefault();
    if (!e.target.classList.contains('gallery__image')) {
        return;
    }

    showImg(e.target);
    openModal();
}

function openModal()
{
    refs.modal.classList.add('is-open');
    window.addEventListener('keydown', onWindowKeydown);
}

function closeModal()
{
    refs.modal.classList.remove('is-open');
    clearModalImg();
    window.removeEventListener('keydown', onWindowKeydown);
}

function onModalOverlayClick(e)
{
    if (e.target === e.currentTarget) {
        closeModal();
    }
}

function onWindowKeydown(e)
{
    const KEYCODE_ESC = 'Escape',
        KEYCODE_ARROW_LEFT = 'ArrowLeft',
        KEYCODE_ARROW_RIGHT = 'ArrowRight'
    ;

    if (KEYCODE_ESC === e.code) {
        closeModal();
    }

    if (KEYCODE_ARROW_LEFT === e.code) {
        prevImg();
    }

    if (KEYCODE_ARROW_RIGHT === e.code) {
        nextImg();
    }
}

function prevImg()
{
    showImg(document.querySelector(`.gallery__image[data-index="${getPrevImgIndex()}"]`));
}

function nextImg()
{
    showImg(document.querySelector(`.gallery__image[data-index="${getNextImgIndex()}"]`));
}

function getPrevImgIndex()
{
    const currentIndex = Number(refs.modalImage.dataset.index);
    if (currentIndex === 0) {
        return gallery.length - 1;
    }
    return currentIndex - 1;
}

function getNextImgIndex()
{
    const currentIndex = Number(refs.modalImage.dataset.index);
    if (currentIndex + 1 === gallery.length) {
        return 0;
    }
    return currentIndex + 1;
}

function showImg(image)
{
    refs.modalImage.src = image.dataset.source;
    refs.modalImage.dataset.index = image.dataset.index;
    refs.modalImage.alt = image.alt;
}

function clearModalImg()
{
    refs.modalImage.src = refs.modalImage.dataset.index = refs.modalImage.alt = '';
}
