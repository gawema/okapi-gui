import React, {useState, useEffect} from "react";
import {Redirect} from 'react-router-dom'
import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';
import {useAuth} from "../../context/auth";
import Header from '../header/Header'
import './Editor.css';


function Editor(props) {

	
	const[project, setProject] = useState();
	const[hiddenPages, setHiddenPages] = useState();
	const[openComponent, setOpenComponent] = useState();
	const[updatedProject, setUpdatedProject] = useState({});
	const[livePreview, setLivePreview] = useState(false);
	const[random, setRandom] = useState(1234);
	const[loading, setLoading] = useState(true)
	const[downloading, setDownloading] = useState(false)


	useEffect(() =>{
		try{
			const projectId = props.location.state;
			const token = JSON.parse(localStorage.getItem('tokens'))['token'];
			const requestOptions = {
				method: 'GET',
				headers: { 'Authorization': 'Bearer ' + token }
			};
			fetch('http://localhost:5000/projects/' +projectId, requestOptions)
				.then(response => response.json())
				.then(data => {
					setProject(data);
					const newHiddenPages = [];
					data.pages.map((page, index) =>{
						newHiddenPages.push({
							page: index,
							hidden: false
						})
					})
					setHiddenPages(newHiddenPages)
					setLoading(false);
				})
		} catch (error) {
			console.log('no id found ' + error)
			return <Redirect to="/" />
		}
	},[])

	const buildNewProject = (componentId, pageId, value) =>{
		const newProject = {...project}
		newProject.pages.map(page =>{
			if(page._id === pageId){
				page.components.map(component => {
					if(component._id === componentId){
						component.text = value;
					}
				})
			}
		})
		setUpdatedProject(newProject)
	}

	const saveUpdates = () => {
		const token = JSON.parse(localStorage.getItem('tokens'))['token'];
		const requestOptions = {
			method: 'PATCH',
			headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedProject)
		};
		fetch('http://localhost:5000/projects/', requestOptions)
			.then(() => setProject(updatedProject))
	}
	
	const downloadProject = () => { 
		setDownloading(true)
		const token = JSON.parse(localStorage.getItem('tokens'))['token'];
		const body = {
			projectId: project._id,
			fileName: project.name,
			pages: project.pages
		}
		const requestOptions = {
			method: 'POST',
			headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		};
		fetch('http://localhost:5000/projects/download', requestOptions)
			.then(response => response.json())
			.then(url => {
				setRandom(Math.random())
				window.open(url.zipFileLocation);
				setDownloading(false)
			})
	}
	
	return (
		<>
		{(!loading && !livePreview) &&
			<>
           		<Header title={project.name} page="editor" />
				<div className="editor">
					<div className="sidebar">
						<div className="folder">
							{project.folder_url}
							{project.pages.map((page, index) => {
								return(
								<div key={index} className={hiddenPages[index].hidden ? 'page hide' : 'page'} >
									<a onClick={() =>{
										const newHiddenPages = [...hiddenPages];
										newHiddenPages[index].hidden = !newHiddenPages[index].hidden
										setHiddenPages(newHiddenPages)
									}}>{page.name}</a>
									{page.components.map(component => {
										return (
											<div key={component._id} className="component" style={openComponent === component._id ? {borderLeft: "3px solid #A8DADC"}:{borderLeft: "3px solid"}}>
												<a onClick={() =>{
													if(openComponent === component._id){
														setOpenComponent()
													}else(
														setOpenComponent(component._id)
													)
												}}>{component.name}</a>
												{openComponent === component._id &&
												<>
													<div className="arrow"></div>
													<div className="content border" >

														<TextareaAutosize 
															className='textarea'
															onChange={e => buildNewProject(component._id, page._id, e.target.value)}
															value={component.text}
														/>
													</div>
													{updatedProject._id &&
														<button className="medium-btn shadow border animate-click" onClick={saveUpdates}>SAVE</button>
													}
												</>
												}
											</div>
										);
									})}
								</div>
								)
							})}
						</div>
					</div>
				</div>
				{!downloading &&
					<button 
						className="medium-btn shadow border animate-click" 
						onClick={downloadProject} 
						style={{marginLeft: 'calc(5% + 1.5rem)', alignSelf: "flex-start"}}>
						download
					</button>
				}
				{downloading &&
					<div className="loading">
						<div className="spinner"></div>
					</div>
				}
				{/* <button 
					className="medium-btn shadow border animate-click" 
					onClick={() => setLivePreview(true)} 
					style={{
						marginLeft: 'calc(5% + 1.5rem)',
						marginTop: '0',
						alignSelf: "flex-start"
						}}>
					Live Preview
				</button> */}
			</>
		}
		{livePreview &&
		<div className="content border preview" >
			<div className="exit" onClick={() => setLivePreview(false)}>x</div>
			<iframe key={random} src={"https://okapi-test-cms.s3.eu-central-1.amazonaws.com/5ff43de22d3295c1cd5b4af4/5ff47bdcd7cdc8ff8a31886f/TEST3/homepage.html"}></iframe>
		</div>
		}
		{loading && 
		<>
			<Header title='' page="editor" />
			<div className="editor">
				<div className="big skeleton margin"></div>
				<div className="skeleton"></div>
				<div className="small skeleton"></div>
				<div className="skeleton"></div>
				<div className="small skeleton margin"></div>
				<div className="big skeleton"></div>
				<div className="big skeleton"></div>
			</div>
		</>
		}
		</>
	);
}

Editor.propTypes = {
	project: PropTypes.object,
	hiddenPages: PropTypes.array,
	openComponent: PropTypes.number,
	updateProject: PropTypes.object
}

export default Editor;
