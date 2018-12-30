
const range = (lower: number, upper: number) => {
    const diff = upper - lower + 1;
    return Array.from(new Array(diff), (_, i) => i + lower);
}

export {range};