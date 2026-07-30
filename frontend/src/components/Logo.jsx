import { TrendingUp } from 'lucide-react' // swap for Target, MessagesSquare, Rocket, or Sparkles

export default function Logo({ size = 32 }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl shadow-sm shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
      }}
    >
      <TrendingUp size={size * 0.58} strokeWidth={2.25} color="white" />
    </span>
  )
}