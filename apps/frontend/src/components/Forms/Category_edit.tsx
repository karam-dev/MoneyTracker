import { useMemo } from 'react'
import { Group, Stack } from '@mantine/core'
import { Form, Formik, FormikHelpers } from 'formik'
import { ObjectSchema as yupObj, string as yupStr } from 'yup'
import SubmitButton from '@components/Formik/SubmitButton'
import AlertStatus from '@components/Formik/AlertStatus'
import { useRoutes } from '@components/ReactRoute/index'

import MySimpleInput from '@components/Formik/ISimple'
import MyColorInput from '@components/Formik/IColor'
import MyIconInput from '@components/Formik/IIcon'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CategoriesState, LogsState, RootState } from '@redux/types'
import dispatch from '@redux/dispatch'
import { CatDoc } from 'src/types/category'
import HttpError from 'src/utils/HttpError'

type args = Omit<CatDoc, 'createdBy' | '__v' | '_id'> & {
  category?: string
}
type Values = args

function AddCategory() {
  const { id } = useParams()
  const cats = useSelector<RootState, CategoriesState>((s) => s.categories)
  const cat = useMemo(
    () => cats.find((cat) => cat._id === id) || ({} as CatDoc),
    [cats]
  )
  if (!cat._id) return <div>Server Error</div>

  const goBack = useRoutes()

  return (
    <Formik
      initialValues={{
        title: cat.title,
        color: cat.color,
        icon: cat.icon,
      }}
      // @ts-ignore
      onSubmit={(
        values: Values,
        { setSubmitting, setErrors, setStatus }: FormikHelpers<Values>
      ) => {
        dispatch('category:update', { doc: values, id: cat._id })
          .then(() => {
            goBack()
          })
          .catch((e) => {
            console.error(e)
            if (e instanceof HttpError && e.isHttpError) {
              e.info.details?.errors && setErrors(e.info.details?.errors)
            }
            setStatus({ error: e.message })
          })
          .finally(() => {
            setSubmitting(false)
          })
      }}
      validationSchema={
        new yupObj({
          title: yupStr().required(),
          color: yupStr(),
          icon: yupStr(),
        })
      }
    >
      <Form>
        <Stack>
          <AlertStatus />

          <MySimpleInput
            required
            label="Title"
            placeholder="Enter a the Category Title"
            formikName="title"
          />

          <MyColorInput label="Colors" formikName="color" />

          <MyIconInput label="Icon" formikName="icon" />

          <Group sx={{ justifyContent: 'end' }}>
            <SubmitButton>Edit Category</SubmitButton>
          </Group>
        </Stack>
      </Form>
    </Formik>
  )
}

export default AddCategory
