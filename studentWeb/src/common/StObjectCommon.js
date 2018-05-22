/**
 * Created by crazycooler on 2017/3/12.
 */
/**
 * 返回指定变量的数据类型
 * @param  {Any} data
 * @return {String}
 */
function type (data) {
	return Object.prototype.toString.call(data).slice(8, -1);
}


/**
 * 判断两个数组是否相等
 * 浅度相等：两数组toString一样
 * 深度相等的判断规则：
 *   1.长度相等
 *   2.俩数组的每一项：
 *      若为数组：参考本函数规则。
 *      若为对象：参考equalObject的规则。
 *      其他的数据类型，要求===判断为true
 * @param  {[type]} arr1
 * @param  {[type]} arr2
 * @param  {[type]} deepCheck
 * @return {[type]}
 */
export const equalArray = (arr1, arr2, deepCheck) => {
	if (arr1 === arr2) {
		return true;
	}
	// 长度不等，不用继续判断
	if (arr1.length !== arr2.length) {
		return false;
	}
	// 浅度检查
	if (!deepCheck) {
		return arr1.toString() === arr2.toString();
	}
	// 判断每个基本数据类型是否一样
	let type1, type2; // 数组每一项的数据类型
	for (let i = 0; i < arr1.length; i++) {
		type1 = type(arr1[i]);
		type2 = type(arr2[i]);

		// 数据类型不一样，无需判断
		if (type1 !== type2) {
			return false;
		}

		if (type1 === "Array") {
			if (!equalArray(arr1[i], arr2[i], true)) {
				return false;
			}
		}else if (type1 === 'Object') {
			if (!equalObject(arr1[i], arr2[i], true)) {
				return false;
			}
		}else if (arr1[i] !== arr2[i]) {
			return false;
		}

	}
	return true;
};

/**
 * 判断两个对象是否相等
 * 浅度判断：
 *      1.只判断obj的第一层属性总数是否一样
 *      2.值的===判断是否为真
 * 深度判断：
 *      值为对象，参考本规则
 *      值为数组，参考equalArray的深度判断
 *      值为其他类型，用===判断
 * @param  {[type]} obj1
 * @param  {[type]} obj2
 * @param  {[type]} deepCheck
 * @return {[type]}
 */
export const equalObject = (obj1, obj2, deepCheck) => {
	if (obj1 === obj2) {
		return true;
	}
	// 属性总数不等，直接返回false
	let size1 = 0;
	for (let key in obj1){
		size1++;
	}
	let size2 = 0;
	for (let key in obj2){
		size2++;
	}
	if (size1 !== size2) {
		return false;
	}

	if (!deepCheck) { // 浅度判断
		for (let key in obj1){
			if (obj1[key] !== obj2[key]) {
				return false;
			}
		}
		return true;
	}

	let type1,type2;
	for (let key in obj1){
		type1 = type(obj1[key]);
		type2 = type(obj2[key]);
		if (type1 !== type2) {
			return false;
		}
		if (type1 === "Object") {
			if (!equalObject(obj1[key], obj2[key], true)) {
				return false;
			}
		}else if (type1 === "Array") {
			if (!equalArray(obj1[key], obj2[key],true)) {
				return false;
			}
		}else if (obj1[key] !== obj2[key]) {
			return false;
		}
	}
	return true;

};