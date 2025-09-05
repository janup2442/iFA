import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const handleSubmit = (values) => {
    // TODO: Integrate with backend
    console.log(values);
  };

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div style={{maxWidth: 400, width: '100%'}}>
        <h2 className="text-center mb-4">Login</h2>
        <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="row g-3">
            <div className="col-12">
              <label className="form-label">Email</label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="col-12">
              <label className="form-label">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </div>
            <div className="col-12 text-center">
              <button type="button" className="btn btn-outline-danger w-100 mt-2">Login with Google</button>
            </div>
          </Form>
        )}
        </Formik>
      </div>
    </div>
  );
}
