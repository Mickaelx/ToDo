import * as React from 'react'
import ToDoStore from './ToDoStore'
import { ToDo } from './Interface'
import ToDoItem from './ToDoItem'
import { FormEvent, KeyboardEvent } from 'react'
import * as cx from 'classnames'

type FilterOptions = 'all' | 'completed' | 'active'

const Filters = {
    completed: (ToDo: ToDo) => ToDo.completed,
    active: (ToDo: ToDo) => !ToDo.completed,
    all: (ToDo: ToDo) => true,
}

interface ToDoListProps {
    
}

interface ToDoListState {
    ToDos : ToDo[],
    newToDo: string,
    filter: FilterOptions
}

export default class ToDoList extends React.PureComponent<ToDoListProps, ToDoListState> {
    private store: ToDoStore = new ToDoStore()
    private toggleToDo: (ToDo: ToDo) => void
    private destroyToDo: (ToDo: ToDo) => void
    private updateTitle: (ToDo: ToDo, title: string) => void
    private clearToDos: () => void

    constructor (props: ToDoListProps) {
        super(props)
        
        this.state = {
            ToDos: [],
            newToDo: '',
            filter: 'all'
        }
        this.store.onChange((store) => {
            this.setState({ToDos: store.ToDos})
        })
        
        this.toggleToDo = this.store.toggleToDo.bind(this.store)  
        this.destroyToDo = this.store.removeToDo.bind(this.store)
        this.clearToDos = this.store.clearToDos.bind(this.store)
        this.updateTitle = this.store.updateTitle.bind(this.store)
    }

    get remainingCount (): number {
        return this.state.ToDos.reduce((count, ToDo) => !ToDo.completed ? count + 1 : count, 0)
    }
    
    get completedCount (): number {
        return this.state.ToDos.reduce((count, ToDo) => ToDo.completed ? count + 1 : count, 0)
    }

    componentDidMount () {
        this.store.addToDo('salut')
        this.store.addToDo('les gens')
    }

    
    

    render() {
        let {ToDos, newToDo, filter} = this.state
        let remainingCount = this.remainingCount
        let completedCount = this.completedCount
        let ToDosFiltered = ToDos.filter(Filters[filter])
        return <section className="todoapp">
        <header className="header">
            <h1>Todos</h1>
            <input className="new-todo" 
                   value={newToDo}
                   placeholder="What needs to be done?"
                   onInput={this.updateNewToDo}
                   onKeyPress={this.addToDo}
            />
        </header>
        <section className="main">
            {ToDos.length > 0 && <input className="toggle-all" type="checkbox" checked={remainingCount === 0} onChange={this.toggle}/>}
            <label htmlFor="toggle-all"></label>
            <ul className="todo-list">
                {ToDosFiltered.map(ToDo => {
                    return <ToDoItem ToDo={ToDo} 
                                     onToggle={this.toggleToDo} 
                                     key={ToDo.id} 
                                     onDestroy={this.destroyToDo}
                                     onUpdate={this.updateTitle}
                            />

                })} 
            </ul>
        </section>
        <footer className="footer">
            { remainingCount > 0 && <span className="todo-count"><strong>{remainingCount}</strong> item{remainingCount > 1 && 's'} left</span> }
            <ul className="filters">
                <li>
                    <a href="#/" className={cx({selected: filter === 'all'})} onClick={this.setFilter('all')}>All</a>
                </li>
                <li>
                    <a href="#/active" className={cx({selected: filter === 'active'})} onClick={this.setFilter('active')}>Active</a>
                </li>
                <li>
                    <a href="#/completed" className={cx({selected: filter === 'completed'})} onClick={this.setFilter('completed')}>Completed</a>
                </li>
            </ul>
            {completedCount > 0 && <button className="clear-completed" onClick={this.clearToDos}>Clear completed</button>}
        </footer>
    </section>
    }

    updateNewToDo = (e: FormEvent<HTMLInputElement>) => {
        this.setState({newToDo: (e.target as HTMLInputElement).value})
    }

    addToDo = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            this.store.addToDo(this.state.newToDo)
            this.setState({newToDo: ''})
        }
    } 

    toggle = (e: FormEvent<HTMLInputElement>) => {
        this.store.toggleAllToDo(this.remainingCount > 0)
    } 

    setFilter = (filter: FilterOptions) {
        return (e: React.MouseEvent<HTMLElement>) {
            this.setState({filter})
        }
    }
}