'use client';

import { useEffect, useRef } from 'react';

export function DivinationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Animation variables
    let animationId: number;
    const circles: {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      speed: number;
      opacity: number;
      color: string;
    }[] = [];

    // Subtle gold color scheme
    const colors = [
      'rgba(255, 236, 200, 0.3)',  // Very light gold
      'rgba(255, 228, 180, 0.3)',  // Light gold
      'rgba(255, 218, 160, 0.3)',  // Soft gold
      'rgba(255, 210, 140, 0.3)'   // Warm gold
    ];

    // Create initial circles - fewer and more spread out
    const initCircles = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Create fewer circles (4 instead of 8)
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        circles.push({
          x: centerX,
          y: centerY,
          radius: 0,
          maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.6, // Smaller max radius
          speed: 0.3 + Math.random() * 0.3, // Slower speed
          opacity: 0.05 + Math.random() * 0.1, // More transparent
          color: colors[i % colors.length] // More even color distribution
        });
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(23, 17, 17, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw circles
      circles.forEach((circle, index) => {
        // Update circle
        circle.radius += circle.speed;
        
        // Reset circle when it gets too big
        if (circle.radius > circle.maxRadius) {
          circle.radius = 0;
          circle.opacity = 0.1 + Math.random() * 0.2;
          circle.speed = 0.5 + Math.random() * 0.5;
        }

        // Draw circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.strokeStyle = circle.color.replace('0.3', (circle.opacity * 0.7).toString());
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      animationId = requestAnimationFrame(animate);
    };

    initCircles();
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
