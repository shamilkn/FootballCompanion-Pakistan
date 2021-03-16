const {v4: uuidv4} = require('uuid');

const TYPES = Object.freeze({
    backdrop: 'backdrop',
    invoice: 'invoice'
});

const unique = () => uuidv4();

const invoice = () => {
    return 'PF' + Date.now();
}

module.exports = getName = (type, info) => {
    switch (type) {
        case TYPES.backdrop: {
            break;
        }
        case TYPES.superimpose: {
            break;
        }
        case TYPES.invoice: {
            return invoice()
        }
        default: {
            return unique()
        }
    }
}