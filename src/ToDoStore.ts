import { ToDo } from './Interface'

declare type ChangeCallback = (store: ToDoStore) => void

export default class ToDoStore {
    private static i = 0
    public ToDos: ToDo[] = []
    private callbacks: ChangeCallback[] = []

    private static increment(){
        return this.i++
    }

    inform () {
        this.callbacks.forEach(callback => callback(this))
    }

    onChange (callback: ChangeCallback) {
        this.callbacks.push(callback)
    }
        
    
    addToDo (title: string): void {
        this.ToDos = 
        [{
            id: 0,
            title: title,
            completed: false
        }, ...this.ToDos]
        this.inform()
    }

    removeToDo (ToDo: ToDo): void {
        this.ToDos = this.ToDos.filter(t => t !== ToDo)
        this.inform()
    }

    toggleToDo (ToDo: ToDo): void { 
        this.ToDos = this.ToDos.map(t => t === ToDo ? { ...t, completed: !t.completed } : t)
        this.inform()
    }

    updateTitle(ToDo: ToDo, title: string): void {
        this.ToDos = this.ToDos.map(t => t === ToDo ? { ...t, title } : t)
        this.inform()
    }

    toggleAllToDo (completed = true) {
        this.ToDos = this.ToDos.map(t => completed !== t.completed ? { ...t, completed } : t)
        this.inform()
    }

    clearToDos (): void {
        this.ToDos = this.ToDos.filter(t => !t.completed)
        this.inform()
    }
}