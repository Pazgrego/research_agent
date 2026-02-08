# Research Analysis Dashboard

A professional, interactive dashboard for CASP (Critical Appraisal Skills Programme) evaluation and quality assessment of research studies.

## Features

- **Tab-based Navigation**: Overview, Methodology (CASP), Clinical Context (PICO), Evidence (GRADE)
- **Interactive Visualizations**: Circular progress gauges, expandable cards, color-coded quality ratings
- **Medical-grade Design**: Clean, minimalist aesthetic with high contrast and proper whitespace
- **Responsive Layout**: Works on desktop, tablet, and mobile devices

## Quick Start

### Option 1: Open Directly in Browser (Easiest)

1. Double-click `research-dashboard.html` to open it in your default browser
2. That's it! No installation required.

### Option 2: Use with Cursor/VS Code

1. Open the project folder in Cursor or VS Code
2. Install the "Live Server" extension (if not already installed)
3. Right-click on `research-dashboard.html` and select "Open with Live Server"
4. The dashboard will open in your browser with auto-reload on changes

### Option 3: Simple HTTP Server

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (install http-server first: npm install -g http-server)
http-server -p 8000
```

Then navigate to `http://localhost:8000/research-dashboard.html`

## Git Setup & Upload

### Initial Setup

```bash
# Initialize git repository
git init

# Add files
git add research-dashboard.html README.md casp_evaluation-3.json

# Create initial commit
git commit -m "Initial commit: Research Analysis Dashboard"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git push -u origin main
```

### Updating the Dashboard

```bash
# After making changes to the HTML file
git add research-dashboard.html

# Commit changes
git commit -m "Update dashboard: [describe your changes]"

# Push to remote
git push
```

## File Structure

```
.
├── research-dashboard.html    # Main dashboard (standalone HTML file)
├── research-dashboard.jsx     # React component (for development)
├── casp_evaluation-3.json    # Source data
└── README.md                 # This file
```

## Technology Stack

- **React 18**: UI framework
- **Tailwind CSS**: Styling
- **Lucide Icons**: Icon library
- **Babel Standalone**: JSX transpilation (in-browser)

## Customization

To modify the dashboard data:

1. Open `research-dashboard.html` in a text editor
2. Find the `data` object (around line 25)
3. Update the values as needed
4. Save and refresh your browser

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- IE11: ❌ Not supported

## License

MIT License - feel free to use and modify as needed.

## Questions or Issues?

If you encounter any problems or have questions, please open an issue on GitHub.
