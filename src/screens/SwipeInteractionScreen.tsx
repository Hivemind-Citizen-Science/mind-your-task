import React from 'react'
import { SwipeInteraction } from '../components/SwipeInteraction/SwipeInteraction'

export const SwipeInteractionScreen: React.FC = () => {
  const handleSwipeComplete = (result: any) => {
    console.log('Swipe completed:', result)
  }

  return (
    <SwipeInteraction
      onSwipeComplete={handleSwipeComplete}
      leftLabel="LEFT"
      rightLabel="RIGHT"
    />
  )
}
