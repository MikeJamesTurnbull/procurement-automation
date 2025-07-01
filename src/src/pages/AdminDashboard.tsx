import { Text, Card } from '@fluentui/react-components'

export default function AdminDashboard() {
  return (
    <div>
      <Text size={800} weight="semibold" style={{ marginBottom: '24px', display: 'block' }}>
        Admin Dashboard
      </Text>
      <Card style={{ padding: '24px' }}>
        <Text>Admin features will be implemented in Phase 3</Text>
      </Card>
    </div>
  )
}
