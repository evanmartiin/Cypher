class Ui {
    constructor() {
        
    }

    show(node) {
        console.log('show')
    }

    hide(node) {
        console.log('hide')
        node.ariaHidden = true
    }
}

export { Ui }