import React,{useState} from 'react';
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import {createCategory} from './apiAdmin'

const AddCategory = () =>{
    const [name,setName]=useState('');
    const [error,setError]=useState('');
    const [success,setSuccess]=useState('');

    //Destructure user and token from localstorage
    const {user,token} = isAuthenticated();

    const handleChange = (e) => {
        setError('');
        setName(e.target.value);
    }

    const clickSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        //Make req to API
        createCategory(user._id, token, {name})
        .then(data => {
            if(data.error){
                setError(data.error);
            }
            else{
                setError('');
                setSuccess(true);
            }
        });
    }

    const goBack = () => {
        return (<div className="mt-5">
            <Link className="text-warning" to='/admin/dashboard'>
                Back to Dashboard
            </Link>
        </div>)
    }

    const newCategoryForm = () => (
        <form onSubmit={clickSubmit}>
            <div className='form-group'>
                <label className='text-muted'>
                    Name
                </label>
                <input
                type='text'
                className='form-control'
                onChange={handleChange}
                value={name}
                autoFocus
                required
                maxLength={32}
                />
            </div>
            <button className='btn btn-outline-primary'>Create Category</button>
        </form>
    );

    const showSuccess = () => {
        if(success){
            return <h3 className="text-success">{name} is created</h3>
        }
    }

    const showError = () => {
        if(error){
            return <h3 className="text-danger">Name must be unique!</h3>
        }
    }
    return (
        <Layout title='Add new Category'
            description={`Hello there ${user.name}~! ... Lets make a new category!`}
            className=''>
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    {showError()}
                    {showSuccess()}
                    {newCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Layout>
    );
}

export default AddCategory;