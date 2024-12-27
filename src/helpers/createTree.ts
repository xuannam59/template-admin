interface ITree {
    _id: string,
    title: string;
    value: string;
    parentId: string;
    children?: any
}

const createTree = (arr: ITree[], parentId = "") => {
    const tree: ITree[] = [];
    arr.forEach(item => {
        if (item.parentId == parentId) {
            const newItem = item;
            const children = createTree(arr, item._id);
            if (children.length > 0) {
                newItem.children = children;
            }
            tree.push(newItem);
        }
    })
    return tree;
}

export const tree = (array: ITree[], parentId = "") => {
    return createTree(array, parentId);
}