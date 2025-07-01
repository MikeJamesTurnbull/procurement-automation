import { Text, Card } from '@fluentui/react-components'
import { useParams } from 'react-router-dom'

export default function RequestDetails() {
  const { id } = useParams()

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Text size={800} weight="semibold" style={{ marginBottom: '24px', display: 'block' }}>
        Request Details - ID: {id}
      </Text>
      <Card style={{ padding: '24px' }}>
        <Text>Request details will be implemented in Phase 2</Text>
      </Card>
    </div>
  )
}
