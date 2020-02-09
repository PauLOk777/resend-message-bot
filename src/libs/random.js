function generateKey(size) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const max = chars.length;

    let res = '';
    for (let i = 0; i < size; i++) {
        const index = Math.floor(Math.random() * max);
        res += chars[index];
    }

    return res;
}

module.exports = generateKey;
