function getScrollPosition() {
    if (document.documentElement.scrollTop === 0) {
        return document.body.scrollTop;
    } else {
        return document.documentElement.scrollTop;
    }
}