"use client"

import { Button, Card, CardActions, CardContent, CardHeader, TextField } from "@mui/material"
import * as yup from "yup"
import { FormikConfig, useFormik } from "formik"

const signInSchema = yup.object({
  email: yup.string("Enter your email").email("Enter a valid email").required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
})

const Page1 = () => {
  // const { mutate, isPending } = usePostSignIn(); // post요청을 위한 tanstack query 훅
  const formik = useFormik({
    initialValues: {
      // 각 input의 초기값
      userId: "",
      password: "",
    },
    validationSchema: signInSchema, // 유효성 검사
    onSubmit: (value) => {
      alert(JSON.stringify(value, null, 2))
      // submit 함수 (input값들을 객체로 받는다)
      // mutate({
      //     userId: form.userId,
      //     password: form.password,
      // });
    },
  })

  return (
    <div>
      <div>예금계산기</div>
      <Card>
        <form onSubmit={formik.handleSubmit}>
          // submit 함수 바인딩
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: 300,
            }}
          >
            <CardHeader title="Sign In" />
            <Input label="ID" name="userId" formik={formik} />
            <Input label="Password" name="password" formik={formik} type="password" />
            <CardActions>
              {/* <LoadingButton
                            loading={isPending}
                            variant="contained"
                            type="submit"
                            endIcon={<Send />}
                        > */}
              <Button>submit</Button>
              {/* </LoadingButton> */}
            </CardActions>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

export const Input = ({
  label,
  name,
  formik,
  type = "text",
}: {
  label: string
  name: string
  formik: any
  type?: string
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      helperText={formik.touched[name] && formik.errors[name]}
      error={formik.touched[name] && !!formik.errors[name]}
      size="small"
      autoComplete="off"
      type={type}
    />
  )
}

export default Page1
