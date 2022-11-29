import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import { fetchPostDetailsAction, updatePostAction } from "../../redux/slices/posts/postSlices";
import CategoryDropDown from "../Categories/CategoryDropDown";
import { Redirect } from 'react-router-dom';

const formSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  // category: Yup.object().required("Category is required"),
  category: Yup.lazy(value => {
    switch (typeof value) {
      case 'object':
        return Yup.object().required("Category is required"); // schema for object
      case 'string':
        return Yup.string().required("Category is required"); // schema for string
      default:
        return Yup.object().required("Category is required"); // here you can decide what is the default
    }
  }),
});

export default function UpdatePost({ computedMatch: { params: { id }} }) {
  // Create an instance of the dispatch function
  const dispatch = useDispatch();

  // Call the fetch Details
  useEffect(() => {
    dispatch(fetchPostDetailsAction(id));
  }, [dispatch, id]);

  // Fetch the data from store
  const postData = useSelector(state => state?.post);
  const { postDetails } = postData;

  // Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: postDetails?.title,
      description: postDetails?.description,
      category: postDetails?.category,
    },
    onSubmit: (values) => {
      // console.log(values);
      const data = {
        title: values?.title,
        description: values?.description,
        category: typeof(values?.category) === 'object' ? values?.category?.label : values?.category,
        id
      }
      // Dispatch an action to create a new post
      dispatch(updatePostAction(data));
    },
    validationSchema: formSchema
  });

  // Get the data from state  
  const updatedPostData = useSelector(state => state?.post);
  const { loading, appErr, serverErr, postRedirect } = updatedPostData;

  if(postRedirect) return <Redirect to={`/posts/${id}`} />

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Update Post
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            <p className="font-medium text-green-600 hover:text-indigo-500">
              Share your ideas to the word. Your post must be free from
              profanity
            </p>
          </p>

          {/* Error Display */}
          { appErr || serverErr ? <p className='mt-2 text-center text-lg text-red-600'>{ serverErr } {appErr}</p>: null }
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <div className="mt-1">
                  {/* Title */}
                  <input
                    value={formik.values.title}
                    onBlur={formik.handleBlur("title")}
                    onChange={formik.handleChange("title")}
                    id="title"
                    name="title"
                    type="title"
                    autoComplete="title"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                {/* Err msg */}
                <div className="text-red-500">
                  {formik.touched.title && formik.errors.title}
                </div>
              </div>
              {/* Category input goes here */}
              <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
              >
                Select Category
              </label>
              <CategoryDropDown 
              value={formik.values.category?.label ? formik.values.category?.label : formik.values.category}
              onChange={formik.setFieldValue}
              onBlur={formik.setFieldTouched}
              touched={formik.touched.category}
              error={formik.errors.category}
               />
              
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                {/* Description */}
                <textarea
                  value={formik.values.description}
                  onChange={formik.handleChange("description")}
                  onBlur={formik.handleBlur("description")}
                  rows="5"
                  cols="10"
                  className="rounded-lg appearance-none block w-full py-3 px-3 text-base text-center leading-tight text-gray-600 bg-transparent focus:bg-transparent  border border-gray-200 focus:border-gray-500  focus:outline-none"
                  type="text"
                ></textarea>
                {/* Err msg */}
                <div className="text-red-500">{ formik.touched.description && formik.errors.description }</div>
              </div>
              <div>
                {/* Submit btn */}
                { loading ? (<button
                  disabled
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600"
                >
                  Loading...
                </button>) : (<button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update
                </button>)}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
