/**
 * Created by crazycooler on 2017/3/12.
 */
import React from 'react'

const highlightElement = (value,reg,match) => {
	return (
		<span>
      {value.split(reg).map((text, i) => (
        i > 0 ? [<span className="highlight">{match[i - 1]}</span>, text] : text
      ))}
		</span>
	);
};


export const makeHighlight = (data,fields,search) => {
	if(!search){
		return;
	}
	const reg = new RegExp(search, 'gi');
	data.map((record) => {
		fields.map((field) => {
			if(record[field] instanceof Array){
				//如果是数组,对数组内的每一个元素进行高亮
				record[field + '_hl'] = record[field].map((item) => {
					const value = typeof item === 'string' ? item : item.toString();
					const match = value.match(reg);
					return match ? highlightElement(value,reg,match) : item;
				})
			} else {
				//如果不是数组直接转换成字符串
				const value = typeof record[field] === 'string' ? record[field] : record[field].toString();
				const match = value.match(reg);
				if (match) {
					record[field + '_hl'] = highlightElement(value,reg,match);
				}
			}
		});
	});

};