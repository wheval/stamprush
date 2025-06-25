"use client"

import { useEffect, useState, useRef } from "react"

export default function Confetti({ show, onComplete }) {
  const [particles, setParticles] = useState([])
  const animationStarted = useRef(false)

  useEffect(() => {
    // Only start animation if show is true and we haven't started yet
    if (show && !animationStarted.current) {
      animationStarted.current = true
      
      // Create confetti particles - Much more particles for fuller effect
      const newParticles = Array.from({ length: 200 }, (_, i) => ({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        y: Math.random() * -400 - 100, // Start much higher up for more fullness
        vx: (Math.random() - 0.5) * 20, // Even wider horizontal spread
        vy: Math.random() * 12 + 2, // More varied fall speeds
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15, // Faster rotation
        color: [
          '#FF6F00', '#9C27B0', '#00C9A7', '#FF4081', '#FFD600', 
          '#FF5722', '#E91E63', '#673AB7', '#3F51B5', '#2196F3',
          '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107',
          '#FF9800', '#795548', '#F44336'
        ][Math.floor(Math.random() * 18)], // More color variety
        size: Math.random() * 16 + 8, // Even bigger particles
        gravity: Math.random() * 0.4 + 0.2, // Varied gravity
        life: 1.0,
        decay: Math.random() * 0.008 + 0.004, // Even slower decay for maximum visibility
        shape: Math.random() > 0.5 ? 'circle' : Math.random() > 0.5 ? 'square' : 'triangle'
      }))
      
      setParticles(newParticles)

      // Clean up after animation - longer duration for fuller effect
      const cleanup = setTimeout(() => {
        setParticles([])
        animationStarted.current = false
        onComplete?.()
      }, 8000)

      return () => {
        clearTimeout(cleanup)
      }
    } 
    
    // Reset when show becomes false
    if (!show) {
      setParticles([])
      animationStarted.current = false
    }
  }, [show, onComplete])

  useEffect(() => {
    if (particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev => {
        const updatedParticles = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + particle.gravity,
          rotation: particle.rotation + particle.rotationSpeed,
          life: particle.life - particle.decay
        })).filter(particle => 
          particle.life > 0 && 
          particle.y < (typeof window !== 'undefined' ? window.innerHeight + 200 : 1200)
        )

        // If no particles left, complete the animation
        if (updatedParticles.length === 0 && prev.length > 0) {
          animationStarted.current = false
          setTimeout(() => onComplete?.(), 100)
        }

        return updatedParticles
      })
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [particles.length, onComplete])

  if (!show || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => {
        const getShapeStyle = () => {
          const baseStyle = {
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: particle.life,
          }

          switch (particle.shape) {
            case 'circle':
              return { ...baseStyle, borderRadius: '50%' }
            case 'triangle':
              return {
                ...baseStyle,
                width: 0,
                height: 0,
                backgroundColor: 'transparent',
                borderLeft: `${particle.size/2}px solid transparent`,
                borderRight: `${particle.size/2}px solid transparent`,
                borderBottom: `${particle.size}px solid ${particle.color}`,
              }
            case 'square':
            default:
              return { ...baseStyle, borderRadius: '2px' }
          }
        }

        return (
          <div
            key={particle.id}
            className="absolute"
            style={getShapeStyle()}
          />
        )
      })}
    </div>
  )
} 