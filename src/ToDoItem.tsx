import * as React from 'react'
import { ToDo } from './Interface'
import * as cx from 'classnames'

interface Props {
    ToDo: ToDo
    onToggle: (ToDo: ToDo) => void
    onDestroy: (ToDo: ToDo) => void
    onUpdate: (ToDo: ToDo, title: string) => void
}

interface State {
    editing: boolean
    title: string
}


export default class ToDoItem extends React.PureComponent<Props,State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            editing: false,
            title: ''
        }
    }
    render() {
        let {ToDo, onDestroy, onToggle} = this.props
        let { editing, title } = this.state
        return (
            <li className={cx({completed: ToDo.completed, editing})}>
                <div className="view">
                    <input className="toggle" type="checkbox" onChange={this.toggle} checked={ToDo.completed}/>
                    <label onDoubleClick={this.startEditing} htmlFor="">{ToDo.title}</label>
                    <button className="destroy" onClick={this.destroy}></button>
                </div>
                <input type="text"
                           className="edit"
                           value={title}
                           onBlur={this.handleSubmit}
                           onInput={this.handleInput}
                           onKeyDown={this.handleKeyDown}
                    />
            </li>
        )
    } 
    

    startEditing = (e: React.MouseEvent<HTMLLabelElement>) => {
        this.setState({editing: true, title: this.props.ToDo.title} )
    }
    toggle = () => {
        this.props.onToggle(this.props.ToDo)
    }
    destroy = () => {
        this.props.onDestroy(this.props.ToDo)
    }

    handleSubmit = () => {
        this.props.onUpdate(this.props.ToDo, this.state.title)
        this.setState({editing: false})
    } 
    handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({title: (e.target as HTMLInputElement).value})
    }
    handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Escape') {
            this.setState({editing: false})
        } else if (e.key === 'Enter') {
            this.handleSubmit()
        }
    }
}