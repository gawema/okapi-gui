import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import { useAuth } from "../../context/auth";
import { convertDateToDMY } from '../../utilities/converter'
import Header from '../header/Header'
import './Dashboard.css';

function Dashboard() {

	const {setAuthTokens} = useAuth();
	const[projects, setProjects] = useState([])
	const[bootstrap, setBootstrap] = useState(true)
	const[uploadInput, setUploadInput] = useState([])
	const[loading, setLoading] = useState(true)
	const[uploading, setUploading] = useState(false)
	const history = useHistory();

	const getProjects = () =>{
		const token = JSON.parse(localStorage.getItem('tokens'))['token'];
		const requestOptions = {
			method: 'GET',
			headers: { 'Authorization': 'Bearer ' + token }
		};
		fetch('http://localhost:5000/projects/', requestOptions)
			.then(response => response.json())
			.then(data => {
				setProjects(data);
				setBootstrap(false);
				setLoading(false);
			})
	}

	useEffect(() =>{
		bootstrap && getProjects();
	},[bootstrap])

	const openProject = (project) => {
		history.push({
			pathname: '/editor',
			state: project
		})
	}

	const saveUploadedFile = (event) => {
		setUploading(true)
		if(event.target.files[0]){
			let formData = new FormData();
			const file = event.target.files[0]
			formData.append('file', file);
			const token = JSON.parse(localStorage.getItem('tokens'))['token'];
	
			fetch('http://localhost:5000/projects/', {
				method: 'POST',
				headers: { 'Authorization': 'Bearer ' + token },
				body: formData
			}).then(response => response.json())
				.then(result => {
					setUploadInput('');
					setUploading(false)
					getProjects();
				})
				.catch(error => console.log('error occurred'));
		}
	}

	return (
		<>
			<Header title="Your Projects" page="dashboard"/>
			{!loading &&
				<div className="projects-grid">
					{projects.map(project => {
						return(
							<div key={project._id} className="border shadow">
								<h3>{project.name}</h3>
								<button className="medium-btn shadow border animate-click" onClick={() => openProject(project._id)}>
									Open
								</button>
								<div className="card-footer">
									<h5>Last update: {convertDateToDMY(project.last_update)}</h5>
									<div>
										<h5>Online</h5>
										<div className="status"></div>
									</div>
								</div>
							</div>
						)
					})}
					{!uploading &&
						<div className="border shadow">
							<h3>Add a new project</h3>
							<div className="upload medium-btn shadow border animate-click" >
								<input type="file" name="file" id="file" accept=".html, .zip" value={uploadInput} onChange={event => saveUploadedFile(event)}/>
								Upload
							</div>
						</div>
					}
					{uploading &&
						<div className="loading">
							<div className="spinner"></div>
						</div>
					}
				</div>
			}
			{loading &&
				<div className="projects-grid">
					<div className="skeleton"></div>
					<div className="skeleton"></div>
					<div className="skeleton"></div>
					<div className="skeleton"></div>
					<div className="skeleton"></div>
					<div className="skeleton"></div>
				</div>
			}
		</>
	);
}

Dashboard.propTypes = {
	projects: PropTypes.array,
	uploadInput: PropTypes.string
}

export default Dashboard;
