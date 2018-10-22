const s = 36;
const l = 7;

export default function genRandomId() {
    return (
        'table-' +
        Math.random()
            .toString(s)
            .substring(2, l)
    );
}
