import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createCommentAction } from "../../redux/slices/comments/commentSlices";

//Form schema
const formSchema = Yup.object({
  description: Yup.string().required("Description is required")
});

const AddComment = ({ postId }) => {
  // dispatch
  const dispatch = useDispatch();

  //formik
  const formik = useFormik({
    initialValues: {
      description: ''
    },
    onSubmit: (values) => {
      const data = {
        description: values?.description,
        postId
      };

      dispatch(createCommentAction(data));
    },
    validationSchema: formSchema
  });

  // Get the comment Data from state
  const comment = useSelector(state => state?.comment);
  const { loading, appErr, serverErr } = comment;

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Error Display */}
      { serverErr || appErr ? <h2 className="text-red-400 pb-2">{serverErr} {appErr}</h2> : null }
      <form
        onSubmit={formik.handleSubmit}
        className="mt-1 flex max-w-sm m-auto"
      >
        <input
          onBlur={formik.handleBlur("description")}
          value={formik.values.description}
          onChange={formik.handleChange("description")}
          type="text"
          name="text"
          id="text"
          className="shadow-sm focus:ring-indigo-500  mr-2 focus:border-indigo-500 block w-full p-2 border-1 sm:text-sm border-gray-300 rounded-md"
          placeholder="Add New comment"
        />

        { loading ? (
          <button
          disabled
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-gray-600"
        >
          Loading...
        </button>
        ) : (
          <button
          type="submit"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
        )}
      </form>
      <div className="text-red-400 mb-2 mt-2">
        {formik.touched.description && formik.errors.description}
      </div>
    </div>
  );
};

export default AddComment;
