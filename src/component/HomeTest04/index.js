import { useEffect, useMemo, useState } from "react"
import Form from './Form'
import List from './List'
import './style.css'
import {getUsers, createUser, editUser, deleteUser} from '../apis/users'
import ModalView from './ModalView'

const DEFAULT_FORM_USER = {name : '', email : ''}

const validate = (list, formData) => {
    if (!formData.name || !formData.email) {
        return false
    }
    
    //Create
    if (!formData.id) {
        const item = list.find((item) => {
            return  item.email === formData.email
        })
        return item ? false : true //Neu find ra item trung thi tra ve false
    }

    //Edit
    if (formData.id) {
        const item = list.find((item) => {
            return item.id !== formData.id && item.email === formData.email
        })
        return item ? false : true 
    }
}

const HomeTest04 = () => {
    const [selectedId, setSelectedId] = useState()
    const [list, setList] = useState([])
    const [formData, setFormData] = useState({name : '', email : ''})
    const [search, setSearch] = useState ('')
    const onChange = (ev) => {
        const name = ev.target.name
        const value = ev.target.value

        setFormData ({
            ...formData,
            [name] : value     
        })         
    }
    
    const resultList = useMemo( () => { // search
        if(search) {
            const newResultList = list.filter((item) => {
                return item.name.includes(search) || item.email.includes(search)
            })
            return newResultList
        }

        return list
        
    }, [search, list])
    
    const fetchData = () => { //get data from mockapi
        getUsers().then(response => {
            setList(response.data)
        })
        .catch(error =>{
            console.log(error)
        })
    }

    useEffect (() => { //get data from mockapi
        fetchData()
    }, [])

    // getUsers >> return arr users
    // createUser >> tao them 1 user
    // doi tao xong getUsers de tao du lieu
    const onSubmit = () => {

        const isValidate = validate(list, formData)
        
        if(isValidate) {
            //Create
            if (!formData.id) {
                console.log(formData)
                createUser(formData)
                .then((response) => {
                    fetchData()
                    setFormData({name : '', email : ''})
                })
                .catch(error => {
                    console.log(error)
                })
            }
            // Edit
            if (formData.id) {
                editUser(formData.id, formData)
                .then((response) => {
                    fetchData()
                    setFormData({name : '', email : ''})
                })
            }
        
        const element = document.querySelector('#modal-form-user')
        const modal = window.bootstrap.Modal.getOrCreateInstance(element)
        modal.hide()
    }}

    const onCreate = () => {
        setFormData(DEFAULT_FORM_USER)

        const element = document.querySelector('#modal-form-user')
        const modal = window.bootstrap.Modal.getOrCreateInstance(element)
        modal.show()
    }

    const onDelete = id => {
        deleteUser(id).then((response) => {fetchData()}).catch((error) => {console.log(error)})

        const element = document.querySelector('#modal-delete-user')
        const modal = window.bootstrap.Modal.getOrCreateInstance(element)
        modal.hide()
    }

    const onSearch = (e) => {
        const value = e.target.value
        
        setSearch(value)
    }
    
    const onEdit = (data) => {
        setFormData(data)
        const element = document.querySelector('#modal-form-user')
        const modal = window.bootstrap.Modal.getOrCreateInstance(element)
        modal.show()
    }

    const onView = id => {
        setSelectedId(id)
        const element = document.querySelector('#modal-view-user')
        const modal = window.bootstrap.Modal.getOrCreateInstance(element)
        console.log(id, element)
        modal.show()
    }
    
    return (
        
        <div>
            <header className="header row">

                <h4 className="col-7"> User </h4>

                <div className="col-3">
                    <input class="form-control" value={search} onChange={onSearch} placeholder=" Type to search : " />
                </div>

                <div className="col-2">
                    <button className="btn btn-secondary" onClick={onCreate}> Create Users </button>
                </div>
            </header>

            <Form list={list} formData={formData} onChange={onChange} onSubmit={onSubmit} onView={onView} />

            { 
                resultList.length === 0 && (
                <div> No data found </div>
            )}

            <List list={resultList} onEdit={onEdit} onDelete={onDelete} formData={formData} onChange={onChange} onView={onView} />

            <ModalView id={selectedId}/>
        </div>
    )
    
} 
export default HomeTest04