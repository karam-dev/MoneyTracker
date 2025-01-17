import React from 'react'
import AddSvg from '@public/undraw_add.svg'
import { Box, Text } from '@mantine/core'
import dispatch from '@redux/dispatch'

function EmptyLogs() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '3rem',
      }}
    >
      <img src={AddSvg} width="70%" />
      <Text
        // @ts-ignore
        size={'2rem'}
        color="#aaa"
        weight="bold"
      >
        {'There\'s No Data Yet.'}
      </Text>
      <Text color="#bbb">
        <div>
          you can{' '}
          <Text
            sx={{ display: 'inline', cursor: 'pointer' }}
            color={'blue'}
            onClick={() =>
              dispatch('app:navigate', { to: '/addLog', asModal: true })
            }
          >
            add more logs
          </Text>
        </div>
      </Text>
    </Box>
  )
}

export default EmptyLogs
