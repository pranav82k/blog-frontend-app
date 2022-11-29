import React, { useEffect } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoriesAction } from '../../redux/slices/categories/categorySlices';

const CategoryDropDown = (props) => {
    // create an instance of dispatch
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCategoriesAction());
    }, [dispatch]);

    // Get the data from store
    const category = useSelector(state => state?.category);
    const { loading, appErr, serverErr, categoryList } = category;

    // Get all the categories and make it to the required format
    const allCategories = categoryList?.map(category => {
        return {
            label: category?.title,
            value: category?._id
        }
    });

    // Handle Change
    const handleChange = (value) => {
        props.onChange("category", value);
    }

    // Handle Blur
    const handleBlur = () => {
        props.onBlur("category", true);
    }

    let defaultValue;
    if(allCategories) {
        defaultValue = allCategories?.find(category => category?.label === props?.value);
    }

    return (
        <div style={{ margin: '1rem 0'}}>
            { loading  ? <h3 className='text-base text-green-600'>Categories Loading..</h3> : (
                    <Select id='category'
                        defaultValue={ defaultValue }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        options={allCategories}
                        value={defaultValue ? defaultValue?.value?.label : props?.value?.label} />
                )
            }

            {/* Dispay the errors */}
            {props?.touched && props?.error && <h3 className='text-red-500 mt-1'>{props?.error}</h3>}
        </div>
    )
}

export default CategoryDropDown