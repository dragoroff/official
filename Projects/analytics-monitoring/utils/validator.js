module.exports = function validate(...args){
    try {
        return [args.map(x => x.replace(/[&\/\\#, +()$~%.'"@:*?<>{}]/g, '').trim()), null];
    } catch (e) {
        return [null, e.message];
    }
};