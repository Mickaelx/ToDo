import { render } from 'react-dom'
import * as React from 'react'
import ToDoList from './ToDoList'

render (
    <ToDoList />,
    document.getElementById('app') as Element
)