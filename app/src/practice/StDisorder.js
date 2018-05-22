/**
 * Created by abing on 2017/3/27.
 */


export const disorder = (questionLength,random,startLoc=null) => {

	let randomStartLoc = '';

	if(startLoc!==null){
		randomStartLoc = startLoc;
	}else {
		randomStartLoc = Math.floor(Math.random()*random.length);//开始位置（范围：0~length-1之间的整数,包含边界值）
	}

	const questionOrder = getDisorder(questionLength,random,randomStartLoc);

	const optionOrder = [];
	for(let i=0;i<questionLength;i++){
		optionOrder.push(getDisorder(4,random,randomStartLoc+i+1));
	}
	return{
		questionOrder:questionOrder,
		optionOrder:optionOrder,
		randomStartLoc:randomStartLoc,
	}

};

const getDisorder = (length,random,randomStartLoc) => {

	let normalOrder = Array.from({length:length}).fill(0).map((item,index) => index);//正常顺序[0,1,2,...questionLength-1]
	let disOrder = [];//打乱的顺序

	for(let location = randomStartLoc;normalOrder.length>0;location++){
		if (location>=random.length){
			location -= random.length;
		}
		let questionIndex = random.charCodeAt(location)%normalOrder.length;//取余
		let questionId = normalOrder.splice(questionIndex,1);
		disOrder.push(questionId[0]);
	}

	return disOrder;
};