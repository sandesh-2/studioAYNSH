# Contributing Guidelines

## Welcome!

Thank you for your interest in contributing to Studio AYNSH. This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow
- Report inappropriate behavior

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- Git
- GitHub account

### Development Setup

```bash
# Clone repository
git clone https://github.com/sandesh-2/studioAYNSH.git
cd studioAYNSH

# Install dependencies
pnpm install

# Create .env.local for development
cp .env.example .env.local

# Update DATABASE_URL and BETTER_AUTH_SECRET in .env.local

# Run database migrations
pnpm run db:push

# Start development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Development Workflow

### 1. Create a Feature Branch

```bash
# Create branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Use descriptive names:
# feature/add-dark-mode
# fix/booking-status-bug
# docs/update-api-docs
# refactor/simplify-auth
```

### 2. Make Changes

```bash
# Make your changes to the codebase
# Test locally
# Commit with clear messages

git add .
git commit -m "feat: add dark mode support

- Add theme toggle component
- Update CSS variables
- Add preference persistence"
```

### 3. Keep Branch Updated

```bash
# Fetch latest changes
git fetch origin

# Rebase on latest main
git rebase origin/main

# Or merge if you prefer
git merge origin/main
```

### 4. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR on GitHub with:
# - Clear title
# - Description of changes
# - Related issue numbers
# - Screenshots if UI changes
```

### 5. Code Review

- Address feedback from reviewers
- Push additional commits for changes
- Mark conversations as resolved
- Re-request review when complete

### 6. Merge

- Ensure all tests pass
- Rebase before merging (keep history clean)
- Delete feature branch after merge

## Code Standards

### TypeScript

```typescript
// ✓ GOOD: Types exported, clear names, proper typing
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

interface Booking {
  id: string
  userId: string
  status: BookingStatus
  createdAt: Date
}

export async function getBooking(id: string): Promise<Booking | null> {
  // implementation
}

// ✗ BAD: Missing types, unclear names
const getBooking = (id) => {
  // implementation
}
```

### React Components

```typescript
// ✓ GOOD: Proper component structure
import { FC } from 'react'

interface BookingCardProps {
  booking: Booking
  onSelect: (id: string) => void
}

export const BookingCard: FC<BookingCardProps> = ({ booking, onSelect }) => {
  return (
    <button onClick={() => onSelect(booking.id)}>
      {booking.id}
    </button>
  )
}

// ✗ BAD: No TypeScript, inconsistent naming
const BookingCard = (props) => {
  return <button onClick={() => props.onSelect(props.booking.id)} />
}
```

### File Organization

```
✓ GOOD: Clear, modular structure
components/
├── admin/
│   ├── admin-dashboard.tsx
│   ├── booking-card.tsx
│   └── stats-grid.tsx
├── common/
│   ├── button.tsx
│   └── dialog.tsx

✗ BAD: Vague naming, mixed concerns
components/
├── Component.tsx
├── MyComponent.tsx
├── utils.tsx
```

### Naming Conventions

- **Files:** kebab-case (`user-profile.tsx`, `auth-service.ts`)
- **Components:** PascalCase (`UserProfile`, `AuthService`)
- **Functions:** camelCase (`getUserProfile`, `validateEmail`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)
- **Boolean functions:** startWithIs/has (`isValidEmail`, `hasPermission`)

### CSS & Tailwind

```typescript
// ✓ GOOD: Semantic classes, responsive modifiers
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">

// ✗ BAD: Arbitrary values, no responsive design
<div className="grid grid-cols-1 gap-[24px] p-[24px]">
```

## Commit Message Format

Use clear, descriptive commit messages following Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance

### Examples

```bash
# Good commits
git commit -m "feat(booking): add email confirmation

- Send confirmation email on booking creation
- Add email template
- Handle retry logic"

git commit -m "fix(auth): resolve session expiration bug"

git commit -m "docs: update API documentation"

git commit -m "refactor(utils): simplify date formatting"
```

## Testing

### Run Tests

```bash
# Run all tests
pnpm run test

# Run specific test file
pnpm run test -- user.test.ts

# Watch mode
pnpm run test:watch

# Coverage report
pnpm run test:coverage
```

### Writing Tests

```typescript
// ✓ GOOD: Clear test cases, proper assertions
describe('validateEmail', () => {
  it('returns true for valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  it('returns false for invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false)
  })

  it('handles edge cases', () => {
    expect(validateEmail('')).toBe(false)
    expect(validateEmail(' ')).toBe(false)
  })
})

// ✗ BAD: Vague test cases, poor assertions
describe('email', () => {
  it('works', () => {
    expect(validateEmail('test')).toBeTruthy()
  })
})
```

## Linting & Formatting

```bash
# Run ESLint
pnpm run lint

# Fix linting errors
pnpm run lint --fix

# Format with Prettier
pnpm run format
```

## Type Checking

```bash
# Check TypeScript
pnpm run type-check

# Build to verify
pnpm run build
```

## Creating Issues

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Go to...
2. Click...
3. Observe...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Version: 1.0.0
```

### Feature Request Template

```markdown
## Description
Clear description of the feature

## Motivation
Why this feature is needed

## Proposed Solution
How you would implement it

## Alternatives Considered
Other possible approaches
```

## Pull Request Template

```markdown
## Description
Brief summary of changes

## Related Issues
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Changes Made
- Detailed list of changes
- With explanations if complex

## Testing
- How to test the changes
- Any new test cases

## Screenshots (if applicable)
Before/after screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] TypeScript compiles without errors
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors/warnings
```

## Code Review Checklist

Reviewers should check:

- [ ] Code follows project standards
- [ ] No security vulnerabilities
- [ ] Performance acceptable
- [ ] TypeScript types correct
- [ ] Tests adequate
- [ ] Documentation updated
- [ ] Commit messages clear
- [ ] No merge conflicts

## Common Issues & Solutions

### TypeScript Errors

```bash
# Clear cache and rebuild
pnpm run clean
pnpm run build

# Check types only
pnpm run type-check
```

### Database Issues

```bash
# Reset database (development only)
pnpm run db:reset

# Migrate schema
pnpm run db:push

# Generate migration
pnpm run db:generate
```

### Build Failures

```bash
# Clear node_modules and reinstall
pnpm install --force

# Clear build cache
rm -rf .next

# Rebuild
pnpm run build
```

## Performance Guidelines

- Minimize bundle size
- Avoid N+1 queries
- Use pagination for large datasets
- Optimize images
- Implement proper caching
- Use React.memo for expensive components
- Profile with Lighthouse

## Security Guidelines

- Never commit secrets
- Use environment variables for sensitive data
- Validate all user inputs
- Use parameterized queries
- Escape user-generated content
- Keep dependencies updated
- Report security issues privately

## Documentation

When adding features, update:

- [ ] README.md (if major feature)
- [ ] API_DOCUMENTATION.md (if new endpoints)
- [ ] ARCHITECTURE.md (if structural changes)
- [ ] Code comments (for complex logic)
- [ ] Type definitions (for new types)

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Questions?

- Check existing issues/discussions
- Read documentation files
- Ask in PR comments
- Contact maintainers

---

**Last Updated:** December 2024  
**Version:** 1.0.0  

Thank you for contributing to Studio AYNSH!
