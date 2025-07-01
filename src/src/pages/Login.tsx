import {
  makeStyles,
  Button,
  Text,
  Card,
  Body1,
  tokens,
} from '@fluentui/react-components'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../config/authConfig'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  loginCard: {
    padding: '32px',
    width: '400px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '16px',
  },
  description: {
    marginBottom: '24px',
    color: tokens.colorNeutralForeground2,
  },
  button: {
    width: '100%',
  },
})

export default function Login() {
  const classes = useStyles()
  const { instance } = useMsal()

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className={classes.container}>
      <Card className={classes.loginCard}>
        <Text size={600} weight="semibold" className={classes.title}>
          Procurement Automation
        </Text>
        <Body1 className={classes.description}>
          Sign in with your Microsoft account to access the procurement system
        </Body1>
        <Button
          appearance="primary"
          size="large"
          className={classes.button}
          onClick={handleLogin}
        >
          Sign In with Microsoft
        </Button>
      </Card>
    </div>
  )
}
