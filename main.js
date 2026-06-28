document.querySelector('.nav-toggle')?.addEventListener('click', function () {
    var nav = document.querySelector('.site-nav');
    var open = nav.classList.toggle('open');
    this.setAttribute('aria-expanded', open);
});

document.addEventListener('click', function (e) {
    if (e.target.closest('.copy-to-clipboard-button')) {
        var btn = e.target.closest('.copy-to-clipboard-button');
        btn.classList.add('copied');
        setTimeout(function () { btn.classList.remove('copied'); }, 2000);
    }
});
