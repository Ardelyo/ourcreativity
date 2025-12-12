# 👥 Maintainers

This document defines the structure, responsibilities, and decision-making processes for maintaining OurCreativity.

---

## 📋 Current Maintainers

### Project Lead & Founder

**Ardelyo** ([@Ardelyo](https://github.com/Ardelyo))

- **Role:** Project Lead, Lead Developer & Designer
- **Responsibilities:**
  - Project vision and strategic direction
  - Architecture and technical decisions
  - Design system and visual language
  - Release management
  - Community leadership
- **Contact:** GitHub Issues, GitHub Discussions
- **Decision Authority:** Final decision on major features, breaking changes, and design

### Documentation & Quality

**DoctorThink**

- **Role:** Documentation Specialist & Code Quality Lead
- **Responsibilities:**
  - Documentation accuracy and completeness
  - Code quality standards and best practices
  - Refactoring guidance and code reviews
  - Development experience improvements
- **Contact:** GitHub Issues with `[DOCS]` tag
- **Decision Authority:** Documentation standards, code style guidelines

---

## 🎯 Responsibility Areas

| Area | Owner(s) | Contact |
|------|----------|---------|
| **Architecture & Design** | Ardelyo | GitHub Issues |
| **Documentation** | DoctorThink | GitHub Issues `[DOCS]` |
| **UI/UX Design System** | Ardelyo | GitHub Issues, Discussions |
| **Code Quality** | DoctorThink | Pull Request Reviews |
| **Release Management** | Ardelyo | GitHub Releases |
| **Community Management** | Ardelyo | GitHub Discussions |
| **Security Issues** | Ardelyo | security@github (See SECURITY.md) |

---

## 📊 Decision Making Framework

### Decision Levels

#### 🟢 Low Impact (No Review Needed)

- Bug fixes
- Documentation updates
- Code comments and minor refactoring
- Dependency patch updates

**Process:** Open PR, merge after CI passes

#### 🟡 Medium Impact (Single Maintainer Review)

- New features (non-breaking)
- UI improvements
- Minor dependency updates
- Performance optimizations
- New documentation

**Process:** Open PR, wait for 1 maintainer approval

#### 🔴 High Impact (Consensus Required)

- Breaking changes
- Major architectural decisions
- New platform pillars
- Large design system changes
- Major version releases
- Public API modifications

**Process:** Open RFC issue, discuss in thread, achieve consensus before implementation

### RFC (Request for Comments) Process

For high-impact changes, follow this process:

1. **Create RFC Issue**
   - Title: `RFC: [Feature/Change Name]`
   - Include: Problem, proposed solution, alternatives, impact analysis
   - Label: `rfc`

2. **Discussion Period**
   - Minimum 3-5 days for community feedback
   - All maintainers must review
   - Issues and concerns addressed

3. **Consensus**
   - No major objections from maintainers
   - Community feedback considered
   - Final decision by Project Lead

4. **Implementation**
   - Create feature branch
   - Follow decision from RFC
   - Reference RFC in commits/PRs

---

## 🔄 Maintenance Cycles

### Weekly

- Review and respond to issues
- Merge non-blocking PRs
- Monitor Lighthouse scores
- Check error tracking

### Bi-Weekly

- Code review sessions
- Community discussion highlights
- Documentation review
- Technical debt assessment

### Monthly

- Release planning
- Roadmap review and adjustment
- Contributor recognition
- Major issue retrospectives

### Quarterly

- Comprehensive roadmap update
- Architecture review
- Performance audit
- Community survey

---

## 📝 Contribution Review Standards

All contributions are reviewed based on:

### Code Quality
- ✅ Follows TypeScript/React best practices
- ✅ No `any` types without justification
- ✅ Proper error handling
- ✅ Meaningful variable/function names
- ✅ No console.log or debug code left behind

### Testing
- ✅ Code works locally
- ✅ No regression in existing features
- ✅ Edge cases considered
- ✅ Responsive design tested (mobile, tablet, desktop)

### Documentation
- ✅ README or docs updated if needed
- ✅ Code comments for complex logic
- ✅ Commit messages follow conventions
- ✅ CHANGELOG updated for features/fixes

### Performance
- ✅ No unnecessary re-renders
- ✅ Images optimized
- ✅ Bundle size impact acceptable
- ✅ Network requests optimized

### Accessibility
- ✅ WCAG 2.1 Level AA compliant
- ✅ Keyboard navigable
- ✅ Screen reader tested
- ✅ Color contrast sufficient
- ✅ Alt text for images

---

## 🚀 Release Management

### Release Types

| Type | Version | Changes | Frequency |
|------|---------|---------|-----------|
| **Major** | X.0.0 | Breaking changes, new pillars | ~6 months |
| **Minor** | 0.X.0 | New features, additions | ~3 months |
| **Patch** | 0.0.X | Bug fixes, docs | As needed |

### Release Process

1. **Planning** — Decide what to include in release
2. **Feature Freeze** — Only bug fixes accepted
3. **Release Branch** — Create `release/vX.Y.Z` branch
4. **Changelog Update** — Update CHANGELOG.md with all changes
5. **Version Bump** — Update version in package.json
6. **Testing** — Comprehensive testing on release branch
7. **Tag & Release** — Create GitHub release with tag
8. **Announcement** — Post release notes to community

---

## 💬 Communication Channels

### For General Inquiries

📧 **GitHub Issues**
- Feature requests: Use `feature-request` label
- Bug reports: Use `bug` label
- Questions: Use `question` label

### For Discussions

💬 **GitHub Discussions**
- Architecture proposals
- Best practices
- General questions
- Community features

### For Urgent/Security Issues

🔒 **Security Policy** (See [SECURITY.md](./SECURITY.md))
- Report security vulnerabilities privately
- Do NOT open public issues for security vulnerabilities

### For Direct Contact

- **Ardelyo:** GitHub @Ardelyo, GitHub Issues/Discussions
- **DoctorThink:** GitHub Issues with `[DOCS]` tag

---

## 👥 Becoming a Maintainer

### Criteria

To be considered for maintainer status:

- **Consistent Contributions** — 20+ merged PRs or equivalent
- **Code Quality** — High-quality, well-reviewed contributions
- **Community Participation** — Active in issues and discussions
- **Maintainer Alignment** — Shares project vision and values
- **Commitment** — Willing to commit 5+ hours/week
- **Communication** — Professional, respectful, collaborative

### Process

1. Contribute consistently (3+ months minimum)
2. Demonstrate understanding of codebase
3. Show reliability and good judgment
4. Current maintainers identify potential candidates
5. Private discussion and consensus
6. Offer and onboarding
7. Public announcement

### Responsibilities

Maintainers agree to:
- Review and respond to PRs promptly
- Attend regular sync meetings
- Participate in major decisions
- Help mentor new contributors
- Maintain code quality standards
- Represent project professionally

### Stepping Down

Maintainers can step down at any time by:
- Notifying project lead
- Documenting transition plan
- Transferring responsibilities
- Remaining as honored contributor

---

## 📊 Governance Model

### Decision Authority

```
PROJECT LEAD (Ardelyo)
    ├─ Major Decisions
    ├─ Releases & Versioning
    └─ Community Leadership

CORE TEAM
    ├─ Feature Implementation
    ├─ Code Reviews
    ├─ Architecture Input
    └─ Quality Standards

COMMUNITY
    ├─ Feature Requests
    ├─ Bug Reports
    ├─ Discussions
    └─ Contributions
```

### Conflict Resolution

1. **Discussion** — Respectful discussion in issue
2. **Escalation** — Involve relevant maintainers
3. **RFC** (if needed) — Formal decision process
4. **Final Decision** — Project Lead decides if no consensus
5. **Documentation** — Decision reasoning documented

---

## 🎓 Onboarding New Maintainers

### Learning Path

1. **Codebase Familiarization**
   - Review [ARSITEKTUR.md](docs/ARSITEKTUR.md)
   - Read [KOMPONEN.md](docs/KOMPONEN.md)
   - Understand current architecture decisions

2. **Review Process**
   - Observe 5+ PR reviews
   - Review simple PRs first
   - Get feedback on reviews
   - Graduate to complex reviews

3. **Responsibilities**
   - Take ownership of specific area
   - Review related PRs
   - Participate in discussions
   - Mentor contributors

4. **Decision Making**
   - Observe RFC discussions
   - Participate in decisions
   - Lead minor decisions
   - Co-decide major decisions

---

## 📋 Checklist for Maintainers

### When Reviewing PRs

- [ ] CI checks pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] Performance impact acceptable
- [ ] Accessibility requirements met
- [ ] Commit messages clear
- [ ] CHANGELOG mentioned

### Before Release

- [ ] All issues resolved or deferred
- [ ] CHANGELOG completely updated
- [ ] Version number bumped
- [ ] Package.json updated
- [ ] Documentation references updated
- [ ] Final testing on staging
- [ ] Release notes written

### After Release

- [ ] Tag created in GitHub
- [ ] Release notes published
- [ ] Announcement shared
- [ ] Documentation live
- [ ] Contributors acknowledged

---

## 🔗 Related Documents

- **[AUTHORS.md](./AUTHORS.md)** — Complete contributor list
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — How to contribute
- **[SECURITY.md](./SECURITY.md)** — Security policy
- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** — Community standards
- **[ROADMAP.md](./ROADMAP.md)** — Future direction

---

<div align="center">

**Questions about maintenance or governance?**

[Open an Issue](https://github.com/ardelyo/ourcreativities/issues) · [Start Discussion](https://github.com/ardelyo/ourcreativities/discussions) · [Read CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

**Interested in becoming a maintainer?** Help us grow! 🌟

</div>
