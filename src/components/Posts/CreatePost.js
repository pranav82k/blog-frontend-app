import Dropzone from 'react-dropzone';
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { createPostAction } from "../../redux/slices/posts/postSlices";
import CategoryDropDown from "../Categories/CategoryDropDown";
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: #00e676;
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

const formSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.object().required("Category is required"),
  image: Yup.string().required("Image is required")
});

export default function CreatePost() {
  // Create an instance of the dispatch function
  const dispatch = useDispatch();

  // Formik
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      image: ''
    },
    onSubmit: (values) => {
      // Dispatch an action to create a new post
      dispatch(createPostAction(values));
    },
    validationSchema: formSchema
  });

  // Get the data from state  
  const post = useSelector(state => state?.post);
  const { loading, appErr, serverErr, postRedirect } = post;

  if(postRedirect) return <Redirect to="/posts" />

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Create Post
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
              value={formik.values.category?.label}
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

                {/* Image Component */}
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mt-3 mb-2"
                >
                  Select Image
                </label>
                <Container className='container mt-2'>
                  <Dropzone
                  // accept="image/png, image/gif image/jpg"
                  onBlur={formik.handleBlur("image")} onDrop={(acceptedFiles) => formik.setFieldValue("image", acceptedFiles[0])}>
                    {
                      ({ getRootProps, getInputProps }) => {
                        return (
                          <div className='container'>
                            <div  { ...getRootProps({
                              className: "dropzone",
                              onDrop: (event) => {
                                event.stopPropagation();
                              }
                            })}>
                              <input { ...getInputProps() } />
                              <p className='text-gray-800 text-md cursor-pointer text-center'>Click here to select image</p>
                            </div>
                          </div>
                        );
                      }
                    }
                  </Dropzone>
                </Container>
                <div className="text-red-500">{ formik.touched.image && formik.errors.image }</div>
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
                  Create
                </button>)}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
