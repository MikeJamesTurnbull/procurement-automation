import React, { ReactNode } from 'react'
import {
  makeStyles,
  Button,
  Text,
  tokens,
  Divider,
} from '@fluentui/react-components'
import {
  Navigation24Regular,
  Person24Regular,
  SignOut24Regular,
} from '@fluentui/react-icons'
import { useMsal } from '@azure/msal-react'
import { useNavigate, useLocation } from 'react-router-dom'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  navigation: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  main: {
    flex: 1,
    padding: '24px',
    overflow: 'auto',
  },
})

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const classes = useStyles()
  const { instance, accounts } = useMsal()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    instance.logoutPopup()
  }

  const currentUser = accounts[0]

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <div className={classes.navigation}>
          <Navigation24Regular />
          <Text size={500} weight="semibold">
            Procurement Automation
          </Text>
          <Divider vertical />
          <Button
            appearance={location.pathname === '/' ? 'primary' : 'subtle'}
            onClick={() => navigate('/')}
          >
            Dashboard
          </Button>
          <Button
            appearance={location.pathname === '/requests/new' ? 'primary' : 'subtle'}
            onClick={() => navigate('/requests/new')}
          >
            New Request
          </Button>
          <Button
            appearance={location.pathname === '/admin' ? 'primary' : 'subtle'}
            onClick={() => navigate('/admin')}
          >
            Admin
          </Button>
        </div>
        
        <div className={classes.userSection}>
          <Person24Regular />
          <Text>{currentUser?.name || 'User'}</Text>
          <Button
            appearance="subtle"
            icon={<SignOut24Regular />}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      </header>
      
      <main className={classes.main}>
        {children}
      </main>
    </div>
  )
}
