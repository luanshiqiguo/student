/**
 * Created by coder on 2017/2/23.
 */

import config from '../config'
import store from '../store'
import {ACTION_FRESH_TOKEN} from '../store/action'

const {hostUrl} = config;


export function HostPost(url,data,needToken = false,newToken){
	let token;
	if(newToken){
		console.log('newToken',newToken);
		token = newToken;
	}else{
		token = needToken ? store.getState()['auth']['token'] : null;
		if(needToken && !token){
			return new Promise((resolve,reject) => {reject('not found token')});
		}
	}
	console.log(url,data);
	return fetch(hostUrl+url,{
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'authorization':'bearer ' + token
				},
				body:JSON.stringify(data)
			}).then((response) => {
				return response.json().then((json) => {
					console.log('get',json);
					return {json,header:response.headers};
				})
			}).then(({json,header}) => {
					return DefaultCheckPost(json,header,url,data,needToken);
			});
}

function DefaultCheckPost(json,header,url,data,needToken){
	if(needToken){
		if(json.status_code === 401 && json.message === 'Token has expired'){
			return RefreshToken().then((newToken) => {
						return HostPost(url,data,needToken,newToken);
					}).catch((error) => {
						return new Promise((resolve,reject) => {reject('refresh failed')});
					});
		} else if(json.status_code === 401 && json.message === 'The token has been blacklisted'){
			return new Promise((resolve,reject) => {reject('The token has been blacklisted')});
		}
	}
	return {json,header};
}

function RefreshToken(){
	let token = store.getState()['auth']['token'];
	if(token === 'waiting'){
		return new Promise((resolve,reject) => {
				let count = 0;
				let waitTime = setInterval(() => {
					count++;
					let token = store.getState()['auth']['token'];
					if(token !== 'waiting'){
						clearInterval(waitTime);
						return resolve(token);
					}
					if(count > 30){
						clearInterval(waitTime);
						dispatchRefreshToken('');
						return reject('wait refresh token timeout');
					}
				},200);
			});
	} else {
		dispatchRefreshToken('waiting');
		return fetch(hostUrl+'/refresh',{
					method:'POST',
					headers:{
						'Content-Type':'application/json'
					},
					body:JSON.stringify({token})
				})
				.then((response) => response.json())
				.then((json) => {
					if(json.error === 0){
						dispatchRefreshToken(json.token);
						return json.token;
					} else {
						return new Promise((resolve,reject) => reject('refresh failed'));
					}
				});
	}
}

function dispatchRefreshToken(token){
	store.dispatch({
		type:ACTION_FRESH_TOKEN,
		payload:token
	});
}


