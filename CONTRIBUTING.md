# Contributing to Flow

Thank you for your interest in contributing to Flow! We welcome contributions from the community and are excited to see what you'll build.

## 🚀 Quick Start

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Set up** environment variables (see README.md)
5. **Create** a feature branch: `git checkout -b feature/your-feature-name`
6. **Make** your changes
7. **Test** your changes: `npm run dev`
8. **Submit** a pull request

## 🎯 Ways to Contribute

### 🐛 Bug Reports
- Use the GitHub issue template
- Include steps to reproduce
- Provide system information
- Add screenshots if applicable

### 💡 Feature Requests
- Check existing issues first
- Describe the problem you're solving
- Explain your proposed solution
- Consider implementation complexity

### 🔧 Code Contributions
- Bug fixes
- New features
- Performance improvements
- Documentation updates
- Test coverage improvements

### 📖 Documentation
- README improvements
- Code comments
- API documentation
- Tutorial content
- Example projects

## 🛠 Development Setup

### Prerequisites
- Node.js 18+
- npm, pnpm, or yarn
- Google Gemini API key
- Git

### Local Development
```bash
# Clone your fork
git clone https://github.com/obhox/flow.git
cd flow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

### Project Structure
```
flow/
├── app/                 # Next.js App Router
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── *.tsx           # Feature components
├── lib/                # Utilities and services
│   ├── ai/             # AI integration
│   ├── constants.ts    # App constants
│   ├── types.ts        # TypeScript types
│   └── utils.ts        # Utility functions
├── hooks/              # Custom React hooks
└── public/             # Static assets
```

## 📝 Code Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use strict mode settings

### React Components
- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries
- Use proper key props for lists

### Styling
- Use Tailwind CSS classes
- Follow existing design patterns
- Ensure responsive design
- Test in multiple browsers

### AI Integration
- Follow existing patterns in `lib/ai/gemini.ts`
- Handle API errors gracefully
- Implement proper loading states
- Add appropriate user feedback

### Code Style
```typescript
// Good: Descriptive names and proper typing
interface ComponentProps {
  title: string;
  isVisible: boolean;
  onClose: () => void;
}

const MyComponent: React.FC<ComponentProps> = ({ title, isVisible, onClose }) => {
  // Component logic here
};

// Good: Proper error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('API call failed:', error);
  throw new Error('Failed to fetch data');
}
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Write tests for new features
- Test edge cases and error conditions
- Use descriptive test names
- Mock external dependencies

### Manual Testing
- Test in multiple browsers
- Verify responsive design
- Test AI features with various inputs
- Check accessibility features

## 📋 Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Changes are tested manually
- [ ] Commit messages are clear

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing done

## Screenshots
(If applicable)

## Additional Notes
Any additional context or notes
```

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in staging environment
4. **Approval** from core team
5. **Merge** to main branch

## 🎨 Design Guidelines

### UI/UX Principles
- **Simplicity**: Keep interfaces clean and intuitive
- **Consistency**: Follow established patterns
- **Accessibility**: Ensure WCAG compliance
- **Performance**: Optimize for speed and responsiveness

### Component Design
- Use Radix UI primitives when possible
- Follow existing color schemes
- Implement proper loading states
- Add appropriate animations

### AI Interface Design
- Provide clear feedback for AI operations
- Handle loading and error states gracefully
- Make AI suggestions actionable
- Ensure AI responses are user-friendly

## 🚨 Issue Guidelines

### Bug Reports
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
```

### Feature Requests
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

## 🏷 Commit Guidelines

### Commit Message Format
```
type(scope): subject

body

footer
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

### Examples
```bash
feat(ai): add design generation from natural language
fix(canvas): resolve node positioning issue
docs(readme): update installation instructions
style(components): improve button hover states
```

## 🤝 Community Guidelines

### Be Respectful
- Use welcoming and inclusive language
- Respect differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Be Collaborative
- Help others learn and grow
- Share knowledge and resources
- Provide constructive feedback
- Celebrate others' contributions

### Be Professional
- Keep discussions on-topic
- Avoid personal attacks
- Use appropriate language
- Maintain professional standards

## 📞 Getting Help

### Resources
- 📖 **Documentation**: Check the README and docs
- 🐛 **Issues**: Search existing GitHub issues
- 💬 **Discussions**: Use GitHub Discussions for questions
- 📧 **Email**: Contact maintainers directly

### Response Times
- **Bug reports**: 1-3 business days
- **Feature requests**: 1-7 business days
- **Pull requests**: 2-5 business days
- **General questions**: 1-3 business days

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs
- Special mentions in project updates

Thank you for contributing to Flow! 🚀