import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] bg-[var(--bg-elev)] px-2.5 py-0.5 font-mono text-xs text-[var(--fg-muted)]',
  {
    variants: {
      variant: {
        default: '',
        accent: 'border-[var(--line-strong)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

function BadgeDot({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn('size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_0_3px_var(--accent-soft)]', className)}
      aria-hidden
      {...props}
    />
  )
}

export { Badge, BadgeDot, badgeVariants }
