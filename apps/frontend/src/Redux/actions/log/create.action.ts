import { apiLogCreate, LogDoc } from 'src/types/log'
import HttpError from 'src/utils/HttpError'
import { actionModule } from '../../dispatch'
import { dispatchFnToTuple as __d } from '@redux/dispatch'

const type = 'log:create'

export type ActionType = {
  type: typeof type
  return: LogDoc

  payload: {
    doc: apiLogCreate
  }
}

const action: actionModule<ActionType> = async function (
  { doc },
  { dispatch, state },
  { pushNoti, online, offline }
) {
  offline()

  const log = await online((helpers) =>
    fetch(import.meta.env.VITE_BACKEND_API + '/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + helpers.token(),
      },
      body: JSON.stringify(doc),
    })
  )

  pushNoti({
    message: doc.title + ' was added',
    reactions: [
      {
        display: 'delete',
        dispatch: __d((d) => d('log:delete', { id: log._id })),
        style: { color: 'red' },
      },
      {
        display: 'edit',
        dispatch: __d((d) =>
          d('app:navigate', { to: '/editLog/' + log._id, asModal: true })
        ),
      },
    ],
  })

  dispatch({ type: 'LOG_ADD_ONE', pl: { log } })

  return log
}

action.type = type
export default action
