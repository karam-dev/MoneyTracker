import {
  Box,
  BoxProps,
  createStyles,
  MantineColor,
  MantineGradient,
  MantineNumberSize,
  Text,
  ThemeIcon,
  ThemeIconProps,
  ThemeIconVariant,
  useMantineTheme,
} from '@mantine/core'
import { IconProps, User } from 'tabler-icons-react'
import * as allTablerIcon from './CategoryAllIcons'
import allColors from './CategoryAllColors'
import { CategoriesState, RootState } from '@redux/types'
import React, { PropsWithChildren } from 'react'
import { useSelector } from 'react-redux'
import dispatch from '@redux/dispatch'
import CategoryAllColors from './CategoryAllColors'
import * as AllIcons from '@components/category/CategoryAllIcons'
import getLogs from '@redux/actions/getData/getLogs'
import getCats from '@redux/actions/getData/getCats'

function _Icon({ icon, props = {} }: { icon?: string; props?: IconProps }) {
  const IconName = icon && icon in allTablerIcon ? icon : 'Category2'
  // @ts-ignore
  const IconComponent = allTablerIcon[IconName]
  return <IconComponent {...props} />
}

const useHov = createStyles<
  'Parent' | 'Child',
  { color?: string; on?: boolean } | null
>((th, props, getRef) => {
  const i = props?.on ? 7 : 1
  const bg =
    (props?.color && th.colors?.[props.color]?.[i]) || th.colors.gray[i]

  return {
    Parent: {
      ref: getRef('Parent'),
      cursor: 'pointer',
      '&:active': { transform: 'translateY(1px)' },
    },
    Child: {
      [`.${getRef('Parent')}:hover &`]: {
        backgroundColor: bg,
      },
    },
  }
})

interface CatInterface {
  title?: string
  color?: string
  icon?: string
}

type _ThemeIconProps = Pick<
  ThemeIconProps,
  'size' | 'radius' | 'color' | 'gradient'
> & { variant?: ThemeIconProps['variant'] | 'subtle' }

interface CategoryIconInterface extends Omit<_ThemeIconProps, 'children'> {
  hideIcon?: boolean
  size?: number
  on?: boolean
  cat?: Omit<CatInterface, 'title'>
}

function CategoryIcon({
  cat = { icon: undefined, color: undefined },
  on,
  hideIcon,
  size: size_ = 48,
  ...props
}: CategoryIconInterface) {
  const color = React.useMemo(
    () =>
      cat?.color && allColors.some((c) => c === cat.color)
        ? cat?.color
        : 'gray',
    [cat?.color]
  )

  const styles = useHov({ color, on })

  return (
    <ThemeIcon
      radius={'xl'}
      size={size_}
      color={color}
      // @ts-ignore
      variant={on ? 'filled' : 'light'}
      {...props}
      className={styles.classes.Child}
    >
      {!hideIcon && <_Icon props={{ size: size_ / 2 }} icon={cat?.icon} />}
    </ThemeIcon>
  )
}

CategoryIcon.Hoverable = function ({
  children,
  ...props
}: PropsWithChildren<BoxProps>) {
  const styles = useHov(null)

  return (
    <Box className={styles.classes.Parent} {...props}>
      {children}
    </Box>
  )
}

CategoryIcon.WithTitle = function ({
  children,
  title,
}: PropsWithChildren<Pick<CatInterface, 'title'>>) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {children}
      <Text sx={{ wordBreak: 'break-word', textAlign: 'center' }}>
        {title || 'Not Categorized'}
      </Text>
    </Box>
  )
}

/**
 *  collections
 */

const collectionAllCategories = getCats

const collectionAllColors = CategoryAllColors

const collectionHexColor = () => {
  const theme = useMantineTheme()
  return (color: string) => {
    const key = Object.keys(theme.colors).some((c) => c === color)
      ? color
      : 'gray'
    return theme.colors[key]
  }
}

const collectionAllIcons = () => {
  return Object.keys(AllIcons).map((key) => {
    // @ts-ignore
    const Icon: React.FC<IconProps> = AllIcons[key]
    return { Icon, key }
  })
}

CategoryIcon.collection = {
  useAllCats: collectionAllCategories,
  useHexColors: collectionHexColor,
  allColors: collectionAllColors,
  allIcons: collectionAllIcons(),
}

export default CategoryIcon
