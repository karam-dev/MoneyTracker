import { Stack } from '@mantine/core'
import { Form, Formik, FormikHelpers } from 'formik'
import { ObjectSchema as yupObj, string as yupStr } from 'yup'
import SubmitButton from '@components/Formik/SubmitButton'
import AlertStatus from '@components/Formik/AlertStatus'
import { useNavigate } from 'react-router-dom'
import profile_update, { ProfileUpdateArgs } from '@redux/api/profile_update'
import MyUserInput from '@components/Formik/IUser'
import profile_password, {
  ProfilePasswordArgs,
} from '@redux/api/profile_password'
import MyPasswordInput from '@components/Formik/IPassword'

interface Values extends ProfilePasswordArgs {}

function Profile_changePassword() {
  const nav = useNavigate()

  return (
    <Formik
      initialValues={{
        oldPassword: '',
        newPassword: '',
      }}
      v
      onSubmit={(
        values: Values,
        { setSubmitting, setErrors, setStatus }: FormikHelpers<Values>
      ) => {
        profile_password(values)
          .then(() => {
            nav(-1)
          })
          .catch((e) => {
            console.error(e)
            e.errors && setErrors(e.errors)
            setStatus({ error: e.message })
          })
          .finally(() => {
            setSubmitting(false)
          })
      }}
      validationSchema={
        new yupObj({
          oldPassword: yupStr().required(),
          newPassword: yupStr().required(),
        })
      }
    >
      <Form>
        <Stack>
          <AlertStatus />

          <MyPasswordInput
            formikName="oldPassword"
            placeholder="Enter Old Password"
            label="Old Password"
          />
          <MyPasswordInput formikName="newPassword" label="New Password" />

          <SubmitButton>Change Password</SubmitButton>
        </Stack>
      </Form>
    </Formik>
  )
}

export default Profile_changePassword