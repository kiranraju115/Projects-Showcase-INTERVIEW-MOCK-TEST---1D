import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Project from '../Project'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class ProjectShowCase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedId: props.categoriesList[0].id,
      projectsList: [],
      apiStatus: apiConstants.initial,
    }
  }

  componentDidMount() {
    this.callProjectApi()
  }

  updateProjectsList = projects => {
    const updateNewProjects = projects.map(eachProject => ({
      id: eachProject.id,
      name: eachProject.name,
      imageUrl: eachProject.image_url,
    }))
    this.setState({
      projectsList: updateNewProjects,
      apiStatus: apiConstants.success,
    })
  }

  callProjectApi = async () => {
    this.setState({apiStatus: apiConstants.progress})
    const {selectedId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${selectedId}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok) {
      this.updateProjectsList(data.projects)
    } else {
      this.setState({apiStatus: apiConstants.failed})
    }
  }

  onChangeOfSelect = event => {
    this.setState({selectedId: event.target.value}, this.callProjectApi)
  }

  getProjects = () => {
    const {projectsList} = this.state

    return (
      <ul className="project-card">
        {projectsList.map(eachProject => (
          <Project key={eachProject.id} projectItem={eachProject} />
        ))}
      </ul>
    )
  }

  loadLoader = () => (
    <div data-testid="loader" className="grow-loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  getFailure = () => (
    <div className="failure-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <div>
        <button
          type="button"
          className="retry-button"
          onClick={this.callProjectApi}
        >
          Retry
        </button>
      </div>
    </div>
  )

  getAllProjects = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.getProjects()
      case apiConstants.progress:
        return this.loadLoader()
      case apiConstants.failed:
        return this.getFailure()
      default:
        return null
    }
  }

  render() {
    const {categoriesList} = this.props
    const {selectedId} = this.state

    return (
      <div className="bg-container">
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="logo-image"
            alt="website logo"
          />
        </div>
        <div className="project-body">
          <select
            className="select-el"
            value={selectedId}
            onChange={this.onChangeOfSelect}
          >
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          {this.getAllProjects()}
        </div>
      </div>
    )
  }
}

export default ProjectShowCase
