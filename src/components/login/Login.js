import React, {useState} from 'react';
import {Redirect} from 'react-router-dom'
import PropTypes from 'prop-types';

import { useAuth } from '../../context/auth'
import './Login.css'

function Login() {


	const [isLoggedIn, setLoggedIn] = useState(false);
	const [email, setEmail] = useState('test@test.com');
	const [password, setPassword] = useState('test');
	const [repetedPassword, setRepetedPassword] = useState('test');
	const [isNewUser, setIsNewUser] = useState(false);
	const { setAuthTokens } = useAuth();

	const handleLogin = (e) => {
		e.preventDefault();
		if(email.length > 0 && password.length > 0){
			const user = {
				email: email,
				password: password
			}
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(user)
			};
			fetch('http://localhost:5000/users/login', requestOptions)
				.then(response => response.json())
				.then(data => {
					setAuthTokens(data);
					setLoggedIn(true)
				});
		}
	};

	const handleSignup = (e) => {
		e.preventDefault();
		if(email.length > 0 && password.length > 0  && repetedPassword.length > 0){
			if(password === repetedPassword){
				const user = {
					email: email,
					password: password
				}
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(user)
				};
				fetch('http://localhost:5000/users/signup', requestOptions)
					.then(response => response.json())
					.then(data => {
						console.log(data);
						setAuthTokens(data);
						setLoggedIn(true)
					});
			}
		}
	};

	if(isLoggedIn){
		return <Redirect to="/" />
	}
	
	return (isNewUser ?
		<>  
			<div className="switch-form">
				<a onClick={()=>setIsNewUser(false)}>You have an account already? Log In!</a>
			</div>
			<form onSubmit={handleSignup} className="login-container shadow fat-border">
				<input className="shadow border" name="email" placeholder="email" value={email} onChange={e =>setEmail(e.target.value)}/>
				<input className="shadow border" name="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/>
				<input className="shadow border" name="password" placeholder="repete password" value={repetedPassword} onChange={e => setRepetedPassword(e.target.value)}/>
				<button className="big-btn shadow border animate-click" type="submit"> Sign Up </button>
			</form>
		</>
		:
		<>  
			<div className="switch-form">
				<a onClick={()=>setIsNewUser(true)}>New user? Sign Up!</a>
			</div>
			<form onSubmit={handleLogin} className="login-container shadow fat-border">
				<input className="shadow border" name="email" placeholder="email" value={email} onChange={e =>setEmail(e.target.value)}/>
				<input className="shadow border" name="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/>
				<a href="">Forgot your password?</a>
				<button className="big-btn shadow border animate-click" type="submit"> Login </button>
 			</form>
		</>
	)
}

Login.propTypes = {
	isLoggedIn: PropTypes.bool,
	email: PropTypes.string,
	password: PropTypes.string,
	resetPassword: PropTypes.string,
	isNewUser: PropTypes.bool
}

export default Login

