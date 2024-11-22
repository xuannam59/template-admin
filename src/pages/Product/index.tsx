import { Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const ProductPage = () => {
    return (
        <Link to="/products/create" type='primary'>Create Product</Link>
    )
}

export default ProductPage