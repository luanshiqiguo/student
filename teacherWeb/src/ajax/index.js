/**
 * Created by coder on 2017/2/23.
 */
import config from '../config'
const {hostUrl} = config;

export function HostPost(url,data,needToken = false){
	const token = needToken ? localStorage.getItem('token') : null;
	if(needToken && !token){
		return new Promise((resolve,reject) => {reject('not found token')});
	}

	console.log('send',data);
	return fetch(hostUrl+url,{
		method:'POST',
		headers:{
			'Content-Type':'application/json',
			'authorization':'bearer ' + token
		},
		body:JSON.stringify(data)
	}).then((response) => {
		return response.json().then((json) => {
			return {json,header:response.headers};
		})
	}).then(({json,header}) => {
		return DefaultCheckPost(json,header,url,data,needToken);
	});
}


function RefreshToken(){
	let token = localStorage.getItem('token');
	if(token === 'waiting'){
		return new Promise((resolve,reject) => {
			let count = 0;
			let waitTime = setInterval(() => {
				count++;
				token = localStorage.getItem('token');
				if(token !== 'waiting'){
					clearInterval(waitTime);
					return resolve({token});
				}
				if(count > 20){
					clearInterval(waitTime);
					localStorage.setItem('token','');
					return reject({'error':'wait refresh token timeout'});
				}
			},200);
		});
	} else {
		localStorage.setItem('token','waiting');
		return fetch(hostUrl+'/refresh',{
			method:'POST',
			headers:{
				'Content-Type':'application/json'
			},
			body:JSON.stringify({token})
		}).then((response) => response.json())
			.then((json) => {
				if(json.error === 0){
					localStorage.setItem('token',json.token);
					return json;
				} else {
					return Promise((resolve,reject) => reject(json));
				}
			});
	}

}

function DefaultCheckPost(json,header,url,data,needToken){
	console.log('fetch',json);

	if(needToken){
		if(json.status_code === 401 && json.message === 'Token has expired'){
			return RefreshToken().then((json) => {
				return HostPost(url,data,needToken);
			}).catch((error) => {
				console.log(error);
			});
		}
	}

	return {json,header};
}
