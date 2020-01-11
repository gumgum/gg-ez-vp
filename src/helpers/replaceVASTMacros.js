// For macro values, see:
// https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/master/AdCOM%20v1.0%20FINAL.md#list_apiframeworks
const MACROS_DICT = {
    '[APIFRAMEWORKS]': 2, //VPAID 2.0
    '[SERVERSIDE]': 0 // false, requesting from client
    //'[OMIDPARTNER]': 0 // TODO
};

export default function replaceVASTMacros(src) {
    let tmpSrc = src;
    Object.keys(MACROS_DICT).forEach(macro => {
        const valueContainer = MACROS_DICT[macro];
        const value = typeof valueContainer === 'function' ? valueContainer() : valueContainer;
        tmpSrc = tmpSrc.replace(macro, value);
    });
    return tmpSrc;
}
