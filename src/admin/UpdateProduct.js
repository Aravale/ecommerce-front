import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link, Redirect } from 'react-router-dom'
import { getProduct, getCategories, updateProduct } from './apiAdmin'

const UpdateProduct = ({ match }) => {

    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    })

    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values;

    const { user, token } = isAuthenticated();

    const clickSubmit = event => {
        event.preventDefault()
        setValues({ ...values, error: '', loading: true });

        updateProduct(match.params.productId, user._id, token, formData)
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error });
                }
                else {
                    setValues({
                        ...values,
                        name: '',
                        description: '',
                        photo: '',
                        price: '',
                        quantity: '',
                        loading: false,
                        createdProduct: data.name
                    });
                }
            });
    }

    const newPostForm = () => (
        <form onSubmit={clickSubmit} className="mb-3">
            <h4>Post Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input onChange={handleChange('photo')} type="file" name="photo" accept='image/*' />
                </label>
            </div>
            <div className="form-group">
                <label className='text-muted'>Name</label>
                <input type="text" className="form-control" value={name} onChange={handleChange('name')} />
            </div>
            <div className="form-group">
                <label className='text-muted'>Description</label>
                <textarea className="form-control" value={description} onChange={handleChange('description')} />
            </div>
            <div className="form-group">
                <label className='text-muted'>Price</label>
                <input type="number" className="form-control" value={price} onChange={handleChange('price')} />
            </div>
            <div className="form-group">
                <label className='text-muted'>Category</label>
                <select className="form-control" onChange={handleChange('category')}>
                    <option>Please select</option>
                    {categories.length > 0 && categories.map((c, i) => (<option key={i} value={c._id}>{c.name}</option>))}
                </select>
            </div>
            <div className="form-group">
                <label className='text-muted'>Shipping</label>
                <select className="form-control" onChange={handleChange('shipping')}>
                    <option>Please select</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>
            <div className="form-group">
                <label className='text-muted'>Quantity</label>
                <input type="number" className="form-control" value={quantity} onChange={handleChange('quantity')} />
            </div>
            <button className="btn btn-outline-primary">Update Product</button>
        </form>
    );

    const showError = () => {
        return (<div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>{error}</div>)
    }

    const showSuccess = () => {
        return (<div className='alert alert-info' style={{ display: createdProduct ? '' : 'none' }}>{createdProduct} updated!</div>)
    }

    const showLoading = () => {
        return loading && (<div className='alert alert-info'><h2>Loading...</h2></div>)
    }

    const redirectUser = () => {
        if(redirectToProfile){
            if(!error){
                return <Redirect to={'/'} />
            }
        }
    }
    //load categories and set form data
    const init = (productId) => {
        getProduct(productId).then(
            data => {
                if (data.error) { setValues({ ...values, error: data.error }) }
                else {
                    {
                        setValues({
                            ...values,
                            name: data.name,
                            description: data.description,
                            price: data.price,
                            category: data.category._id,
                            shipping: data.shipping,
                            quantity: data.quantity,
                            formData: new FormData(),
                        });

                        initCategories();
                    }
                }
            }
        )
    }

    const initCategories = () => {
        getCategories().then(
            data => {
                if (data.error) { setValues({ ...values, error: data.error }) }
                else {
                    {
                        setValues({ categories: data, formData: new FormData() });
                        console.log(data);
                    }
                }
            }
        )
    }

    useEffect(() => {
        init(match.params.productId);
    }, []);

    const handleChange = name => (event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value)
        setValues({ ...values, [name]: value })
    }

    const goBack = () => {
        return (<div className="mt-5">
            <Link className="text-warning" to='/admin/dashboard'>
                Back to Dashboard
            </Link>
        </div>)
    }

    return (
        <Layout title='Add new Product'
            description={`Hello there ${user.name}~! ... Lets make a new product!`}
            className=''>
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    {showError()}
                    {showSuccess()}
                    {showLoading()}
                    {newPostForm()}
                    {goBack()}
                    {redirectUser()}
                </div>
            </div>
        </Layout>
    );
}

export default UpdateProduct;