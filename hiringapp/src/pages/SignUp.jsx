import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
  dob: Yup.date().required("Date of Birth is required"),
  gender: Yup.string().required("Gender is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function SignUp() {
  const handleSubmit = (values) => {
    // TODO: Integrate with backend
    console.log(values);
  };

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div style={{maxWidth: 500, width: '100%'}}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <Formik
        initialValues={{ name: "", email: "", phone: "", dob: "", gender: "", password: "" }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <Field name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <Field name="phone" className="form-control" />
              <ErrorMessage name="phone" component="div" className="text-danger" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
              <Field name="dob" type="date" className="form-control" />
              <ErrorMessage name="dob" component="div" className="text-danger" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <Field as="select" name="gender" className="form-select">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Field>
              <ErrorMessage name="gender" component="div" className="text-danger" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">Sign Up</button>
            </div>
            <div className="col-12 text-center">
              <button type="button" className="btn btn-outline-danger w-100 mt-2">Sign Up with Google</button>
            </div>
          </Form>
        )}
        </Formik>
      </div>
    </div>
  );
}
