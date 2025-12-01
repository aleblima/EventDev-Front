import AppsIcon from '@mui/icons-material/Apps'
import EventIcon from '@mui/icons-material/Event'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

const ACTIVE_BG_COLOR = '#FC692D !important'

export default function ViewToggle({ view, setView }) {
  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={(_, val) => {
        if (val) {
          setView(val)
        }
      }}
      sx={{
        width: { xs: '100%', sm: 'auto' },
        alignSelf: { xs: 'stretch', sm: 'auto' },
        border: '1px solid #E2E7F0',
        borderRadius: '12px'
      }}>
      <ToggleButton
        value="grid"
        selected={view === 'grid'}
        sx={{
          'flex': 1,
          'backgroundColor': view === 'grid' ? ACTIVE_BG_COLOR : '#ffffff',
          'border': 'none',
          'borderRadius': '10px',
          'minWidth': 44,
          'height': 44,
          '&:hover': {
            backgroundColor: view === 'grid' ? ACTIVE_BG_COLOR : '#f9fafb'
          }
        }}>
        <AppsIcon sx={{ color: view === 'grid' ? '#ffffff' : '#64748B' }} />
      </ToggleButton>

      <ToggleButton
        value="calendar"
        selected={view === 'calendar'}
        sx={{
          'flex': 1,
          'backgroundColor': view === 'calendar' ? ACTIVE_BG_COLOR : '#ffffff',
          'border': 'none',
          'borderRadius': '10px',
          'minWidth': 44,
          'height': 44,
          '&:hover': {
            backgroundColor: view === 'calendar' ? ACTIVE_BG_COLOR : '#f9fafb'
          }
        }}>
        <EventIcon sx={{ color: view === 'calendar' ? '#ffffff' : '#64748B' }} />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
