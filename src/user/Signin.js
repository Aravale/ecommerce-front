import React, { useState } from 'react';
import Layout from '../core/Layout'
import { Redirect } from 'react-router-dom'
import { signin, authenticate, isAuthenticated } from '../auth'
const Signin = () => {

    const [values, setValues] = useState({
        email: 'ryan@gmail.com',
        password: 'abc123',
        error: '',
        loading: false,
        redirectToReferrer: false,
    });

    const { user } = isAuthenticated();

    const { email, password, loading, error, redirectToReferrer } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true })
        signin({ email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false });
                }
                else {
                    authenticate(data, () => {
                        setValues({
                            ...values,
                            redirectToReferrer: true
                        });
                    });
                }
            });
    }

    const singInForm = () => (
        <form>
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

    const showLoading = () => {
        return loading && (<div className='alert alert-info'><h2>Loading...</h2></div>)
    }

    const redirectUser = () => {
        if (redirectToReferrer) {
            if (user && user.role === 1) {
                return <Redirect to='/admin/dashboard' />
            }
            else {
                return <Redirect to='/user/dashboard' />
            }
        }
        if(isAuthenticated())
        {
            return <Redirect to='/' />

        }
    }

    return (
        <Layout title='Signin'
            description='Node React Ecom App Signin'
            className='container col-md-8 offset-md-2'>
            {showLoading()}
            {showError()}
            {singInForm()}
            {redirectUser()}
        </Layout>
    )
}

export default Signin;
