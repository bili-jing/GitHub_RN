/**
 * 
 * @param {string} actionType 
 * @param {*} dispatch 
 * @param {string} storeName 
 * @param {} data
 * @param {} pageSize 
 */
export function handleData(actionType,dispatch, storeName, data, pageSize) {
	let fixItems = [];
	if (data && data.data) {
        if (Array.isArray(data.data)) {
            fixItems = data.data
            
        }else if(Array.isArray(data.data.items)){
            fixItems = data.data.items;
        }
	}
	dispatch({
		type: actionType,
		items: fixItems,
		projectModels: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),
		storeName,
		pageIndex: 1
	});
}
