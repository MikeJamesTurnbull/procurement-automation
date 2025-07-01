import {
  makeStyles,
  Text,
  Card,
  Button,
  Badge,
  tokens,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@fluentui/react-components'
import { Add24Regular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  statCard: {
    padding: '16px',
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontSize: '32px',
    fontWeight: 'bold',
    color: tokens.colorBrandForeground1,
  },
  requestsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
})

// Mock data for demonstration
const mockRequests = [
  {
    id: '1',
    title: 'New Development Laptops',
    amount: '$12,500.00',
    status: 'Pending Approval',
    createdDate: '2025-07-01',
  },
  {
    id: '2',
    title: 'Office Printer Paper',
    amount: '$150.00',
    status: 'Approved',
    createdDate: '2025-06-30',
  },
  {
    id: '3',
    title: 'Software Licenses',
    amount: '$2,400.00',
    status: 'Draft',
    createdDate: '2025-06-29',
  },
]

export default function Dashboard() {
  const classes = useStyles()
  const navigate = useNavigate()

  const getStatusBadge = (status: string) => {
    const appearance = 
      status === 'Approved' ? 'outline' :
      status === 'Pending Approval' ? 'filled' :
      'ghost'
    
    return <Badge appearance={appearance}>{status}</Badge>
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text size={800} weight="semibold">
          Dashboard
        </Text>
        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={() => navigate('/requests/new')}
        >
          New Request
        </Button>
      </div>

      <div className={classes.statsCards}>
        <Card className={classes.statCard}>
          <Text className={classes.statNumber}>5</Text>
          <Text>Total Requests</Text>
        </Card>
        <Card className={classes.statCard}>
          <Text className={classes.statNumber}>2</Text>
          <Text>Pending Approval</Text>
        </Card>
        <Card className={classes.statCard}>
          <Text className={classes.statNumber}>2</Text>
          <Text>Approved</Text>
        </Card>
        <Card className={classes.statCard}>
          <Text className={classes.statNumber}>$15,050</Text>
          <Text>Total Value</Text>
        </Card>
      </div>

      <div className={classes.requestsSection}>
        <Text size={600} weight="semibold">
          Recent Requests
        </Text>
        <Card>
          <div style={{ padding: '16px' }}>
            {mockRequests.map((request) => (
              <Card key={request.id} style={{ marginBottom: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text weight="semibold">{request.title}</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text size={200}>{request.amount} • {request.createdDate}</Text>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {getStatusBadge(request.status)}
                    <Button
                      size="small"
                      onClick={() => navigate(`/requests/${request.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
