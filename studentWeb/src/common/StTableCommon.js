/**
 * Created by crazycooler on 2017/3/12.
 */

export const getCurrentPage = (pagination) => {
	return pagination.hasOwnProperty('current') ? pagination.current : 1;
};

export const getPageSize = (pagination) => {
	return pagination.hasOwnProperty('pageSize') ? pagination.pageSize : 10;
};


export const getPageStartIndex = (pagination) =>{
	return (getCurrentPage(pagination)-1)*getPageSize(pagination);
};

export const renderHighlight = (record,field) => {
	return record.hasOwnProperty(field + '_hl') ? record[field + '_hl'] : record[field];
};