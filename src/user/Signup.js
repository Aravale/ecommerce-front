import React, { useState } from 'react';
import Layout from '../core/Layout'
import { Link } from 'react-router-dom'
import { signup } from '../auth'
const Signup = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    const { name, email, password, success, error } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false })
        signup({ name, email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, success: false });
                }
                else {
                    setValues({
                        ...values,
                        name: '',
                        email: '',
                        password: '',
                        error: '',
                        success: true
                    })
                }
            })
    }

    const singUpForm = () => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Name</label>
                <input
                    onChange={handleChange('name')}
                    type='text'
                    value={name}
                    className='form-control'></input>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Email</label>
                <input
                    onChange={handleChange('email')}
                    type='text'
                    value={email}
                    className='form-control'></input>
            </div>
            <div className='form-group'>
                <label className='text-muted'>Password</label>
                <input
                    onChange={handleChange('password')}
                    type='password'
                    value={password}
                    className='form-control'></input>
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
        </form>
    )

    const showError = () => {
        return (<div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>{error}</div>)
    }

    const showSuccess = () => {
        return (<div className='alert alert-info' style={{ display: success ? '' : 'none' }}>New account created! <Link to='/signin'>Sign in</Link></div>)
    }

    return (
        <Layout title='Signup'
            description='Sign up to new app!'
            className='container col-md-8 offset-md-2'>
            {showSuccess()}
            {showError()}
            {singUpForm()}
        </Layout>
    )
}

export default Signup;
