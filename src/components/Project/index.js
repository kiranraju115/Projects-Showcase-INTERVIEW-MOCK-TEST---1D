import './index.css'

const Project = props => {
  const {projectItem} = props
  const {name, imageUrl} = projectItem

  return (
    <li className="project-item">
      <img src={imageUrl} className="project-image" alt={name} />
      <p className="name">{name}</p>
    </li>
  )
}

export default Project
